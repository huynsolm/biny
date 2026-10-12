import styles from "./BoxModel.module.css";

// CSS 박스 모델(margin, border, padding, content)을 개발자도구처럼 그린 장식 그림.
// 의미 있는 정보가 아니라서 스크린 리더는 건너뛴다. 글자는 모노스페이스용이라 영문만 쓴다.
export default function BoxModel() {
  return (
    <svg
      className={styles.diagram}
      viewBox="0 0 240 200"
      aria-hidden="true"
      focusable="false"
    >
      <rect className={styles.margin} x="0.5" y="0.5" width="239" height="199" />
      <rect className={styles.border} x="24" y="24" width="192" height="152" />
      <rect className={styles.padding} x="48" y="48" width="144" height="104" />
      <rect className={styles.content} x="72" y="72" width="96" height="56" />
      <text className={styles.label} x="8" y="15">margin</text>
      <text className={styles.label} x="32" y="39">border</text>
      <text className={styles.label} x="56" y="63">padding</text>
      <text className={styles.contentLabel} x="120" y="104" textAnchor="middle">
        content
      </text>
    </svg>
  );
}
