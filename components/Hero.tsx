import styles from "./Hero.module.css";

export default function Hero() {
  return (
    <section className={`container ${styles.hero}`} aria-labelledby="hero-title">
      <p className={`label ${styles.kicker}`}>publisher.to(frontend)</p>
      <div className={styles.box}>
        <span className={`label ${styles.dimension}`} aria-hidden="true">
          padding: 24px;
        </span>
        <h1 id="hero-title" className={styles.title}>
          웹 퍼블리셔에서 <span className={styles.mark}>프론트엔드 개발자</span>로 넘어가는 중이에요.
        </h1>
      </div>
    </section>
  );
}
