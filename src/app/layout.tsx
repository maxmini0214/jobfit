import type { Metadata } from "next";
import "./globals.css";
import Header from "@/components/ui/Header";

export const metadata: Metadata = {
  title: "JobFit AI — 나한테 진짜 맞는 회사를 AI가 찾아줍니다",
  description: "이력서와 워크스타일을 분석해서 스킬, 컬쳐핏, 성장궤적, 타이밍까지 고려한 최적의 회사를 매칭해드립니다.",
  keywords: ["AI", "채용", "매칭", "구직", "컬쳐핏", "이직"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko" suppressHydrationWarning>
      <body className="antialiased min-h-screen">
        <Header />
        <main className="pt-16">
          {children}
        </main>
      </body>
    </html>
  );
}
