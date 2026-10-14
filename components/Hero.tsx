import BoxModel from "./BoxModel";
import styles from "./Hero.module.css";

const EMAIL = "salbulkyb@gmail.com";

export default function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <div className={styles.text}>
        <p className={`label ${styles.kicker}`}>publisher.to(frontend)</p>
        <div className={styles.box}>
          <span className={`label ${styles.dimension}`} aria-hidden="true">
            padding: 24px;
          </span>
          <h1 id="hero-title" className={styles.title}>
            반응형·접근성·CMS 운영 경험을 바탕으로 <span className={styles.mark}>React와 Next.js</span>로 화면을 만듭니다.
          </h1>
        </div>
        <p className={styles.name}>김영빈</p>
        <p className={styles.actions}>
          <a href={`mailto:${EMAIL}`} className={styles.primary}>
            메일 보내기
          </a>
          <a href="#projects" className={styles.secondary}>
            프로젝트 보기
          </a>
        </p>
      </div>
      <div className={styles.figure}>
        <BoxModel />
      </div>
    </section>
  );
}
