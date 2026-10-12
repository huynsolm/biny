import SectionHeading from "./SectionHeading";
import styles from "./Career.module.css";

// 작성자가 직접 알려준 사실만 적는다. 정확한 월을 모르는 시점(맥스마인 퇴사, idstrust 입사)은 적지 않는다.
const ITEMS: { period: string; title: string; detail?: string }[] = [
  { period: "2010", title: "맥스마인", detail: "웹 퍼블리싱 · 4년 11개월" },
  { period: "그 사이", title: "방과후 로봇강사, 학원강사" },
  { period: "2020.12", title: "엠서클", detail: "웹 퍼블리싱 · 다시 입사 · 1년 2개월" },
  { period: "~ 2024.5", title: "idstrust", detail: "웹 퍼블리싱 · 회사 인사 이동" },
  { period: "2024.5 ~ 현재", title: "page1", detail: "웹 퍼블리싱 · 회사 인사 이동" },
];

export default function Career() {
  return (
    <section id="career" className={`container ${styles.career}`} aria-labelledby="career-title">
      <SectionHeading id="career-title" number="02" name="career" />
      <ol className={styles.list}>
        {ITEMS.map((item) => (
          <li key={item.title} className={styles.item}>
            <span className={`label ${styles.period}`}>{item.period}</span>
            <div>
              <p className={styles.title}>{item.title}</p>
              {item.detail && <p className={styles.detail}>{item.detail}</p>}
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
