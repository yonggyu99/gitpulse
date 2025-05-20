import React, { useRef, useEffect } from "react";
import styles from "./CustomScrollbar.module.css";

const CustomScrollbar = ({ swiper }) => {
  const trackRef = useRef(null);
  const thumbRef = useRef(null);

  const handleScroll = () => {
    const track = trackRef.current;
    if (!track || !swiper) return;
    const scrollLeft = track.scrollLeft;
    const maxScrollLeft = track.scrollWidth - track.clientWidth;
    const scrollRatio = scrollLeft / maxScrollLeft;
    const maxSlide = swiper.snapGrid.length - 1;
    swiper.slideTo(Math.round(scrollRatio * maxSlide));
  };

  useEffect(() => {
    if (!swiper || !trackRef.current || !thumbRef.current) return;

    const updateThumbPosition = () => {
      const track = trackRef.current;
      const thumb = thumbRef.current;
      const maxIndex = Math.max(swiper.snapGrid.length - 1, 1); // 👈 더보기 제외

      const ratio = swiper.activeIndex / maxIndex;
      const maxScrollLeft = track.clientWidth - thumb.clientWidth;

      thumb.style.transform = `translateX(${ratio * maxScrollLeft}px)`;
    };

    swiper.on("slideChange", updateThumbPosition);
    updateThumbPosition();

    return () => swiper.off("slideChange", updateThumbPosition);
  }, [swiper]);

  useEffect(() => {
    if (!swiper || !thumbRef.current) return;
    const thumb = thumbRef.current;
    const visible = swiper.params.slidesPerView;
    const total = swiper.snapGrid.length;
    const ratio = visible / total;
    thumb.style.width = `${Math.max(ratio * 100, 10)}%`;
  }, [swiper]);

  return (
    <div className={styles.container}>
      <div className={styles.track} ref={trackRef} onScroll={handleScroll}>
        <div className={styles.thumb} ref={thumbRef} />
      </div>
    </div>
  );
};

export default CustomScrollbar;
