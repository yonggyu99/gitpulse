import { useQuery } from "@tanstack/react-query";
import { fetchWithToken, postWithToken } from "./github";

// PR 정보 불러오기
export const getPRInfo = async (orgs, repo, pullNumber) => {
  try {
    const [info, files, comment] = await Promise.all([
      fetchWithToken(`/repos/${orgs}/${repo}/pulls/${pullNumber}`),
      fetchWithToken(`/repos/${orgs}/${repo}/pulls/${pullNumber}/files`),
      fetchWithToken(`/repos/${orgs}/${repo}/issues/${pullNumber}/comments`),
    ]);
    return { info, files, comment };
  } catch (error) {
    console.log("조직 가져오기 실패", error);
    throw error;
  }
};

export const usePRInfo = (orgs, repo, pullNumber) => {
  return useQuery({
    queryKey: ["PRInfo", orgs, repo, pullNumber],
    queryFn: async () => {
      try {
        const data = pullNumber && (await getPRInfo(orgs, repo, pullNumber));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

export const postPRComment = async (
  owner,
  repo,
  pullNumber,
  body,
  commitId, // optional
  path, // optional
  position // optional
) => {
  try {
    const isReviewComment = commitId && path && typeof position === "number";
    const endpoint = isReviewComment
      ? `/repos/${owner}/${repo}/pulls/${pullNumber}/comments`
      : `/repos/${owner}/${repo}/issues/${pullNumber}/comments`;
    const payload = isReviewComment
      ? { body, commit_id: commitId, path, position }
      : { body };
    const res = await postWithToken(endpoint, payload);
    return res;
  } catch (error) {
    console.error("PR 코멘트 실패", error.response?.data || error);
    throw error;
  }
};

// PR 정보 불러오기
export const getPRLineReviews = async (owner, repo, pullNumber) => {
  try {
    const res = await fetchWithToken(
      `/repos/${owner}/${repo}/pulls/${pullNumber}/comments`
    );
    return res;
  } catch (error) {
    console.log("리뷰 가져오기 실패", error);
    throw error;
  }
};

export const usePRLineReviews = (owner, repo, pullNumber) => {
  return useQuery({
    queryKey: ["review-comments", owner, repo, pullNumber],
    queryFn: async () => {
      try {
        const data =
          pullNumber && (await getPRLineReviews(owner, repo, pullNumber));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 5,
  });
};
