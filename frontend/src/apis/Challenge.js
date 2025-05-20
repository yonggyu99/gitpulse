import axios from "axios";

const API_BASE = "http://localhost:4000/api/challenge";

// 챌린지 참여 요청
export const joinChallenge = async ({ githubId, type }) => {
  try {
    const res = await axios.post(`${API_BASE}/join`, {
      githubId,
      type, // "commit" 또는 "continue"
    });
    return res.data;
  } catch (err) {
    console.error("❌ 챌린지 참여 실패:", err.response?.data || err.message);
    throw err;
  }
};

// 전체 참여자 조회
export const getAllParticipants = async () => {
  try {
    const res = await axios.get(`${API_BASE}/all`);
    return res.data; // 참여자 배열
  } catch (err) {
    console.error("❌ 참여자 조회 실패:", err.response?.data || err.message);
    throw err;
  }
};

//JWT Token
export const getUserFromJWT = () => {
  const token = localStorage.getItem("jwt");
  if (!token) return null;

  try {
    const payloadBase64Url = token.split(".")[1];
    const payloadBase64 = payloadBase64Url
      .replace(/-/g, "+")
      .replace(/_/g, "/")
      .padEnd(
        payloadBase64Url.length + ((4 - (payloadBase64Url.length % 4)) % 4),
        "="
      );

    const decoded = JSON.parse(atob(payloadBase64));
    return decoded; // { login, name, avatar_url }
  } catch (e) {
    console.error("JWT decode 실패", e);
    return null;
  }
};

export const leaveChallenge = async (githubId, type) => {
  try {
    const res = await axios.delete(
      `${API_BASE}/leave/${githubId}?type=${type}`
    );
    return res.data;
  } catch (err) {
    console.error("챌린지 취소 실패:", err.response?.data || err.message);
    throw err;
  }
};
