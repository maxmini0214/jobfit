# JobFit AI 배포 체크리스트

## max가 해야 할 것 (2가지만!)

### 1. GitHub 토큰 갱신
```bash
gh auth login
# 이후 에이전트가 리포 생성 + 푸시 자동 처리
```

### 2. Vercel 로그인
```bash
vercel login
# 이후 에이전트가 `vercel --prod` 자동 배포
```

## 현재 상태
- ✅ Next.js 15 빌드 성공 (3.0초)
- ✅ 매칭 엔진 TS 네이티브 (Python 의존성 없음)
- ✅ Vercel 호환 API route + vercel.json (icn1 리전)
- ✅ SEO 준비 (sitemap.xml + robots + OG meta)
- ✅ Vercel Analytics 연동
- ✅ 404 커스텀 페이지
- ✅ 크롤링 데이터 최신 (40공고, 26회사)
- ✅ 데모 플로우 동작 확인

## 페이지 구조
| 경로 | 설명 |
|---|---|
| `/` | 랜딩 페이지 |
| `/onboarding` | 3스텝 프로필 입력 |
| `/demo` | 데모 프로필 → 결과 자동 리다이렉트 |
| `/results` | 매칭 결과 (카드형, 필터, 상세) |
| `/api/match` | 매칭 API (POST) |
| `/sitemap.xml` | SEO 사이트맵 |
