import React, { useState } from "react";
import css from "./Header.module.css";
import defaultProfile from "../assets/logo 2.svg";
import { X } from "lucide-react";
import GithubModal from "../components/Githubmodal";

const Header = ({ name, profile, onClose }) => {
  const [searchInput, setSearchInput] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [targetUsername, setTargetUsername] = useState("");

  const handleSearch = () => {
    if (!searchInput.trim()) return;
    setTargetUsername(searchInput); // 검색한 사용자 이름 저장
    setShowModal(true); // 모달 열기
  };

  return (
    <>
      <header className={css.headerContainer}>
        <div className={css.header}>
          <div className={css.headerLeft}>
            <img
              src={profile || defaultProfile}
              alt="profile"
              className={css.profileImage}
            />
            <div className={css.textGroup}>
              <h2>
                <span className={css.headerHighlight}>Hi</span> {name},
              </h2>
              <p>It's looking like a good day</p>
            </div>
          </div>
          <div className={css.search}>
            <input
              type="text"
              placeholder="궁금한 사람의 깃허브 아이디를 입력하세요"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            />
            <i className="bi bi-search" onClick={handleSearch}></i>
          </div>
        </div>

        {onClose && (
          <button className={css.closeButton} onClick={onClose}>
            <X size={28} />
          </button>
        )}
      </header>

      {/* ✅ GithubModal은 별도 검색 사용자 정보만 표시 */}
      {showModal && (
        <GithubModal
          username={targetUsername}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
};

export default Header;
