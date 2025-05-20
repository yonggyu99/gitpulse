import React from "react";
import styles from "../pages/LoginPage.module.css";

const LogoutBtn = ({ user, onLogout }) => {
  return (
    <div className={styles.userCard}>
      <img src={user.avatar_url} alt="Avatar" className={styles.avatar} />
      <h2>{user.name || user.login}</h2>
      <a
        href={`https://github.com/${user.login}`}
        target="_blank"
        rel="noreferrer"
        className={styles.profileLink}
      >
        프로필 보기
      </a>
      <a href="/profile">my gitpulse 보기</a>
      <button className={styles.logoutButton} onClick={onLogout}>
        로그아웃
      </button>
    </div>
  );
};

export default LogoutBtn;
