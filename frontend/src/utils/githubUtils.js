// utils/githubUtils.js
import { getUserRepos, getRepoCommits } from "../apis/github";

// 지난달 날짜 범위 구하기
export const getLastMonthRange = () => {
  const now = new Date();
  const start = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  const end = new Date(now.getFullYear(), now.getMonth(), 1);
  return { start, end };
};

// 사용자 전체 커밋 수집 (지난달 기준 필터링)
export const getMonthlyCommits = async (githubId) => {
  const repos = await getUserRepos(githubId, 1, 100);
  const { start, end } = getLastMonthRange();

  let commits = [];

  for (const repo of repos) {
    const repoCommits = await getRepoCommits(githubId, repo.name, 100);
    const filtered = repoCommits
      .filter((commit) => {
        const date = new Date(commit.commit.author.date);
        return date >= start && date < end;
      })
      .map((commit) => ({
        ...commit,
        repoName: repo.name,
      }));
    commits.push(...filtered);
  }

  return commits;
};
