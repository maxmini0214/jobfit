# JobFit AI 🎯

> 나한테 진짜 맞는 회사를 AI가 찾아주는 서비스

## 개요

기존 채용 플랫폼이 스킬 매칭만 하는 것과 달리, JobFit AI는 **4가지 차원**으로 매칭합니다:

- 🎯 **스킬 매칭 (35%)** — 기술 스택과 경험 분석
- 🤝 **컬쳐핏 (30%)** — 워크스타일과 조직 문화 매칭
- 📈 **성장궤적 (20%)** — 3년 후 커리어 시나리오 분석
- ⏰ **타이밍 (15%)** — 채용 시장 동향과 입사 타이밍

## 기술 스택

- **프론트엔드**: Next.js 14+ (App Router), TypeScript
- **스타일**: Tailwind CSS v4
- **백엔드**: Supabase (PostgreSQL + Auth + Storage)
- **AI**: OpenAI API (임베딩) + Claude API (분석/매칭 리포트)
- **배포**: Vercel

## 시작하기

```bash
# 의존성 설치
npm install

# 환경변수 설정
cp .env.example .env.local
# .env.local 파일을 열어 실제 값으로 변경

# 개발 서버 실행
npm run dev
```

http://localhost:3000 에서 확인

## 프로젝트 구조

```
src/
├── app/
│   ├── page.tsx              # 랜딩페이지
│   ├── layout.tsx            # 루트 레이아웃
│   ├── globals.css           # 글로벌 스타일
│   ├── onboard/
│   │   └── page.tsx          # 온보딩 플로우
│   └── results/
│       ├── page.tsx          # 매칭 결과 목록
│       └── [matchId]/
│           └── page.tsx      # 상세 리포트
├── components/
│   ├── landing/              # 랜딩페이지 컴포넌트
│   ├── onboard/              # 온보딩 컴포넌트
│   ├── results/              # 결과 페이지 컴포넌트
│   └── ui/                   # 공통 UI 컴포넌트
├── data/
│   └── mock.ts               # 목업 데이터
├── lib/
│   └── utils.ts              # 유틸리티 함수
└── types/
    └── index.ts              # TypeScript 타입 정의

supabase/
└── schema.sql                # DB 스키마 (Supabase SQL Editor에서 실행)
```

## 페이지

| 경로 | 설명 |
|---|---|
| `/` | 랜딩페이지 — 서비스 소개 + CTA |
| `/onboard` | 온보딩 — 이력서 업로드 + 워크스타일 설문 + 희망 조건 |
| `/results` | 매칭 결과 — TOP 5 회사 카드 (무료 3개 / 프리미엄 5개) |
| `/results/[matchId]` | 상세 리포트 — 스킬·컬쳐핏·성장·타이밍 분석 + 면접팁 |

## 디자인

- **메인 컬러**: #2563EB (blue-600)
- **액센트**: #F59E0B (amber-500)
- **다크모드** 지원
- **모바일 퍼스트** 반응형

## MVP 현황

### ✅ 완료 (Phase 1)
- [x] 랜딩페이지
- [x] 온보딩 플로우 (이력서 업로드 + 워크스타일 진단 + 희망 조건)
- [x] 매칭 결과 페이지 (목업 데이터)
- [x] 상세 리포트 페이지
- [x] 다크모드
- [x] 모바일 반응형
- [x] DB 스키마

### 🔜 TODO (Phase 2)
- [ ] Supabase 연동 (Auth + DB)
- [ ] 이력서 PDF 파싱 (서버 액션)
- [ ] OpenAI 임베딩 생성
- [ ] Claude 매칭 분석 API
- [ ] 채용 공고 크롤링 파이프라인
- [ ] 결제 시스템 (프리미엄)

## 라이선스

Private — All rights reserved.
