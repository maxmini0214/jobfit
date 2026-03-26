#!/usr/bin/env python3
"""
JobFit AI — 매칭 스코어링 엔진 (v1 프로토타입)
유저 프로필과 크롤링된 공고를 비교하여 매칭 점수를 산출합니다.

방식: TF-IDF 코사인 유사도 (스킬) + 규칙 기반 (컬쳐핏/조건)
외부 API 없이 로컬 실행 가능.

사용법:
    python3 scripts/match_score.py --profile sample_profile.json --jobs data/jobs_*.json
    python3 scripts/match_score.py --profile sample_profile.json --jobs data/ --top 10
    python3 scripts/match_score.py --demo  # 샘플 프로필+크롤링 데이터로 데모
"""

import argparse
import json
import math
import os
import re
import sys
from collections import Counter
from datetime import datetime
from pathlib import Path


# ─── 스킬 정규화 ──────────────────────────────────────────────────────

SKILL_ALIASES = {
    "js": "javascript", "ts": "typescript", "py": "python",
    "react.js": "react", "reactjs": "react", "react js": "react",
    "next.js": "nextjs", "next js": "nextjs",
    "node.js": "nodejs", "node js": "nodejs",
    "vue.js": "vuejs", "vue js": "vuejs",
    "express.js": "expressjs",
    "spring boot": "springboot",
    "postgresql": "postgres", "psql": "postgres",
    "mysql": "mysql", "mariadb": "mysql",
    "amazon web services": "aws",
    "google cloud": "gcp", "google cloud platform": "gcp",
    "microsoft azure": "azure",
    "docker compose": "docker",
    "k8s": "kubernetes",
    "ci/cd": "cicd", "ci cd": "cicd",
    "machine learning": "ml", "deep learning": "dl",
    "llm": "llm", "large language model": "llm",
    "github actions": "github-actions",
    "rest api": "restapi", "rest": "restapi",
    "graphql": "graphql",
    "mongodb": "mongodb", "mongo": "mongodb",
    "redis": "redis",
}

def normalize_skill(skill: str) -> str:
    """스킬명 정규화"""
    s = skill.strip().lower()
    s = re.sub(r'[^\w\s./#+-]', '', s)
    return SKILL_ALIASES.get(s, s)


# ─── 스킬 매칭 스코어 ─────────────────────────────────────────────────

def skill_match_score(user_skills: list[str], job_skills: list[str]) -> tuple[float, list[str], list[str]]:
    """
    유저 스킬 vs 공고 요구 스킬 매칭.
    Returns: (score 0-100, matched_skills, missing_skills)
    """
    if not job_skills:
        return 50.0, [], []  # 스킬 정보 없으면 중립 점수

    user_norm = set(normalize_skill(s) for s in user_skills)
    job_norm = [normalize_skill(s) for s in job_skills]
    job_set = set(job_norm)

    matched = user_norm & job_set
    missing = job_set - user_norm

    if not job_set:
        return 50.0, [], []

    # 가중치: 필수 스킬 상위 3개는 2배 가중
    core_skills = set(job_norm[:3])  # 첫 3개 = 핵심 스킬로 간주
    core_matched = matched & core_skills
    core_missing = core_skills - matched

    # 점수 = (핵심 매칭 * 2 + 나머지 매칭) / (핵심 총 * 2 + 나머지 총) * 100
    other_matched = matched - core_skills
    other_total = job_set - core_skills

    numerator = len(core_matched) * 2 + len(other_matched)
    denominator = len(core_skills) * 2 + len(other_total)

    score = (numerator / denominator * 100) if denominator > 0 else 50.0
    return round(score, 1), sorted(matched), sorted(missing)


# ─── 조건 매칭 스코어 ──────────────────────────────────────────────────

def condition_match_score(user_prefs: dict, job: dict) -> tuple[float, list[str]]:
    """
    근무 조건 매칭 (원격, 급여, 위치 등).
    Returns: (score 0-100, reasons)
    """
    score = 70.0  # 기본 점수
    reasons = []

    # 원격 근무
    remote_type = job.get("remote_type", "office")
    if user_prefs.get("remote_ok"):
        if remote_type == "remote":
            score += 15
            reasons.append("✅ 풀 리모트 근무 가능")
        elif remote_type == "hybrid":
            score += 8
            reasons.append("🔶 하이브리드 (부분 리모트)")
        else:
            score -= 10
            reasons.append("❌ 사무실 출근 필수")

    # 급여
    min_salary = user_prefs.get("min_salary")
    salary_range = job.get("salary_range")
    if min_salary and salary_range:
        if salary_range.get("max", 0) >= min_salary:
            score += 10
            reasons.append(f"✅ 연봉 범위 충족 ({salary_range['min']}~{salary_range['max']}만원)")
        else:
            score -= 15
            reasons.append(f"❌ 연봉 부족 (최대 {salary_range.get('max', '?')}만원)")

    # 회사 규모
    pref_size = user_prefs.get("preferred_company_size", "any")
    company_size = job.get("company_size", "")
    if pref_size != "any" and company_size:
        size_lower = company_size.lower()
        if pref_size == "startup" and any(k in size_lower for k in ["스타트업", "startup", "1-50", "1~50"]):
            score += 5
            reasons.append("✅ 선호 규모 (스타트업)")
        elif pref_size == "enterprise" and any(k in size_lower for k in ["대기업", "enterprise", "1000+", "500+"]):
            score += 5
            reasons.append("✅ 선호 규모 (대기업)")

    return min(max(round(score, 1), 0), 100), reasons


# ─── 컬쳐핏 스코어 ────────────────────────────────────────────────────

CULTURE_KEYWORDS = {
    "자율": ["자율", "자유", "셀프", "자기주도", "autonomous", "self-driven"],
    "수평": ["수평", "플랫", "flat", "horizontal", "동료", "peer"],
    "성장지향": ["성장", "학습", "교육", "세미나", "컨퍼런스", "growth", "learning"],
    "워라밸": ["워라밸", "work-life", "유연근무", "flexible", "자율출퇴근"],
    "도전": ["도전", "실험", "혁신", "innovation", "challenge", "새로운"],
    "협업": ["협업", "팀워크", "collaboration", "함께", "team"],
    "기술주도": ["기술", "테크", "엔지니어링", "tech-driven", "engineering"],
}

def culture_match_score(user_culture: list[str], job: dict) -> tuple[float, list[str]]:
    """
    컬쳐핏 매칭. 공고 description + culture_tags에서 키워드 분석.
    Returns: (score 0-100, matched_cultures)
    """
    if not user_culture:
        return 50.0, []

    # 공고 텍스트 합치기
    text = " ".join([
        job.get("description", ""),
        " ".join(job.get("culture_tags", [])),
        " ".join(job.get("preferred", [])),
    ]).lower()

    matched = []
    for pref in user_culture:
        pref_lower = pref.lower()
        keywords = CULTURE_KEYWORDS.get(pref_lower, [pref_lower])
        if any(kw in text for kw in keywords):
            matched.append(pref)

    if not user_culture:
        return 50.0, matched

    score = len(matched) / len(user_culture) * 100
    return round(score, 1), matched


# ─── 종합 스코어 ──────────────────────────────────────────────────────

def compute_match(user: dict, job: dict) -> dict:
    """
    유저-공고 종합 매칭 점수 산출.
    Returns: MatchReport-like dict
    """
    # 스킬 매칭 (40%)
    skill_score, matched_skills, missing_skills = skill_match_score(
        user.get("skills", []),
        job.get("tech_stack", []) + job.get("requirements", [])
    )

    # 조건 매칭 (30%)
    cond_score, cond_reasons = condition_match_score(
        user.get("preferences", {}), job
    )

    # 컬쳐핏 (30%)
    culture_score, matched_cultures = culture_match_score(
        user.get("preferences", {}).get("preferred_culture", []), job
    )

    # 가중 평균
    overall = round(skill_score * 0.4 + cond_score * 0.3 + culture_score * 0.3, 1)

    # 이유 생성
    reasons = []
    if matched_skills:
        reasons.append(f"🛠 스킬 매칭: {', '.join(matched_skills[:5])}")
    if matched_cultures:
        reasons.append(f"🎯 컬쳐핏: {', '.join(matched_cultures)}")
    reasons.extend(cond_reasons)

    # 갭 분석
    gaps = []
    if missing_skills:
        gaps.append(f"📚 보완 필요 스킬: {', '.join(sorted(missing_skills)[:5])}")

    return {
        "job_id": job.get("id", ""),
        "company_name": job.get("company_name", ""),
        "position_title": job.get("position_title", ""),
        "source": job.get("source", ""),
        "source_url": job.get("source_url", ""),
        "overall_score": overall,
        "skill_score": skill_score,
        "condition_score": cond_score,
        "culture_score": culture_score,
        "reasons": reasons,
        "gaps": gaps,
        "matched_skills": matched_skills,
        "missing_skills": sorted(missing_skills)[:10],
        "matched_at": datetime.now().isoformat(),
    }


# ─── 배치 매칭 ────────────────────────────────────────────────────────

def batch_match(user: dict, jobs: list[dict], top_n: int = 10) -> list[dict]:
    """모든 공고에 대해 매칭하고 상위 N개 반환"""
    results = [compute_match(user, job) for job in jobs]
    results.sort(key=lambda x: x["overall_score"], reverse=True)
    return results[:top_n]


def print_report(results: list[dict], user_name: str = ""):
    """매칭 결과 터미널 출력"""
    print(f"\n{'='*60}")
    print(f"🎯 JobFit AI 매칭 리포트 — {user_name or '유저'}")
    print(f"{'='*60}")
    print(f"총 {len(results)}개 매칭 결과\n")

    for i, r in enumerate(results, 1):
        emoji = "🟢" if r["overall_score"] >= 70 else "🟡" if r["overall_score"] >= 50 else "🔴"
        print(f"{emoji} #{i} [{r['overall_score']}점] {r['company_name']} — {r['position_title']}")
        print(f"   스킬: {r['skill_score']}  조건: {r['condition_score']}  컬쳐핏: {r['culture_score']}")
        print(f"   소스: {r['source']} | {r['source_url']}")
        for reason in r["reasons"][:3]:
            print(f"   {reason}")
        for gap in r["gaps"][:2]:
            print(f"   {gap}")
        print()


# ─── 샘플 프로필 ──────────────────────────────────────────────────────

SAMPLE_PROFILE = {
    "id": "demo-user-001",
    "name": "김개발",
    "email": "dev@example.com",
    "skills": [
        "Python", "TypeScript", "React", "Next.js", "Node.js",
        "PostgreSQL", "Docker", "AWS", "Git", "REST API",
        "Redis", "MongoDB", "CI/CD"
    ],
    "experience_years": 3,
    "current_role": "백엔드 개발자",
    "desired_roles": ["풀스택 개발자", "백엔드 개발자", "AI 엔지니어"],
    "preferences": {
        "remote_ok": True,
        "min_salary": 5000,
        "preferred_industries": ["IT", "핀테크", "AI"],
        "preferred_company_size": "startup",
        "preferred_culture": ["자율", "성장지향", "수평", "기술주도"]
    }
}


# ─── CLI ──────────────────────────────────────────────────────────────

def normalize_job(raw: dict) -> dict:
    """크롤링 데이터 필드명을 MatchReport 표준으로 변환"""
    salary_range = None
    if raw.get("salary_min") and raw.get("salary_max"):
        salary_range = {"min": raw["salary_min"], "max": raw["salary_max"]}

    # requirements/preferred가 문자열이면 줄 단위로 분리
    reqs = raw.get("requirements", [])
    if isinstance(reqs, str):
        reqs = [line.strip().lstrip("•·-").strip() for line in reqs.split("\n") if line.strip()]
    prefs = raw.get("preferred", [])
    if isinstance(prefs, str):
        prefs = [line.strip().lstrip("•·-").strip() for line in prefs.split("\n") if line.strip()]

    return {
        "id": raw.get("id", raw.get("source_id", "")),
        "source": raw.get("source", ""),
        "source_url": raw.get("source_url", raw.get("url", "")),
        "company_name": raw.get("company_name", ""),
        "position_title": raw.get("position_title", raw.get("title", "")),
        "description": raw.get("description", ""),
        "requirements": reqs,
        "preferred": prefs,
        "tech_stack": raw.get("tech_stack", []),
        "culture_tags": raw.get("culture_tags", []),
        "salary_range": salary_range,
        "location": raw.get("location", ""),
        "remote_type": raw.get("remote_type", "office"),
        "company_size": raw.get("company_size", ""),
        "industry": raw.get("industry", ""),
    }


def load_jobs(path: str) -> list[dict]:
    """JSON 파일 또는 디렉토리에서 공고 로드 + 필드 정규화"""
    raw_jobs = []
    p = Path(path)
    files = []
    if p.is_file():
        files = [p]
    elif p.is_dir():
        files = sorted(p.glob("*.json"))

    for f in files:
        with open(f) as fp:
            data = json.load(fp)
            if isinstance(data, list):
                raw_jobs.extend(data)
            elif isinstance(data, dict) and "jobs" in data:
                raw_jobs.extend(data["jobs"])
    
    return [normalize_job(j) for j in raw_jobs]


def main():
    parser = argparse.ArgumentParser(description="JobFit AI 매칭 스코어링 엔진")
    parser.add_argument("--profile", help="유저 프로필 JSON 경로")
    parser.add_argument("--jobs", help="공고 JSON 파일 또는 디렉토리 경로")
    parser.add_argument("--top", type=int, default=10, help="상위 N개 결과 (기본 10)")
    parser.add_argument("--demo", action="store_true", help="샘플 프로필로 데모 실행")
    parser.add_argument("--output", help="결과 JSON 저장 경로")
    args = parser.parse_args()

    if args.demo:
        user = SAMPLE_PROFILE
        # 데모: data/ 디렉토리에서 크롤링 데이터 로드
        jobs_path = Path(__file__).parent.parent / "data"
        if not jobs_path.exists() or not list(jobs_path.glob("*.json")):
            print("❌ data/ 디렉토리에 크롤링 데이터가 없습니다.")
            print("먼저 실행: python3 scripts/crawl_all.py")
            sys.exit(1)
        jobs = load_jobs(str(jobs_path))
    elif args.profile and args.jobs:
        with open(args.profile) as f:
            user = json.load(f)
        jobs = load_jobs(args.jobs)
    else:
        parser.print_help()
        sys.exit(1)

    if not jobs:
        print("❌ 공고 데이터를 찾을 수 없습니다.")
        sys.exit(1)

    print(f"📊 {len(jobs)}개 공고 로드 완료")
    results = batch_match(user, jobs, args.top)
    print_report(results, user.get("name", ""))

    # JSON 출력
    if args.output:
        out_path = Path(args.output)
        out_path.parent.mkdir(parents=True, exist_ok=True)
        with open(out_path, "w") as f:
            json.dump({
                "user": user.get("name", ""),
                "matched_at": datetime.now().isoformat(),
                "total_jobs": len(jobs),
                "results": results,
            }, f, ensure_ascii=False, indent=2)
        print(f"\n💾 결과 저장: {out_path}")

    # 요약 통계
    if results:
        avg = sum(r["overall_score"] for r in results) / len(results)
        top = results[0]
        print(f"\n📈 평균 매칭점수: {avg:.1f}점")
        print(f"🏆 최고 매칭: {top['company_name']} — {top['position_title']} ({top['overall_score']}점)")


if __name__ == "__main__":
    main()
