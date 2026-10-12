import styles from "./About.module.css";

const OLD_PORTFOLIO = "https://team-library.biny.cloud/portfolio-recruiting-2026/";

export default function About() {
  return (
    <section id="about" className={`container ${styles.about}`} aria-labelledby="about-title">
      <h2 id="about-title" className={`label ${styles.heading}`}>
        01 / about
      </h2>
      <div className={styles.body}>
        <p>
          병원 홈페이지, 기업 사이트, 와인 브랜드 사이트까지 웹 퍼블리셔로 일해 왔어요. 시맨틱
          마크업과 반응형 구현, 키보드와 브라우저 점검은 늘 일의 기준이었어요.
        </p>
        <p>
          반복되는 제작 과정은 Gulp 템플릿으로 묶어서 8개 스킨을 한 환경에서 확인할 수 있게
          만들었어요.
        </p>
        <p>
          퍼블리셔로 일하면서 React라는 라이브러리를 보게 됐어요. HTML에서 멈추지 않고 화면의
          데이터를 다루는 기술까지 갖추면 일을 더 깊이 이해하면서 할 수 있겠다고 느꼈어요. 지금
          하는 일도 넓게 보면 프론트엔드 개발의 일부라서, 퍼블리싱 경험을 강점으로 살릴 수 있을
          거라고 생각해요.
        </p>
        <p>
          지금은 React, Next.js, TypeScript를 익히고 있어요. 이 사이트도 그 공부의 결과물이라,
          만든 방식과 이유를 프로젝트마다 적어 두었어요.
        </p>
        <p className={styles.more}>
          더 자세한 퍼블리싱 기록은{" "}
          <a href={OLD_PORTFOLIO} target="_blank" rel="noopener noreferrer">
            기존 포트폴리오
          </a>
          에 있어요.
        </p>
      </div>
    </section>
  );
}
