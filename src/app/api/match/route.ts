import { NextRequest, NextResponse } from "next/server";
import { batchMatch, normalizeJob, type UserProfile } from "@/lib/match-engine";
import jobData from "@/data/jobs.json";

function loadJobs() {
  const raw = jobData as unknown as { jobs?: Record<string, unknown>[] } | Record<string, unknown>[];
  const allJobs: Record<string, unknown>[] = Array.isArray(raw)
    ? raw
    : (raw?.jobs ?? []);
  return allJobs.map(normalizeJob);
}

/**
 * POST /api/match
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { profile, top = 20 } = body;

    if (!profile?.skills || !Array.isArray(profile.skills) || !profile.skills.length) {
      return NextResponse.json(
        { error: "최소 1개 이상의 스킬을 입력해주세요." },
        { status: 400 }
      );
    }

    const user: UserProfile = {
      name: profile.name || "사용자",
      skills: profile.skills,
      experience_years: profile.experience_years || 0,
      current_role: profile.current_role || "",
      desired_roles: profile.desired_roles || [],
      preferences: {
        remote_ok: profile.preferences?.remote_ok ?? false,
        min_salary: profile.preferences?.min_salary ?? 0,
        preferred_industries: profile.preferences?.preferred_industries || [],
        preferred_company_size: profile.preferences?.preferred_company_size || "any",
        preferred_culture: profile.preferences?.preferred_culture || [],
      },
    };

    const jobs = await loadJobs();
    const results = batchMatch(user, jobs, Math.min(top, 50));

    return NextResponse.json({
      user: user.name,
      matched_at: new Date().toISOString(),
      total_jobs: jobs.length,
      results,
    });
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/match] Error:", message);
    return NextResponse.json(
      { error: "매칭 처리 중 오류가 발생했습니다.", detail: message },
      { status: 500 }
    );
  }
}

/** GET: health check */
export async function GET() {
  let jobCount = 0;
  try {
    const jobs = await loadJobs();
    jobCount = jobs.length;
  } catch { /* no data */ }

  return NextResponse.json({
    status: "ok",
    engine: "match-engine.ts v1 (native)",
    jobs_available: jobCount,
    endpoint: "POST /api/match",
  });
}
