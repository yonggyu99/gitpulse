// pages/NewsPage.jsx
import React from "react";
import css from "./NewsPage.module.css";
import ITblog from "../components/ITblog";
const NewsPage = () => {
  return (
    <div className={css.container}>
      <div className={css.box}>
        <ITblog />
      </div>
    </div>
  );
};

export default NewsPage;
