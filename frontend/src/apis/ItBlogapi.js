// 이미지 로고 경로 맵 (기업 로고)
export const blogLogoMap = {
  "NAVER D2": "/ItBlog/logo-naver.png",
  kakao: "/ItBlog/logo-kakao.png",
  우아한형제들: "/ItBlog/logo-woowa.png",
  당근마켓: "/ItBlog/logo-daangn.png",
  NHN: "/ItBlog/logo-nhn.png",
  직방: "/ItBlog/logo-zigbang.png",
  Toss: "/ItBlog/logo-toss.png",
};

// 이미지 기본 썸네일 경로 맵 (피드에 이미지가 없을 때)
export const defaultImageMap = {
  "NAVER D2": "/ItBlog/default-naver.png",
  kakao: "/ItBlog/default-kakao.png",
  우아한형제들: "/ItBlog/default-woowa.png",
  당근마켓: "/ItBlog/default-daangn.png",
  NHN: "/ItBlog/default-nhn.png",
  직방: "/ItBlog/default-zigbang.png",
  Toss: "/ItBlog/default-toss.png",
};

// 블로그 RSS 기업 정보
export const companies = [
  {
    name: "NAVER D2",
    url: "https://d2.naver.com/d2.atom",
    blogUrl: "https://d2.naver.com",
  },
  {
    name: "kakao",
    url: "https://tech.kakao.com/blog/feed/",
    blogUrl: "https://tech.kakao.com/blog/",
  },
  {
    name: "우아한형제들",
    url: "https://techblog.woowahan.com/feed/",
    blogUrl: "https://techblog.woowahan.com",
  },
  {
    name: "당근마켓",
    url: "https://medium.com/feed/daangn",
    blogUrl: "https://medium.com/daangn",
  },
  {
    name: "NHN",
    url: "https://meetup.toast.com/rss",
    blogUrl: "https://meetup.toast.com",
  },

  {
    name: "직방",
    url: "https://medium.com/feed/zigbang",
    blogUrl: "https://medium.com/zigbang",
  },

  {
    name: "Toss",
    url: "https://toss.tech/rss.xml",
    blogUrl: "https://toss.tech",
  },
];

// RSS 피드 데이터를 불러오는 함수
export const fetchRssFeeds = async (companies, setFeeds) => {
  for (const { name, url } of companies) {
    const rssJsonUrl = `https://api.rss2json.com/v1/api.json?rss_url=${url}`;
    try {
      const res = await fetch(rssJsonUrl);
      const data = await res.json();
      if (data?.items) {
        setFeeds((prev) => ({ ...prev, [name]: data.items }));
      }
    } catch (err) {
      console.error(`❌ ${name} RSS fetch 실패:`, err);
    }
  }
};
