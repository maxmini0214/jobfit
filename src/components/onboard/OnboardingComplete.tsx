'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function OnboardingComplete() {
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('이력서 분석 중...');

  useEffect(() => {
    const steps = [
      { progress: 20, text: '이력서 분석 중...' },
      { progress: 40, text: '스킬 매칭 분석 중...' },
      { progress: 60, text: '컬쳐핏 진단 중...' },
      { progress: 80, text: '성장궤적 예측 중...' },
      { progress: 95, text: '최적 매칭 계산 중...' },
      { progress: 100, text: '완료!' },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(step.progress);
        setStatusText(step.text);
        if (step.progress === 100) {
          setTimeout(() => router.push('/results'), 500);
        }
      }, (i + 1) * 800);
    });
  }, [router]);

  return (
    <div className="text-center py-20">
      <div className="text-6xl mb-8 animate-bounce">🔍</div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-4">AI가 분석하고 있어요</h2>
      <p className="text-[var(--color-text-secondary)] mb-10">{statusText}</p>

      <div className="max-w-md mx-auto">
        <div className="h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-amber-500 transition-all duration-700"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">{progress}%</p>
      </div>

      <div className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-lg mx-auto">
        {['스킬 매칭', '컬쳐핏', '성장궤적', '타이밍'].map((label, i) => (
          <div
            key={label}
            className={`p-3 rounded-xl border transition-all duration-300 ${
              progress > (i + 1) * 20
                ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/20'
                : 'border-[var(--color-border)]'
            }`}
          >
            <div className="text-lg mb-1">
              {progress > (i + 1) * 20 ? '✅' : '⏳'}
            </div>
            <p className="text-xs font-medium">{label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
