import React, { useState } from "react";
import css from "./ChallengePage.module.css";
import ChallengeBox from "../components/ChallengeBox";
import CommitListViewer from "../components/CommitListViewer";
import { getKRMonthRange } from "../apis/github";

const ChallengePage = () => {
  const [selectedUser, setSelectedUser] = useState(null);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [activeType, setActiveType] = useState(null);

  const now = new Date();
  const year = now.getFullYear();
  const month = now.getMonth() + 1;
  const { since, until } = getKRMonthRange(year, month);

  const formatDate = (isoStr) => {
    const d = new Date(isoStr);
    return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(
      2,
      "0"
    )}.${String(d.getDate()).padStart(2, "0")}`;
  };
  const periodText = `Period : ${formatDate(since)} ~ ${formatDate(until)}`;

  return (
    <div className={css.container}>
      <h2 className={css.title}>Challenge</h2>
      <p className={css.period}>{periodText}</p>
      <div className={css.challengeRow}>
        <ChallengeBox
          title="Commit's Challenge"
          type="commit"
          onSelect={(user) => {
            setSelectedUser(user);
            setSelectedRepo(null);
            setActiveType("commit");
          }}
        />
        <ChallengeBox
          title="Never Stop Challenge"
          type="continue"
          onSelect={(user) => {
            setSelectedUser(user);
            setSelectedRepo(null);
            setActiveType("continue");
          }}
        />
        <ChallengeBox
          title="Open Repo Ranking"
          type="star"
          onSelect={(repo) => {
            setSelectedRepo(repo);
            setSelectedUser(null);
            setActiveType("star");
          }}
        />
      </div>
      <div className={css.viewerSection}>
        <h2 className={css.title}>Commit List</h2>
        <CommitListViewer
          selectedUser={selectedUser}
          selectedRepo={selectedRepo}
          activeType={activeType}
        />
      </div>
    </div>
  );
};
export default ChallengePage;
