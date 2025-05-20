import React, { useEffect, useState } from "react";
import css from "./OneLineComment.module.css";
import { getUserCommitActivity } from "../apis/github"; // streakDays, missingDays 제공하는 함수

const praise = [
  (day) => `연속 ${day}일 커밋! 습관화 성공 중!`,
  (day) => `${day}일 간의 꾸준한 기록, 멋져요`,
  (day) => `${day}일 간 성장 중인 당신을 응원해요!`,
  () => `꾸준함이 실력입니다! 계속 달려봐요!!`,
];

const encourage = [
  (day) => `${day}일 쉬셨네요! 오늘 한줄이라도 커밋 어때요?`,
  (day) => `${day}일 쉬어갔다면, 지금이 다시 시작할 타이밍 입니다!`,
  () => `작은 커밋 하나가 다시 루틴을 깨워줄거에요!`,
  () => `이번주에 커밋이 하나도 없어요.. 저를 보기 싫은가요? `,
  () => `혹시 컴퓨터가 고장나셨나요?? 왜 커밋이 하나도 없죠?`,
];

const neutral = [
  () => "오늘도 한 걸음! 지금처럼만 해도 충분해요 :)",
  () => "조금씩 성장하는 중이에요. 지금 속도도 좋아요!",
  () => "어제보다 나은 오늘! 지금처럼 이어가봐요",
];

const OneLineComment = ({ username }) => {
  const [comment, setComment] = useState("");
  const [color, setColor] = useState("#000");

  useEffect(() => {
    if (!username) return; // username 없으면 스킵
    (async () => {
      const { streakDays, missingDays } = await getUserCommitActivity(username);
      console.log(`streakDays=${streakDays}, missingDays=${missingDays}`);

      let msgFunc, chosenColor;

      //오늘 포함 3일 이상 연속 커밋 → 칭찬
      if (streakDays >= 3) {
        msgFunc = praise[Math.floor(Math.random() * praise.length)];
        chosenColor = "#5F41B2";
        setComment(msgFunc.length === 0 ? msgFunc() : msgFunc(streakDays));

        //커밋 안한지 5일 이상 → 격려
      } else if (missingDays >= 5) {
        msgFunc = encourage[Math.floor(Math.random() * encourage.length)];
        chosenColor = "#D82700";
        setComment(msgFunc.length === 0 ? msgFunc() : msgFunc(missingDays));

        //그 외 (1~2일째 커밋 중이거나 평소 연속 커밋 아님) → 중립
      } else {
        msgFunc = neutral[Math.floor(Math.random() * neutral.length)];
        chosenColor = "#000000";
        setComment(msgFunc());
      }

      setColor(chosenColor);
    })();
  }, [username]);

  return (
    <div className={css.wrapper}>
      <p className={css.text} style={{ color }}>
        {comment}
      </p>
    </div>
  );
};

export default OneLineComment;
