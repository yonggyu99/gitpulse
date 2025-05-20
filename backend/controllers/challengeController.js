const Participant = require("../models/ChallengeParticipant");

// 챌린지 참여하기
exports.joinChallenge = async (req, res) => {
  const { githubId, type } = req.body;

  try {
    const existing = await Participant.findOne({ githubId });

    if (existing) {
      // 이미 참여자라면 해당 챌린지 필드만 갱신
      if (type === "commit" && !existing.commit) {
        existing.commit = true;
        await existing.save();
        return res
          .status(200)
          .json({
            message: "커밋왕 참여 완료 (기존 업데이트)",
            data: existing,
          });
      }

      if (type === "continue" && !existing.continue) {
        existing.continue = new Date();
        await existing.save();
        return res
          .status(200)
          .json({
            message: "꾸준왕 참여 완료 (기존 업데이트)",
            data: existing,
          });
      }

      return res
        .status(409)
        .json({ message: "이미 해당 챌린지에 참여 중입니다" });
    }

    // 최초 참여자
    const payload = { githubId };
    if (type === "commit") payload.commit = true;
    if (type === "continue") payload.continue = new Date();

    const newOne = new Participant(payload);
    const saved = await newOne.save();

    res.status(201).json({ message: "신규 참여 완료", data: saved });
  } catch (err) {
    res.status(500).json({ error: "참여 실패", detail: err.message });
  }
};

// 전체 참여자 조회
exports.getAllParticipants = async (req, res) => {
  try {
    const all = await Participant.find().sort({ githubId: 1 });
    res.json(all);
  } catch (err) {
    res.status(500).json({ error: "참여자 조회 실패", detail: err.message });
  }
};

// 챌린지 항목별 취소
exports.leaveChallenge = async (req, res) => {
  const { githubId } = req.params;
  const { type } = req.query;

  try {
    const participant = await Participant.findOne({ githubId });
    if (!participant)
      return res.status(404).json({ message: "참여자가 없습니다" });

    if (type === "commit") {
      if (!participant.commit)
        return res
          .status(400)
          .json({ message: "커밋왕에 참여하지 않았습니다" });

      participant.commit = false;
    } else if (type === "continue") {
      if (!participant.continue)
        return res
          .status(400)
          .json({ message: "꾸준왕에 참여하지 않았습니다" });

      participant.continue = undefined;
    } else {
      return res.status(400).json({ message: "유효하지 않은 type입니다" });
    }

    // 둘 다 없으면 문서 삭제
    if (!participant.commit && !participant.continue) {
      await participant.deleteOne();
      return res.json({ message: "완전히 참여 취소됨" });
    } else {
      await participant.save();
      return res.json({ message: `${type} 챌린지 취소 완료` });
    }
  } catch (e) {
    res.status(500).json({ error: "참여 취소 실패", detail: e.message });
  }
};
