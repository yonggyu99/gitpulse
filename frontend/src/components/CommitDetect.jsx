import React from "react";
import { useSuspiciousCommits } from "../hooks/useSuspiciousCommits";
import css from "./CommitDetect.module.css";

const CommitDetect = ({ name, repo }) => {
  const { suspiciousCommits, loading } = useSuspiciousCommits({
    name,
    repo,
  });
  return (
    <div className={css.detectTable}>
      <div className={css.tableTitle}>
        <h3>
          커밋 <strong>허수</strong> 잡기
        </h3>
        <p>의미 없는 커밋을 분석해, 실제 기여도를 정직하게 평가합니다.</p>
        <div className={css.iconCon}>
          <i className="bi bi-info-circle" />
          <div className={css.tableDesc}>
            <h5>✅ 커밋 허수 감지 기준 (최근 커밋 50개 기준) </h5>
            <ul>
              <li>변경된 파일 수가 너무 적은 경우 - 3점</li>
              <li>커밋 메시지가 6자 미만인 경우 - 3점</li>
              <li> 총 코드 변경량(추가+삭제)이 6줄 이하인 경우 - 10점 </li>
              <li>
                변경된 파일의 확장자가 .md, .json, .log, .lock, .env, .yml 등
                비코드성 파일인 경우 - 10점
              </li>
              <li>변경된 내용이 console.log만 추가/수정된 경우-10점</li>
            </ul>
            <p>총 5점 이상인 경우 허수로 판단합니다.</p>
          </div>
        </div>
      </div>
      {loading ? (
        <div className={css.loader}>
          <img src="/img/police_loader.gif" />
          <div>허수 잡으러 가는 중... 잠시만 기다려주세요 !</div>
        </div>
      ) : (
        <div className={css.tableWrapper}>
          <table className={css.tableHeader}>
            <thead>
              <tr>
                <th className={css.colDate}>날짜</th>
                <th className={css.colUser}>작성자</th>
                <th className={css.colTitle}>메시지</th>
                <th className={css.colCnt}>파일 수</th>
                <th className={css.colChange}>변경</th>
                <th className={css.colFile}>파일 종류</th>
                <th className={css.colConsole}>console</th>
                <th className={css.colScore}>score</th>
              </tr>
            </thead>
          </table>
          <div className={css.scrollBody}>
            <table className={css.tableBody}>
              <tbody>
                {suspiciousCommits
                  .filter((commit) => commit.isSuspicious)
                  .map((commit) => (
                    <tr key={commit.sha}>
                      <td className={css.colDate}>
                        {new Date(commit.date).toLocaleDateString()}
                      </td>
                      <td className={css.colUser}>{commit.author}</td>
                      <td className={css.colTitle}>{commit.message}</td>
                      <td className={css.colCnt}>{commit.fileCount}</td>
                      <td className={css.colChange}>
                        +{commit.additions} / -{commit.deletions}
                      </td>
                      <td className={css.colFile}>
                        {commit.files
                          .map((f) => f.filename.split(".").pop())
                          .join(", ")}
                      </td>
                      <td className={css.colConsole}>
                        {commit.containsConsole ? "✅" : "❌"}
                      </td>
                      <td className={css.colScore}>{commit.score}</td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default CommitDetect;
