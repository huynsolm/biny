import SectionHeading from "./SectionHeading";
import styles from "./Method.module.css";

const STEPS = [
  "요구와 화면의 맥락을 먼저 정리해요.",
  "시맨틱 마크업과 반응형으로 구현해요.",
  "키보드, 브라우저, 발행 기준으로 점검해요.",
  "반복되는 건 구조와 문서로 남겨요.",
];

export default function Method() {
  return (
    <section id="method" className={`container ${styles.method}`} aria-labelledby="method-title">
      <SectionHeading id="method-title" number="06" name="method" />
      <ol className={styles.steps}>
        {STEPS.map((step, index) => (
          <li key={step} className={styles.step}>
            <span className={`label ${styles.number}`} aria-hidden="true">
              {String(index + 1).padStart(2, "0")}
            </span>
            <p>{step}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
