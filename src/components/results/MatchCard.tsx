'use client';

import Link from 'next/link';
import ScoreRing from '@/components/ui/ScoreRing';
import { getScoreLabel, getRemotePolicyLabel, getCompanySizeLabel, formatSalary } from '@/lib/utils';
import type { Match } from '@/types';

interface Props {
  match: Match;
  rank: number;
}

const scoreCategories = [
  { key: 'skill_score' as const, label: '스킬', color: 'bg-emerald-500' },
  { key: 'culture_score' as const, label: '컬쳐핏', color: 'bg-blue-500' },
  { key: 'growth_score' as const, label: '성장궤적', color: 'bg-purple-500' },
  { key: 'timing_score' as const, label: '타이밍', color: 'bg-amber-500' },
];

export default function MatchCard({ match, rank }: Props) {
  const job = match.job_posting;
  if (!job) return null;

  return (
    <Link href={`/results/${match.id}`}>
      <div className="card-hover rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6 sm:p-8">
        <div className="flex flex-col sm:flex-row gap-6">
          {/* Left: Company info */}
          <div className="flex-1">
            <div className="flex items-start gap-4 mb-4">
              {/* Rank badge */}
              <div className={`shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm ${
                rank === 1 ? 'bg-gradient-to-br from-amber-400 to-amber-600' :
                rank === 2 ? 'bg-gradient-to-br from-slate-300 to-slate-500' :
                rank === 3 ? 'bg-gradient-to-br from-amber-600 to-amber-800' :
                'bg-[var(--color-text-secondary)]'
              }`}>
                {rank}
              </div>

              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-bold text-xl">{job.company_name}</h3>
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300">
                    {getScoreLabel(match.total_score)}
                  </span>
                </div>
                <p className="text-[var(--color-text-secondary)]">{job.position_title}</p>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-4">
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                📍 {job.location}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                🌐 {getRemotePolicyLabel(job.remote_policy)}
              </span>
              <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                👥 {getCompanySizeLabel(job.company_size)}
              </span>
              {job.salary_range && (
                <span className="text-xs px-2.5 py-1 rounded-full bg-[var(--color-bg-secondary)] border border-[var(--color-border)]">
                  💰 {formatSalary(job.salary_range.min)} ~ {formatSalary(job.salary_range.max)}
                </span>
              )}
            </div>

            {/* Tech stack */}
            <div className="flex flex-wrap gap-1.5 mb-4">
              {job.tech_stack.slice(0, 5).map((tech) => (
                <span key={tech} className="text-xs px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-medium">
                  {tech}
                </span>
              ))}
            </div>

            {/* Score bars */}
            <div className="space-y-2">
              {scoreCategories.map((cat) => (
                <div key={cat.key} className="flex items-center gap-3">
                  <span className="text-xs text-[var(--color-text-secondary)] w-14 shrink-0">{cat.label}</span>
                  <div className="flex-1 h-1.5 rounded-full bg-[var(--color-border)] overflow-hidden">
                    <div
                      className={`h-full rounded-full ${cat.color} transition-all duration-1000`}
                      style={{ width: `${match[cat.key]}%` }}
                    />
                  </div>
                  <span className="text-xs font-medium w-7 text-right">{match[cat.key]}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Score ring + reasons */}
          <div className="sm:w-72 shrink-0">
            <div className="flex sm:flex-col items-center sm:items-end gap-4 mb-4">
              <ScoreRing score={match.total_score} size={72} />
            </div>

            <div className="space-y-2">
              <p className="text-xs font-medium text-[var(--color-text-secondary)] mb-2">맞는 이유</p>
              {match.reasons.map((reason, i) => (
                <div key={i} className="flex gap-2">
                  <span className="shrink-0 w-5 h-5 rounded-full bg-[var(--color-primary)]/10 text-[var(--color-primary)] text-xs flex items-center justify-center font-bold">
                    {i + 1}
                  </span>
                  <p className="text-xs text-[var(--color-text-secondary)] leading-relaxed">{reason}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
}
