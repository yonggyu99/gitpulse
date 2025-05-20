const express = require("express");
const axios = require("axios");
const cors = require("cors");
const jwt = require("jsonwebtoken");
require("dotenv").config();

const connectDB = require("./config/db");
const challengeRoutes = require("./routes/challengeRoutes");

const app = express();

const CLIENT_ID = process.env.GITHUB_CLIENT_ID;
const CLIENT_SECRET = process.env.GITHUB_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || "my_jwt_secret_key";
const FRONT_URL = process.env.FRONT_URL || "http://localhost:5173";
const SERVER_URL =
  process.env.SERVER_URL || `http://localhost:${process.env.PORT || 4000}`;
const PORT = process.env.PORT || 4000;

const allowedOrigins = [FRONT_URL, "http://localhost:5173"];

const userAccessTokens = {};

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);

app.use(express.json());

// OAuth 경로
app.get("/oauth/github", (req, res) => {
  const redirectUri = `${SERVER_URL}/oauth/github/callback`;
  const url = `https://github.com/login/oauth/authorize?client_id=${CLIENT_ID}&redirect_uri=${redirectUri}&scope=repo`;
  res.json({ url });
});

app.get("/oauth/github/callback", async (req, res) => {
  const code = req.query.code;

  try {
    const tokenRes = await axios.post(
      "https://github.com/login/oauth/access_token",
      {
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        code,
      },
      {
        headers: { Accept: "application/json" },
      }
    );

    const accessToken = tokenRes.data.access_token;
    const userRes = await axios.get("https://api.github.com/user", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const user = userRes.data;
    const username = user.login;
    userAccessTokens[username] = accessToken;

    const jwtToken = jwt.sign(
      {
        login: user.login,
        name: user.name,
        avatar_url: user.avatar_url,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.send(`
      <script>
        window.opener.postMessage('${jwtToken}', '*');
        window.close();
      </script>
    `);
  } catch (error) {
    console.error("OAuth 실패:", error);
    res.status(500).send("GitHub OAuth 실패");
  }
});

// 인증 미들웨어
function authenticate(req, res, next) {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: "인증 토큰 없음" });

  const token = authHeader.split(" ")[1];
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (e) {
    return res.status(401).json({ message: "토큰 검증 실패" });
  }
}

// GitHub proxy
app.get("/github/proxy", authenticate, async (req, res) => {
  const { path, ...params } = req.query;

  let dp = path;
  try {
    dp = decodeURIComponent(dp);
  } catch (e) {}
  try {
    dp = decodeURIComponent(dp);
  } catch (e) {}
  const fullPath = dp.startsWith("/") ? dp : `/${dp}`;

  const token = userAccessTokens[req.user.login];
  if (!token) return res.status(404).json({ message: "AccessToken 없음" });

  try {
    const isReadme = fullPath.includes("/readme");

    const githubRes = await axios.get(`https://api.github.com${fullPath}`, {
      params,
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: isReadme
          ? "application/vnd.github.v3.raw"
          : "application/vnd.github+json",
      },
      responseType: isReadme ? "text" : "json",
    });

    res.send(githubRes.data);
  } catch (error) {
    const status = error.response?.status || 500;
    const message = error.response?.data?.message || "GitHub 호출 실패";

    // 빈 레포 에러는 따로 처리해서 빈 배열을 반환
    if (message === "Git Repository is empty.") {
      console.warn(`⚠️ Empty repository for ${fullPath}`);
      return res.status(200).json([]); // 프론트가 parse할 수 있게 정상 응답
    }

    console.error(
      "GitHub API 호출 실패:",
      error.response?.data || error.message
    );
    return res.status(status).json({
      message: "GitHub 호출 실패",
      githubMessage: message,
    });
  }
});

// Challenge API 등록
connectDB();
app.use("/api/challenge", challengeRoutes);

app.post(
  "/github/proxy/repos/:owner/:repo/issues/:number/comments",
  authenticate,
  async (req, res) => {
    const { owner, repo, number } = req.params;
    const { body } = req.body;

    const token = userAccessTokens[req.user.login];
    if (!token) return res.status(404).json({ message: "AccessToken 없음" });

    try {
      const response = await axios.post(
        `https://api.github.com/repos/${owner}/${repo}/issues/${number}/comments`,
        { body },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            Accept: "application/vnd.github+json",
          },
        }
      );
      res.json(response.data);
    } catch (error) {
      console.error(
        "일반 PR 코멘트 실패:",
        error.response?.data || error.message
      );
      res.status(500).json({ message: "GitHub POST 호출 실패" });
    }
  }
);

// ✅ 서버 실행
app.listen(PORT, () => {
  console.log(`✅ 백엔드 서버 실행 중: http://localhost:${PORT}`);
});
