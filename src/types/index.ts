export interface Profile {
  id: string;
  email: string;
  name: string | null;
  resume_url: string | null;
  github_url: string | null;
  linkedin_url: string | null;
  parsed_resume: ParsedResume | null;
  work_style: WorkStyle | null;
  preferences: Preferences | null;
  job_category: JobCategory | null;
  sub_role: string | null;
  experience_level: ExperienceLevel | null;
  created_at: string;
}

export type JobCategory = 'dev' | 'design' | 'data' | 'pm' | 'marketing' | 'aiml' | 'devops' | 'other';
export type ExperienceLevel = 'entry' | '1-3' | '3-5' | '5-10' | '10+';

export interface JobCategoryInfo {
  id: JobCategory;
  label: string;
  emoji: string;
  subRoles: string[];
}

export const JOB_CATEGORIES: JobCategoryInfo[] = [
  { id: 'dev', label: '개발', emoji: '💻', subRoles: ['프론트엔드', '백엔드', '풀스택', '모바일', '임베디드', '게임'] },
  { id: 'design', label: '디자인', emoji: '🎨', subRoles: ['UI/UX', '그래픽', '브랜드', '모션', '3D'] },
  { id: 'data', label: '데이터', emoji: '📊', subRoles: ['데이터 분석', '데이터 엔지니어', 'BI', '데이터 사이언스'] },
  { id: 'pm', label: 'PM/기획', emoji: '📱', subRoles: ['서비스 기획', '프로덕트 매니저', '프로젝트 매니저', 'PO'] },
  { id: 'marketing', label: '마케팅', emoji: '📈', subRoles: ['퍼포먼스', '콘텐츠', '브랜드', 'CRM', '그로스'] },
  { id: 'aiml', label: 'AI/ML', emoji: '🤖', subRoles: ['ML 엔지니어', 'AI 리서처', 'NLP', '컴퓨터 비전', 'MLOps'] },
  { id: 'devops', label: 'DevOps', emoji: '⚙️', subRoles: ['클라우드', 'SRE', '인프라', '보안', 'DBA'] },
  { id: 'other', label: '기타', emoji: '📋', subRoles: ['QA', 'TA', '기술 지원', '기타'] },
];

export const EXPERIENCE_LEVELS: { id: ExperienceLevel; label: string }[] = [
  { id: 'entry', label: '신입' },
  { id: '1-3', label: '1~3년' },
  { id: '3-5', label: '3~5년' },
  { id: '5-10', label: '5~10년' },
  { id: '10+', label: '10년+' },
];

export interface ParsedResume {
  skills: string[];
  experience: ExperienceItem[];
  education: EducationItem[];
  summary: string;
}

export interface ExperienceItem {
  company: string;
  position: string;
  duration: string;
  description: string;
}

export interface EducationItem {
  school: string;
  degree: string;
  field: string;
  year: string;
}

export interface WorkStyle {
  buildVsImprove: number;     // 1(0→1) ~ 5(기존 개선)
  speedVsPlan: number;        // 1(빠른 실행) ~ 5(신중한 계획)
  autonomyVsStructure: number; // 1(자율) ~ 5(체계)
  depthVsBreadth: number;     // 1(깊이) ~ 5(폭)
  teamSize: 'startup' | 'midsize' | 'enterprise';
}

export interface Preferences {
  salaryMin: number;
  salaryMax: number;
  remote: 'remote' | 'hybrid' | 'office' | 'any';
  location: string;
}

export interface JobPosting {
  id: string;
  company_name: string;
  position_title: string;
  source: string | null;
  source_url: string | null;
  description: string | null;
  requirements: Record<string, unknown> | null;
  tech_stack: string[];
  salary_range: { min: number; max: number } | null;
  location: string | null;
  remote_policy: string | null;
  company_size: string | null;
  company_culture: Record<string, unknown> | null;
  created_at: string;
  expires_at: string | null;
}

export interface Match {
  id: string;
  profile_id: string;
  job_posting_id: string;
  skill_score: number;
  culture_score: number;
  growth_score: number;
  timing_score: number;
  total_score: number;
  reasons: string[];
  detailed_report?: DetailedReport;
  is_premium: boolean;
  created_at: string;
  job_posting?: JobPosting;
}

export interface DetailedReport {
  skillAnalysis: string;
  cultureAnalysis: string;
  growthAnalysis: string;
  timingAnalysis: string;
  overallSummary: string;
  interviewTips: string[];
  negotiationAdvice: string;
}

export interface OnboardingData {
  step: number;
  jobCategory: JobCategory | null;
  subRole: string | null;
  experienceLevel: ExperienceLevel | null;
  workStyle: WorkStyle;
  // Optional enhancements (post-result)
  resumeFile: File | null;
  githubUrl: string;
  linkedinUrl: string;
  preferences: Preferences;
}

export interface AccuracyBoost {
  id: string;
  label: string;
  emoji: string;
  boost: number;
  completed: boolean;
}

export interface CustomLink {
  url: string;
  label: string;
}

export interface OptionalProfile {
  linkedinUrl?: string;
  githubUrl?: string;
  portfolioUrl?: string;
  blogUrl?: string;
  kaggleUrl?: string;
  customLinks: CustomLink[];
  resumeFile?: File | null;
  preferences?: {
    salaryMin?: number;
    salaryMax?: number;
    remotePolicy: 'onsite' | 'hybrid' | 'remote' | 'any';
    location: string;
  };
}

export const DEFAULT_OPTIONAL_PROFILE: OptionalProfile = {
  customLinks: [],
  preferences: {
    remotePolicy: 'any',
    location: '',
  },
};
