// Mongoose 모듈 불러오기 (MongoDB 연결 및 스키마 정의에 사용)
const mongoose = require("mongoose");

// 챌린지 참여자 스키마 정의
const challengeParticipantSchema = new mongoose.Schema({
  // GitHub 아이디 (고유값, 중복 불가)
  githubId: { type: String, required: true, unique: true },

  // 커밋왕 챌린지 참여 여부 (true면 참여 중)
  commit: { type: Boolean, default: false },

  // 꾸준왕 챌린지 기준 시작일 (참여한 날짜)
  continue: { type: Date },
});

// 'ChallengeParticipant' 라는 이름으로 모델을 등록 및 내보내기
// => MongoDB 컬렉션 이름은 challengeparticipants 로 자동 설정됨
module.exports = mongoose.model(
  "ChallengeParticipant",
  challengeParticipantSchema
);
