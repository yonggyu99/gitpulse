const express = require("express");
const {
  joinChallenge,
  getAllParticipants,
  leaveChallenge,
} = require("../controllers/challengeController");

const router = express.Router();

// [POST] /api/challenge/join
router.post("/join", joinChallenge);

// [GET] /api/challenge/all
router.get("/all", getAllParticipants);

// [DELETE] /api/challenge/leave/:githubId
router.delete("/leave/:githubId", leaveChallenge);

// ✅ 반드시 마지막에 export
module.exports = router;
