import styles from "./SiteFooter.module.css";

const REPO = "https://github.com/huynsolm/biny";

// 빌드할 때 한 번 계산된다. 정적 생성이라 "마지막으로 배포된 날"과 같은 뜻이다.
const BUILT_AT = new Date().toLocaleDateString("ko-KR", {
  timeZone: "Asia/Seoul",
  year: "numeric",
  month: "long",
  day: "numeric",
});

export default function SiteFooter() {
  return (
    <footer className={styles.footer}>
      <div className={`container ${styles.inner}`}>
        <p>Next.js로 만들었어요.</p>
        <p>
          <a href={REPO} target="_blank" rel="noopener noreferrer">
            저장소 보기 (새 탭)
          </a>
        </p>
        <p className={`label ${styles.built}`}>마지막 배포 {BUILT_AT}</p>
      </div>
    </footer>
  );
}
