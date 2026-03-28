'use client';

import { useState, useCallback, useRef } from 'react';
import type { WorkStyle, JobCategory, OptionalProfile, CustomLink } from '@/types';

interface Props {
  workStyle: WorkStyle;
  onChange: (ws: WorkStyle) => void;
  onNext: () => void;
  onBack: () => void;
  jobCategory: JobCategory | null;
  optionalProfile: OptionalProfile;
  onOptionalProfileChange: (profile: OptionalProfile) => void;
}

const questions = [
  {
    key: 'buildVsImprove' as const,
    leftEmoji: '🏗️',
    leftLabel: '0→1 새로 만들기',
    rightLabel: '기존 시스템 개선',
    rightEmoji: '📐',
  },
  {
    key: 'speedVsPlan' as const,
    leftEmoji: '🏃',
    leftLabel: '빠른 실행',
    rightLabel: '신중한 계획',
    rightEmoji: '🧠',
  },
  {
    key: 'autonomyVsStructure' as const,
    leftEmoji: '🦅',
    leftLabel: '자율적으로',
    rightLabel: '체계적 가이드',
    rightEmoji: '📋',
  },
  {
    key: 'depthVsBreadth' as const,
    leftEmoji: '🔬',
    leftLabel: '한 분야 깊이',
    rightLabel: '여러 분야 폭넓게',
    rightEmoji: '🌊',
  },
];

const teamSizeOptions = [
  { value: 'startup' as const, label: '스타트업', desc: '~30명', emoji: '🚀' },
  { value: 'midsize' as const, label: '중견', desc: '30~300명', emoji: '🏢' },
  { value: 'enterprise' as const, label: '대기업', desc: '300명+', emoji: '🏛️' },
];

const buttonValues = [1, 2, 3, 4, 5];

const remotePolicyOptions = [
  { value: 'onsite' as const, label: '출근' },
  { value: 'hybrid' as const, label: '하이브리드' },
  { value: 'remote' as const, label: '풀리모트' },
  { value: 'any' as const, label: '상관없음' },
];

const locationOptions = ['서울', '경기', '부산', '대전', '대구', '기타', '상관없음'];

function getRecommendedLinks(category: JobCategory | null): { key: string; label: string; placeholder: string }[] {
  switch (category) {
    case 'dev':
    case 'aiml':
    case 'devops':
      return [
        { key: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/username' },
        { key: 'blogUrl', label: '기술 블로그 URL', placeholder: 'https://blog.example.com' },
      ];
    case 'design':
      return [
        { key: 'portfolioUrl', label: '포트폴리오 URL', placeholder: 'https://behance.net/... 또는 dribbble.com/...' },
      ];
    case 'pm':
      return [
        { key: 'portfolioUrl', label: '포트폴리오 URL', placeholder: 'https://notion.so/... 등' },
      ];
    case 'data':
      return [
        { key: 'kaggleUrl', label: 'Kaggle URL', placeholder: 'https://kaggle.com/username' },
        { key: 'githubUrl', label: 'GitHub URL', placeholder: 'https://github.com/username' },
      ];
    case 'marketing':
      return [
        { key: 'blogUrl', label: '블로그/SNS URL', placeholder: 'https://blog.example.com 또는 SNS 링크' },
      ];
    default:
      return [];
  }
}

export default function WorkStyleStep({
  workStyle,
  onChange,
  onNext,
  onBack,
  jobCategory,
  optionalProfile,
  onOptionalProfileChange,
}: Props) {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const updateField = <K extends keyof WorkStyle>(key: K, value: WorkStyle[K]) => {
    onChange({ ...workStyle, [key]: value });
  };

  const updateProfile = useCallback(
    (updates: Partial<OptionalProfile>) => {
      onOptionalProfileChange({ ...optionalProfile, ...updates });
    },
    [optionalProfile, onOptionalProfileChange]
  );

  const updateProfileLink = useCallback(
    (key: string, value: string) => {
      updateProfile({ [key]: value });
    },
    [updateProfile]
  );

  const updatePreference = useCallback(
    (key: string, value: string | number | undefined) => {
      updateProfile({
        preferences: {
          ...optionalProfile.preferences!,
          [key]: value,
        },
      });
    },
    [optionalProfile, updateProfile]
  );

  const addCustomLink = useCallback(() => {
    if (optionalProfile.customLinks.length >= 5) return;
    updateProfile({
      customLinks: [...optionalProfile.customLinks, { url: '', label: '' }],
    });
  }, [optionalProfile, updateProfile]);

  const updateCustomLink = useCallback(
    (index: number, field: keyof CustomLink, value: string) => {
      const updated = [...optionalProfile.customLinks];
      updated[index] = { ...updated[index], [field]: value };
      updateProfile({ customLinks: updated });
    },
    [optionalProfile, updateProfile]
  );

  const removeCustomLink = useCallback(
    (index: number) => {
      const updated = optionalProfile.customLinks.filter((_, i) => i !== index);
      updateProfile({ customLinks: updated });
    },
    [optionalProfile, updateProfile]
  );

  const handleResumeDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') {
        updateProfile({ resumeFile: file });
      }
    },
    [updateProfile]
  );

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) updateProfile({ resumeFile: file });
  };

  const recommendedLinks = getRecommendedLinks(jobCategory);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">워크스타일 진단</h2>
        <p className="text-[var(--color-text-secondary)]">
          나에게 맞는 환경을 찾기 위한 4문항입니다 🎯
        </p>
      </div>

      {/* Questions with 5-button UI */}
      <div className="space-y-6">
        {questions.map((q) => (
          <div
            key={q.key}
            className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
          >
            {/* Labels */}
            <div className="flex items-center justify-between mb-4">
              <span className="text-sm font-medium flex items-center gap-1.5">
                <span className="text-lg">{q.leftEmoji}</span>
                <span className="hidden sm:inline">{q.leftLabel}</span>
                <span className="sm:hidden text-xs">{q.leftLabel}</span>
              </span>
              <span className="text-sm font-medium flex items-center gap-1.5">
                <span className="hidden sm:inline">{q.rightLabel}</span>
                <span className="sm:hidden text-xs">{q.rightLabel}</span>
                <span className="text-lg">{q.rightEmoji}</span>
              </span>
            </div>

            {/* 5 Buttons */}
            <div className="flex gap-2">
              {buttonValues.map((val) => {
                const isSelected = workStyle[q.key] === val;
                return (
                  <button
                    key={val}
                    onClick={() => updateField(q.key, val)}
                    className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                      isSelected
                        ? val <= 2
                          ? 'bg-blue-500 text-white shadow-md shadow-blue-500/20'
                          : val === 3
                          ? 'bg-slate-500 text-white shadow-md'
                          : 'bg-amber-500 text-white shadow-md shadow-amber-500/20'
                        : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                    }`}
                  >
                    {val}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Team size */}
      <div>
        <h3 className="font-medium mb-3 text-sm text-[var(--color-text-secondary)]">선호 팀 규모</h3>
        <div className="grid grid-cols-3 gap-3">
          {teamSizeOptions.map((opt) => (
            <button
              key={opt.value}
              onClick={() => updateField('teamSize', opt.value)}
              className={`p-4 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                workStyle.teamSize === opt.value
                  ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20 shadow-md shadow-blue-500/10'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
              }`}
            >
              <div className="text-2xl mb-1">{opt.emoji}</div>
              <div className="font-medium text-sm">{opt.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">{opt.desc}</div>
            </button>
          ))}
        </div>
      </div>

      {/* Optional Profile Accordion */}
      <div className="rounded-2xl border border-[var(--color-border)] overflow-hidden">
        <button
          onClick={() => setAccordionOpen(!accordionOpen)}
          className="w-full flex items-center justify-between p-5 bg-[var(--color-bg-secondary)] hover:bg-[var(--color-bg-secondary)]/80 transition-colors"
        >
          <span className="font-medium text-sm flex items-center gap-2">
            <span className="text-lg">📎</span>
            더 정확한 결과를 원하면?
          </span>
          <svg
            className={`w-5 h-5 text-[var(--color-text-secondary)] transition-transform duration-300 ${
              accordionOpen ? 'rotate-180' : ''
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>

        <div
          ref={contentRef}
          className="transition-all duration-300 ease-in-out overflow-hidden"
          style={{
            maxHeight: accordionOpen ? `${contentRef.current?.scrollHeight ?? 2000}px` : '0px',
            opacity: accordionOpen ? 1 : 0,
          }}
        >
          <div className="p-5 space-y-6 border-t border-[var(--color-border)]">
            {/* Category-specific recommended links */}
            {recommendedLinks.length > 0 && (
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">
                  📌 직군 추천 링크
                </h4>
                {recommendedLinks.map((link) => (
                  <div key={link.key}>
                    <label className="block text-sm font-medium mb-1.5">{link.label}</label>
                    <input
                      type="url"
                      value={(optionalProfile as unknown as Record<string, string>)[link.key] || ''}
                      onChange={(e) => updateProfileLink(link.key, e.target.value)}
                      placeholder={link.placeholder}
                      className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                    />
                  </div>
                ))}
              </div>
            )}

            {/* Resume upload */}
            <div>
              <h4 className="text-sm font-medium text-[var(--color-text-secondary)] mb-2">📎 이력서 업로드</h4>
              <div
                onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                onDragLeave={() => setDragActive(false)}
                onDrop={handleResumeDrop}
                className={`relative border-2 border-dashed rounded-xl p-6 text-center transition-all cursor-pointer ${
                  dragActive
                    ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/10'
                    : optionalProfile.resumeFile
                    ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
                }`}
              >
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleResumeChange}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                />
                {optionalProfile.resumeFile ? (
                  <div>
                    <span className="text-2xl">✅</span>
                    <p className="font-medium text-emerald-700 dark:text-emerald-400 text-sm mt-1">
                      {optionalProfile.resumeFile.name}
                    </p>
                    <p className="text-xs text-[var(--color-text-secondary)] mt-0.5">
                      클릭해서 변경
                    </p>
                  </div>
                ) : (
                  <div>
                    <span className="text-2xl">📄</span>
                    <p className="text-sm font-medium mt-1">PDF 드래그 또는 클릭</p>
                    <p className="text-xs text-[var(--color-text-secondary)]">최대 10MB</p>
                  </div>
                )}
              </div>
            </div>

            {/* LinkedIn URL */}
            <div>
              <label className="block text-sm font-medium mb-1.5">🔗 LinkedIn URL</label>
              <input
                type="url"
                value={optionalProfile.linkedinUrl || ''}
                onChange={(e) => updateProfile({ linkedinUrl: e.target.value })}
                placeholder="https://linkedin.com/in/..."
                className="w-full px-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
              />
            </div>

            {/* Custom links */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-sm font-medium">✏️ 기타 링크</label>
                {optionalProfile.customLinks.length < 5 && (
                  <button
                    onClick={addCustomLink}
                    className="flex items-center gap-1 text-xs font-medium text-[var(--color-primary)] hover:underline"
                  >
                    <span className="text-lg leading-none">+</span> 추가
                  </button>
                )}
              </div>
              {optionalProfile.customLinks.length === 0 && (
                <p className="text-xs text-[var(--color-text-secondary)]">
                  개인 블로그, Notion 포트폴리오 등 자유롭게 추가하세요
                </p>
              )}
              <div className="space-y-2">
                {optionalProfile.customLinks.map((link, i) => (
                  <div key={i} className="flex gap-2 items-start">
                    <div className="flex-1 space-y-1.5">
                      <input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateCustomLink(i, 'url', e.target.value)}
                        placeholder="https://..."
                        className="w-full px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                      />
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateCustomLink(i, 'label', e.target.value)}
                        placeholder="예: 개인 블로그"
                        className="w-full px-3 py-2 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-xs"
                      />
                    </div>
                    <button
                      onClick={() => removeCustomLink(i)}
                      className="mt-2 p-1.5 rounded-lg text-[var(--color-text-secondary)] hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors"
                      aria-label="삭제"
                    >
                      ✕
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Preferences */}
            <div className="space-y-4">
              <h4 className="text-sm font-medium text-[var(--color-text-secondary)]">💰 희망 조건</h4>

              {/* Salary range */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">
                  연봉 범위 (만원)
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    value={optionalProfile.preferences?.salaryMin ?? ''}
                    onChange={(e) =>
                      updatePreference('salaryMin', e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="최소"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                  <span className="text-[var(--color-text-secondary)] text-sm">~</span>
                  <input
                    type="number"
                    value={optionalProfile.preferences?.salaryMax ?? ''}
                    onChange={(e) =>
                      updatePreference('salaryMax', e.target.value ? Number(e.target.value) : undefined)
                    }
                    placeholder="최대"
                    className="flex-1 px-3 py-2.5 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all text-sm"
                  />
                </div>
              </div>

              {/* Remote policy */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">
                  리모트 정책
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {remotePolicyOptions.map((opt) => (
                    <button
                      key={opt.value}
                      onClick={() => updatePreference('remotePolicy', opt.value)}
                      className={`py-2.5 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        optionalProfile.preferences?.remotePolicy === opt.value
                          ? 'bg-[var(--color-primary)] text-white shadow-md'
                          : 'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {opt.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Location */}
              <div>
                <label className="block text-xs font-medium mb-1.5 text-[var(--color-text-secondary)]">
                  선호 지역
                </label>
                <div className="flex flex-wrap gap-2">
                  {locationOptions.map((loc) => (
                    <button
                      key={loc}
                      onClick={() => updatePreference('location', loc)}
                      className={`px-3 py-2 rounded-xl text-sm font-medium transition-all active:scale-95 ${
                        optionalProfile.preferences?.location === loc
                          ? 'bg-[var(--color-primary)] text-white shadow-md'
                          : 'border border-[var(--color-border)] bg-[var(--color-bg-secondary)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                      }`}
                    >
                      {loc}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation — always visible */}
      <div className="flex gap-3">
        <button
          onClick={onBack}
          className="px-6 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
        >
          ← 이전
        </button>
        <button
          onClick={onNext}
          className="flex-1 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] transition-all active:scale-[0.98]"
        >
          매칭 결과 보기 ✨
        </button>
      </div>
    </div>
  );
}
