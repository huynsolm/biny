import SectionHeading from "./SectionHeading";
import styles from "./Operations.module.css";

// 고객, 병원, 내부 서비스 이름과 요청량은 적지 않는다. 역할과 한 일의 종류만 쓴다.
const AREAS: { title: string; points: string[] }[] = [
  {
    title: "병원 홈페이지 · CMS 운영",
    points: [
      "퍼블리싱 영역 유지보수와 CMS 기반 웹사이트 관리를 맡았습니다.",
      "메인 리뉴얼, 페이지 추가, 콘텐츠와 UI 업데이트를 진행했어요.",
      "요청을 확인한 뒤 고객지원, 사업부, 개발 담당자와 협업하는 흐름으로 일했습니다.",
    ],
  },
  {
    title: "반응형 홈페이지 제작",
    points: [
      "리뉴얼을 포함한 여러 반응형 홈페이지를 제작했습니다.",
      "공통 스킨과 개별 디자인을 함께 다뤘어요.",
    ],
  },
  {
    title: "앱 UI 유지보수",
    points: [
      "메신저 앱에서 메시지 창, 링크 탭과 메시지, URL 대화창 작업을 맡았습니다.",
      "위치·도면 기반 업무 화면을 작업했고, 비슷한 UI는 다시 활용했어요.",
    ],
  },
];

export default function Operations() {
  return (
    <section
      id="operations"
      className={`container ${styles.operations}`}
      aria-labelledby="operations-title"
    >
      <SectionHeading id="operations-title" number="04" name="operations" />
      <ul className={styles.areas}>
        {AREAS.map((area) => (
          <li key={area.title} className={styles.area}>
            <h3 className={styles.title}>{area.title}</h3>
            <ul className={styles.points}>
              {area.points.map((point) => (
                <li key={point}>{point}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
      <p className={styles.note}>상세 화면과 운영 정보는 정보 보호를 위해 공개하지 않습니다.</p>
    </section>
  );
}
