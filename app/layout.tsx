import type { Metadata } from "next";
import { Noto_Sans_KR, JetBrains_Mono } from "next/font/google";
import SiteHeader from "@/components/SiteHeader";
import "@/styles/tokens.css";
import "@/styles/globals.css";

// 한글 본문과 영문 라벨/코드 글꼴을 분리한다. 모노스페이스 글꼴은 대개 한글을 못 그려서
// 섞어 쓰면 브라우저가 임의의 글꼴로 대체해 높이와 굵기가 어긋난다.
const notoSansKr = Noto_Sans_KR({
  variable: "--font-noto-sans-kr",
  subsets: ["latin"],
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "김영빈 | 포트폴리오",
  description: "웹 퍼블리셔에서 프론트엔드 개발자로.",
  // 링크를 메신저나 메일에 붙였을 때 보이는 미리보기 문구. 이미지는 아직 만들지 않는다.
  openGraph: {
    title: "김영빈 | 포트폴리오",
    description: "웹 퍼블리셔에서 프론트엔드 개발자로.",
    type: "website",
    locale: "ko_KR",
  },
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="ko" className={`${notoSansKr.variable} ${jetbrainsMono.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          본문으로 건너뛰기
        </a>
        <SiteHeader />
        {children}
      </body>
    </html>
  );
}
