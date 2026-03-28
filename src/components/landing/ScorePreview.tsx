'use client';

import ScoreRing from '@/components/ui/ScoreRing';

export default function ScorePreview() {
  return (
    <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 sm:p-12 shadow-xl shadow-black/5">
      <div className="text-center mb-10">
        <p className="text-sm font-medium text-[var(--color-primary)] mb-2">매칭 결과 미리보기</p>
        <h3 className="text-2xl font-bold">이런 분석을 받을 수 있어요</h3>
      </div>

      <div className="flex flex-col lg:flex-row items-center gap-10">
        {/* Company card preview */}
        <div className="flex-1 w-full">
          <div className="rounded-2xl border border-[var(--color-border)] p-6 bg-[var(--color-bg-secondary)]">
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-lg mb-3">
                  T
                </div>
                <h4 className="font-bold text-xl">토스</h4>
                <p className="text-[var(--color-text-secondary)] text-sm">프론트엔드 개발자</p>
              </div>
              <ScoreRing score={86} />
            </div>

            <div className="space-y-3 mt-6">
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-secondary)] w-20 shrink-0">스킬</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full rounded-full bg-emerald-500" style={{ width: '95%' }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">95</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-secondary)] w-20 shrink-0">컬쳐핏</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '82%' }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">82</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-secondary)] w-20 shrink-0">성장궤적</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full rounded-full bg-blue-500" style={{ width: '88%' }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">88</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-sm text-[var(--color-text-secondary)] w-20 shrink-0">타이밍</span>
                <div className="flex-1 h-2 rounded-full bg-[var(--color-border)] overflow-hidden">
                  <div className="h-full rounded-full bg-amber-500" style={{ width: '75%' }} />
                </div>
                <span className="text-sm font-medium w-8 text-right">75</span>
              </div>
            </div>
          </div>
        </div>

        {/* Reasons preview */}
        <div className="flex-1 w-full space-y-4">
          <h4 className="font-bold text-lg mb-2">🎯 이 회사가 맞는 이유</h4>
          {[
            'TypeScript + Next.js 전문성이 토스의 기술 스택과 정확히 일치합니다',
            '임팩트 중심의 빠른 실행 문화가 당신의 성향과 잘 맞습니다',
            '핀테크 도메인에서의 성장 가능성이 높고 연봉 밴드도 희망 조건에 부합합니다',
          ].map((reason, i) => (
            <div
              key={i}
              className="flex gap-3 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)]"
            >
              <span className="shrink-0 w-6 h-6 rounded-full bg-[var(--color-primary)] text-white text-xs flex items-center justify-center font-bold">
                {i + 1}
              </span>
              <p className="text-sm leading-relaxed">{reason}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
