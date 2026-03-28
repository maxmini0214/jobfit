import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return clsx(inputs);
}

export function getScoreColor(score: number): string {
  if (score >= 85) return 'text-emerald-500';
  if (score >= 70) return 'text-blue-500';
  if (score >= 55) return 'text-amber-500';
  return 'text-red-500';
}

export function getScoreRingColor(score: number): string {
  if (score >= 85) return '#10B981';
  if (score >= 70) return '#3B82F6';
  if (score >= 55) return '#F59E0B';
  return '#EF4444';
}

export function getScoreLabel(score: number): string {
  if (score >= 85) return '최고 매칭';
  if (score >= 70) return '좋은 매칭';
  if (score >= 55) return '보통';
  return '낮은 매칭';
}

export function formatSalary(amount: number): string {
  if (amount >= 10000) {
    return `${(amount / 10000).toFixed(1)}억`;
  }
  return `${amount.toLocaleString()}만원`;
}

export function getRemotePolicyLabel(policy: string | null): string {
  switch (policy) {
    case 'remote': return '완전 리모트';
    case 'hybrid': return '하이브리드';
    case 'office': return '오피스 출근';
    default: return '미정';
  }
}

export function getCompanySizeLabel(size: string | null): string {
  switch (size) {
    case 'startup': return '스타트업';
    case 'midsize': return '중견기업';
    case 'enterprise': return '대기업';
    default: return '미정';
  }
}
