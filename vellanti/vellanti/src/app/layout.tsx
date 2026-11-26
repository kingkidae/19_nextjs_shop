import type { Metadata, Viewport } from "next";
import { Bodoni_Moda, Noto_Sans_KR } from "next/font/google";
import "./globals.css";

// 한글 폰트는 용량이 커서 preload를 끄고 unicode-range 분할 로딩에 맡깁니다.
const noto = Noto_Sans_KR({ weight: ["400", "500", "700"], variable: "--font-noto", display: "swap", preload: false });
const bodoni = Bodoni_Moda({ subsets: ["latin"], weight: ["400"], variable: "--font-bodoni", display: "swap" });

export const metadata: Metadata = {
  title: { default: "VELLANTI | 공식 온라인 부티크", template: "%s | VELLANTI" },
  description: "이탈리안 헤리티지를 재해석한 가상 럭셔리 브랜드 VELLANTI의 온라인 부티크 데모",
};

export const viewport: Viewport = { width: "device-width", initialScale: 1, themeColor: "#000000" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="ko" className={`${noto.variable} ${bodoni.variable}`}>
      <body>{children}</body>
    </html>
  );
}
