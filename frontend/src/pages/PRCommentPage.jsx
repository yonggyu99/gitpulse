import React, { useState } from "react";
import css from "./PRCommentPage.module.css";
import { useLocation } from "react-router-dom";
import {
  postPRComment,
  usePRInfo,
  usePRLineReviews,
} from "../apis/usePRComment";
import { getPositionInPatch } from "../utils/prComment.js";

import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import Tab from "react-bootstrap/Tab";

import PrCommentHeader from "../components/PrCommentHeader.jsx";
import ColSidePrTab from "../components/ColSidePrTab.jsx";
import TabPrInfo from "../components/TabPrInfo.jsx";
import Loading from "../common/Loading.jsx";

const PRCommentPage = () => {
  const location = useLocation();
  const { url } = location.state || {};
  const [commentTargets, setCommentTargets] = useState({});
  const [expandedLines, setExpandedLines] = useState({});

  const parts = url?.split("/");
  const orgs = parts[4];
  const repo = parts[5];
  const pullNumber = parts[7];

  const { data, isLoading, isError } = usePRInfo(orgs, repo, pullNumber);
  const prFiles = data?.files;
  const commitId = data?.info?.head?.sha;

  const {
    data: reviewComments,
    isLoading: isReviewLoading,
    refetch: refetchReviewComments,
  } = usePRLineReviews(orgs, repo, pullNumber);

  if (isLoading || isReviewLoading) return <Loading />;
  if (isError) return <p>에러 발생!</p>;

  const handleCommentChange = (key, value) => {
    setCommentTargets((prev) => ({ ...prev, [key]: value }));
  };

  const getCommentsForLine = (filename, lineIndex, patch, comments) => {
    return (
      comments?.filter((comment) => {
        return (
          comment.path === filename &&
          getPositionInPatch(patch, lineIndex) === comment.position
        );
      }) || []
    );
  };

  return (
    <div className={css.prCommentCon}>
      <PrCommentHeader info={data?.info} pullNumber={pullNumber} />
      <main>
        <Tab.Container defaultActiveKey="pr-body">
          <Row>
            <ColSidePrTab prFiles={prFiles} />
            <Col className={css.prCon} sm={9}>
              <Tab.Content>
                {/* 코드 변경 요약 탭 */}
                <TabPrInfo orgs={orgs} repo={repo} pullNumber={pullNumber} />
                {/* 파일별 탭 */}
                {prFiles?.map((file) => (
                  <Tab.Pane key={file.filename} eventKey={file.filename}>
                    <h4>{file.filename}</h4>
                    <pre className={css.codeBlock}>
                      {file?.patch?.split("\n").map((line, lineIndex) => {
                        const key = `${file.filename}-${lineIndex}`;

                        let bgColor = "";
                        let color = "";
                        const isAddedLine =
                          line.startsWith("+") && !line.startsWith("+++");
                        const isRemovedLine =
                          line.startsWith("-") && !line.startsWith("---");
                        const isMetaLine = line.startsWith("@@");
                        if (isAddedLine) {
                          bgColor = "#e6ffed";
                          color = "#22863a";
                        } else if (isRemovedLine) {
                          bgColor = "#ffeef0";
                          color = "#cb2431";
                        } else if (isMetaLine) {
                          bgColor = "#f0f0f0";
                          color = "#6a737d";
                        }

                        const commentsForLine = getCommentsForLine(
                          file.filename,
                          lineIndex,
                          file.patch,
                          reviewComments
                        ); // 라인 리뷰 필터링
                        const hasComments = commentsForLine.length > 0;
                        const isLineOpened = expandedLines[key];

                        return (
                          <div
                            key={lineIndex}
                            className={css.codeLineWrapper}
                            style={{
                              backgroundColor: bgColor,
                              color,
                              display: "flex",
                              padding: "2px 0",
                              flexDirection: "column",
                            }}
                          >
                            {/* 줄 번호 + 코드 한 줄 */}
                            <div style={{ display: "flex", width: "100%" }}>
                              {/* 줄 번호 및 댓글 아이콘 */}
                              <div
                                style={{
                                  paddingLeft: "8px",
                                  paddingRight: "8px",
                                  textAlign: "right",
                                  userSelect: "none",
                                  color: "#999",
                                }}
                              >
                                {lineIndex + 1}
                                {hasComments && (
                                  <span
                                    className={css.isComment}
                                    style={{ marginLeft: 10 }}
                                  >
                                    💜
                                  </span>
                                )}
                              </div>

                              {/* 코드 줄 내용 */}
                              <div
                                style={{
                                  flex: 1,
                                  whiteSpace: "pre-wrap",
                                  cursor: isAddedLine ? "pointer" : "default",
                                }}
                                onClick={() => {
                                  if (isAddedLine) {
                                    setExpandedLines((prev) => ({
                                      ...prev,
                                      [key]: !prev[key],
                                    }));
                                  }
                                }}
                              >
                                {line}
                              </div>
                            </div>

                            {/* 댓글 목록 + 작성창 (클릭 시에만 보여줌) */}
                            {isLineOpened && (
                              <div
                                style={{
                                  flexBasis: "100%",
                                  marginLeft: "50px",
                                  marginTop: "4px",
                                }}
                              >
                                {/* 댓글 목록 */}
                                {commentsForLine.map((cmt, i) => (
                                  <div key={i} className={css.commentBody}>
                                    <div className={css.commentInfo}>
                                      <div className={css.commentUser}>
                                        {cmt.user.login}
                                      </div>
                                      <div>{cmt.created_at.split("T")[0]}</div>
                                    </div>
                                    <div className={css.lineBody}>
                                      {cmt.body}
                                    </div>
                                  </div>
                                ))}

                                {/* 댓글 작성 창 */}
                                <div className={css.lineComment}>
                                  <LineCommentInput
                                    value={commentTargets[key]}
                                    onChange={(val) =>
                                      handleCommentChange(key, val)
                                    }
                                  />
                                  <button
                                    onClick={async () => {
                                      const body = commentTargets[key];
                                      const position = getPositionInPatch(
                                        file.patch,
                                        lineIndex
                                      );
                                      if (!commitId || position === null) {
                                        alert(
                                          "커밋 ID 또는 position이 유효하지 않습니다."
                                        );
                                        return;
                                      }
                                      await postPRComment(
                                        orgs,
                                        repo,
                                        pullNumber,
                                        body,
                                        commitId,
                                        file.filename,
                                        position
                                      );
                                      await refetchReviewComments();
                                      handleCommentChange(key, undefined);
                                    }}
                                  >
                                    리뷰 등록
                                  </button>
                                </div>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </pre>
                  </Tab.Pane>
                ))}
              </Tab.Content>
            </Col>
          </Row>
        </Tab.Container>
      </main>
    </div>
  );
};

export default PRCommentPage;

const LineCommentInput = React.memo(({ value, onChange }) => (
  <textarea
    placeholder="해당 라인에 리뷰를 달아주세요."
    rows={2}
    style={{ width: "100%" }}
    value={value || ""}
    onChange={(e) => onChange(e.target.value)}
  />
));
