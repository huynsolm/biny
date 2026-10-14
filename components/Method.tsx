import SectionHeading from "./SectionHeading";
import styles from "./Method.module.css";

const STEPS = [
  "작업에 들어가기 전에 요구와 화면이 쓰일 맥락부터 정리합니다.",
  "뼈대는 시맨틱 마크업으로, 화면 폭에 따른 변화는 반응형 구현으로 맞춥니다.",
  "구현이 끝나면 키보드 이동, 브라우저별 화면, 발행 기준을 하나씩 확인해요.",
  "반복되는 일은 구조와 문서로 남기는 쪽을 택합니다.",
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
