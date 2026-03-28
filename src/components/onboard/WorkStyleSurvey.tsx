'use client';

import type { WorkStyle } from '@/types';

interface Props {
  workStyle: WorkStyle;
  onChange: (ws: WorkStyle) => void;
  onNext: () => void;
  onBack: () => void;
}

const questions = [
  {
    key: 'buildVsImprove' as const,
    question: '새로운 것을 만드는 것 vs 기존 것을 개선하는 것',
    left: '0→1 만들기',
    right: '기존 개선',
    emoji: '🔨',
  },
  {
    key: 'speedVsPlan' as const,
    question: '빠르게 실행하기 vs 신중하게 계획하기',
    left: '빠른 실행',
    right: '신중한 계획',
    emoji: '⚡',
  },
  {
    key: 'autonomyVsStructure' as const,
    question: '자율적으로 일하기 vs 체계적인 환경에서 일하기',
    left: '자율',
    right: '체계',
    emoji: '🧭',
  },
  {
    key: 'depthVsBreadth' as const,
    question: '한 분야를 깊게 파기 vs 여러 분야를 넓게 경험',
    left: '깊이',
    right: '폭넓게',
    emoji: '🔬',
  },
];

const teamSizeOptions = [
  { value: 'startup' as const, label: '스타트업', desc: '10~50명, 빠른 성장', emoji: '🚀' },
  { value: 'midsize' as const, label: '중견기업', desc: '50~500명, 안정+성장', emoji: '🏢' },
  { value: 'enterprise' as const, label: '대기업', desc: '500명+, 체계적 환경', emoji: '🏛️' },
];

export default function WorkStyleSurvey({ workStyle, onChange, onNext, onBack }: Props) {
  const updateField = <K extends keyof WorkStyle>(key: K, value: WorkStyle[K]) => {
    onChange({ ...workStyle, [key]: value });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">당신의 워크스타일은?</h2>
        <p className="text-[var(--color-text-secondary)]">
          5개 질문으로 어떤 환경에서 최고의 퍼포먼스를 내는지 진단합니다
        </p>
      </div>

      {/* Slider questions */}
      <div className="space-y-8">
        {questions.map((q) => (
          <div key={q.key} className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
            <div className="flex items-center gap-2 mb-4">
              <span className="text-xl">{q.emoji}</span>
              <h3 className="font-medium">{q.question}</h3>
            </div>

            <div className="relative px-2">
              <input
                type="range"
                min={1}
                max={5}
                value={workStyle[q.key] as number}
                onChange={(e) => updateField(q.key, Number(e.target.value))}
                className="w-full h-2 rounded-full appearance-none cursor-pointer bg-gradient-to-r from-blue-500 to-amber-500 [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:w-6 [&::-webkit-slider-thumb]:h-6 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-white [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-blue-500 [&::-webkit-slider-thumb]:cursor-pointer"
              />

              {/* Labels */}
              <div className="flex justify-between mt-2">
                <span className="text-xs text-blue-600 dark:text-blue-400 font-medium">{q.left}</span>
                <span className="text-xs text-[var(--color-text-secondary)]">{workStyle[q.key] as number}/5</span>
                <span className="text-xs text-amber-600 dark:text-amber-400 font-medium">{q.right}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Team size */}
      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <span className="text-xl">👥</span>
          선호하는 팀 규모
        </h3>
        <div className="grid grid-cols-3 gap-3">
          {teamSizeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateField('teamSize', opt.value)}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                workStyle.teamSize === opt.value
                  ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
              }`}
            >
              <div className="text-2xl mb-2">{opt.emoji}</div>
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)] mt-1">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
        >
          ← 이전
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] transition-all"
        >
          다음 단계로 →
        </button>
      </div>
    </div>
  );
}
