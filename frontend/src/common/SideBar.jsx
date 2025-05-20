import React, { useEffect, useState } from "react";
import css from "./SideBar.module.css";
import { NavLink, useNavigate } from "react-router-dom";
import { throttle } from "../utils/feature";
import { useOrganizationList } from "../apis/useOrganizationApi";

const SideBar = () => {
  const [isOn, setIsOn] = useState(false);
  const navigate = useNavigate();

  const handleResize = throttle(() => {
    if (window.innerWidth > 1410) {
      setIsOn(false);
    }
  }, 200);

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setIsOn(false);
  }, []);

  const username = localStorage.getItem("username");
  const { data: groupList, isLoading, isError } = useOrganizationList(username);

  const handleLogout = () => {
    localStorage.removeItem("username");
    localStorage.removeItem("token");
    navigate("/");
  };

  const handleNavClick = () => {
    if (window.innerWidth <= 1410) {
      setIsOn(false);
    }
  };

  if (isLoading) return <p>Loading...</p>;
  if (isError) return <p>에러 발생</p>;

  return (
    <>
      {!isOn && (
        <button className={css.hamburger} onClick={() => setIsOn(!isOn)}>
          <i className="bi bi-list" aria-label="Open sidebar"></i>
        </button>
      )}

      <div className={`${css.sideBarCon} ${isOn ? css.on : ""}`}>
        {isOn && (
          <button className={css.closeButton} onClick={() => setIsOn(false)}>
            <i className="bi bi-x" aria-label="Close sidebar" />
          </button>
        )}
        <div className={css.icon}>
          <a href="/profile">
            <img src="/img/icon_mini.png" alt="logo" />
          </a>
        </div>
        <div className={css.scrollableArea}>
          <div className={css.sideBarList}>
            <CustomNavLink
              to="/profile"
              label="My Git"
              icon="bi-person-fill"
              onClick={handleNavClick}
            />
            {groupList?.map((group) => (
              <CustomNavLink
                key={group.id}
                to={`/org/${group.id}/${group.login}`}
                label={group.login}
                icon="bi-people-fill"
                onClick={handleNavClick}
              />
            ))}
          </div>
          <div className={css.divider}></div>
          <div className={css.sideBarList}>
            <CustomNavLink
              to="/news"
              label="IT News"
              icon="bi-newspaper"
              onClick={handleNavClick}
            />
            <CustomNavLink
              to="/test"
              label="개발자 유형 테스트"
              icon="bi-emoji-smile"
              onClick={handleNavClick}
            />
            <CustomNavLink
              to="/challenged"
              label="Challenged"
              icon="bi-joystick"
              onClick={handleNavClick}
            />
            <button className={css.logoutButton} onClick={handleLogout}>
              로그아웃
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

const CustomNavLink = ({ to, label, icon, onClick }) => (
  <NavLink
    className={({ isActive }) => (isActive ? css.active : "")}
    to={to}
    onClick={onClick}
  >
    <i className={`bi ${icon}`}></i>
    <p> {label}</p>
  </NavLink>
);

export default SideBar;
