'use client';

import { useEffect, useState } from 'react';

interface Props {
  accuracy: number;
  maxAccuracy?: number;
}

export default function AccuracyGauge({ accuracy, maxAccuracy = 100 }: Props) {
  const [displayAccuracy, setDisplayAccuracy] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => setDisplayAccuracy(accuracy), 100);
    return () => clearTimeout(timer);
  }, [accuracy]);

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <span className="text-lg">🎯</span>
          <span className="font-semibold">매칭 정확도</span>
        </div>
        <span className="text-2xl font-bold text-[var(--color-primary)]">{displayAccuracy}%</span>
      </div>
      <div className="h-3 rounded-full bg-[var(--color-border)] overflow-hidden">
        <div
          className="h-full rounded-full bg-gradient-to-r from-blue-600 to-amber-500 transition-all duration-1000 ease-out"
          style={{ width: `${(displayAccuracy / maxAccuracy) * 100}%` }}
        />
      </div>
      {displayAccuracy < 80 && (
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
          매칭 정확도 {displayAccuracy}% — 이력서 추가하면 {Math.min(displayAccuracy + 20, 100)}%까지!
        </p>
      )}
    </div>
  );
}
