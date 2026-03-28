'use client';

import { useEffect, useState } from 'react';

interface Props {
  onComplete: () => void;
}

export default function AnalyzingStep({ onComplete }: Props) {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('프로필 분석 중...');

  useEffect(() => {
    const steps = [
      { progress: 30, text: '워크스타일 분석 중...' },
      { progress: 60, text: '컬쳐핏 매칭 중...' },
      { progress: 90, text: '최적 회사 계산 중...' },
      { progress: 100, text: '완료!' },
    ];

    steps.forEach((step, i) => {
      setTimeout(() => {
        setProgress(step.progress);
        setStatusText(step.text);
        if (step.progress === 100) {
          setTimeout(onComplete, 400);
        }
      }, (i + 1) * 500);
    });
  }, [onComplete]);

  return (
    <div className="text-center py-16">
      <div className="text-6xl mb-8 animate-bounce">🔍</div>
      <h2 className="text-2xl sm:text-3xl font-bold mb-3">AI가 분석하고 있어요</h2>
      <p className="text-[var(--color-text-secondary)] mb-10">{statusText}</p>

      <div className="max-w-sm mx-auto">
        <div className="h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-blue-600 via-blue-400 to-amber-500 transition-all duration-500"
            style={{ width: `${progress}%` }}
          />
        </div>
        <p className="text-sm text-[var(--color-text-secondary)] mt-3">{progress}%</p>
      </div>
    </div>
  );
}
