import { NextRequest, NextResponse } from "next/server";
import { execFile } from "child_process";
import { writeFile, unlink, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

/**
 * POST /api/match
 * 
 * Body: {
 *   profile: {
 *     name: string;
 *     skills: string[];
 *     experience_years: number;
 *     current_role?: string;
 *     desired_roles?: string[];
 *     preferences?: {
 *       remote_ok?: boolean;
 *       min_salary?: number;
 *       preferred_industries?: string[];
 *       preferred_company_size?: string;
 *       preferred_culture?: string[];
 *     }
 *   },
 *   top?: number;  // default 20
 * }
 * 
 * Response: {
 *   user: string;
 *   matched_at: string;
 *   total_jobs: number;
 *   results: MatchResult[];
 * }
 */

const SCRIPTS_DIR = join(process.cwd(), "scripts");
const DATA_DIR = join(process.cwd(), "data");
const TMP_DIR = join(process.cwd(), ".tmp");

function runPython(
  profilePath: string,
  outputPath: string,
  top: number
): Promise<string> {
  return new Promise((resolve, reject) => {
    const scriptPath = join(SCRIPTS_DIR, "match_score.py");
    execFile(
      "python3",
      [
        scriptPath,
        "--profile", profilePath,
        "--jobs", DATA_DIR,
        "--top", String(top),
        "--output", outputPath,
      ],
      { timeout: 30_000, maxBuffer: 5 * 1024 * 1024 },
      (error, stdout, stderr) => {
        if (error) {
          reject(new Error(`Match engine error: ${stderr || error.message}`));
        } else {
          resolve(stdout);
        }
      }
    );
  });
}

export async function POST(request: NextRequest) {
  const id = randomUUID().slice(0, 8);
  const profilePath = join(TMP_DIR, `profile-${id}.json`);
  const outputPath = join(TMP_DIR, `result-${id}.json`);

  try {
    const body = await request.json();
    const { profile, top = 20 } = body;

    // Validate profile
    if (!profile || !profile.skills || !Array.isArray(profile.skills)) {
      return NextResponse.json(
        { error: "프로필에 skills 배열이 필요합니다." },
        { status: 400 }
      );
    }

    if (profile.skills.length === 0) {
      return NextResponse.json(
        { error: "최소 1개 이상의 스킬을 입력해주세요." },
        { status: 400 }
      );
    }

    // Build profile object matching Python engine's expected format
    const engineProfile = {
      id: `user-${id}`,
      name: profile.name || "사용자",
      email: profile.email || "",
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

    // Write temp profile
    await mkdir(TMP_DIR, { recursive: true });
    await writeFile(profilePath, JSON.stringify(engineProfile, null, 2));

    // Run match engine
    await runPython(profilePath, outputPath, Math.min(top, 50));

    // Read results
    const { readFile } = await import("fs/promises");
    const resultJson = await readFile(outputPath, "utf-8");
    const result = JSON.parse(resultJson);

    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "Unknown error";
    console.error("[/api/match] Error:", message);
    return NextResponse.json(
      { error: "매칭 처리 중 오류가 발생했습니다.", detail: message },
      { status: 500 }
    );
  } finally {
    // Cleanup temp files
    try { await unlink(profilePath); } catch { /* ignore */ }
    try { await unlink(outputPath); } catch { /* ignore */ }
  }
}

// GET: health check + data status
export async function GET() {
  const { readdir } = await import("fs/promises");
  let jobCount = 0;
  try {
    const files = await readdir(DATA_DIR);
    const jsonFiles = files.filter((f: string) => f.endsWith(".json"));
    for (const file of jsonFiles) {
      const { readFile } = await import("fs/promises");
      const data = JSON.parse(await readFile(join(DATA_DIR, file), "utf-8"));
      if (Array.isArray(data)) jobCount += data.length;
    }
  } catch { /* no data dir */ }

  return NextResponse.json({
    status: "ok",
    engine: "match_score.py v1",
    jobs_available: jobCount,
    endpoint: "POST /api/match",
  });
}
