import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import Badges from "../components/Badges";
import css from "./RewardBadges.module.css";

import {
  getUserRepos,
  getRepoCommits,
  getMergedPullRequests,
  getLanguageDiversity,
  getLateNightCommitDays,
  getUserCommitDates,
  getUserCreatedExternalIssues,
} from "../apis/github";

import FirstCommitImg from "/img/1Commit image.svg";
import HundredCommitImg from "/img/100Commit image.svg";
import BestCoderImg from "/img/BestCoder image.svg";
import BugImg from "/img/Bug Image.svg";
import AlchemyImg from "/img/Alchemy image.svg";
import NightImg from "/img/Night Owl image.svg";

const BADGE_CONFIG = {
  firstCommit: {
    src: FirstCommitImg,
    title: "First Commit!",
    description:
      "개발자의 첫 걸음! 조심스레 시작한 당신의 코딩 여정을 응원하는 새싹 뱃지.",
    condition: "커밋 1회 이상",
  },
  hundredCommit: {
    src: HundredCommitImg,
    title: "Continual Commit",
    description: "꾸준함의 상징! 매일 성실하게 커밋한 당신에게 주는 성장 뱃지.",
    condition: "100일 연속 커밋",
  },
  prChampion: {
    src: BestCoderImg,
    title: "PR Champion",
    description: "활발한 코드 기여로 모두를 놀라게 한 당신! MVP 뱃지.",
    condition: "머지된 PR 30개 이상",
  },
  bugHunter: {
    src: BugImg,
    title: "Bug Hunter",
    description:
      "남의 버그도 내 일처럼! 디버깅을 도와주는 진정한 협업의 챔피언.",
    condition: "이슈 등록 10건 이상",
  },
  alchemist: {
    src: AlchemyImg,
    title: "Alchemist",
    description: "여러가지 언어를 자유자재로 사용하는 마스터 개발자!",
    condition: "5개 이상의 다른 언어 레포 보유",
  },
  nightOwl: {
    src: NightImg,
    title: "Night Owl",
    description:
      "조용한 밤, 당신의 IDE는 언제나 반짝이고 있었어요. 야행성 개발자의 뱃지!",
    condition: "밤 12시 이후 커밋밋 30일 이상",
  },
};

const RewardBadges = ({ username }) => {
  const [earnedBadges, setEarnedBadges] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const allKeys = Object.keys(BADGE_CONFIG);

  useEffect(() => {
    const load = async () => {
      if (!username) return;
      const earned = [];
      const repos = await getUserRepos(username, 1, 10);
      for (const r of repos) {
        const commits = await getRepoCommits(username, r.name, 10);
        if (commits.length > 0) {
          earned.push("firstCommit");
          break;
        }
      }
      if ((await getUserCommitDates(username)) >= 100) {
        earned.push("hundredCommit");
      }
      if ((await getMergedPullRequests(username)) >= 30) {
        earned.push("prChampion");
      }
      if ((await getLanguageDiversity(username)) >= 5) {
        earned.push("alchemist");
      }
      if ((await getLateNightCommitDays(username)) >= 30) {
        earned.push("nightOwl");
      }
      if ((await getUserCreatedExternalIssues(username)) >= 10) {
        earned.push("bugHunter");
      }
      setEarnedBadges(earned);
      setIsLoading(false);
    };
    load();
  }, [username]);

  return (
    <>
      <div className={css.badgesWrapper}>
        {isLoading ? (
          <div className={css.loadingBox}>
            <img
              src="/img/BadgeWaiting.png"
              alt="로딩 중"
              className={css.loadingImage}
            />
            <p className={css.loadingText}>뱃지를 가져오는 중입니다!</p>
          </div>
        ) : (
          <Badges badges={earnedBadges.map((key) => BADGE_CONFIG[key].src)} />
        )}

        <button
          className={css.helpButton}
          onClick={() => setShowModal(true)}
          aria-label="뱃지 설명 보기"
        >
          <i className="bi bi-question-circle"></i>
        </button>
      </div>

      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        centered
        dialogClassName={css.wideModal}
        size="lg"
      >
        <Modal.Header closeButton>
          <Modal.Title className={css.modalTitle}>내 뱃지 현황</Modal.Title>
        </Modal.Header>
        <Modal.Body className={css.modalBody}>
          <ul className={css.badgeList}>
            {allKeys.map((key) => {
              const { src, title, description, condition } = BADGE_CONFIG[key];
              const unlocked = earnedBadges.includes(key);

              return (
                <li
                  key={key}
                  className={`${css.badgeItem} ${!unlocked ? css.locked : ""}`}
                >
                  <div className={css.badgeIconContainer}>
                    <img src={src} alt={title} className={css.badgeIcon} />
                  </div>
                  <div className={css.badgeInfo}>
                    <div className={css.badgeTitle}>{title}</div>
                    <div className={css.badgeCondition}>
                      달성 조건 : {condition}
                    </div>
                    <div className={css.badgeDesc}>{description}</div>
                  </div>
                </li>
              );
            })}
          </ul>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default RewardBadges;