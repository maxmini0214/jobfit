import type { Metadata } from "next";
import { Geist } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "JobFit AI — 나한테 진짜 맞는 회사를 AI가 찾아줍니다",
  description:
    "스킬 매칭이 아닌, 컬쳐핏 + 성장궤적 분석으로 당신에게 최적인 회사를 매칭해드립니다. 원티드·점핏 실시간 공고 분석.",
  keywords: ["AI 매칭", "이직", "컬쳐핏", "채용", "원티드", "점핏", "개발자 이직", "JobFit"],
  openGraph: {
    title: "JobFit AI — 나한테 맞는 회사, AI가 찾아드립니다",
    description: "컬쳐핏 + 성장궤적 + 스킬 종합 매칭. 무료 매칭 리포트 3개.",
    type: "website",
    siteName: "JobFit AI",
    locale: "ko_KR",
  },
  twitter: {
    card: "summary_large_image",
    title: "JobFit AI — 나한테 맞는 회사, AI가 찾아드립니다",
    description: "컬쳐핏 + 성장궤적 + 스킬 종합 매칭",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${geist.variable} font-sans antialiased`}>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
