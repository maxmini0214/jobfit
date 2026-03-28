import { Match, JobPosting } from '@/types';

export const mockJobPostings: JobPosting[] = [
  {
    id: '1',
    company_name: '토스',
    position_title: '프론트엔드 개발자',
    source: 'wanted',
    source_url: 'https://wanted.co.kr',
    description: '토스 앱의 핵심 서비스를 개발합니다. React, TypeScript 기반의 대규모 프론트엔드 시스템을 설계하고 구현합니다.',
    requirements: { experience: '3년 이상', skills: ['React', 'TypeScript', 'Next.js'] },
    tech_stack: ['React', 'TypeScript', 'Next.js', 'GraphQL', 'Storybook'],
    salary_range: { min: 6000, max: 9000 },
    location: '서울 강남구',
    remote_policy: 'hybrid',
    company_size: 'midsize',
    company_culture: { values: ['실험', '속도', '임팩트'], review_score: 4.2 },
    created_at: new Date().toISOString(),
    expires_at: null,
  },
  {
    id: '2',
    company_name: '당근',
    position_title: '풀스택 개발자',
    source: 'jumpit',
    source_url: 'https://jumpit.co.kr',
    description: '하이퍼로컬 서비스의 새로운 기능을 0→1로 만들어갑니다. 작은 팀에서 큰 임팩트를 만듭니다.',
    requirements: { experience: '2년 이상', skills: ['React', 'Node.js', 'PostgreSQL'] },
    tech_stack: ['React', 'Node.js', 'PostgreSQL', 'Redis', 'Kotlin'],
    salary_range: { min: 5500, max: 8500 },
    location: '서울 서초구',
    remote_policy: 'hybrid',
    company_size: 'midsize',
    company_culture: { values: ['자율', '책임', '성장'], review_score: 4.5 },
    created_at: new Date().toISOString(),
    expires_at: null,
  },
  {
    id: '3',
    company_name: '리멤버',
    position_title: '백엔드 개발자',
    source: 'saramin',
    source_url: 'https://saramin.co.kr',
    description: '명함 관리를 넘어 비즈니스 네트워크 플랫폼으로 진화하는 여정에 함께할 백엔드 개발자를 찾습니다.',
    requirements: { experience: '3년 이상', skills: ['Java', 'Spring', 'AWS'] },
    tech_stack: ['Java', 'Spring Boot', 'AWS', 'MySQL', 'Kafka'],
    salary_range: { min: 5000, max: 7500 },
    location: '서울 강남구',
    remote_policy: 'remote',
    company_size: 'startup',
    company_culture: { values: ['깊이', '꼼꼼함', '신뢰'], review_score: 4.0 },
    created_at: new Date().toISOString(),
    expires_at: null,
  },
  {
    id: '4',
    company_name: '네이버',
    position_title: 'AI 엔지니어',
    source: 'wanted',
    source_url: 'https://wanted.co.kr',
    description: '네이버의 AI/ML 서비스를 연구하고 실서비스에 적용합니다. 대규모 트래픽 환경에서의 ML 시스템을 구축합니다.',
    requirements: { experience: '5년 이상', skills: ['Python', 'PyTorch', 'MLOps'] },
    tech_stack: ['Python', 'PyTorch', 'Kubernetes', 'TensorFlow', 'Spark'],
    salary_range: { min: 7000, max: 12000 },
    location: '성남 분당구',
    remote_policy: 'hybrid',
    company_size: 'enterprise',
    company_culture: { values: ['기술 깊이', '연구', '안정'], review_score: 3.8 },
    created_at: new Date().toISOString(),
    expires_at: null,
  },
  {
    id: '5',
    company_name: '빙글',
    position_title: 'iOS 개발자',
    source: 'jumpit',
    source_url: 'https://jumpit.co.kr',
    description: '글로벌 관심사 기반 SNS를 만듭니다. 작은 팀에서 빠르게 실험하고 글로벌 유저에게 전달합니다.',
    requirements: { experience: '2년 이상', skills: ['Swift', 'SwiftUI', 'Combine'] },
    tech_stack: ['Swift', 'SwiftUI', 'Combine', 'GraphQL', 'Firebase'],
    salary_range: { min: 5000, max: 7000 },
    location: '서울 성동구',
    remote_policy: 'remote',
    company_size: 'startup',
    company_culture: { values: ['글로벌', '자유', '실험'], review_score: 4.3 },
    created_at: new Date().toISOString(),
    expires_at: null,
  },
];

export const mockMatches: Match[] = [
  {
    id: 'm1',
    profile_id: 'user1',
    job_posting_id: '2',
    skill_score: 92,
    culture_score: 88,
    growth_score: 85,
    timing_score: 90,
    total_score: 89,
    reasons: [
      '당신의 React + Node.js 경험이 당근의 풀스택 요구사항과 95% 일치합니다',
      '자율적이고 빠른 실행을 선호하는 워크스타일이 당근의 문화와 완벽히 맞습니다',
      '하이퍼로컬 시장이 급성장 중이라 커리어 성장 기회가 큽니다',
    ],
    is_premium: false,
    created_at: new Date().toISOString(),
    job_posting: mockJobPostings[1],
  },
  {
    id: 'm2',
    profile_id: 'user1',
    job_posting_id: '1',
    skill_score: 95,
    culture_score: 82,
    growth_score: 88,
    timing_score: 75,
    total_score: 86,
    reasons: [
      'TypeScript + Next.js 전문성이 토스의 기술 스택과 정확히 일치합니다',
      '임팩트 중심의 빠른 실행 문화가 당신의 성향과 잘 맞습니다',
      '핀테크 도메인에서의 성장 가능성이 높고 연봉 밴드도 희망 조건에 부합합니다',
    ],
    is_premium: false,
    created_at: new Date().toISOString(),
    job_posting: mockJobPostings[0],
  },
  {
    id: 'm3',
    profile_id: 'user1',
    job_posting_id: '5',
    skill_score: 78,
    culture_score: 91,
    growth_score: 82,
    timing_score: 88,
    total_score: 84,
    reasons: [
      '스타트업 규모를 선호하는 당신에게 빙글의 작은 팀 환경이 이상적입니다',
      '글로벌 서비스 경험을 쌓을 수 있어 커리어 다양성이 크게 늘어납니다',
      '완전 리모트 정책이 당신의 근무 환경 선호도와 100% 일치합니다',
    ],
    is_premium: false,
    created_at: new Date().toISOString(),
    job_posting: mockJobPostings[4],
  },
  {
    id: 'm4',
    profile_id: 'user1',
    job_posting_id: '3',
    skill_score: 72,
    culture_score: 75,
    growth_score: 80,
    timing_score: 70,
    total_score: 74,
    reasons: [
      'B2B SaaS 경험이 리멤버의 비즈니스 플랫폼 전환 시기와 맞아떨어집니다',
      '체계적인 코드 리뷰 문화가 당신의 깊이 지향 성향과 잘 맞습니다',
      '리모트 가능 정책으로 유연한 근무가 가능합니다',
    ],
    is_premium: true,
    created_at: new Date().toISOString(),
    job_posting: mockJobPostings[2],
  },
  {
    id: 'm5',
    profile_id: 'user1',
    job_posting_id: '4',
    skill_score: 65,
    culture_score: 68,
    growth_score: 90,
    timing_score: 60,
    total_score: 70,
    reasons: [
      'AI/ML에 대한 관심과 학습 의지가 네이버의 AI 연구 환경에서 빠르게 성장할 수 있는 기반입니다',
      '대규모 서비스 경험을 쌓을 수 있어 장기적 커리어에 큰 자산이 됩니다',
      'AI 엔지니어 수요가 급증하는 시점이라 입사 타이밍이 좋습니다',
    ],
    is_premium: true,
    created_at: new Date().toISOString(),
    job_posting: mockJobPostings[3],
  },
];

export const mockDetailedReport = {
  skillAnalysis: `당신의 기술 스택은 이 포지션과 높은 적합도를 보입니다.

**강점 매칭:**
- React/TypeScript 3년 이상 경험 → 즉시 기여 가능
- Next.js App Router 실무 경험 → 최신 아키텍처 이해
- GraphQL 경험 → API 설계 역량 검증

**보완 필요:**
- Storybook 경험이 부족하지만, 학습 곡선이 낮아 빠르게 적응 가능
- 대규모 모노레포 경험이 있으면 더 좋지만, 필수는 아님`,

  cultureAnalysis: `워크스타일 진단 결과, 이 회사의 문화와 높은 적합도를 보입니다.

**매칭 포인트:**
- "빠른 실행" 성향(4/5)이 회사의 "속도" 가치관과 일치
- "0→1" 선호가 신규 서비스 개발 포지션과 적합
- 자율성 선호(2/5)가 적절한 가이드라인 내 자율 환경과 매칭

**주의점:**
- 체계보다 자율을 약간 선호하는데, 이 회사는 프로세스가 있는 편이라 적응기 필요`,

  growthAnalysis: `3년 후 시나리오 분석:

1. **기술 성장**: 대규모 트래픽 프론트엔드 최적화 경험 확보
2. **도메인 전문성**: 핀테크 도메인 전문가로 시장 가치 상승
3. **리더십**: 주니어 멘토링 → 테크리드 → 엔지니어링 매니저 패스 가능
4. **연봉 곡선**: 현 시장 기준 3년 후 40-60% 상승 예상`,

  timingAnalysis: `현재 시장 상황과 채용 타이밍을 분석했습니다.

- 이 포지션은 2주 전 오픈, 지원자 약 50명 예상
- 회사의 시리즈 B 펀딩 직후라 적극 채용 중
- 프론트엔드 시니어 수요가 공급 대비 2배 이상
- 지금 지원하면 빠른 프로세스 진행 가능 (보통 2-3주)`,

  overallSummary: `종합적으로, 이 포지션은 당신에게 **"성장할 수 있는 도전"**입니다. 현재 역량의 80%는 즉시 활용 가능하고, 나머지 20%는 입사 후 3-6개월 내에 채울 수 있는 수준입니다. 특히 당신의 워크스타일과 회사 문화의 높은 적합도가 장기 근속과 성과에 긍정적 요인이 됩니다.`,

  interviewTips: [
    '대규모 사용자 대상 성능 최적화 경험을 구체적 수치와 함께 준비하세요',
    '0→1 프로젝트에서 기술 의사결정을 주도한 경험을 강조하세요',
    '팀 협업에서의 커뮤니케이션 사례를 2-3개 준비하세요',
    '회사의 최근 기술 블로그 글을 읽고 질문을 준비하세요',
  ],

  negotiationAdvice: `제시된 연봉 밴드(6,000-9,000만원) 중 상위 30%인 8,000-9,000만원을 목표로 협상하세요. 당신의 경력과 기술 매칭도를 고려하면 충분히 가능한 범위입니다. 스톡옵션이나 RSU도 함께 논의하세요.`,
};
