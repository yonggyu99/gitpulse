import css from "./IntroPage.module.css";
import logoImage from "../assets/icon_mini.png";

const IntroPage = ({ onStart }) => {
  return (
    <main className={css.container}>
      <h1 className={css.title}>개발자 유형 테스트</h1>
      <div className={css.logoWrapper}>
        <img src={logoImage} alt="GitPulse Logo" className={css.logo} />
      </div>
      <p className={css.subtitle}>나의 개발자 유형과 숨겨진 능력은 ?</p>
      <button onClick={onStart} className={css.startButton}>
        테스트 시작하기 🚀
      </button>
    </main>
  );
};

export default IntroPage;
