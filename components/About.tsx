import SectionHeading from "./SectionHeading";
import styles from "./About.module.css";

const OLD_PORTFOLIO = "https://team-library.biny.cloud/portfolio-recruiting-2026/";

export default function About() {
  return (
    <section id="about" className={`container ${styles.about}`} aria-labelledby="about-title">
      <SectionHeading id="about-title" number="01" name="about" />
      <div className={styles.body}>
        <p>
          병원 홈페이지와 기업 사이트, 와인 브랜드 사이트까지 웹 퍼블리셔로 일해 왔습니다.
          시맨틱 마크업, 반응형 구현, 키보드와 브라우저 점검이 작업의 기준이었습니다.
        </p>
        <p>
          반복되던 제작 과정은 Gulp 템플릿으로 묶어 8개 스킨을 한 환경에서 확인하도록
          바꿨습니다.
        </p>
        <p>
          HTML 너머에서 화면의 데이터를 다루는 방법이 궁금해 React를 보기 시작했고, 지금은
          React, Next.js, TypeScript를 직접 만들어 보며 익히고 있어요.
        </p>
        <p>
          이 사이트도 그 과정에서 나온 결과물이라, 무엇을 왜 골랐는지를 프로젝트마다 적어
          두었습니다.
        </p>
        <p className={styles.more}>
          더 자세한 퍼블리싱 기록은{" "}
          <a href={OLD_PORTFOLIO} target="_blank" rel="noopener noreferrer">
            기존 포트폴리오
          </a>
          에서 볼 수 있어요.
        </p>
      </div>
    </section>
  );
}
