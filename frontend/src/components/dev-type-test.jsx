import React, { useState, useRef } from "react";
import { toPng } from "html-to-image";
import { useNavigate } from "react-router-dom";
import IntroPage from "./IntroPage";
import css from "./DevTypeTest.module.css";

const questions = [
  {
    qNumber: "Q1",
    q: "새 프로젝트 시작! 첫 작업은?",
    options: [
      { text: "디자인 시안부터 만들고 UI 컨셉 잡음", type: "artist" },
      { text: "요구사항 정리하고, 데이터 흐름 분석", type: "data" },
      { text: "figma 보면서 폰트랑 여백부터 정리", type: "pikachu" },
      { text: "디렉토리 구조 짜고 API 엔드포인트 미리 정리", type: "backend" },
      { text: "관련 아키텍처 사례들 GPT한테 물어보자", type: "gpt" },
      { text: "일단 데드라인 언제인지부터 확인함", type: "deadline" },
    ],
  },
  {
    qNumber: "Q2",
    q: "팀 프로젝트에서 코드 합치기 전날 밤, 당신은?",
    options: [
      { text: "데이터를 정규화할지 비정규화할지 고민 중", type: "data" },

      { text: "컴포넌트 스타일 수정하다 시간이 다 감", type: "pikachu" },
      { text: "merge 전략 다시 보고 충돌 방지", type: "backend" },
      {
        text: "페이지마다 디자인 묘하게 다른 거 예민하게 체크 중",
        type: "artist",
      },
      { text: "그날 처음 VSCode 켬", type: "deadline" },
      { text: '"GPT야 merge 도와줘"라고 말함', type: "gpt" },
    ],
  },
  {
    qNumber: "Q3",
    q: "맡은 일에서 내가 가장 신경 쓰는 부분은?",
    options: [
      { text: "감각적이고 매력 있는 결과물!", type: "artist" },
      { text: "팀원들 다 같이 즐겁게 할 수 있을지!", type: "pikachu" },
      { text: "기술적 완성도랑 안정성!", type: "backend" },
      { text: "정보 정리와 이해도 향상!", type: "gpt" },
      { text: "일정 내 완수하는 것!", type: "deadline" },
      { text: "정확성과 실수 없는 처리!", type: "data" },
    ],
  },
  {
    qNumber: "Q4",
    q: "새로 알게 된 툴이나 기술을 접했을 때 당신의 반응은?",
    options: [
      { text: "프로젝트와 얼마나 연계 가능한지 분석", type: "data" },
      { text: "이건 어떤 구조로 짜야 안정적일까 고민부터 함", type: "backend" },
      { text: 'GPT한테 "사용법이랑 장단점 요약해줘"', type: "gpt" },
      { text: "오 재밌겠다! 이걸로 뭐 만들어볼까?", type: "pikachu" },
      { text: "일단 UI 구성이나 레이아웃 어떻게 나올지 상상", type: "artist" },
      { text: "북마크 해놓고 두 달 뒤에 다시 봄", type: "deadline" },
    ],
  },
  {
    qNumber: "Q5",
    q: '"1일 1커밋 챌린지"에 참여하게 됐다. 당신은?',
    options: [
      { text: "작은 변화라도 귀엽게 다듬어서 커밋", type: "pikachu" },
      { text: "로직을 기능 단위로 쪼개서 정리 커밋", type: "backend" },
      { text: "GPT한테 간단한 자동화 커밋 루틴 요청", type: "gpt" },
      { text: "커밋 내용마다 분석 태그를 붙여둠", type: "data" },
      { text: "UI 요소 미세조정하며 영감 커밋", type: "artist" },
      { text: "주말에 몰아서 7개 커밋", type: "deadline" },
    ],
  },
  {
    qNumber: "Q6",
    q: "협업 중 다른 팀원이 내 코드를 수정했다면?",
    options: [
      { text: "수정된 부분 데이터 처리 흐름부터 점검", type: "data" },
      { text: "로직 흐름 이상 없는지 diff부터 탐색", type: "backend" },
      { text: '"이거 왜 바꿨는지 GPT한테 요약 부탁"', type: "gpt" },
      { text: "내가 짠 디자인 컨셉 망가졌을까 걱정", type: "artist" },
      { text: "알림만 봤고 아직 안 열어봄", type: "deadline" },
      { text: "스타일 무너졌는지 먼저 확인", type: "pikachu" },
    ],
  },
  {
    qNumber: "Q7",
    q: "회의 시간, 당신은 어떤 사람?",
    options: [
      { text: "말 듣다가 갑자기 좋은 아이디어 떠오름", type: "pikachu" },
      { text: "GPT에 회의 요약시키는 중", type: "gpt" },
      { text: "말한 내용 실시간으로 표로 정리", type: "data" },
      { text: "회의 안건에 감성적 네이밍 제안함", type: "artist" },
      { text: "회의 끝나고 '뭐라 했더라?' 생각 중", type: "deadline" },
      { text: "API 명세 바로 정리하고 있음", type: "backend" },
    ],
  },
  {
    qNumber: "Q8",
    q: "오류가 발생했을 때 당신의 첫 반응은?",
    options: [
      { text: "그냥 새로고침 해봄", type: "deadline" },
      {
        text: "이상해! 누구랑 같이 봐줘!",
        type: "pikachu",
      },
      { text: "디버깅 모드 ON. 원인 코드부터 추적해봐야지.", type: "backend" },
      { text: '"GPT야 이 에러 무슨 뜻이야?"', type: "gpt" },
      { text: '"흠... 혹시 UI 구조 문제일 수도 있지 않을까?"', type: "artist" },
      { text: "어떤 데이터가 이상했는지 로그 추적", type: "data" },
    ],
  },
  {
    qNumber: "Q9",
    q: "완성한 페이지를 처음 공유할 때 드는 생각은?",
    options: [
      { text: "요청 응답 속도 괜찮나 체크", type: "backend" },
      { text: "GPT한테 피드백 요약해달라고 할까?", type: "gpt" },
      { text: "이거 너무 귀엽지 않아? 반응 기대 중", type: "pikachu" },
      {
        text: "이름 짓느라 고생한 컴포넌트 보여줄 생각에 설렘",
        type: "artist",
      },
      { text: "데이터 흐름 설명할 준비 완료", type: "data" },
      { text: "버그 없기를 기도하면서 배포함", type: "deadline" },
    ],
  },
  {
    qNumber: "Q10",
    q: "가장 집중 잘 되는 환경은?",
    options: [
      {
        text: "여러 명이랑 떠들면서 아이디어 나누는 게 재밌어!",
        type: "pikachu",
      },
      {
        text: "조용한 공간에서 혼자 몰입하며 작업하는 게 최고지",
        type: "backend",
      },
      { text: "레퍼런스를 충분히 정리해두고 나서 시작!", type: "gpt" },
      { text: "쿼리 콘솔과 로그창 열어둔 세팅", type: "data" },
      {
        text: "감성 플레이리스트 틀고 즉흥적으로 집중",
        type: "artist",
      },
      { text: "마감 3시간 전, 본능적 몰입 ON", type: "deadline" },
    ],
  },
];

const results = {
  pikachu: {
    title: "💻 감성 가득 프론트엔드",
    subTitle: "픽셀에 마음을 담는 당신, 섬세한 프론트엔드 개발자!",
    desc: [
      "기획서보다 Figma 먼저 켜요.",
      "버튼 hover 안 들어가면 잠 못 자요.",
      "디자이너랑 커뮤니케이션이 제일 잘 통해요.",
      "컴포넌트 쪼개다가 하루가 다 가요.",
      "API 연동보다 상태 관리가 더 어렵게 느껴져요.",
      "useEffect랑 감정 싸움한 적 있어요.",
      "UI 깨지는 거 보면 마음도 같이 깨져요.",
    ],
    color: "#d3fbef",
    character: "/img/pikachu-image.png",
  },
  backend: {
    title: "⚙️ 고독한 백엔드",
    subTitle: "조용히 서버 지키는 당신, 로그로 말하는 개발자!",
    desc: [
      "API 문서보다 로그 파일 보는 시간이 더 길어요.",
      "로그는 친구, 에러는 천적이에요.",
      "말은 없지만 서버 터지면 누구보다 빠르게 움직여요.",
      "커밋 메시지는 거의 자동완성 상태예요.",
      "'fix: 버그 수정', 'hotfix: 서버 장애'만 반복돼요.",
      "응답 3초 넘는 API? 전쟁이에요.",
      "최적화는 선택이 아니라 본능이에요.",
    ],
    color: "#1b234c",
    character: "/img/werewolf-image.png",
  },
  gpt: {
    title: "🤖 GPT 영혼 합체 AI 개발자",
    subTitle: "프롬프트가 더 중요한 당신, GPT 없인 코드도 못 짜요!",
    desc: [
      "코드 짤 땐 GPT와의 대화가 먼저예요.",
      "혼자 작성했다 해도 사실은 GPT와 공동 저자예요.",
      "프롬프트 짜는 데 2시간, 구현은 10분이에요.",
      "디버깅할 때 GPT 대화창에 소설을 써요.",
      "'이걸 어떻게 물어보지?' 고민에 하루가 가요.",
      "GPT 없으면 손이 멈춰요. 진짜로요.",
      "프론트든 백엔드든 일단 GPT에게 물어봐요.",
    ],
    color: "#c2f0fe",
    character: "/img/robot-image.png",
  },
  data: {
    title: "📊 숫자 덕후 데이터 집착러",
    subTitle: "차트에 혼을 담는 당신, 데이터 없인 못 살아!",
    desc: [
      "엑셀보다 SQL이 편한 사람 여기 있어요.",
      "팀원 기분보다 그래프 추이에 더 민감해요.",
      "Recharts만 보면 괜히 흐뭇해지고 기분이 좋아져요.",
      "컬럼명은 외우는데 팀원 이름은 자주 헷갈려요.",
      "DB 스키마는 거의 머릿속에 각인되어 있어요.",
      "코드 리뷰보다 인덱스 튜닝 얘기가 더 재밌어요.",
    ],
    color: "#ffe9bb",
    character: "/img/data-analyst-image.png",
  },
  artist: {
    title: "🎨 CSS 감정러",
    subTitle: "margin 1px에도 흔들리는 당신,\n 스타일에 인생을 거는 개발자!",
    desc: [
      "클래스명 짓는 데만 10분 넘게 걸려요.",
      "padding이 마음에 안 들면 하루 종일 찝찝해요.",
      "border-radius 6px? 8px? 결정 못 하고 디자이너한테 물어봐요.",
      "컴포넌트 구조보다 스타일 계층이 더 중요해 보여요.",
      "디자인 시스템이 없으면 손이 안 움직여요.",
      "CSS 변수 쓸 때 색 이름도 감정 담아서 지어요.",
      "스타일 통일 안 되면 리팩터링 본능이 발동돼요.",
    ],
    color: "#fee7ff",
    character: "/img/artist-image.png",
  },
  deadline: {
    title: "⌛ 마감형 괴물 커밋러",
    subTitle: "D-1에 각성하는 당신, 벼락치기 마법사 개발자!",
    desc: [
      "마감 전까지는 잠잠하지만, 그날이 오면 몰입 시작이에요.",
      "그동안 뭐 했냐는 말에 ‘지금 집중하면 돼’라고 말해요.",
      "D-1 새벽, 키보드에 불이 나요.",
      "집중력은 기한 직전에만 활성화돼요.",
      "마감 전 1시간이 제일 생산적인 시간이에요.",
      "마감 후 회고? '담부턴 일찍 해야지'만 반복돼요.",
    ],
    color: "#70578f",
    character: "/img/monster-image.png",
  },
};

const getSortedScores = (scores) =>
  Object.entries(scores).sort((a, b) => (b[1] ?? 0) - (a[1] ?? 0));

const DevTypeTest = () => {
  const [step, setStep] = useState(0);
  const [scores, setScores] = useState({});
  const [isDone, setIsDone] = useState(false);
  const [showIntro, setShowIntro] = useState(false);
  const resultRef = useRef(null);

  const handleAnswer = (type) => {
    setScores((prev) => ({ ...prev, [type]: (prev[type] ?? 0) + 1 }));
    if (step + 1 >= questions.length) {
      setIsDone(true);
    } else {
      setStep(step + 1);
    }
  };

  const handleDownload = async () => {
    if (!resultRef.current) return;
    try {
      const dataUrl = await toPng(resultRef.current, {
        backgroundColor: "#ffffff", // 흰색 배경 추가
      });
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = "dev-type-result.png";
      a.click();
    } catch (error) {
      console.error("이미지 저장 에러:", error);
      alert("이미지 저장에 실패했습니다. 다시 시도해 주세요.");
    }
  };

  const handleRestart = () => {
    setShowIntro(true);
    setStep(0);
    setScores({});
    setIsDone(false);
  };

  const sortedScores = getSortedScores(scores);
  const topType = sortedScores[0]?.[0];
  const result = topType ? results[topType] : undefined;
  const navigate = useNavigate();
  return (
    <div className={css.main}>
      {/* 질문화면과 결과화면을 분리하는 최상위 div 구조 */}
      {showIntro ? (
        <IntroPage onStart={() => setShowIntro(false)} />
      ) : !isDone ? (
        <>
          <div className={css.progressWrapper}>
            <div className={css.progressBar}>
              <div
                className={css.progressFill}
                style={{ width: `${((step + 1) / questions.length) * 100}%` }}
              />
            </div>
            <div className={css.progressText}>
              {step + 1}/{questions.length}
            </div>
          </div>
          <section className={css.section}>
            <div className={css.questionBox}>
              <div className={css.questionTitle}>
                <p className={css.questionNumber}>{questions[step].qNumber}.</p>
                <p className={css.questionText}>{questions[step].q}</p>
              </div>
              <div className={css.options}>
                {questions[step].options.map((opt, idx) => (
                  <button
                    key={idx}
                    onClick={() => handleAnswer(opt.type)}
                    className={css.optionButton}
                  >
                    {opt.text}
                  </button>
                ))}
              </div>
            </div>
          </section>
        </>
      ) : (
        <div className={css.resultContainer}>
          {" "}
          {/* 결과 전용 컨테이너 */}
          <div ref={resultRef}>
            <div className={css.resultHeader}>
              <p className={css.resultSubtitle}>당신의 개발자 유형은</p>
              <h2 className={css.resultHeading}>{result.title}</h2>
            </div>
            <img
              src={result.character}
              alt={result.title}
              className={css.resultImageLarge}
            />
            {result?.subTitle.split(",").map((line, index) => (
              <div className={css.resultSubDesc} key={index}>
                {line.trim()}
              </div>
            ))}
            <div className={css.resultDescBox}>
              <ul>
                {result.desc.map((item, index) => (
                  <li key={index}>{item}</li>
                ))}
              </ul>
            </div>
          </div>
          <div className={css.buttonGroup}>
            <button
              className={css.primaryButton}
              onClick={() => navigate("/news")}
            >
              요즘 인기있는 기술 트렌드 보기
            </button>
            <button className={css.outlinedButton} onClick={handleDownload}>
              결과 이미지 저장하기
            </button>
            <button className={css.primaryButton} onClick={handleRestart}>
              테스트 다시하기
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
export default DevTypeTest;
