import React from "react";
import css from "./PrCommentHeader.module.css";
const PrCommentHeader = ({ pullNumber, info }) => {
  const { title, created_at, user, state, commits, changed_files } = info || {};

  return (
    <header>
      <h2>
        PR #{pullNumber} : {title}
      </h2>
      <div className={css.prCommentDesc}>
        <div>작성자 : {user.login}</div>
        <div>날짜 : {created_at.split("T")[0]}</div>
        <div>state : {state}</div>
        <div>커밋 : {commits}개</div>
        <div>변경된 파일 : {changed_files}개</div>
      </div>
    </header>
  );
};

export default PrCommentHeader;
