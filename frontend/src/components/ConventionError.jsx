import React from "react";
import ConventionErrTable from "./ConventionErrTable.jsx";
import css from "./ConventionError.module.css";

const ConventionError = ({ commits }) => {
  const allowedPrefixes = [
    "feat",
    "fix",
    "bug",
    "style",
    "refactor",
    "test",
    "chore",
    "docs",
  ];

  const isMergeCommit = (message) => message.toLowerCase().startsWith("merge");

  const normalizeMessage = (msg) =>
    msg.trim().toLowerCase().replace(/\s+/g, "");

  const isConventionError = (message) => {
    const reasons = [];

    if (isMergeCommit(message)) {
      return { reasons: [] };
    }

    const normalized = normalizeMessage(message);
    const hasPrefix = allowedPrefixes.some((prefix) =>
      normalized.startsWith(prefix)
    );

    if (!hasPrefix)
      reasons.push(
        "커밋 메시지에 접두어(feat, fix 등)가 빠졌습니다. 컨벤션을 지켜주세요"
      );
    if (normalized.length < 6)
      reasons.push("커밋 메시지가 너무 짧아요. 조금 더 구체적으로 적어주세요");

    return { reasons };
  };

  const commitMsgList = commits?.map((commit) => {
    const { reasons } = isConventionError(commit.commit.message);
    return {
      date: commit.commit.author.date,
      author: commit.commit.author.name,
      message: commit.commit.message,
      result: reasons,
    };
  });

  const filteredList = commitMsgList?.filter(
    (commit) => commit.result.length > 0
  );

  return (
    <div className={css.conventionErrorCon}>
      <div className={css.tableTitle}>
        <h3>
          커밋 메세지 <strong>컨벤션 오류</strong>
        </h3>
        <p>팀원 간 협업을 위해 커밋 메시지도 표준을 지켜야죠!</p>
      </div>

      <ConventionErrTable commitMsgList={filteredList} />
    </div>
  );
};

export default ConventionError;
