"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface MatchResult {
  company_name: string;
  position_title: string;
  source: string;
  source_url: string;
  overall_score: number;
  skill_score: number;
  condition_score: number;
  culture_score: number;
  matched_skills: string[];
  missing_skills: string[];
  reasons: string[];
  location?: string;
  remote_type?: string;
  tech_stack?: string[];
}

interface MatchData {
  user: string;
  matched_at: string;
  total_jobs: number;
  results: MatchResult[];
}

// Demo data for static build
const DEMO_DATA: MatchData = {
  user: "데모 유저",
  matched_at: new Date().toISOString(),
  total_jobs: 40,
  results: [
    {
      company_name: "데모 회사",
      position_title: "프론트엔드 개발자",
      source: "wanted",
      source_url: "#",
      overall_score: 72,
      skill_score: 85,
      condition_score: 65,
      culture_score: 60,
      matched_skills: ["React", "TypeScript", "Next.js"],
      missing_skills: ["GraphQL"],
      reasons: ["스킬 매칭 85%: React, TypeScript, Next.js 사용 포지션", "원격근무 가능"],
      location: "서울",
      remote_type: "hybrid",
      tech_stack: ["React", "TypeScript", "Next.js", "GraphQL"],
    },
  ],
};

function ScoreBadge({ score, label }: { score: number; label: string }) {
  const color =
    score >= 70
      ? "text-green-700 bg-green-50 border-green-200"
      : score >= 50
        ? "text-yellow-700 bg-yellow-50 border-yellow-200"
        : "text-red-700 bg-red-50 border-red-200";
  return (
    <div className={`rounded-lg border px-3 py-2 text-center ${color}`}>
      <div className="text-2xl font-bold">{score}</div>
      <div className="text-xs mt-0.5">{label}</div>
    </div>
  );
}

function ScoreBar({ score }: { score: number }) {
  const color =
    score >= 70 ? "bg-green-500" : score >= 50 ? "bg-yellow-500" : "bg-red-400";
  return (
    <div className="w-full bg-slate-100 rounded-full h-2.5">
      <div
        className={`h-2.5 rounded-full transition-all duration-500 ${color}`}
        style={{ width: `${score}%` }}
      />
    </div>
  );
}

function MatchCard({ result, rank }: { result: MatchResult; rank: number }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-shadow">
      {/* Header */}
      <div className="flex items-start justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-700 font-bold text-lg">
            {rank}
          </div>
          <div>
            <h3 className="font-bold text-lg text-slate-900">
              {result.company_name}
            </h3>
            <p className="text-slate-600 text-sm">{result.position_title}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold text-blue-600">
            {result.overall_score}
            <span className="text-base text-slate-400 font-normal">점</span>
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="text-xs text-slate-500 uppercase font-medium">
              {result.source}
            </span>
            {result.location && (
              <span className="text-xs text-slate-400">· {result.location}</span>
            )}
            {result.remote_type && result.remote_type !== "office" && (
              <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">
                {result.remote_type === "remote" ? "원격" : "하이브리드"}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Score bar */}
      <ScoreBar score={result.overall_score} />

      {/* Score breakdown */}
      <div className="grid grid-cols-3 gap-3 mt-4">
        <ScoreBadge score={result.skill_score} label="스킬" />
        <ScoreBadge score={result.condition_score} label="조건" />
        <ScoreBadge score={result.culture_score} label="컬쳐핏" />
      </div>

      {/* Matched skills */}
      {result.matched_skills.length > 0 && (
        <div className="mt-4">
          <div className="flex flex-wrap gap-1.5">
            {result.matched_skills.map((skill) => (
              <span
                key={skill}
                className="bg-green-50 text-green-700 text-xs px-2 py-1 rounded-full border border-green-200"
              >
                ✓ {skill}
              </span>
            ))}
            {result.missing_skills.slice(0, 3).map((skill) => (
              <span
                key={skill}
                className="bg-slate-50 text-slate-500 text-xs px-2 py-1 rounded-full border border-slate-200"
              >
                {skill}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="mt-4 text-sm text-blue-600 hover:text-blue-800"
      >
        {expanded ? "접기 ▲" : "상세 보기 ▼"}
      </button>

      {/* Expanded details */}
      {expanded && (
        <div className="mt-4 pt-4 border-t border-slate-100 space-y-3">
          {/* Reasons */}
          {result.reasons.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                💡 이 회사가 맞는 이유
              </h4>
              <ul className="space-y-1">
                {result.reasons.map((reason, i) => (
                  <li key={i} className="text-sm text-slate-600 flex gap-2">
                    <span className="text-blue-500 mt-0.5">•</span>
                    {reason}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Tech stack */}
          {result.tech_stack && result.tech_stack.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                🛠 기술 스택
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.tech_stack.map((tech) => (
                  <span
                    key={tech}
                    className="bg-slate-100 text-slate-600 text-xs px-2 py-1 rounded"
                  >
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Missing skills */}
          {result.missing_skills.length > 0 && (
            <div>
              <h4 className="text-sm font-semibold text-slate-700 mb-2">
                📚 보완 추천
              </h4>
              <div className="flex flex-wrap gap-1.5">
                {result.missing_skills.map((skill) => (
                  <span
                    key={skill}
                    className="bg-orange-50 text-orange-700 text-xs px-2 py-1 rounded-full border border-orange-200"
                  >
                    + {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Link to posting */}
          {result.source_url && result.source_url !== "#" && (
            <a
              href={result.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 text-sm bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              공고 보러가기 →
            </a>
          )}
        </div>
      )}
    </div>
  );
}

export default function ResultsPage() {
  const [data, setData] = useState<MatchData>(DEMO_DATA);
  const [filter, setFilter] = useState<"all" | "high" | "mid">("all");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Load match results from API on mount (if profile exists in sessionStorage)
  useEffect(() => {
    const savedProfile = typeof window !== "undefined"
      ? sessionStorage.getItem("jobfit_profile")
      : null;
    if (!savedProfile) return;

    setLoading(true);
    setError(null);

    fetch("/api/match", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ profile: JSON.parse(savedProfile), top: 20 }),
    })
      .then((res) => {
        if (!res.ok) throw new Error(`API error ${res.status}`);
        return res.json();
      })
      .then((result) => {
        if (result.results && result.results.length > 0) {
          setData(result);
        }
      })
      .catch((err) => {
        console.error("Match API error:", err);
        setError("매칭 결과를 불러오는 중 오류가 발생했습니다. 데모 데이터를 표시합니다.");
      })
      .finally(() => setLoading(false));
  }, []);

  const filtered = data.results.filter((r) => {
    if (filter === "high") return r.overall_score >= 70;
    if (filter === "mid") return r.overall_score >= 50;
    return true;
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-slate-900">
            JobFit <span className="text-blue-600">AI</span>
          </Link>
          <Link
            href="/onboarding"
            className="text-sm text-blue-600 hover:text-blue-800"
          >
            프로필 수정 →
          </Link>
        </div>
      </header>

      <main className="max-w-4xl mx-auto px-6 py-10">
        {/* Loading state */}
        {loading && (
          <div className="text-center py-20">
            <div className="text-5xl mb-4 animate-bounce">🔍</div>
            <h2 className="text-xl font-bold text-slate-700 mb-2">AI가 매칭 중입니다...</h2>
            <p className="text-slate-500">공고를 분석하고 최적의 매칭을 찾고 있어요</p>
          </div>
        )}

        {/* Error banner */}
        {error && (
          <div className="mb-6 bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-sm text-yellow-800">
            ⚠️ {error}
          </div>
        )}

        {/* Summary */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {data.user}님의 매칭 결과
          </h1>
          <p className="text-slate-600">
            {data.total_jobs}개 공고 분석 · {data.results.length}개 매칭 ·{" "}
            {new Date(data.matched_at).toLocaleDateString("ko-KR")} 기준
          </p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-blue-600">
              {data.results.length > 0
                ? Math.round(
                    data.results.reduce((s, r) => s + r.overall_score, 0) /
                      data.results.length
                  )
                : 0}
            </div>
            <div className="text-sm text-slate-500 mt-1">평균 매칭점수</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-green-600">
              {data.results.filter((r) => r.overall_score >= 70).length}
            </div>
            <div className="text-sm text-slate-500 mt-1">강력 추천</div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5 text-center">
            <div className="text-3xl font-bold text-slate-700">
              {data.total_jobs}
            </div>
            <div className="text-sm text-slate-500 mt-1">분석한 공고</div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex gap-2 mb-6">
          {[
            { key: "all" as const, label: "전체" },
            { key: "mid" as const, label: "50점 이상" },
            { key: "high" as const, label: "70점 이상" },
          ].map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                filter === f.key
                  ? "bg-blue-600 text-white"
                  : "bg-white text-slate-600 border border-slate-200 hover:bg-slate-50"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        {/* Results list */}
        <div className="space-y-4">
          {filtered.length === 0 ? (
            <div className="text-center py-20 text-slate-500">
              <div className="text-4xl mb-4">🔍</div>
              <p>조건에 맞는 매칭 결과가 없습니다.</p>
              <p className="text-sm mt-2">필터를 변경하거나 프로필을 업데이트해보세요.</p>
            </div>
          ) : (
            filtered.map((result, i) => (
              <MatchCard key={i} result={result} rank={i + 1} />
            ))
          )}
        </div>

        {/* CTA */}
        <div className="mt-12 bg-blue-50 rounded-xl p-8 text-center border border-blue-100">
          <h3 className="text-xl font-bold text-slate-900 mb-2">
            더 정확한 매칭을 원하시나요?
          </h3>
          <p className="text-slate-600 mb-4">
            프리미엄에서는 면접 코칭, 상세 컬쳐핏 분석, 연봉 협상 가이드를 제공합니다.
          </p>
          <button className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition">
            프리미엄 시작하기 — ₩9,900/월
          </button>
        </div>
      </main>
    </div>
  );
}
