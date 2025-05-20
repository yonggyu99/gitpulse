import React from "react";
import css from "./RepoDetailInfo.module.css";
import { useOrgsDetail } from "../apis/useOrganizationApi";

const RepoDetailInfo = ({ orgs, repo }) => {
  const { data, isLoading, isError } = useOrgsDetail(orgs, repo);

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  return (
    <div className={css.repoInfoCon}>
      <div className={css.repoInfoItems}>
        <div>
          <p>Star</p>
          <p>{data?.stargazers_count}</p>
        </div>
        <div>
          <p>Language</p>
          <p>{data?.language}</p>
        </div>
      </div>
      <div className={css.repoReviewItems}>
        <p>open Issue (PR 포함)</p>
        <p>{data?.open_issues}</p>
      </div>
    </div>
  );
};

export default RepoDetailInfo;
