import type { Metadata } from "next";
import Link from "next/link";
import CmsPreview from "@/components/CmsPreview";

export const metadata: Metadata = {
  title: "CMS 컴포넌트 미리보기 | 김영빈",
  description: "텍스트를 입력하면 HTML 소스가 만들어지고 결과를 바로 볼 수 있는 개인 데모예요.",
};

export default function CmsPreviewPage() {
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
      <h1>CMS 컴포넌트 미리보기</h1>
      <p>샘플 데이터예요. 서버에 저장되지 않고, 개인이 만든 데모예요.</p>
      <p>타입 25개를 담은 데모예요.</p>
      <CmsPreview />
      <Link href="/">처음으로 돌아가기</Link>
    </main>
  );
}
