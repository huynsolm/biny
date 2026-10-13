import type { Metadata } from "next";
import Link from "next/link";
import QaDashboard from "@/components/QaDashboard";

export const metadata: Metadata = {
  title: "발행 점검 체크리스트 | 김영빈",
  description: "페이지를 발행하기 전에 점검하는 기준을 직접 눌러 볼 수 있는 개인 데모예요.",
};

export default function QaDashboardPage() {
  return (
    <main
      id="main"
      className="container"
      style={{
        padding: "var(--space-5) var(--space-3)",
        display: "flex",
        flexDirection: "column",
        gap: "var(--space-3)",
      }}
    >
      <h1>발행 점검 체크리스트</h1>
      <p>샘플 데이터예요. 이 브라우저에만 저장되고, 개인이 만든 데모예요.</p>
      <QaDashboard />
      <Link href="/">처음으로 돌아가기</Link>
    </main>
  );
}
