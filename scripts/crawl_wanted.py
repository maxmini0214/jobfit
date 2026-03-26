#!/usr/bin/env python3
"""
JobFit AI — 원티드(Wanted) 공고 크롤러
공개 API v4를 사용하여 개발자 채용 공고를 수집합니다.

사용법:
    python3 scripts/crawl_wanted.py                    # 기본 (개발 전체)
    python3 scripts/crawl_wanted.py --category 518     # 특정 카테고리
    python3 scripts/crawl_wanted.py --limit 50         # 최대 50개
    python3 scripts/crawl_wanted.py --output data/     # 출력 디렉토리
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

# 원티드 카테고리 IDs (tag_type_ids)
CATEGORIES = {
    "dev-all": 518,        # 개발 전체
    "web-fe": 669,         # 웹 프론트엔드
    "web-be": 872,         # 웹 백엔드
    "mobile": 677,         # 모바일
    "data": 655,           # 데이터 엔지니어
    "ml": 1634,            # 머신러닝
    "devops": 674,         # DevOps/인프라
    "security": 671,       # 보안
}

BASE_URL = "https://www.wanted.co.kr/api/v4"
HEADERS = {
    "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36",
    "Accept": "application/json",
    "Referer": "https://www.wanted.co.kr/",
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
    offset = 0
    page_size = 20  # 원티드 기본값

    while len(jobs) < limit:
        url = (
            f"{BASE_URL}/jobs?country=kr"
            f"&tag_type_ids={category_id}"
            f"&locations=all&years=-1"
            f"&limit={page_size}&offset={offset}"
            f"&job_sort=job.latest_order"
        )
        print(f"  📥 페이지 {offset // page_size + 1} (offset={offset})...")
        data = fetch_json(url)
        if not data or not data.get("data"):
            break

        for item in data["data"]:
            if len(jobs) >= limit:
                break
            jobs.append(item)

        # 다음 페이지 확인
        next_link = data.get("links", {}).get("next")
        if not next_link:
            break
        offset += page_size
        time.sleep(0.5)  # 레이트 리밋 방지

    return jobs


def fetch_job_detail(job_id: int) -> dict:
    """개별 공고 상세 정보를 가져옵니다."""
    url = f"{BASE_URL}/jobs/{job_id}"
    data = fetch_json(url)
    return data.get("job", {})


def parse_job(listing: dict, detail: dict) -> dict:
    """원티드 API 데이터를 JobFit 스키마로 변환합니다."""
    company = listing.get("company", {})
    address = listing.get("address", {})
    det = detail.get("detail", {})
    company_tags = detail.get("company_tags", [])

    # 회사 크기 추출 (company_tags에서)
    company_size = None
    for tag in company_tags:
        title = tag.get("title", "")
        if "이하" in title or "이상" in title:
            company_size = title

    # 기술스택 추출 (skill_tags + requirements 텍스트)
    tech_stack = []
    for tag in detail.get("skill_tags", []):
        if isinstance(tag, dict) and tag.get("title"):
            tech_stack.append(tag["title"])
        elif isinstance(tag, str):
            tech_stack.append(tag)

    # requirements 텍스트에서 기술스택 키워드 추출
    req_text = det.get("requirements", "")
    pref_text = det.get("preferred_points", "")
    
    # 일반적인 기술 키워드
    tech_keywords = [
        "Python", "Java", "JavaScript", "TypeScript", "React", "Vue", "Angular",
        "Node.js", "Go", "Rust", "Kotlin", "Swift", "Flutter", "Docker",
        "Kubernetes", "AWS", "GCP", "Azure", "PostgreSQL", "MySQL", "MongoDB",
        "Redis", "Elasticsearch", "Kafka", "Spring", "Django", "FastAPI",
        "Next.js", "GraphQL", "TensorFlow", "PyTorch", "Spark",
        "Airflow", "Terraform", "CI/CD", "Git",
    ]
    combined_text = f"{req_text} {pref_text}"
    for kw in tech_keywords:
        if kw.lower() in combined_text.lower() and kw not in tech_stack:
            tech_stack.append(kw)

    # 컬쳐 태그 추출
    culture_tags = []
    benefits = det.get("benefits", "")
    culture_keywords = {
        "수평": "수평적",
        "자율": "자율출퇴근",
        "재택": "재택근무",
        "리모트": "리모트",
        "연봉업계평균이상": "연봉업계평균이상",
        "스타트업": "스타트업",
    }
    for tag in company_tags:
        title = tag.get("title", "")
        if title in culture_keywords:
            culture_tags.append(culture_keywords[title])
        elif title not in ["IT, 컨텐츠"]:
            culture_tags.append(title)
    for kw, label in culture_keywords.items():
        if kw in benefits and label not in culture_tags:
            culture_tags.append(label)

    # requirements를 리스트로 분할
    requirements = [
        line.strip().lstrip("•·-▸▹◦")
        for line in req_text.split("\n")
        if line.strip() and len(line.strip()) > 5
    ]
    preferred = [
        line.strip().lstrip("•·-▸▹◦")
        for line in pref_text.split("\n")
        if line.strip() and len(line.strip()) > 5
    ]

    return {
        "source": "wanted",
        "source_id": listing["id"],
        "source_url": f"https://www.wanted.co.kr/wd/{listing['id']}",
        "company_name": company.get("name", ""),
        "company_industry": company.get("industry_name", ""),
        "company_size": company_size,
        "position_title": listing.get("position", ""),
        "description": det.get("intro", ""),
        "main_tasks": det.get("main_tasks", ""),
        "requirements": requirements,
        "preferred": preferred,
        "tech_stack": tech_stack,
        "culture_tags": culture_tags,
        "benefits": det.get("benefits", ""),
        "location": address.get("full_location", ""),
        "location_key": address.get("location_key", ""),
        "annual_from": listing.get("annual_from"),
        "annual_to": listing.get("annual_to"),
        "reward": listing.get("reward", {}).get("formatted_total", ""),
        "due_time": listing.get("due_time"),
        "scraped_at": datetime.now(timezone.utc).isoformat(),
    }


def main():
    parser = argparse.ArgumentParser(description="원티드 공고 크롤러")
    parser.add_argument("--category", default="dev-all",
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

    print(f"🔍 원티드 크롤링 시작: {cat_name} (ID: {cat_id}), 최대 {args.limit}개")
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
            print(f"  [{i+1}/{len(listings)}] {listing.get('position', '?')} @ {listing.get('company', {}).get('name', '?')}")
            detail = fetch_job_detail(job_id)
            if detail:
                parsed = parse_job(listing, detail)
                jobs.append(parsed)
            time.sleep(0.3)  # 레이트 리밋
    else:
        # 목록만 간단 파싱
        for listing in listings:
            jobs.append(parse_job(listing, {}))

    # 3. 저장
    today = datetime.now().strftime("%Y%m%d")
    filename = f"wanted-{cat_name}-{today}.json"
    filepath = output_dir / filename
    
    with open(filepath, "w", encoding="utf-8") as f:
        json.dump({
            "source": "wanted",
            "category": cat_name,
            "category_id": cat_id,
            "scraped_at": datetime.now(timezone.utc).isoformat(),
            "total": len(jobs),
            "jobs": jobs,
        }, f, ensure_ascii=False, indent=2)

    print(f"\n✅ {len(jobs)}개 공고 저장: {filepath}")

    # 4. 요약 통계
    companies = set(j["company_name"] for j in jobs)
    tech_counter: dict[str, int] = {}
    for j in jobs:
        for t in j.get("tech_stack", []):
            tech_counter[t] = tech_counter.get(t, 0) + 1
    top_tech = sorted(tech_counter.items(), key=lambda x: -x[1])[:10]

    print(f"\n📊 통계:")
    print(f"  회사 수: {len(companies)}")
    print(f"  Top 기술스택: {', '.join(f'{t}({c})' for t, c in top_tech)}")

    return jobs


if __name__ == "__main__":
    main()
