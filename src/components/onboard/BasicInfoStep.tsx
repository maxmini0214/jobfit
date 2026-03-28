'use client';

import { useRef, useEffect } from 'react';
import { JOB_CATEGORIES, EXPERIENCE_LEVELS } from '@/types';
import type { JobCategory, ExperienceLevel } from '@/types';

interface Props {
  jobCategory: JobCategory | null;
  subRole: string | null;
  experienceLevel: ExperienceLevel | null;
  onCategoryChange: (cat: JobCategory) => void;
  onSubRoleChange: (role: string) => void;
  onExperienceChange: (level: ExperienceLevel) => void;
  onNext: () => void;
}

export default function BasicInfoStep({
  jobCategory,
  subRole,
  experienceLevel,
  onCategoryChange,
  onSubRoleChange,
  onExperienceChange,
  onNext,
}: Props) {
  const bottomRef = useRef<HTMLDivElement>(null);
  const selectedCategory = JOB_CATEGORIES.find((c) => c.id === jobCategory);
  const canProceed = jobCategory && subRole && experienceLevel;

  // 선택할 때마다 하단으로 부드럽게 스크롤
  useEffect(() => {
    if ((jobCategory || subRole || experienceLevel) && bottomRef.current) {
      setTimeout(() => {
        bottomRef.current?.scrollIntoView({ behavior: 'smooth', block: 'end' });
      }, 100);
    }
  }, [jobCategory, subRole, experienceLevel]);

  // 경력 선택하면 자동으로 다음 단계로
  useEffect(() => {
    if (canProceed) {
      const timer = setTimeout(() => {
        onNext();
      }, 400);
      return () => clearTimeout(timer);
    }
  }, [canProceed, onNext]);

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl sm:text-2xl font-bold mb-1">어떤 일을 하세요?</h2>
        <p className="text-sm text-[var(--color-text-secondary)]">
          직군 → 세부직무 → 경력 순서로 탭하세요 ⚡
        </p>
      </div>

      {/* Job Category — compact horizontal scroll on mobile */}
      <div>
        <h3 className="font-medium mb-2 text-xs text-[var(--color-text-secondary)]">1. 직군</h3>
        <div className="flex flex-wrap gap-2">
          {JOB_CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`px-3 py-2 rounded-xl border-2 text-center transition-all active:scale-95 flex items-center gap-1.5 ${
                jobCategory === cat.id
                  ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20 shadow-sm'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
              }`}
            >
              <span className="text-lg">{cat.emoji}</span>
              <span className="font-medium text-sm">{cat.label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Sub-role chips */}
      {selectedCategory && (
        <div className="animate-in">
          <h3 className="font-medium mb-2 text-xs text-[var(--color-text-secondary)]">2. 세부 직무</h3>
          <div className="flex flex-wrap gap-2">
            {selectedCategory.subRoles.map((role) => (
              <button
                key={role}
                onClick={() => onSubRoleChange(role)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  subRole === role
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {role}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Experience Level */}
      {subRole && (
        <div className="animate-in">
          <h3 className="font-medium mb-2 text-xs text-[var(--color-text-secondary)]">3. 경력</h3>
          <div className="flex flex-wrap gap-2">
            {EXPERIENCE_LEVELS.map((level) => (
              <button
                key={level.id}
                onClick={() => onExperienceChange(level.id)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-all active:scale-95 ${
                  experienceLevel === level.id
                    ? 'bg-[var(--color-primary)] text-white shadow-md shadow-blue-500/20'
                    : 'bg-[var(--color-bg-secondary)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)] hover:text-[var(--color-primary)]'
                }`}
              >
                {level.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Scroll anchor */}
      <div ref={bottomRef} />
    </div>
  );
}
