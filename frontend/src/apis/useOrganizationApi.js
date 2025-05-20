import { useQuery } from "@tanstack/react-query";
import { fetchWithToken } from "./github";

// 사용자 이름으로 조직 불러오기
export const getOrganizationsByUser = async (username) => {
  if (!username) return []; // 또는 return null;

  try {
    const res = await fetchWithToken(`/users/${username}/orgs`);
    return res;
  } catch (error) {
    console.log("조직 가져오기 실패", error);
    throw error;
  }
};

export const useOrganizationList = (username) => {
  return useQuery({
    queryKey: ["OrganizationList", username],
    queryFn: async () => {
      try {
        const data = username && (await getOrganizationsByUser(username));
        return data.reverse();
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

// orgs 정보 불러오기
export const getOrgsInfo = async (org) => {
  try {
    const [members, repos] = await Promise.all([
      fetchWithToken(`/orgs/${org}/members`),
      fetchWithToken(`/orgs/${org}/repos`),
    ]);
    return {
      members,
      repos,
    };
  } catch (error) {
    console.log("조직 정보 가져오기 실패", error);
    throw error;
  }
};

export const useOrgsInfo = (org) => {
  return useQuery({
    queryKey: ["orgsInfo", org],
    queryFn: async () => {
      try {
        const data = org && (await getOrgsInfo(org));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 60,
    retry: 1,
  });
};

// 조직 repo 불러오기
export const getOrgsRepos = async (orgs, repo) => {
  try {
    const now = new Date(); // 현재 시각
    const since = new Date(now);
    since.setDate(now.getDate() - 6); // 6일 전(오늘 포함해서 7일간)
    since.setHours(0, 0, 0, 0); // 00:00:00.000으로 맞춤

    const until = new Date(now);
    until.setHours(23, 59, 59, 999); // 오늘 23:59:59.999까지

    const sinceStr = since.toISOString();
    const untilStr = until.toISOString();

    const [commitsPage1, commitsPage2, pulls] = await Promise.all([
      fetchWithToken(
        `/repos/${orgs}/${repo}/commits?since=${sinceStr}&until=${untilStr}&per_page=100&page=1`
      ),
      fetchWithToken(
        `/repos/${orgs}/${repo}/commits?since=${sinceStr}&until=${untilStr}&per_page=100&page=2`
      ),
      fetchWithToken(`/repos/${orgs}/${repo}/pulls`),
    ]);

    const commit = [...commitsPage1, ...commitsPage2]; // 200개로 병합

    return {
      commit,
      pulls,
    };
  } catch (error) {
    console.log("조직 repo 가져오기 실패", error);
    throw error;
  }
};

export const useOrgsRepos = (orgs, repo) => {
  return useQuery({
    queryKey: ["orgsRepo", repo],
    queryFn: async () => {
      try {
        const data = repo && (await getOrgsRepos(orgs, repo));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};

// 조직 repo info 불러오기
export const getOrgsDetail = async (orgs, repo) => {
  try {
    const res = await fetchWithToken(`/repos/${orgs}/${repo}`);
    return res;
  } catch (error) {
    console.log("조직 repo info 가져오기 실패", error);
    throw error;
  }
};

export const useOrgsDetail = (orgs, repo) => {
  return useQuery({
    queryKey: ["orgsDetail", orgs, repo],
    queryFn: async () => {
      try {
        const data = repo && (await getOrgsDetail(orgs, repo));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 30,
    retry: 1,
  });
};

export const getOrgsPR = async (orgs, repo) => {
  try {
    const res = await fetchWithToken(`/repos/${orgs}/${repo}/pulls?state=all`);
    return res;
  } catch (error) {
    console.log("PR List 가져오기 실패", error);
    throw error;
  }
};

export const useOrgsPR = (orgs, repo) => {
  return useQuery({
    queryKey: ["OrgsPR", repo],
    queryFn: async () => {
      try {
        const data = repo && (await getOrgsPR(orgs, repo));
        return data;
      } catch (err) {
        console.log("", err);
      }
    },
    staleTime: 1000 * 60 * 10,
    retry: 1,
  });
};
