import React, { useState, useEffect, useRef } from "react";
import styles from "./ITblog.module.css";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid } from "swiper/modules";
import "swiper/css";
import "swiper/css/grid";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  companies,
  blogLogoMap,
  defaultImageMap,
  fetchRssFeeds,
} from "../apis/ItBlogapi.js";
import CustomScrollbar from "./CustomScrollbar";

const extractImage = (html) => {
  const match = html?.match(/<img.*?src=["'](.*?)["']/);
  return match ? match[1] : null;
};

const ITblog = () => {
  const [feeds, setFeeds] = useState({});
  const [active, setActive] = useState(companies[0].name);
  const [isEnd, setIsEnd] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const swiperRef = useRef(null);

  useEffect(() => {
    setIsLoading(true);
    fetchRssFeeds(companies, (data) => {
      setFeeds(data);
      setIsLoading(false);
    });
  }, []);

  const currentItems = feeds[active] || [];
  const activeCompany = companies.find((c) => c.name === active);

  const renderCard = (item, index) => {
    const img = extractImage(item.description) || defaultImageMap[active];
    return (
      <SwiperSlide key={item.guid || item.link || index}>
        <div
          className={`${styles.card} ${styles.cardAnimated}`}
          style={{
            animationDelay: `${index * 0.1}s`,
            animationFillMode: "forwards",
          }}
        >
          <img
            src={img}
            onError={(e) => {
              e.currentTarget.src = defaultImageMap[active];
            }}
            alt=""
            className={styles.cardImage}
          />
          <div className={styles.cardContent}>
            <a
              href={item.link}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.cardTitle}
            >
              {item.title}
            </a>
            <p className={styles.cardDate}>
              {new Date(item.pubDate).toLocaleDateString()}
            </p>
          </div>
        </div>
      </SwiperSlide>
    );
  };

  const skeletonSlides = Array.from({ length: 6 }, (_, index) => (
    <SwiperSlide key={`skeleton-${index}`}>
      <div className={styles.card}>
        <Skeleton height={120} />
        <div className={styles.cardContent}>
          <Skeleton height={20} width="80%" />
          <Skeleton height={15} width="60%" />
        </div>
      </div>
    </SwiperSlide>
  ));

  return (
    <div className={styles.container}>
      <h2 className={styles.heading}>IT NEWS</h2>

      <div className={styles.tabButtons}>
        {companies.map((c) => (
          <button
            key={c.name}
            onClick={() => {
              setActive(c.name);
              setIsEnd(false);
              swiperRef.current?.slideTo(0);
            }}
            className={`${styles.tabButton} ${
              active === c.name ? styles.activeTab : ""
            }`}
          >
            # {c.name}
          </button>
        ))}
      </div>

      <Swiper
        modules={[Grid]}
        slidesPerView={1}
        grid={{ rows: 2 }}
        observer={true}
        observeParents={true}
        breakpoints={{
          0: {
            slidesPerView: 2,
            grid: { rows: 2 },
            spaceBetween: 20,
          },
          768: {
            slidesPerView: 2,
            grid: { rows: 2 },
            spaceBetween: 30,
          },
          1410: {
            slidesPerView: 2.5,
            grid: { rows: 2 },
            spaceBetween: 60,
          },
        }}
        className={styles.cardSwiper}
        onSwiper={(swiper) => (swiperRef.current = swiper)}
        onReachEnd={() => setIsEnd(true)}
        onFromEdge={() => setIsEnd(false)}
      >
        {isLoading ? skeletonSlides : currentItems.map(renderCard)}

        <SwiperSlide>
          <div
            className={`${styles.moreSlideAlt} ${
              isEnd ? styles.moreSlideVisible : styles.moreSlideHidden
            }`}
          >
            <div
              className={styles.morebtn}
              onClick={() =>
                window.open(
                  activeCompany?.blogUrl,
                  "_blank",
                  "noopener noreferrer"
                )
              }
            >
              <img
                src={blogLogoMap[active]}
                alt={`${active} logo`}
                className={styles.moreIcon}
              />
              <div className={styles.moreTextGroup}>
                <i className="bi bi-chevron-right"></i>
                <span className={styles.moreText}>more</span>
              </div>
            </div>
          </div>
        </SwiperSlide>
      </Swiper>

      <div className={styles.slider}>
        {swiperRef.current && <CustomScrollbar swiper={swiperRef.current} />}
      </div>
    </div>
  );
};

export default ITblog;
