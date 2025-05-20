import React from "react";
import css from "./Header.module.css";
import defaultProfile from "../assets/logo 2.svg";
import { X } from "lucide-react";

const Header = ({ name, profile }) => {
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
                <span className={css.headerHighlight}>{name}</span>'s github
              </h2>
              <p>It's looking like a good day</p>
            </div>
          </div>
        </div>
      </header>
    </>
  );
};

export default Header;
