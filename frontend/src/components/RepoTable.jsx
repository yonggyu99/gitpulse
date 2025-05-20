import React, { useCallback, useEffect, useRef, useState } from "react";
import css from "./RepoTable.module.css";
import { getUserRepos } from "../apis/github";

const RepoTable = ({ username }) => {
  const [repos, setRepos] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const observer = useRef();

  const lastElementRef = useCallback(
    (node) => {
      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((prevPage) => prevPage + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [hasMore]
  );

  useEffect(() => {
    const fetchRepos = async () => {
      const newRepos = await getUserRepos(username, page);
      setRepos((prevRepos) => [...prevRepos, ...newRepos]);
      if (newRepos.length === 0) setHasMore(false);
    };
    if (username) fetchRepos();
  }, [username, page]);

  return (
    <div className={css.repoTable}>
      <h4>Repo</h4>
      <table>
        <thead>
          <tr>
            <th>Name</th>
            <th>Stars</th>
            <th>Recently Commit</th>
            <th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {repos.map((repo, index) => (
            <tr
              key={index}
              ref={index === repos.length - 1 ? lastElementRef : null}
            >
              <td>
                <a
                  href={repo.url}
                  target="_blank"
                  rel="noreferer"
                  className={css.repoLink}
                >
                  {repo.name}
                </a>
              </td>
              <td>{repo.stars}</td>
              <td>{new Date(repo.pushed_at).toLocaleDateString()}</td>
              <td>{new Date(repo.created_at).toLocaleDateString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default RepoTable;
