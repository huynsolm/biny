import SectionHeading from "./SectionHeading";
import styles from "./Skills.module.css";

// 실제로 쓰고 확인된 것만 적는다. 숙련도 막대나 퍼센트는 근거 없는 수치라서 쓰지 않는다.
const GROUPS: { label: string; items: string[] }[] = [
  {
    label: "업무에서 써 왔어요",
    items: ["HTML", "CSS / SCSS", "Gulp", "Babel", "반응형 UI", "접근성·브라우저 점검", "CMS 운영"],
  },
  {
    label: "익히는 중이에요",
    items: ["React", "Next.js", "TypeScript"],
  },
];

export default function Skills() {
  return (
    <section id="skills" className={`container ${styles.skills}`} aria-labelledby="skills-title">
      <SectionHeading id="skills-title" number="03" name="stack" />
      <dl className={styles.list}>
        {GROUPS.map((group) => (
          <div key={group.label} className={styles.row}>
            <dt>{group.label}</dt>
            <dd className="label">{group.items.join(" / ")}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}
