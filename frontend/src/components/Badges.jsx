import React from "react";
import css from "./Badges.module.css";

const Badges = ({ badges }) => {
  const groups = [];
  for (let i = 0; i < badges.length; i += 3) {
    groups.push(badges.slice(i, i + 3));
  }

  return (
    <div
      id="badgeCarousel"
      className={`carousel slide ${css.carouselWrapper}`}
      data-bs-ride="carousel"
    >
      <div className="carousel-inner">
        {groups.map((group, idx) => (
          <div
            key={idx}
            className={`carousel-item ${idx === 0 ? " active" : ""}`}
          >
            <div className={css.carouselCard}>
              {" "}
              {/* ← 이 컨테이너에 flex-row */}
              {group.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  alt={`badge-${idx * 3 + i}`}
                  className={css.badgeImage}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
      <button
        className="carousel-control-prev"
        type="button"
        data-bs-target="#badgeCarousel"
        data-bs-slide="prev"
      >
        <i className={`bi bi-chevron-left ${css.arrow}`} />
      </button>
      <button
        className="carousel-control-next"
        type="button"
        data-bs-target="#badgeCarousel"
        data-bs-slide="next"
      >
        <i className={`bi bi-chevron-right ${css.arrow}`} />
      </button>
    </div>
  );
};

export default Badges;
