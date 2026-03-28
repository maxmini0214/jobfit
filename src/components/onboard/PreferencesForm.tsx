'use client';

import type { Preferences } from '@/types';

interface Props {
  preferences: Preferences;
  onChange: (p: Preferences) => void;
  onNext: () => void;
  onBack: () => void;
}

const remoteOptions = [
  { value: 'remote' as const, label: '완전 리모트', emoji: '🏠' },
  { value: 'hybrid' as const, label: '하이브리드', emoji: '🔄' },
  { value: 'office' as const, label: '오피스 출근', emoji: '🏢' },
  { value: 'any' as const, label: '상관없음', emoji: '✨' },
];

const locationOptions = [
  '서울', '경기/인천', '부산', '대전', '대구', '광주', '제주', '해외', '상관없음'
];

export default function PreferencesForm({ preferences, onChange, onNext, onBack }: Props) {
  const update = <K extends keyof Preferences>(key: K, value: Preferences[K]) => {
    onChange({ ...preferences, [key]: value });
  };

  return (
    <div className="space-y-10">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">희망 조건을 알려주세요</h2>
        <p className="text-[var(--color-text-secondary)]">
          조건에 맞는 회사를 우선적으로 매칭해드립니다
        </p>
      </div>

      {/* Salary Range */}
      <div className="p-6 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]">
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <span className="text-xl">💰</span>
          희망 연봉 범위
        </h3>
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">최소</label>
            <div className="relative">
              <input
                type="number"
                value={preferences.salaryMin}
                onChange={(e) => update('salaryMin', Number(e.target.value))}
                step={500}
                min={0}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-secondary)]">만원</span>
            </div>
          </div>
          <span className="text-[var(--color-text-secondary)] mt-6">~</span>
          <div className="flex-1">
            <label className="text-xs text-[var(--color-text-secondary)] mb-1 block">최대</label>
            <div className="relative">
              <input
                type="number"
                value={preferences.salaryMax}
                onChange={(e) => update('salaryMax', Number(e.target.value))}
                step={500}
                min={0}
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-[var(--color-text-secondary)]">만원</span>
            </div>
          </div>
        </div>
        <p className="text-xs text-[var(--color-text-secondary)]">
          연봉 범위: {preferences.salaryMin.toLocaleString()}만원 ~ {preferences.salaryMax.toLocaleString()}만원
        </p>
      </div>

      {/* Remote Policy */}
      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <span className="text-xl">🌐</span>
          근무 형태
        </h3>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {remoteOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => update('remote', opt.value)}
              className={`p-4 rounded-2xl border-2 text-center transition-all ${
                preferences.remote === opt.value
                  ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
              }`}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className="font-medium text-sm">{opt.label}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Location */}
      <div>
        <h3 className="font-medium mb-4 flex items-center gap-2">
          <span className="text-xl">📍</span>
          선호 지역
        </h3>
        <div className="flex flex-wrap gap-2">
          {locationOptions.map((loc) => (
            <button
              key={loc}
              onClick={() => update('location', loc)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                preferences.location === loc
                  ? 'bg-[var(--color-primary)] text-white'
                  : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
              }`}
            >
              {loc}
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
          매칭 결과 보기 ✨
        </button>
      </div>
    </div>
  );
}
