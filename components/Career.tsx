import SectionHeading from "./SectionHeading";
import styles from "./Career.module.css";

// 2020.12부터는 작성자의 인사 발령 기록을 기준으로 한다. 그 이전(맥스마인 기간 등)은 작성자가 알려준 사실만 적는다.
// 팀 이름, 직책, 직무급 같은 내부 정보는 적지 않는다.
const ITEMS: { period: string; title: string; detail?: string }[] = [
  { period: "2010.01 ~ 2014.11", title: "맥스마인", detail: "웹 퍼블리싱 · 계약직 3개월 포함 · 4년 10개월" },
  { period: "그 사이", title: "방과후 로봇강사, 학원강사" },
  { period: "2020.12 ~ 2022.02", title: "엠서클 (현 하나누리)", detail: "웹 퍼블리싱 · 1년 2개월" },
  { period: "2022.03 ~ 2024.10", title: "아이디에스앤트러스트", detail: "웹 퍼블리싱 · 관계사 이동 · 2년 8개월" },
  { period: "2024.11 ~ 현재", title: "페이지원", detail: "웹 퍼블리싱 · 관계사 이동" },
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
