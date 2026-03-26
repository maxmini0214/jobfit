// User profile for matching
export interface UserProfile {
  id: string;
  email: string;
  name: string;
  skills: string[];
  experience_years: number;
  current_role: string;
  desired_roles: string[];
  github_url?: string;
  resume_text?: string;
  preferences: {
    remote_ok: boolean;
    min_salary?: number;
    preferred_industries: string[];
    preferred_company_size: "startup" | "mid" | "enterprise" | "any";
    preferred_culture: string[]; // e.g. ["자율", "수평", "성장지향"]
  };
  created_at: string;
  updated_at: string;
}

// Job posting scraped from platforms
export interface JobPosting {
  id: string;
  source: "wanted" | "jumpit" | "saramin" | "linkedin" | "manual";
  source_url: string;
  company_name: string;
  position_title: string;
  description: string;
  requirements: string[];
  preferred: string[];
  tech_stack: string[];
  salary_range?: { min: number; max: number };
  location: string;
  remote_type: "office" | "hybrid" | "remote";
  company_size?: string;
  industry?: string;
  scraped_at: string;
}

// Matching result
export interface MatchReport {
  id: string;
  user_id: string;
  job_id: string;
  overall_score: number; // 0-100
  skill_score: number;
  culture_score: number;
  growth_score: number;
  reasons: string[]; // "이 회사가 맞는 3가지 이유"
  gaps: string[]; // 보완이 필요한 영역
  interview_tips: string[];
  created_at: string;
}
