/**
 * JobFit AI — 매칭 스코어링 엔진 (TypeScript v1)
 * Python match_score.py를 TypeScript로 포팅.
 * Vercel Edge/Node.js에서 네이티브 실행 가능.
 */

// ─── 스킬 정규화 ──────────────────────────────────────────────────────

const SKILL_ALIASES: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  py: "python",
  "react.js": "react",
  reactjs: "react",
  "react js": "react",
  "next.js": "nextjs",
  "next js": "nextjs",
  "node.js": "nodejs",
  "node js": "nodejs",
  "vue.js": "vuejs",
  "vue js": "vuejs",
  "express.js": "expressjs",
  "spring boot": "springboot",
  postgresql: "postgres",
  psql: "postgres",
  mariadb: "mysql",
  "amazon web services": "aws",
  "google cloud": "gcp",
  "google cloud platform": "gcp",
  "microsoft azure": "azure",
  "docker compose": "docker",
  k8s: "kubernetes",
  "ci/cd": "cicd",
  "ci cd": "cicd",
  "machine learning": "ml",
  "deep learning": "dl",
  "large language model": "llm",
  "github actions": "github-actions",
  "rest api": "restapi",
  rest: "restapi",
  mongo: "mongodb",
};

function normalizeSkill(skill: string): string {
  const s = skill.trim().toLowerCase().replace(/[^\w\s./#+-]/g, "");
  return SKILL_ALIASES[s] ?? s;
}

// ─── 컬쳐핏 키워드 ───────────────────────────────────────────────────

const CULTURE_KEYWORDS: Record<string, string[]> = {
  자율: ["자율", "자유", "셀프", "자기주도", "autonomous", "self-driven"],
  수평: ["수평", "플랫", "flat", "horizontal", "동료", "peer"],
  성장지향: ["성장", "학습", "교육", "세미나", "컨퍼런스", "growth", "learning"],
  워라밸: ["워라밸", "work-life", "유연근무", "flexible", "자율출퇴근"],
  도전: ["도전", "실험", "혁신", "innovation", "challenge", "새로운"],
  협업: ["협업", "팀워크", "collaboration", "함께", "team"],
  기술주도: ["기술", "테크", "엔지니어링", "tech-driven", "engineering"],
};

// ─── 타입 ─────────────────────────────────────────────────────────────

export interface UserProfile {
  id?: string;
  name: string;
  email?: string;
  skills: string[];
  experience_years?: number;
  current_role?: string;
  desired_roles?: string[];
  preferences?: {
    remote_ok?: boolean;
    min_salary?: number;
    preferred_industries?: string[];
    preferred_company_size?: string;
    preferred_culture?: string[];
  };
}

export interface JobPosting {
  id: string;
  source: string;
  source_url: string;
  company_name: string;
  position_title: string;
  description: string;
  requirements: string[];
  preferred: string[];
  tech_stack: string[];
  culture_tags: string[];
  salary_range?: { min: number; max: number } | null;
  location: string;
  remote_type: string;
  company_size: string;
  industry: string;
}

export interface MatchResult {
  job_id: string;
  company_name: string;
  position_title: string;
  source: string;
  source_url: string;
  overall_score: number;
  skill_score: number;
  condition_score: number;
  culture_score: number;
  reasons: string[];
  gaps: string[];
  matched_skills: string[];
  missing_skills: string[];
  matched_at: string;
}

// ─── 스킬 매칭 ───────────────────────────────────────────────────────

function skillMatchScore(
  userSkills: string[],
  jobSkills: string[]
): { score: number; matched: string[]; missing: string[] } {
  if (!jobSkills.length) return { score: 50, matched: [], missing: [] };

  const userNorm = new Set(userSkills.map(normalizeSkill));
  const jobNorm = jobSkills.map(normalizeSkill);
  const jobSet = new Set(jobNorm);

  const matched = [...userNorm].filter((s) => jobSet.has(s));
  const missing = [...jobSet].filter((s) => !userNorm.has(s));

  if (!jobSet.size) return { score: 50, matched: [], missing: [] };

  // 핵심 스킬 (상위 3개) 가중치 2배
  const coreSkills = new Set(jobNorm.slice(0, 3));
  const coreMatched = matched.filter((s) => coreSkills.has(s));
  const otherMatched = matched.filter((s) => !coreSkills.has(s));
  const otherTotal = [...jobSet].filter((s) => !coreSkills.has(s));

  const numerator = coreMatched.length * 2 + otherMatched.length;
  const denominator = coreSkills.size * 2 + otherTotal.length;

  const score = denominator > 0 ? Math.round((numerator / denominator) * 1000) / 10 : 50;
  return { score, matched: matched.sort(), missing: missing.sort() };
}

// ─── 조건 매칭 ────────────────────────────────────────────────────────

function conditionMatchScore(
  prefs: UserProfile["preferences"],
  job: JobPosting
): { score: number; reasons: string[] } {
  let score = 70;
  const reasons: string[] = [];

  if (prefs?.remote_ok) {
    if (job.remote_type === "remote") {
      score += 15;
      reasons.push("✅ 풀 리모트 근무 가능");
    } else if (job.remote_type === "hybrid") {
      score += 8;
      reasons.push("🔶 하이브리드 (부분 리모트)");
    } else {
      score -= 10;
      reasons.push("❌ 사무실 출근 필수");
    }
  }

  const minSalary = prefs?.min_salary;
  if (minSalary && job.salary_range) {
    if (job.salary_range.max >= minSalary) {
      score += 10;
      reasons.push(`✅ 연봉 범위 충족 (${job.salary_range.min}~${job.salary_range.max}만원)`);
    } else {
      score -= 15;
      reasons.push(`❌ 연봉 부족 (최대 ${job.salary_range.max}만원)`);
    }
  }

  const prefSize = prefs?.preferred_company_size ?? "any";
  if (prefSize !== "any" && job.company_size) {
    const sl = job.company_size.toLowerCase();
    if (prefSize === "startup" && /스타트업|startup|1-50|1~50/.test(sl)) {
      score += 5;
      reasons.push("✅ 선호 규모 (스타트업)");
    } else if (prefSize === "enterprise" && /대기업|enterprise|1000\+|500\+/.test(sl)) {
      score += 5;
      reasons.push("✅ 선호 규모 (대기업)");
    }
  }

  return { score: Math.min(Math.max(Math.round(score * 10) / 10, 0), 100), reasons };
}

// ─── 컬쳐핏 ──────────────────────────────────────────────────────────

function cultureMatchScore(
  userCulture: string[],
  job: JobPosting
): { score: number; matched: string[] } {
  if (!userCulture.length) return { score: 50, matched: [] };

  const text = [
    job.description,
    ...job.culture_tags,
    ...job.preferred,
  ]
    .join(" ")
    .toLowerCase();

  const matched: string[] = [];
  for (const pref of userCulture) {
    const keywords = CULTURE_KEYWORDS[pref.toLowerCase()] ?? [pref.toLowerCase()];
    if (keywords.some((kw) => text.includes(kw))) {
      matched.push(pref);
    }
  }

  const score = Math.round((matched.length / userCulture.length) * 1000) / 10;
  return { score, matched };
}

// ─── 종합 매칭 ───────────────────────────────────────────────────────

export function computeMatch(user: UserProfile, job: JobPosting): MatchResult {
  const { score: skillScore, matched: matchedSkills, missing: missingSkills } = skillMatchScore(
    user.skills,
    [...job.tech_stack, ...job.requirements]
  );

  const { score: condScore, reasons: condReasons } = conditionMatchScore(user.preferences, job);

  const { score: cultureScore, matched: matchedCultures } = cultureMatchScore(
    user.preferences?.preferred_culture ?? [],
    job
  );

  const overall = Math.round((skillScore * 0.4 + condScore * 0.3 + cultureScore * 0.3) * 10) / 10;

  const reasons: string[] = [];
  if (matchedSkills.length) reasons.push(`🛠 스킬 매칭: ${matchedSkills.slice(0, 5).join(", ")}`);
  if (matchedCultures.length) reasons.push(`🎯 컬쳐핏: ${matchedCultures.join(", ")}`);
  reasons.push(...condReasons);

  const gaps: string[] = [];
  if (missingSkills.length) gaps.push(`📚 보완 필요 스킬: ${missingSkills.slice(0, 5).join(", ")}`);

  return {
    job_id: job.id,
    company_name: job.company_name,
    position_title: job.position_title,
    source: job.source,
    source_url: job.source_url,
    overall_score: overall,
    skill_score: skillScore,
    condition_score: condScore,
    culture_score: cultureScore,
    reasons,
    gaps,
    matched_skills: matchedSkills,
    missing_skills: missingSkills.slice(0, 10),
    matched_at: new Date().toISOString(),
  };
}

// ─── 배치 매칭 ───────────────────────────────────────────────────────

export function batchMatch(user: UserProfile, jobs: JobPosting[], topN = 20): MatchResult[] {
  const results = jobs.map((job) => computeMatch(user, job));
  results.sort((a, b) => b.overall_score - a.overall_score);
  return results.slice(0, topN);
}

// ─── 크롤링 데이터 정규화 ────────────────────────────────────────────

export function normalizeJob(raw: Record<string, unknown>): JobPosting {
  let salaryRange: { min: number; max: number } | null = null;
  if (raw.salary_min && raw.salary_max) {
    salaryRange = { min: raw.salary_min as number, max: raw.salary_max as number };
  }

  let reqs = (raw.requirements ?? []) as string[] | string;
  if (typeof reqs === "string") {
    reqs = reqs
      .split("\n")
      .map((l) => l.trim().replace(/^[•·-]\s*/, ""))
      .filter(Boolean);
  }

  let prefs = (raw.preferred ?? []) as string[] | string;
  if (typeof prefs === "string") {
    prefs = prefs
      .split("\n")
      .map((l) => l.trim().replace(/^[•·-]\s*/, ""))
      .filter(Boolean);
  }

  return {
    id: (raw.id ?? raw.source_id ?? "") as string,
    source: (raw.source ?? "") as string,
    source_url: (raw.source_url ?? raw.url ?? "") as string,
    company_name: (raw.company_name ?? "") as string,
    position_title: (raw.position_title ?? raw.title ?? "") as string,
    description: (raw.description ?? "") as string,
    requirements: reqs as string[],
    preferred: prefs as string[],
    tech_stack: (raw.tech_stack ?? []) as string[],
    culture_tags: (raw.culture_tags ?? []) as string[],
    salary_range: salaryRange,
    location: (raw.location ?? "") as string,
    remote_type: (raw.remote_type ?? "office") as string,
    company_size: (raw.company_size ?? "") as string,
    industry: (raw.industry ?? "") as string,
  };
}
