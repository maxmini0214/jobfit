import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist",
});

export const metadata: Metadata = {
  title: "JobFit AI — 나한테 진짜 맞는 회사를 AI가 찾아줍니다",
  description:
    "스킬 매칭이 아닌, 컬쳐핏 + 성장궤적 분석으로 당신에게 최적인 회사를 매칭해드립니다.",
  openGraph: {
    title: "JobFit AI — 나한테 맞는 회사, AI가 찾아드립니다",
    description: "컬쳐핏 + 성장궤적 + 스킬 종합 매칭",
    type: "website",
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
      </body>
    </html>
  );
}
