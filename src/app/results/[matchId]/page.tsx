import { mockMatches, mockDetailedReport } from '@/data/mock';
import ScoreRing from '@/components/ui/ScoreRing';
import { getRemotePolicyLabel, getCompanySizeLabel, formatSalary } from '@/lib/utils';
import Link from 'next/link';

export function generateStaticParams() {
  return [
    { matchId: 'm1' },
    { matchId: 'm2' },
    { matchId: 'm3' },
    { matchId: 'm4' },
    { matchId: 'm5' },
  ];
}

export default async function MatchDetailPage({ params }: { params: Promise<{ matchId: string }> }) {
  const { matchId } = await params;
  const match = mockMatches.find((m) => m.id === matchId) ?? mockMatches[0];
  const job = match.job_posting!;
  const report = mockDetailedReport;

  const scoreItems = [
    { label: '스킬 매칭', score: match.skill_score, weight: '35%', color: 'text-emerald-500', emoji: '🎯' },
    { label: '컬쳐핏', score: match.culture_score, weight: '30%', color: 'text-blue-500', emoji: '🤝' },
    { label: '성장궤적', score: match.growth_score, weight: '20%', color: 'text-purple-500', emoji: '📈' },
    { label: '타이밍', score: match.timing_score, weight: '15%', color: 'text-amber-500', emoji: '⏰' },
  ];

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-4xl mx-auto px-4 py-12">
        <Link href="/results" className="inline-flex items-center gap-1 text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] mb-8 transition-colors">
          ← 매칭 결과로 돌아가기
        </Link>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 sm:p-10 mb-8">
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-white font-bold text-2xl shrink-0">
              {job.company_name[0]}
            </div>
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-1">{job.company_name}</h1>
              <p className="text-lg text-[var(--color-text-secondary)] mb-4">{job.position_title}</p>
              <div className="flex flex-wrap gap-2">
                <span className="text-sm px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">📍 {job.location}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">🌐 {getRemotePolicyLabel(job.remote_policy)}</span>
                <span className="text-sm px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">👥 {getCompanySizeLabel(job.company_size)}</span>
                {job.salary_range && (
                  <span className="text-sm px-3 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">💰 {formatSalary(job.salary_range.min)} ~ {formatSalary(job.salary_range.max)}</span>
                )}
              </div>
            </div>
            <ScoreRing score={match.total_score} size={100} strokeWidth={8} />
          </div>
          <div className="mt-6 pt-6 border-t border-[var(--color-border)]">
            <p className="text-sm font-medium mb-3">기술 스택</p>
            <div className="flex flex-wrap gap-2">
              {job.tech_stack.map((tech) => (
                <span key={tech} className="text-sm px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">{tech}</span>
              ))}
            </div>
          </div>
        </div>

        <div className="grid sm:grid-cols-4 gap-4 mb-8">
          {scoreItems.map((item) => (
            <div key={item.label} className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-5 text-center">
              <div className="text-2xl mb-2">{item.emoji}</div>
              <div className={`text-3xl font-bold ${item.color}`}>{item.score}</div>
              <div className="text-sm font-medium mt-1">{item.label}</div>
              <div className="text-xs text-[var(--color-text-secondary)]">가중치 {item.weight}</div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 mb-8">
          <h2 className="text-xl font-bold mb-6 flex items-center gap-2">🎯 이 회사가 맞는 이유</h2>
          <div className="space-y-4">
            {match.reasons.map((reason, i) => (
              <div key={i} className="flex gap-4 p-4 rounded-xl bg-[var(--color-bg-secondary)]">
                <span className="shrink-0 w-8 h-8 rounded-full bg-[var(--color-primary)] text-white flex items-center justify-center font-bold">{i + 1}</span>
                <p className="leading-relaxed pt-1">{reason}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          {[
            { title: '🎯 스킬 분석', content: report.skillAnalysis },
            { title: '🤝 컬쳐핏 분석', content: report.cultureAnalysis },
            { title: '📈 성장궤적 분석', content: report.growthAnalysis },
            { title: '⏰ 타이밍 분석', content: report.timingAnalysis },
          ].map((section) => (
            <div key={section.title} className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8">
              <h2 className="text-xl font-bold mb-4">{section.title}</h2>
              <div className="prose prose-sm dark:prose-invert max-w-none">
                {section.content.split('\n').map((line, i) => (
                  <p key={i} className="text-[var(--color-text-secondary)] leading-relaxed mb-2">{line}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 text-white p-8 sm:p-10 mt-8">
          <h2 className="text-xl font-bold mb-4">💡 종합 평가</h2>
          <p className="leading-relaxed text-blue-100">{report.overallSummary}</p>
        </div>

        <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 mt-8">
          <h2 className="text-xl font-bold mb-6">🎤 면접 준비 팁</h2>
          <div className="space-y-3">
            {report.interviewTips.map((tip, i) => (
              <div key={i} className="flex gap-3 items-start">
                <span className="shrink-0 w-6 h-6 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-600 text-xs flex items-center justify-center font-bold">{i + 1}</span>
                <p className="text-[var(--color-text-secondary)] leading-relaxed">{tip}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-3xl border border-amber-200 dark:border-amber-900/50 bg-amber-50 dark:bg-amber-900/10 p-8 mt-8">
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">💰 연봉 협상 전략</h2>
          <p className="text-[var(--color-text-secondary)] leading-relaxed">{report.negotiationAdvice}</p>
        </div>

        <div className="text-center mt-12 space-y-4">
          <Link href="/results" className="inline-block px-8 py-3 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all">
            ← 다른 매칭 결과 보기
          </Link>
        </div>
      </div>
    </div>
  );
}
