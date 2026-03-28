# JobFit AI — 나한테 진짜 맞는 회사 찾기

<p align="center">
  <strong>스킬 매칭이 아니라, 컬쳐핏 + 성장궤적까지 분석하는 AI 이직 매칭 서비스</strong>
</p>

---

## 🎯 What is JobFit?

기존 채용 플랫폼은 "키워드 매칭"만 합니다. JobFit은 다릅니다:

- **스킬 매칭 (40%)** — 내 기술 스택과 공고 요구 기술의 정밀 비교
- **조건 매칭 (30%)** — 원격근무, 급여, 회사 규모 등 나의 선호 반영
- **컬쳐핏 매칭 (30%)** — 자율/수평/성장지향 등 업무 문화 궁합 분석

> "왜 이 회사가 나한테 맞는지" 설명해주는 유일한 서비스

## ✨ Features

- 🧑‍💻 **3단계 온보딩** — 기본 정보 → 기술 스택 → 선호 조건, 2분이면 끝
- 🔍 **실시간 공고 수집** — 원티드 + 점핏에서 최신 공고 자동 크롤링
- 🤖 **AI 매칭 엔진** — 규칙 기반 스코어링 + 스킬 정규화(50개+ alias)
- 📊 **매칭 리포트** — 종합 점수 + 3종 세부 스코어 + 매칭/부족 스킬 한눈에
- 🎨 **반응형 UI** — 모바일/데스크톱 완벽 지원

## 🖼️ Screenshots

> Coming soon — 로컬에서 `npm run dev` 후 확인하세요

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| Frontend | Next.js 16, React 19, TypeScript, Tailwind CSS v4 |
| Backend | Supabase (PostgreSQL + Auth + RLS) |
| Crawling | Python (원티드 API v4 + 점핏 API) |
| Matching | Python (규칙 기반 가중평균 스코어링) |
| Deploy | Vercel (예정) |

## 🚀 Getting Started

### Prerequisites

- Node.js 20+
- Python 3.10+
- Supabase 프로젝트 (optional — 데모 데이터로도 동작)

### Install & Run

```bash
# 1. 의존성 설치
npm install

# 2. 개발 서버
npm run dev
# → http://localhost:3000

# 3. 공고 크롤링 (선택)
cd scripts
python3 crawl_all.py  # 원티드+점핏 통합 수집
python3 match_score.py  # AI 매칭 실행
```

### Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 📁 Project Structure

```
jobfit/
├── src/app/
│   ├── page.tsx          # 랜딩 페이지
│   ├── onboarding/       # 3단계 온보딩 플로우
│   ├── results/          # 매칭 결과 페이지
│   └── api/match/        # 매칭 API 엔드포인트
├── scripts/
│   ├── crawl_wanted.py   # 원티드 크롤러
│   ├── crawl_jumpit.py   # 점핏 크롤러
│   ├── crawl_all.py      # 통합 크롤러 (중복제거)
│   └── match_score.py    # AI 매칭 엔진
├── data/                 # 크롤링 결과 (JSON)
└── supabase/migrations/  # DB 스키마
```

## 🧮 Matching Algorithm

```
Overall Score = Skill(40%) + Condition(30%) + Culture(30%)
```

- **Skill**: 50개+ alias로 정규화 (e.g., `TS` = `TypeScript` = `타입스크립트`)
- **Condition**: 원격근무 선호도, 급여 범위, 회사 규모 매칭
- **Culture**: 7개 카테고리 키워드 분석 (자율, 수평, 성장지향, 워라밸 등)

## 📊 Current Stats

- 크롤링: **40개 공고 / 28개 회사** (원티드 + 점핏)
- 매칭 엔진: v1 완성, 80개 공고 테스트 완료
- 최고 매칭: 68점 (윙잇 풀스택)

## 🗺️ Roadmap

- [x] 랜딩 페이지
- [x] 온보딩 플로우
- [x] 원티드/점핏 크롤러
- [x] AI 매칭 엔진 v1
- [x] 매칭 결과 UI
- [ ] Supabase 연동 (Auth + DB)
- [ ] GitHub/이력서 파싱
- [ ] 프리미엄 (상세 리포트, 면접 코칭)
- [ ] 사람인/LinkedIn 크롤러 확장

## 📄 License

MIT

---

Built with ☕ by [MaxMini](https://github.com/maxmini0214)
