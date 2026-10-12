import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "기록 | 김영빈",
  description: "배우고 만든 과정을 기록하는 공간이에요.",
};

export default function LogPage() {
  return (
    <main id="main" className="container" style={{ padding: "var(--space-5) var(--space-3)" }}>
      <h1>기록</h1>
      <p style={{ margin: "var(--space-3) 0" }}>기록은 곧 채워질 예정이에요.</p>
      <Link href="/">처음으로 돌아가기</Link>
    </main>
  );
}
