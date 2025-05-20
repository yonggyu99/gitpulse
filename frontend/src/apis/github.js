import axios from "axios";

const API_BASE = "http://localhost:4000";

export const githubAxios = axios.create({
  baseURL: "https://api.github.com",
  headers: {
    Accept: "application/vnd.github+json",
  },
});

export const fetchWithToken = async (path, params = {}) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.get(`${API_BASE}/github/proxy`, {
    params: { path, ...params },
    headers: { Authorization: `Bearer ${token}` },
    withCredentials: true,
  });
  return res.data;
};

export const postWithToken = async (path, data = {}) => {
  const token = localStorage.getItem("jwt");
  const res = await axios.post(`${API_BASE}/github/proxy${path}`, data, {
    // params: { path },
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });
  return res.data;
};

export const getGitHubUserInfo = async (username) => {
  try {
    const res = await fetchWithToken(`/users/${username}`);
    const data = res.data || res;

    if (!data || data.message === "Not Found") {
      throw new Error("User not found");
    }

    const { followers, following, public_repos, login, name, avatar_url } =
      data;
    return { followers, following, public_repos, login, name, avatar_url };
  } catch (error) {
    console.error("GitHub 유저 정보 요청 실패:", error);
    throw error;
  }
};

export const fetchUserRepos = async (username, page = 1, perPage = 100) => {
  try {
    const data = await fetchWithToken(`/users/${username}/repos`, {
      page,
      per_page: perPage,
      sort: "pushed",
    });
    return data;
  } catch (err) {
    console.error("Failed to fetch user repos:", err);
    throw err;
  }
};

export const getUserRepos = async (username, page = 1, perPage = 5) => {
  try {
    const res = await fetchWithToken(`/users/${username}/repos`, {
      page,
      per_page: perPage,
      sort: "pushed",
    });
    return res.map((repo) => ({
      name: repo.name,
      url: repo.html_url,
      stars: repo.stargazers_count,
      created_at: repo.created_at,
      pushed_at: repo.pushed_at,
    }));
  } catch (err) {
    console.error("사용자의 레포지토리 가져오기 실패", err);
    return [];
  }
};

export const getRepoCommits = async (
  username,
  repoName,
  perPage = 30,
  since,
  until,
  page = 1
) => {
  try {
    const params = {
      per_page: perPage,
      page,
    };

    if (since) params.since = since;
    if (until) params.until = until;

    const res = await fetchWithToken(
      `/repos/${username}/${repoName}/commits`,
      params
    );
    return res;
  } catch (err) {
    const errorMsg = err?.response?.data?.message;
    if (errorMsg === "Git Repository is empty.") {
      console.warn(`${repoName}는 비어있는 레포입니다.`);
      return [];
    }
    console.error(`${repoName} Commit 불러오기 실패`, err);
    return [];
  }
};

export const getMergedPullRequests = async (username) => {
  try {
    const res = await fetchWithToken(`/search/issues`, {
      q: `author:${username} is:pr is:merged`,
    });
    return res.total_count;
  } catch (err) {
    console.error("병합된 PR 검색 실패", err);
    return 0;
  }
};

export const getLanguageDiversity = async (username) => {
  try {
    const repos = await fetchWithToken(`/users/${username}/repos`, {
      per_page: 100,
    });
    const languageSet = new Set();
    repos.forEach((repo) => {
      if (repo.language && repo.language !== "JavaScript") {
        languageSet.add(repo.language);
      }
    });
    return languageSet.size;
  } catch (err) {
    console.error("레포 언어 다변성 측정 실패", err);
    return 0;
  }
};

export const getLateNightCommitDays = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 5);
    const lateNightDays = new Set();

    for (const repo of repos) {
      const commits = await getRepoCommits(username, repo.name, 50);
      commits.forEach((c) => {
        const dateStr = c.commit?.author?.date;
        if (dateStr) {
          const date = new Date(dateStr);
          let hour = date.getUTCHours() + 9;
          if (hour >= 24) hour -= 24;
          if (hour >= 0 && hour <= 4) {
            const dayOnly = dateStr.slice(0, 10);
            lateNightDays.add(dayOnly);
          }
        }
      });
    }

    return lateNightDays.size;
  } catch (err) {
    console.error("야행성 커밋 계산 실패", err);
    return 0;
  }
};

export const getUserCommitDates = async (username) => {
  try {
    const repos = await getUserRepos(username, 1, 100);
    const dateSet = new Set();

    for (const repo of repos) {
      const commits = await getRepoCommits(username, repo.name, 100);
      commits.forEach((commit) => {
        if (commit?.commit?.author?.date) {
          const date = new Date(commit.commit.author.date)
            .toISOString()
            .split("T")[0];
          dateSet.add(date);
        }
      });
    }

    return dateSet.size;
  } catch (err) {
    console.error("100일 커밋 날짜 계산 실패", err);
    return 0;
  }
};

export const getUserCreatedExternalIssues = async (username) => {
  try {
    let page = 1;
    let allIssues = [];

    while (true) {
      const data = await fetchWithToken(`/search/issues`, {
        q: `author:${username} type:issue`,
        per_page: 100,
        page,
      });

      if (!data.items || data.items.length === 0) break;
      allIssues = allIssues.concat(data.items);
      if (data.items.length < 100) break;
      page++;
    }

    const externalIssues = allIssues.filter(
      (issue) => issue.repository?.owner?.login !== username
    );

    return externalIssues.length;
  } catch (err) {
    console.error("버그 사냥꾼 이슈 검색 실패", err);
    return 0;
  }
};

export const getUserCommitActivity = async (username) => {
  try {
    const dateSet = new Set();
    const todayKey = (() => {
      const d = new Date();
      return [
        d.getFullYear(),
        String(d.getMonth() + 1).padStart(2, "0"),
        String(d.getDate()).padStart(2, "0"),
      ].join("-");
    })();

    for (let page = 1; page <= 3; page++) {
      const events = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });
      if (!Array.isArray(events) || events.length === 0) break;

      for (const e of events) {
        if (
          e.type === "PushEvent" ||
          (e.type === "PullRequestEvent" && e.payload.action === "merged") ||
          (e.type === "CreateEvent" && e.payload.ref_type === "repository")
        ) {
          const dt = new Date(e.created_at);
          const key = [
            dt.getFullYear(),
            String(dt.getMonth() + 1).padStart(2, "0"),
            String(dt.getDate()).padStart(2, "0"),
          ].join("-");
          dateSet.add(key);
        }
      }

      if (dateSet.has(todayKey)) break;
    }

    if (dateSet.size === 0) {
      return { streakDays: 0, missingDays: 999 };
    }

    const sorted = [...dateSet].sort((a, b) => (a < b ? 1 : -1));
    let streak = 0;
    let cursor = new Date(sorted[0]);
    while (true) {
      const key = [
        cursor.getFullYear(),
        String(cursor.getMonth() + 1).padStart(2, "0"),
        String(cursor.getDate()).padStart(2, "0"),
      ].join("-");
      if (!dateSet.has(key)) break;
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    }

    const lastDate = new Date(sorted[0]);
    const missing = Math.floor((new Date() - lastDate) / (1000 * 60 * 60 * 24));

    return { streakDays: streak, missingDays: missing };
  } catch (err) {
    console.error("활동 분석 실패:", err);
    return { streakDays: 0, missingDays: 999 };
  }
};

export const getRateLimit = async () => {
  return await fetchWithToken("/rate_limit");
};

export const getMonthlyCommitCount = async (username, since, until) => {
  try {
    const events = [];

    for (let page = 1; page <= 3; page++) {
      const res = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });

      if (!Array.isArray(res) || res.length === 0) break;

      for (const event of res) {
        // 1. PushEvent만
        if (event.type !== "PushEvent") continue;

        // 2. KST 기준 비교 (UTC에서 9시간 더한 값으로 계산)
        const eventDate = new Date(event.created_at);
        const eventKST = new Date(eventDate.getTime() + 9 * 60 * 60 * 1000);
        const sinceDate = new Date(since);
        const untilDate = new Date(until);

        if (eventKST >= sinceDate && eventKST <= untilDate) {
          events.push(event);
        }
      }
    }

    let commitCount = 0;
    for (const e of events) {
      const commits = e.payload.commits || [];
      commitCount += commits.length;
    }

    return commitCount;
  } catch (err) {
    console.error("월간 커밋 수 가져오기 실패", err);
    return 0;
  }
};

export const getMonthlyCommitDays = async (username, since, until) => {
  try {
    const dateSet = new Set();

    for (let page = 1; page <= 3; page++) {
      const res = await fetchWithToken(`/users/${username}/events`, {
        per_page: 100,
        page,
      });

      if (!Array.isArray(res) || res.length === 0) break;

      res.forEach((event) => {
        if (
          event.type === "PushEvent" &&
          event.created_at >= since &&
          event.created_at <= until
        ) {
          const date = new Date(event.created_at).toISOString().split("T")[0];
          dateSet.add(date);
        }
      });
    }

    return dateSet.size;
  } catch (err) {
    console.error("월간 커밋 일수 가져오기 실패", err);
    return 0;
  }
};

export const fetchRepos = async (sort = "stars", page = 1, perPage = 10) => {
  try {
    const res = await fetchWithToken(`/search/repositories`, {
      q: "stars:>100",
      sort,
      order: "desc",
      page,
      per_page: perPage,
    });
    return res.items || [];
  } catch (err) {
    console.error("인기 레포지토리 불러오기 실패", err);
    return [];
  }
};

// Readme 불러오기
export const fetchReadme = async (owner, repo) => {
  try {
    const readme = await fetchWithToken(`/repos/${owner}/${repo}/readme`);
    return typeof readme === "string" ? readme : ""; // markdown text
  } catch (err) {
    console.error("readMe 불러오기 실패:", err);
    return "";
  }
};

//Diff 가져오기
export const getCommitDiff = async (username, repoName, sha) => {
  try {
    const res = await fetchWithToken(
      `/repos/${username}/${repoName}/commits/${sha}`
    );
    const files = res.files || [];
    const diffs = files.map((file) => {
      return `\`\`\`diff
${file.patch || ""}
\`\`\``;
    });
    return diffs.join("\n\n");
  } catch (err) {
    console.error("커밋 diff 불러오기 실패", err);
    return "불러오기 실패";
  }
};

export const getKRMonthRange = (year, month) => {
  // JS 기준: month는 0~11이 아니라 1~12 기준으로 받음
  const start = new Date(Date.UTC(year, month - 1, 1, 0, 0, 0));
  const end = new Date(Date.UTC(year, month, 0, 23, 59, 59));

  return {
    since: start.toISOString(),
    until: end.toISOString(),
    label: `${month}월 1일 ~ ${month}월 ${end.getUTCDate()}일`,
  };
};


export const getAllUserCommitRepos = async (username, since, until) => {
  try {
    const combinedCommits = [];

    // 개인 public 레포
    const personalRepos = await fetchWithToken(`/users/${username}/repos`, {
      per_page: 100,
      sort: "pushed",
    });

    // 소속 조직 목록
    const orgs = await fetchWithToken(`/users/${username}/orgs`);

    // 각 조직의 public 레포 목록
    let orgRepos = [];
    for (const org of orgs) {
      const repos = await fetchWithToken(`/orgs/${org.login}/repos`, {
        per_page: 100,
        sort: "pushed",
      });
      orgRepos.push(...repos);
    }

    const allRepos = [...personalRepos, ...orgRepos];

    // 각 repo에 대해 author=username 커밋 가져오기
    for (const repo of allRepos) {
      const owner = repo.owner?.login;
      const name = repo.name;
      if (!owner || !name) continue;

      const commits = await fetchWithToken(`/repos/${owner}/${name}/commits`, {
        since,
        until,
        author: username,
        per_page: 100,
      });

      const mapped = commits.map((c) => ({
        ...c,
        repo: name,
        org: owner !== username ? owner : null,
      }));

      combinedCommits.push(...mapped);
    }

    // 최신순 정렬
    const sorted = combinedCommits.sort(
      (a, b) => new Date(b.commit.author.date) - new Date(a.commit.author.date)
    );

    return sorted;
  } catch (err) {
    console.error("통합 커밋 불러오기 실패:", err);
    return [];
  }
};
