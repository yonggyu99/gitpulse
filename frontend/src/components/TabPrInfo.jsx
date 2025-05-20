import { useState } from "react";
import Markdown from "react-markdown";
import { postPRComment, usePRInfo } from "../apis/usePRComment";
import css from "../pages/PRCommentPage.module.css";
import Tab from "react-bootstrap/Tab";

const TabPrInfo = ({ orgs, repo, pullNumber }) => {
  const { data, isLoading, isError, refetch } = usePRInfo(
    orgs,
    repo,
    pullNumber
  );
  const prComment = data?.comment;
  const { body } = data?.info || {};
  const [isCommentLoading, setIsCommentLoading] = useState(false);
  const [generalComment, setGeneralComment] = useState("");

  const handlePRComment = async (orgs, repo, pullNumber, generalComment) => {
    try {
      setIsCommentLoading(true);
      await postPRComment(orgs, repo, pullNumber, generalComment);
      setGeneralComment("");
      await refetch(); // 리렌더링을 위한 데이터 다시 불러오기
    } catch (e) {
      console.error(e);
    } finally {
      setIsCommentLoading(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생!</p>;

  return (
    <Tab.Pane eventKey="pr-body">
      <h4>코드 변경 요약</h4>
      <div className={css.prMdCon}>
        <Markdown>{body}</Markdown>
      </div>
      {/* pr 일반 댓글 */}
      <div className={css.commentList}>
        {prComment?.map((comment, index) => (
          <div key={index} className={css.commentCon}>
            <img src={comment.user.avatar_url} />
            <div className={css.commentBody}>
              <div className={css.commentInfo}>
                <div className={css.commentUser}>{comment.user.login}</div>
                <div className={css.commentDate}>
                  {comment.created_at.split("T")[0]}
                </div>
              </div>
              <div>{comment.body}</div>
            </div>
          </div>
        ))}
      </div>
      {/* pr 일반 댓글 input */}
      <div className={css.commentInput}>
        <textarea
          placeholder="이 PR에 대한 의견을 남겨보세요"
          value={generalComment}
          onChange={(e) => setGeneralComment(e.target.value)}
        />
        <button
          disabled={isCommentLoading}
          onClick={() =>
            handlePRComment(orgs, repo, pullNumber, generalComment)
          }
        >
          Comment
        </button>
      </div>
    </Tab.Pane>
  );
};

export default TabPrInfo;
