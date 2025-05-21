import React, { useEffect, useState } from "react";
import css from "./ProfilePage.module.css";
import UserStatCard from "../components/UserStatCard";
import { getGitHubUserInfo, getUserRepos } from "../apis/github";
import RepoTable from "../components/RepoTable";
import Header from "../components/Header";
import CommitTimeChart from "../components/CommitTimeChart";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import OneLineComment from "../components/OneLineComment";
import RewardBadges from "../hooks/RewardBadges";

const ProfilePage = () => {
  const username = localStorage.getItem("username");
  const [userData, setUserData] = useState({
    followers: 0,
    following: 0,
    public_repos: 0,
    name: "",
    login: "",
    avatar_url: "",
  });
  const [repos, setRepos] = useState([]);

  // const [rate, setRate] = useState({ limit: 0, remaining: 0 });

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username).then((data) => setUserData(data));
    }
  }, [username]);

  useEffect(() => {
    if (username) {
      getGitHubUserInfo(username).then((data) => setUserData(data));
      getUserRepos(username).then((repoData) => setRepos(repoData));
    }
  }, [username]);

  // useEffect(() => {
  //   if (username) {
  //     getRateLimit()
  //       .then((data) => {
  //         const core = data.resources.core;
  //         setRate({ limit: core.limit, remaining: core.remaining });
  //       })
  //       .catch((err) => console.error("Rate limit fetch failed", err));
  //   }
  // }, [username]);

  return (
    <div className={css.container}>
      {/* <div className={css.rateLimit}>
        남은 요청: {rate.remaining} / {rate.limit}
      </div> */}

      <main className={css.main}>
        {/* 헤더영역 */}
        <Header
          name={userData.name || userData.login}
          profile={userData.avatar_url}
        />

        {/* 카드 영역 */}
        <div className={css.contentContainer}>
          <section className={css.profileStats}>
            <UserStatCard
              iconClass="bi bi-person-fill-check"
              label="Followers"
              value={userData.followers}
            />

            <UserStatCard
              iconClass="bi bi-person-heart"
              label="Followings"
              value={userData.following}
            />

            <UserStatCard
              iconClass="bi bi-cloud-check"
              label="Public Repos"
              value={userData.public_repos}
            />
          </section>

          {/* 뱃지 영역 */}
          <section className={css.badgeSection}>
            <div className={css.badgeCol}>
              <RewardBadges username={username} />
            </div>
            <div className={css.commentCol}>
              <OneLineComment username={username} />
            </div>
          </section>

          {/* 커밋 잔디 영역 */}
          <section className={css.contributions}>
            <h4>History</h4>
            <img
              src={`https://ghchart.rshah.org/${username}`}
              alt="GitHub Contributions"
              style={{ width: "100%", height: "auto" }}
            />
          </section>

          {/* repo & 그래프 영역 */}
          <section className={css.bottom}>
            {/* repo table */}
            <RepoTable username={username} />

            {/* graph */}
            <div className={css.commitTimeChart}>
              <h4>Commit Time Graph</h4>
              {username && <CommitTimeChart username={username} />}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
};

export default ProfilePage;
