#!/usr/bin/env python3
"""
JobFit AI — 통합 크롤링 스크립트
원티드 + 점핏 공고를 한 번에 수집하고 중복 제거 후 통합 파일로 저장합니다.

사용법:
    python3 scripts/crawl_all.py                         # 기본 (개발 전체, 각 20개)
    python3 scripts/crawl_all.py --limit 50              # 각 플랫폼 50개
    python3 scripts/crawl_all.py --categories backend frontend  # 특정 카테고리
    python3 scripts/crawl_all.py --detail                # 상세 정보 포함
    python3 scripts/crawl_all.py --output data/          # 출력 디렉토리
"""

import argparse
import json
import os
import sys
import time
import hashlib
import re
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

# ─── 공통 설정 ───────────────────────────────────────────────────────
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
}

# 카테고리 매핑 (통합 이름 → 플랫폼별 ID)
CATEGORY_MAP = {
    "dev-all":  {"wanted": 518,  "jumpit": 1},     # 개발 전체 / 서버백엔드
    "backend":  {"wanted": 872,  "jumpit": 1},
    "frontend": {"wanted": 669,  "jumpit": 2},
    "fullstack":{"wanted": 518,  "jumpit": 4},
    "mobile":   {"wanted": 677,  "jumpit": 16},
    "data":     {"wanted": 655,  "jumpit": 6},
    "ml":       {"wanted": 1634, "jumpit": 8},
    "devops":   {"wanted": 674,  "jumpit": 15},
    "security": {"wanted": 671,  "jumpit": 14},
}


def fetch_json(url: str, headers: dict, retries: int = 3) -> dict | None:
    """URL에서 JSON을 가져옵니다."""
    for attempt in range(retries):
        try:
            req = Request(url, headers=headers)
            with urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except (HTTPError, URLError, TimeoutError) as e:
            if attempt < retries - 1:
                time.sleep(1 * (attempt + 1))
            else:
                print(f"  ⚠️ 실패: {url} → {e}")
                return None


# ─── 원티드 크롤러 ──────────────────────────────────────────────────
def crawl_wanted(cat_id: int, limit: int, detail: bool) -> list[dict]:
    """원티드 공고를 수집합니다."""
    headers = {**HEADERS, "Referer": "https://www.wanted.co.kr/"}
    jobs = []
    offset = 0

    print(f"\n🔵 원티드 크롤링 (cat={cat_id}, limit={limit})...")
    while len(jobs) < limit:
        url = f"https://www.wanted.co.kr/api/v4/jobs?tag_type_ids={cat_id}&country=kr&locations=all&years=-1&limit=20&offset={offset}"
        data = fetch_json(url, headers)
        if not data or not data.get("data"):
            break

        listings = data["data"]
        if not listings:
            break

        for listing in listings:
            if len(jobs) >= limit:
                break

            job = {
                "source": "wanted",
                "source_id": str(listing["id"]),
                "title": listing.get("position", ""),
                "company_name": listing.get("company", {}).get("name", ""),
                "company_id": str(listing.get("company", {}).get("id", "")),
                "location": "",
                "experience": "",
                "tech_stack": [],
                "culture_tags": [],
                "salary_min": None,
                "salary_max": None,
                "url": f"https://www.wanted.co.kr/wd/{listing['id']}",
                "description": "",
                "requirements": "",
                "preferred": "",
                "benefits": "",
            }

            # 상세 정보 (선택)
            if detail:
                print(f"  [{len(jobs)+1}/{limit}] {job['title'][:40]} @ {job['company_name']}")
                detail_url = f"https://www.wanted.co.kr/api/v4/jobs/{listing['id']}"
                d = fetch_json(detail_url, headers)
                if d and d.get("job"):
                    jd = d["job"]
                    job["location"] = jd.get("address", {}).get("full_location", "")
                    detail_data = jd.get("detail", {})
                    job["description"] = detail_data.get("main_tasks", "")
                    job["requirements"] = detail_data.get("requirements", "")
                    job["preferred"] = detail_data.get("preferred_points", "")
                    job["benefits"] = detail_data.get("benefits", "")
                    # 기술스택 추출
                    skill_tags = jd.get("skill_tags", [])
                    if isinstance(skill_tags, list):
                        job["tech_stack"] = [s.get("title", s) if isinstance(s, dict) else str(s) for s in skill_tags]
                    # 문화 태그 추출 (intro에서)
                    intro = detail_data.get("intro", "")
                    if intro:
                        culture_keywords = ["리모트", "재택", "유연근무", "자율출퇴근", "스톡옵션",
                                           "성장", "수평", "자율", "워라밸", "remote", "flexible"]
                        job["culture_tags"] = [kw for kw in culture_keywords if kw.lower() in intro.lower()]
                    time.sleep(0.3)

            jobs.append(job)

        offset += 20

    print(f"  ✅ 원티드: {len(jobs)}개 수집")
    return jobs


# ─── 점핏 크롤러 ──────────────────────────────────────────────────
def crawl_jumpit(cat_id: int, limit: int, detail: bool) -> list[dict]:
    """점핏 공고를 수집합니다."""
    headers = {**HEADERS, "Referer": "https://www.jumpit.co.kr/"}
    jobs = []
    page = 1

    print(f"\n🟢 점핏 크롤링 (cat={cat_id}, limit={limit})...")
    while len(jobs) < limit:
        url = f"https://api.jumpit.co.kr/api/positions?jobCategory={cat_id}&page={page}&sort=rsp_rate"
        data = fetch_json(url, headers)
        if not data or not data.get("result") or not data["result"].get("positions"):
            break

        listings = data["result"]["positions"]
        if not listings:
            break

        for listing in listings:
            if len(jobs) >= limit:
                break

            job = {
                "source": "jumpit",
                "source_id": str(listing["id"]),
                "title": listing.get("title", ""),
                "company_name": listing.get("companyName", ""),
                "company_id": "",
                "location": listing.get("locations", [""])[0] if listing.get("locations") else "",
                "experience": "",
                "tech_stack": listing.get("techStacks", []),
                "culture_tags": [],
                "salary_min": None,
                "salary_max": None,
                "url": f"https://www.jumpit.co.kr/position/{listing['id']}",
                "description": "",
                "requirements": "",
                "preferred": "",
                "benefits": "",
            }

            # 상세 정보 (선택)
            if detail:
                print(f"  [{len(jobs)+1}/{limit}] {job['title'][:40]} @ {job['company_name']}")
                detail_url = f"https://api.jumpit.co.kr/api/position/{listing['id']}"
                d = fetch_json(detail_url, headers)
                if d and d.get("result"):
                    pos = d["result"]
                    job["company_id"] = str(pos.get("companyId", ""))
                    job["description"] = pos.get("qualificationRequirements", "")
                    job["requirements"] = pos.get("qualificationRequirements", "")
                    job["preferred"] = pos.get("preferredRequirements", "")
                    job["benefits"] = pos.get("welfare", "")
                    exp_min = pos.get("minCareer")
                    exp_max = pos.get("maxCareer")
                    if exp_min is not None:
                        job["experience"] = f"{exp_min}~{exp_max}년" if exp_max else f"{exp_min}년+"
                    # 문화 태그
                    tags = pos.get("celebTags", [])
                    if tags:
                        job["culture_tags"] = [t.get("name", t) if isinstance(t, dict) else str(t) for t in tags]
                    time.sleep(0.3)

            jobs.append(job)

        page += 1

    print(f"  ✅ 점핏: {len(jobs)}개 수집")
    return jobs


# ─── 중복 제거 ──────────────────────────────────────────────────
def normalize_company(name: str) -> str:
    """회사명을 정규화합니다."""
    name = name.strip().lower()
    # 괄호 내용 제거: (주), (유), 주식회사 등
    name = re.sub(r'\(주\)|\(유\)|주식회사|㈜|\s+', '', name)
    return name


def deduplicate_jobs(jobs: list[dict]) -> list[dict]:
    """회사명 + 직무 제목 기반으로 중복 제거합니다. 원티드 우선."""
    seen = set()
    unique = []

    # 원티드를 먼저 (원티드 우선)
    jobs_sorted = sorted(jobs, key=lambda j: 0 if j["source"] == "wanted" else 1)

    for job in jobs_sorted:
        # 정규화된 회사명 + 직무 제목의 해시
        key = f"{normalize_company(job['company_name'])}|{job['title'].strip().lower()}"
        fingerprint = hashlib.md5(key.encode()).hexdigest()

        if fingerprint not in seen:
            seen.add(fingerprint)
            unique.append(job)

    dupes = len(jobs) - len(unique)
    if dupes > 0:
        print(f"\n🔄 중복 제거: {dupes}개 중복 → {len(unique)}개 유니크")

    return unique


# ─── 메인 ──────────────────────────────────────────────────
def main():
    parser = argparse.ArgumentParser(description="JobFit AI — 통합 크롤러")
    parser.add_argument("--categories", nargs="+", default=["dev-all"],
                        choices=list(CATEGORY_MAP.keys()),
                        help="크롤링할 카테고리 (기본: dev-all)")
    parser.add_argument("--limit", type=int, default=20,
                        help="플랫폼별 최대 수집 수 (기본: 20)")
    parser.add_argument("--detail", action="store_true",
                        help="상세 정보 포함 (느림)")
    parser.add_argument("--output", default="data/",
                        help="출력 디렉토리 (기본: data/)")
    parser.add_argument("--platforms", nargs="+", default=["wanted", "jumpit"],
                        choices=["wanted", "jumpit"],
                        help="크롤링할 플랫폼 (기본: 둘 다)")
    args = parser.parse_args()

    output_dir = Path(args.output)
    output_dir.mkdir(parents=True, exist_ok=True)

    all_jobs = []
    start = time.time()

    for cat in args.categories:
        ids = CATEGORY_MAP[cat]
        print(f"\n{'='*60}")
        print(f"📋 카테고리: {cat}")
        print(f"{'='*60}")

        if "wanted" in args.platforms:
            wanted_jobs = crawl_wanted(ids["wanted"], args.limit, args.detail)
            all_jobs.extend(wanted_jobs)

        if "jumpit" in args.platforms:
            jumpit_jobs = crawl_jumpit(ids["jumpit"], args.limit, args.detail)
            all_jobs.extend(jumpit_jobs)

    # 중복 제거
    unique_jobs = deduplicate_jobs(all_jobs)

    # 저장
    today = datetime.now().strftime("%Y%m%d")
    cats_str = "-".join(args.categories)
    filename = f"all-{cats_str}-{today}.json"
    filepath = output_dir / filename

    result = {
        "source": "combined",
        "platforms": args.platforms,
        "categories": args.categories,
        "scraped_at": datetime.now(timezone.utc).isoformat(),
        "total_raw": len(all_jobs),
        "total_unique": len(unique_jobs),
        "duplicates_removed": len(all_jobs) - len(unique_jobs),
        "jobs": unique_jobs,
    }

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump(result, f, ensure_ascii=False, indent=2)

    # Also copy to src/data/jobs.json for Next.js static import (Vercel compatible)
    src_data_dir = Path(filepath).parent.parent / "src" / "data"
    if src_data_dir.exists():
        import shutil
        shutil.copy2(filepath, src_data_dir / "jobs.json")
        print(f"📦 src/data/jobs.json 동기화 완료")

    elapsed = time.time() - start

    # 통계
    wanted_count = sum(1 for j in unique_jobs if j["source"] == "wanted")
    jumpit_count = sum(1 for j in unique_jobs if j["source"] == "jumpit")
    companies = set(normalize_company(j["company_name"]) for j in unique_jobs if j["company_name"])

    tech_counter: dict[str, int] = {}
    for j in unique_jobs:
        for t in j.get("tech_stack", []):
            tech_counter[t] = tech_counter.get(t, 0) + 1
    top_tech = sorted(tech_counter.items(), key=lambda x: -x[1])[:10]

    print(f"\n{'='*60}")
    print(f"📊 통합 결과")
    print(f"{'='*60}")
    print(f"  원티드: {wanted_count}개")
    print(f"  점핏: {jumpit_count}개")
    print(f"  중복 제거: {len(all_jobs) - len(unique_jobs)}개")
    print(f"  최종: {len(unique_jobs)}개 유니크 공고")
    print(f"  회사 수: {len(companies)}개")
    if top_tech:
        print(f"  Top 기술스택: {', '.join(f'{t}({c})' for t, c in top_tech)}")
    print(f"  소요 시간: {elapsed:.1f}초")
    print(f"  저장: {filepath}")


if __name__ == "__main__":
    main()
