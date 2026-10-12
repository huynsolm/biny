import type { Metadata } from "next";
import Link from "next/link";
import styles from "./not-found.module.css";

export const metadata: Metadata = {
  title: "페이지를 찾을 수 없어요 | 김영빈",
};

// 루트 레이아웃 안에서 그려지므로 헤더와 푸터는 그대로 보인다.
// 건너뛰기 링크(#main)가 갈 곳이 있도록 main 요소를 직접 둔다.
export default function NotFound() {
  return (
    <main id="main" className={`container ${styles.page}`}>
      <p className={`label ${styles.status}`}>status: 404;</p>
      <div className={styles.box}>
        <h1 className={styles.title}>찾으시는 페이지가 없어요.</h1>
        <p className={styles.text}>주소가 바뀌었거나 잘못 입력되었을 수 있어요.</p>
      </div>
      <p className={styles.actions}>
        <Link href="/" className={styles.primary}>
          처음으로 돌아가기
        </Link>
        <Link href="/#projects" className={styles.secondary}>
          프로젝트 보기
        </Link>
      </p>
    </main>
  );
}
