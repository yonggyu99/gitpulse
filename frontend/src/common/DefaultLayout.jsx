import React from "react";
import { Outlet } from "react-router-dom";
import SideTab from "./SideBar";
import css from "./DefaultLayout.module.css";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap-icons/font/bootstrap-icons.css";
import "./index.css";

export const DefaultLayout = () => {
  return (
    <div className={css.defaultLayout}>
      <SideTab />
      <Outlet />
    </div>
  );
};

export default DefaultLayout;
