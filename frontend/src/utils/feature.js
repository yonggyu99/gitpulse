// 쓰로틀 : 일정 시간 동안 한 번만 실행. 함수(함수, 대시시간)
export const throttle = (func, limit = 300) => {
  let inThrottle;
  return function (...args) {
    // 일반 함수로 변경
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
