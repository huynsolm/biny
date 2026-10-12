import styles from "./SectionHeading.module.css";

type Props = { id: string; number: string; name: string };

// 섹션 제목을 한 곳에서 관리한다. "번호 / 이름" 형태가 도면 노트 콘셉트의 일부라서 모든 섹션이 똑같아야 한다.
export default function SectionHeading({ id, number, name }: Props) {
  return (
    <h2 id={id} className={`label ${styles.heading}`}>
      {number} / {name}
    </h2>
  );
}
