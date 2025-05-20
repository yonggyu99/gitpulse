import React from "react";
import css from "./UserStatCard.module.css";

const UserStatCard = ({ iconClass, label, value }) => {
  return (
    <div className={css.card}>
      <i className={iconClass}></i>
      <div className={css.cardText}>
        <p className={css.cardLabel}>{label}</p>
        <p className={css.cardValue}>{value}</p>
      </div>
    </div>
  );
};

export default UserStatCard;
