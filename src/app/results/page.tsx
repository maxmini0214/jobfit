'use client';

import { useState, useEffect } from 'react';
import { mockMatches } from '@/data/mock';
import MatchCard from '@/components/results/MatchCard';
import AccuracyGauge from '@/components/results/AccuracyGauge';
import ProfileBoost from '@/components/results/ProfileBoost';
import Link from 'next/link';

export default function ResultsPage() {
  const [accuracy, setAccuracy] = useState(60);

  useEffect(() => {
    try {
      const saved = localStorage.getItem('jobfit_accuracy');
      if (saved) {
        setAccuracy(Math.min(Number(saved), 100));
      }
    } catch {}
  }, []);
  const [analyzeCount, setAnalyzeCount] = useState(0);
  const freeMatches = mockMatches.slice(0, 3);
  const premiumMatches = mockMatches.slice(3);

  const handleReanalyze = () => {
    setAnalyzeCount((c) => c + 1);
  };

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100 dark:bg-emerald-900/30 text-emerald-700 dark:text-emerald-300 text-sm font-medium mb-4">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            매칭 완료
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold mb-3">
            당신에게 맞는 회사 <span className="gradient-text">TOP 5</span>
          </h1>
          <p className="text-[var(--color-text-secondary)] text-lg">
            스킬 35% · 컬쳐핏 30% · 성장궤적 20% · 타이밍 15% 종합 분석
          </p>
        </div>

        {/* Accuracy Gauge */}
        <div className="mb-8">
          <AccuracyGauge accuracy={accuracy} />
        </div>

        {/* Free matches */}
        <div className="space-y-6 mb-8">
          {freeMatches.map((match, i) => (
            <MatchCard key={`${match.id}-${analyzeCount}`} match={match} rank={i + 1} />
          ))}
        </div>

        {/* Premium wall */}
        {premiumMatches.length > 0 && (
          <div className="relative mb-8">
            <div className="absolute inset-0 z-10 flex items-center justify-center">
              <div className="bg-[var(--color-bg)]/95 backdrop-blur-sm rounded-3xl p-8 sm:p-12 text-center border border-[var(--color-border)] shadow-2xl max-w-md mx-4">
                <div className="text-4xl mb-4">🔒</div>
                <h3 className="text-xl font-bold mb-2">프리미엄으로 전체 결과 확인</h3>
                <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                  나머지 {premiumMatches.length}개 매칭 결과와 각 회사별 상세 리포트를 확인하세요.
                  면접 팁, 연봉 협상 전략까지 포함됩니다.
                </p>
                <button className="w-full py-3 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 text-white font-semibold hover:from-amber-600 hover:to-amber-700 transition-all">
                  프리미엄 시작하기 — ₩9,900/월
                </button>
                <p className="text-xs text-[var(--color-text-secondary)] mt-3">
                  7일 무료 체험 · 언제든 해지 가능
                </p>
              </div>
            </div>

            <div className="opacity-30 blur-sm pointer-events-none space-y-6">
              {premiumMatches.map((match, i) => (
                <MatchCard key={match.id} match={match} rank={i + 4} />
              ))}
            </div>
          </div>
        )}

        {/* Profile Boost Section */}
        <div className="mb-8">
          <ProfileBoost
            accuracy={accuracy}
            onAccuracyChange={setAccuracy}
            onReanalyze={handleReanalyze}
          />
        </div>

        {/* Back to onboard */}
        <div className="text-center mt-8">
          <Link
            href="/onboard"
            className="text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors text-sm"
          >
            ← 다시 진단하기
          </Link>
        </div>
      </div>
    </div>
  );
}
