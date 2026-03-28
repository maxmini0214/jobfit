'use client';

import { useState } from 'react';
import Link from 'next/link';
import ScoreRing from '@/components/ui/ScoreRing';

const POPULAR_COMPANIES = ['토스', '당근', '네이버', '카카오', '쿠팡', '라인', '배달의민족', '크래프톤'];

const QUICK_QUESTIONS = [
  {
    key: 'buildVsImprove',
    leftEmoji: '🏗️',
    leftLabel: '0→1 새로 만들기',
    rightLabel: '기존 시스템 개선',
    rightEmoji: '📐',
  },
  {
    key: 'speedVsPlan',
    leftEmoji: '🏃',
    leftLabel: '빠른 실행',
    rightLabel: '신중한 계획',
    rightEmoji: '🧠',
  },
  {
    key: 'teamPreference',
    leftEmoji: '🚀',
    leftLabel: '작은 팀',
    rightLabel: '큰 조직',
    rightEmoji: '🏛️',
  },
];

// Mock company fit data
const MOCK_COMPANY_FIT: Record<string, { score: number; culture: string[]; fit: string[]; concern: string[] }> = {
  '토스': {
    score: 86,
    culture: ['속도', '임팩트', '실험'],
    fit: ['빠른 실행력이 토스의 문화와 잘 맞습니다', '기술 깊이를 중시하는 환경에서 성장 가능'],
    concern: ['야근이 잦을 수 있어 워라밸 선호 시 고려 필요'],
  },
  '당근': {
    score: 91,
    culture: ['자율', '책임', '성장'],
    fit: ['자율적인 워크스타일이 당근 문화와 완벽히 매칭', '0→1 경험을 쌓기 좋은 환경'],
    concern: ['빠른 성장 속도에 적응이 필요할 수 있습니다'],
  },
  '네이버': {
    score: 72,
    culture: ['기술 깊이', '연구', '안정'],
    fit: ['대규모 트래픽 경험을 쌓기 좋은 환경', '기술 연구에 투자가 많은 조직'],
    concern: ['체계적이지만 의사결정이 느릴 수 있음'],
  },
  '카카오': {
    score: 78,
    culture: ['도전', '성장', '다양성'],
    fit: ['다양한 서비스에서 경험을 쌓을 수 있습니다', '수평적 문화가 자율성을 존중'],
    concern: ['조직 규모가 커서 개인 임팩트를 느끼기 어려울 수 있음'],
  },
};

// Generate random-ish fit for unknown companies
function getCompanyFit(name: string) {
  if (MOCK_COMPANY_FIT[name]) return MOCK_COMPANY_FIT[name];
  const hash = name.split('').reduce((acc, c) => acc + c.charCodeAt(0), 0);
  return {
    score: 60 + (hash % 30),
    culture: ['성장', '혁신', '팀워크'],
    fit: [`${name}의 업무 환경이 당신의 워크스타일과 잘 맞습니다`, '성장 가능성이 높은 포지션이 있습니다'],
    concern: ['더 정확한 분석을 위해 전체 매칭을 시작해보세요'],
  };
}

type Step = 'search' | 'survey' | 'result';

export default function CheckPage() {
  const [step, setStep] = useState<Step>('search');
  const [companyName, setCompanyName] = useState('');
  const [answers, setAnswers] = useState<Record<string, number>>({
    buildVsImprove: 3,
    speedVsPlan: 3,
    teamPreference: 3,
  });

  const handleCompanySelect = (name: string) => {
    setCompanyName(name);
    setStep('survey');
  };

  const handleSearch = () => {
    if (companyName.trim()) {
      setStep('survey');
    }
  };

  const handleSurveyComplete = () => {
    setStep('result');
  };

  const fit = getCompanyFit(companyName);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {step === 'search' && (
          <div className="space-y-8">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl font-bold mb-3">
                이 회사, 나한테 맞을까? 🤔
              </h1>
              <p className="text-[var(--color-text-secondary)] text-lg">
                회사 이름을 입력하면 나와의 핏을 분석해드립니다
              </p>
            </div>

            {/* Search bar */}
            <div className="relative">
              <input
                type="text"
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="회사 이름을 입력하세요..."
                className="w-full px-6 py-4 rounded-2xl border-2 border-[var(--color-border)] bg-[var(--color-bg)] text-lg focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
              />
              <button
                onClick={handleSearch}
                disabled={!companyName.trim()}
                className="absolute right-3 top-1/2 -translate-y-1/2 px-5 py-2 rounded-xl bg-[var(--color-primary)] text-white font-medium disabled:opacity-40 transition-all"
              >
                분석 →
              </button>
            </div>

            {/* Popular companies */}
            <div>
              <p className="text-sm text-[var(--color-text-secondary)] mb-3">인기 회사</p>
              <div className="flex flex-wrap gap-2">
                {POPULAR_COMPANIES.map((name) => (
                  <button
                    key={name}
                    onClick={() => handleCompanySelect(name)}
                    className="px-4 py-2.5 rounded-full border border-[var(--color-border)] text-sm font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all active:scale-95"
                  >
                    {name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {step === 'survey' && (
          <div className="space-y-8">
            <div>
              <button
                onClick={() => setStep('search')}
                className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-4 transition-colors"
              >
                ← 다른 회사 검색
              </button>
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className="text-[var(--color-primary)]">{companyName}</span>과 나의 핏은?
              </h2>
              <p className="text-[var(--color-text-secondary)]">
                3개 질문만 답해주세요 ⚡
              </p>
            </div>

            <div className="space-y-6">
              {QUICK_QUESTIONS.map((q) => (
                <div
                  key={q.key}
                  className="p-5 rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)]"
                >
                  <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      <span className="text-lg">{q.leftEmoji}</span>
                      {q.leftLabel}
                    </span>
                    <span className="text-sm font-medium flex items-center gap-1.5">
                      {q.rightLabel}
                      <span className="text-lg">{q.rightEmoji}</span>
                    </span>
                  </div>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((val) => (
                      <button
                        key={val}
                        onClick={() => setAnswers((prev) => ({ ...prev, [q.key]: val }))}
                        className={`flex-1 py-3 rounded-xl text-sm font-bold transition-all active:scale-95 ${
                          answers[q.key] === val
                            ? val <= 2
                              ? 'bg-blue-500 text-white shadow-md'
                              : val === 3
                              ? 'bg-slate-500 text-white shadow-md'
                              : 'bg-amber-500 text-white shadow-md'
                            : 'bg-[var(--color-bg)] border border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                        }`}
                      >
                        {val}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={handleSurveyComplete}
              className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] transition-all active:scale-[0.98]"
            >
              핏 분석하기 🔍
            </button>
          </div>
        )}

        {step === 'result' && (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-2xl sm:text-3xl font-bold mb-2">
                <span className="text-[var(--color-primary)]">{companyName}</span>과의 핏
              </h2>
            </div>

            {/* Fit Card */}
            <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 text-center">
              <div className="mb-6">
                <ScoreRing score={fit.score} size={120} strokeWidth={10} />
              </div>
              <h3 className="text-xl font-bold mb-2">{companyName}</h3>
              <div className="flex justify-center gap-2 mb-6">
                {fit.culture.map((v) => (
                  <span
                    key={v}
                    className="text-xs px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300"
                  >
                    {v}
                  </span>
                ))}
              </div>

              <div className="text-left space-y-4">
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-emerald-600">✅ 맞는 포인트</h4>
                  {fit.fit.map((f, i) => (
                    <p key={i} className="text-sm text-[var(--color-text-secondary)] mb-1">• {f}</p>
                  ))}
                </div>
                <div>
                  <h4 className="font-semibold text-sm mb-2 text-amber-600">⚠️ 참고할 점</h4>
                  {fit.concern.map((c, i) => (
                    <p key={i} className="text-sm text-[var(--color-text-secondary)] mb-1">• {c}</p>
                  ))}
                </div>
              </div>
            </div>

            {/* CTAs */}
            <div className="space-y-3">
              <button
                onClick={() => { setStep('search'); setCompanyName(''); }}
                className="w-full py-3 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
              >
                🔍 다른 회사도 확인하기
              </button>
              <Link
                href="/onboard"
                className="block w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg text-center hover:bg-[var(--color-primary-dark)] transition-all"
              >
                전체 매칭 시작하기 →
              </Link>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
