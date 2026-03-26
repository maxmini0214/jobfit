#!/usr/bin/env python3
"""
JobFit AI — 점핏(Jumpit) 공고 크롤러
공개 API를 사용하여 개발자 채용 공고를 수집합니다.

사용법:
    python3 scripts/crawl_jumpit.py                    # 기본 (서버/백엔드)
    python3 scripts/crawl_jumpit.py --category 2       # 프론트엔드
    python3 scripts/crawl_jumpit.py --limit 50         # 최대 50개
    python3 scripts/crawl_jumpit.py --output data/     # 출력 디렉토리
"""

import argparse
import json
import os
import sys
import time
from datetime import datetime, timezone
from pathlib import Path
from urllib.request import urlopen, Request
from urllib.error import HTTPError, URLError

# 점핏 직무 카테고리 (jobCategory)
CATEGORIES = {
    "backend": 1,       # 서버/백엔드
    "frontend": 2,      # 프론트엔드
    "fullstack": 4,     # 풀스택
    "mobile": 16,       # 모바일
    "data": 6,          # 데이터 엔지니어
    "ml": 8,            # 머신러닝/AI
    "devops": 15,       # DevOps/인프라
    "security": 14,     # 보안
    "embedded": 17,     # 임베디드
    "qa": 13,           # QA
}

BASE_URL = "https://api.jumpit.co.kr/api"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Referer": "https://www.jumpit.co.kr/",
}


def fetch_json(url: str, retries: int = 3) -> dict:
    """URL에서 JSON을 가져옵니다. 실패 시 재시도."""
    for attempt in range(retries):
        try:
            req = Request(url, headers=HEADERS)
            with urlopen(req, timeout=15) as resp:
                return json.loads(resp.read().decode())
        except (HTTPError, URLError, TimeoutError) as e:
            if attempt < retries - 1:
                wait = 2 ** attempt
                print(f"  ⚠️ 재시도 {attempt+1}/{retries} ({wait}s 대기): {e}")
                time.sleep(wait)
            else:
                print(f"  ❌ 실패: {url} — {e}")
                return {}


def fetch_job_list(category_id: int, limit: int = 100) -> list[dict]:
    """공고 목록을 가져옵니다 (페이지네이션)."""
    jobs = []
    page = 1

    while len(jobs) < limit:
        url = (
            f"{BASE_URL}/positions"
            f"?sort=rsp_rate&highlight=false"
            f"&page={page}&jobCategory={category_id}"
        )
        print(f"  📥 페이지 {page}...")
        data = fetch_json(url)
        if not data or data.get("status") != 200:
            break

        positions = data.get("result", {}).get("positions", [])
        if not positions:
            break

        for item in positions:
            if len(jobs) >= limit:
                break
            jobs.append(item)

        # 다음 페이지
        total = data.get("result", {}).get("totalCount", 0)
        if len(jobs) >= total:
            break
        page += 1
        time.sleep(0.5)

    return jobs


def fetch_job_detail(job_id: int) -> dict:
    """개별 공고 상세 정보를 가져옵니다."""
    url = f"{BASE_URL}/position/{job_id}"
    data = fetch_json(url)
    return data.get("result", {})


def parse_job(listing: dict, detail: dict) -> dict:
    """점핏 API 데이터를 JobFit 스키마로 변환합니다."""
    # 기술스택
    tech_stack = []
    if isinstance(listing.get("techStacks"), list):
        for t in listing["techStacks"]:
            if isinstance(t, str):
                tech_stack.append(t)
            elif isinstance(t, dict) and t.get("stack"):
                tech_stack.append(t["stack"])
    # 상세에서 추가 스택
    if isinstance(detail.get("techStacks"), list):
        for t in detail["techStacks"]:
            name = t.get("stack", t) if isinstance(t, dict) else t
            if name and name not in tech_stack:
                tech_stack.append(name)

    # 자격요건 파싱
    qualifications_text = detail.get("qualifications", "")
    requirements = [
        line.strip().lstrip("•·-▸▹◦")
        for line in qualifications_text.split("\n")
        if line.strip() and len(line.strip()) > 3
    ]

    # 우대사항 파싱
    preferred_text = detail.get("preferredRequirements", "")
    preferred = [
        line.strip().lstrip("•·-▸▹◦")
        for line in preferred_text.split("\n")
        if line.strip() and len(line.strip()) > 3
    ]

    # 복지/문화 태그 추출
    welfares = detail.get("welfares", "")
    culture_tags = []
    culture_keywords = {
        "자율출퇴근": "자율출퇴근",
        "재택": "재택근무",
        "리모트": "리모트",
        "수평": "수평적",
        "스톡옵션": "스톡옵션",
        "연차": "자유연차",
        "유연근무": "유연근무",
        "자기계발": "자기계발비",
    }
    for kw, label in culture_keywords.items():
        if kw in welfares:
            culture_tags.append(label)

    # 위치
    locations = listing.get("locations", [])
    location = ", ".join(locations) if isinstance(locations, list) else ""

    return {
        "source": "jumpit",
        "source_id": listing["id"],
        "source_url": f"https://www.jumpit.co.kr/position/{listing['id']}",
        "company_name": listing.get("companyName", "") or detail.get("companyName", ""),
        "company_industry": "",  # 점핏 목록에 없음, 상세에서도 별도 필드 없음
        "company_size": None,
        "position_title": listing.get("title", "") or detail.get("title", ""),
        "job_category": listing.get("jobCategory", ""),
        "description": detail.get("serviceInfo", ""),
        "main_tasks": detail.get("responsibility", ""),
        "requirements": requirements,
        "preferred": preferred,
        "tech_stack": tech_stack,
        "culture_tags": culture_tags,
        "benefits": welfares,
        "location": location,
        "min_career": listing.get("minCareer"),
        "max_career": listing.get("maxCareer"),
        "newcomer": listing.get("newcomer", False),
        "celebration": listing.get("celebration"),  # 합격축하금 (만원)
        "closed_at": listing.get("closedAt"),
        "always_open": listing.get("alwaysOpen", False),
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def main():
    parser = argparse.ArgumentParser(description="점핏 공고 크롤러")
    parser.add_argument("--category", default="backend",
                       help=f"카테고리: {', '.join(CATEGORIES.keys())} 또는 숫자 ID")
    parser.add_argument("--limit", type=int, default=30,
                       help="수집할 최대 공고 수 (기본: 30)")
    parser.add_argument("--output", default="data",
                       help="출력 디렉토리 (기본: data)")
    parser.add_argument("--detail", action="store_true", default=True,
                       help="상세 정보 수집 (기본: True)")
    parser.add_argument("--no-detail", action="store_false", dest="detail",
                       help="목록만 수집 (빠름)")
    args = parser.parse_args()

    # 카테고리 ID 확인
    if args.category in CATEGORIES:
        cat_id = CATEGORIES[args.category]
        cat_name = args.category
    else:
        try:
            cat_id = int(args.category)
            cat_name = f"custom-{cat_id}"
        except ValueError:
            print(f"❌ 알 수 없는 카테고리: {args.category}")
            print(f"   사용 가능: {', '.join(CATEGORIES.keys())}")
            sys.exit(1)

    # 출력 디렉토리
    script_dir = Path(__file__).parent.parent
    output_dir = script_dir / args.output
    output_dir.mkdir(parents=True, exist_ok=True)

    print(f"🔍 점핏 크롤링 시작: {cat_name} (ID: {cat_id}), 최대 {args.limit}개")
    print()

    # 1. 목록 수집
    listings = fetch_job_list(cat_id, args.limit)
    print(f"\n📋 {len(listings)}개 공고 목록 수집 완료")

    if not listings:
        print("❌ 공고가 없습니다.")
        sys.exit(0)

    # 2. 상세 정보 수집 + 파싱
    jobs = []
    if args.detail:
        print(f"\n📝 상세 정보 수집 중...")
        for i, listing in enumerate(listings):
            job_id = listing["id"]
            title = listing.get("title", "?")
            company = listing.get("companyName", "?")
            print(f"  [{i+1}/{len(listings)}] {title} @ {company}")
            detail = fetch_job_detail(job_id)
            if detail:
                parsed = parse_job(listing, detail)
                jobs.append(parsed)
            time.sleep(0.3)
    else:
        for listing in listings:
            jobs.append(parse_job(listing, {}))

    # 3. 저장
    today = datetime.now().strftime("%Y%m%d")
    filename = f"jumpit-{cat_name}-{today}.json"
    filepath = output_dir / filename

    with open(filepath, "w", encoding="utf-8") as f:
        json.dump({
            "source": "jumpit",
            "category": cat_name,
            "category_id": cat_id,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "total": len(jobs),
            "jobs": jobs,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ {len(jobs)}개 공고 저장: {filepath}")

    # 4. 요약 통계
    companies = set(j["company_name"] for j in jobs if j["company_name"])
    tech_counter: dict[str, int] = {}
    for j in jobs:
        for t in j.get("tech_stack", []):
            tech_counter[t] = tech_counter.get(t, 0) + 1
    top_tech = sorted(tech_counter.items(), key=lambda x: -x[1])[:10]

    print(f"\n📊 통계:")
    print(f"  회사 수: {len(companies)}")
    if top_tech:
        print(f"  Top 기술스택: {', '.join(f'{t}({c})' for t, c in top_tech)}")

    return jobs


if __name__ == "__main__":
    main()
