'use client';

import Link from 'next/link';
import ThemeToggle from './ThemeToggle';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 backdrop-blur-xl bg-[var(--color-bg)]/80 border-b border-[var(--color-border)]">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center">
            <span className="text-white font-bold text-sm">JF</span>
          </div>
          <span className="font-bold text-lg">
            Job<span className="text-[var(--color-primary)]">Fit</span> AI
          </span>
        </Link>
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/check"
            className="hidden sm:inline-block px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            회사 핏 체크
          </Link>
          <Link
            href="/quiz"
            className="hidden sm:inline-block px-3 py-1.5 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
          >
            이직 퀴즈
          </Link>
          <ThemeToggle />
          <Link
            href="/onboard"
            className="px-4 py-2 rounded-full bg-[var(--color-primary)] text-white text-sm font-medium hover:bg-[var(--color-primary-dark)] transition-colors"
          >
            시작하기
          </Link>
        </div>
      </div>
    </header>
  );
}
