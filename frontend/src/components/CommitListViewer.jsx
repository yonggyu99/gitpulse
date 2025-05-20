import React, { useEffect, useState, useRef, useCallback } from "react";
import css from "./CommitListViewer.module.css";
import {
  getAllUserCommitRepos,
  fetchReadme,
  getCommitDiff,
  getKRMonthRange,
} from "../apis/github";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

const CommitListViewer = ({
  selectedUser,
  selectedRepo,
  activeType,
  year = 2025,
  month = 5,
}) => {
  const [commits, setCommits] = useState([]);
  const [readme, setReadme] = useState("");
  const [commitDiff, setCommitDiff] = useState("");
  const [loading, setLoading] = useState(true);
  const loaderRef = useRef(null);
  const { since, until } = getKRMonthRange(year, month);

  useEffect(() => {
    const init = async () => {
      setLoading(true);
      setCommits([]);
      setReadme("");
      setCommitDiff("");

      if (activeType === "star" && selectedRepo) {
        const data = await fetchReadme(
          selectedRepo.owner.login,
          selectedRepo.name
        );
        setReadme(data);
        setLoading(false);
      } else if (
        (activeType === "commit" || activeType === "continue") &&
        selectedUser
      ) {
        const data = await getAllUserCommitRepos(selectedUser, since, until);
        setCommits(data);
        setLoading(false);
      } else {
        setLoading(false);
      }
    };
    init();
  }, [selectedUser, selectedRepo, activeType, since, until]);

  const handleClickCommit = async (sha, repo, owner) => {
    if (!selectedUser || !repo) return;
    const diff = await getCommitDiff(owner || selectedUser, repo, sha);
    setCommitDiff(diff);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    return d.toISOString().split("T")[0];
  };

  return (
    <div className={css.viewerContainer}>
      <div className={css.commitListBox}>
        <div className={css.commitListHeader}>Commits</div>
        <ul className={css.commitList}>
          {loading ? (
            <>
              <li className={css.skeleton}></li>
              <li className={css.skeleton}></li>
              <li className={css.skeleton}></li>
            </>
          ) : commits.length ? (
            commits.map((c, i) => {
              const msg = c.commit.message || "No message";
              const shortMsg = msg.length > 40 ? msg.slice(0, 40) + "..." : msg;
              const date = formatDate(c.commit.author.date);
              const owner = c.repo && c.org ? c.org : selectedUser;
              return (
                <li
                  key={i}
                  onClick={() => handleClickCommit(c.sha, c.repo, owner)}
                  title={msg}
                  className={css.commitItem}
                >
                  <span className={css.commitMessage}>{shortMsg}</span>
                  <span className={css.commitDate}>{date}</span>
                </li>
              );
            })
          ) : (
            <li>No commits</li>
          )}
        </ul>
      </div>

      <div className={css.readmeWrapper}>
        <div className={css.readmeHeader}>CONTENT</div>
        <div className={css.readmeContent}>
          {activeType === "star" ? (
            readme ? (
              <ReactMarkdown>{readme}</ReactMarkdown>
            ) : (
              <div className={css.empty}>No README</div>
            )
          ) : commitDiff ? (
            <SyntaxHighlighter language="diff" style={dracula}>
              {commitDiff}
            </SyntaxHighlighter>
          ) : (
            <div className={css.empty}>No commit code</div>
          )}
        </div>
        {selectedRepo && activeType === "star" && (
          <a
            className={css.repoBtn}
            href={`https://github.com/${selectedRepo.full_name}`}
            target="_blank"
            rel="noreferrer"
          >
            Repository 가기 &gt;&gt;
          </a>
        )}
      </div>
    </div>
  );
};

export default CommitListViewer;
