import SectionHeading from "./SectionHeading";
import styles from "./AiWorkflow.module.css";

// AI는 요구사항 정리, 구현, 검수의 보조로만 적는다. 쓰는 도구 이름이나 성과 수치는 적지 않는다.
const STEPS = [
  "요청의 목적과 사용 맥락을 확인해요.",
  "관련 화면과 기준을 모아 정리해요.",
  "AI와 함께 초안과 대안을 빠르게 살펴봐요.",
  "사실과 맥락은 직접 판단하고 고쳐요.",
  "서비스 구조에 맞게 화면을 구현해요.",
  "기기와 브라우저에서 테스트하고 검증해요.",
  "다시 쓸 수 있는 기준으로 문서에 남겨요.",
];

export default function AiWorkflow() {
  return (
    <section
      id="ai-workflow"
      className={`container ${styles.ai}`}
      aria-labelledby="ai-workflow-title"
    >
      <SectionHeading id="ai-workflow-title" number="07" name="ai" />
      <p className={styles.principle}>
        AI는 초안과 비교, 반복 작업을 돕는 도구예요. 업무 맥락을 해석하고 실제 화면에 적용할지는
        제가 직접 판단해요.
      </p>
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
