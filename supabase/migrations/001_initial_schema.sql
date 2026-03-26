-- JobFit AI — Initial Schema
-- Run in Supabase SQL Editor after project creation

-- Enable required extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pg_trgm";  -- for text search

-- ============================================
-- 1. User Profiles
-- ============================================
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  auth_id UUID UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  email TEXT NOT NULL,
  name TEXT NOT NULL DEFAULT '',
  skills TEXT[] DEFAULT '{}',
  experience_years INTEGER DEFAULT 0,
  current_role TEXT DEFAULT '',
  desired_roles TEXT[] DEFAULT '{}',
  github_url TEXT,
  resume_text TEXT,
  -- preferences (flat columns for simpler queries)
  remote_ok BOOLEAN DEFAULT true,
  min_salary INTEGER, -- 만원 단위
  preferred_industries TEXT[] DEFAULT '{}',
  preferred_company_size TEXT DEFAULT 'any' 
    CHECK (preferred_company_size IN ('startup', 'mid', 'enterprise', 'any')),
  preferred_culture TEXT[] DEFAULT '{}',  -- e.g. ['자율', '수평', '성장지향']
  -- metadata
  onboarding_complete BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- ============================================
-- 2. Job Postings (scraped from platforms)
-- ============================================
CREATE TABLE job_postings (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  source TEXT NOT NULL CHECK (source IN ('wanted', 'jumpit', 'saramin', 'linkedin', 'manual')),
  source_url TEXT UNIQUE NOT NULL,
  company_name TEXT NOT NULL,
  position_title TEXT NOT NULL,
  description TEXT NOT NULL DEFAULT '',
  requirements TEXT[] DEFAULT '{}',
  preferred TEXT[] DEFAULT '{}',
  tech_stack TEXT[] DEFAULT '{}',
  salary_min INTEGER,  -- 만원 단위
  salary_max INTEGER,
  location TEXT DEFAULT '',
  remote_type TEXT DEFAULT 'office' 
    CHECK (remote_type IN ('office', 'hybrid', 'remote')),
  company_size TEXT,
  industry TEXT,
  -- embedding for semantic matching (later)
  embedding VECTOR(1536),
  -- metadata
  is_active BOOLEAN DEFAULT true,
  scraped_at TIMESTAMPTZ DEFAULT now(),
  expires_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Indexes for common queries
CREATE INDEX idx_jobs_source ON job_postings(source);
CREATE INDEX idx_jobs_active ON job_postings(is_active) WHERE is_active = true;
CREATE INDEX idx_jobs_tech_stack ON job_postings USING GIN(tech_stack);
CREATE INDEX idx_jobs_company ON job_postings(company_name);
CREATE INDEX idx_jobs_scraped ON job_postings(scraped_at DESC);

-- ============================================
-- 3. Match Reports
-- ============================================
CREATE TABLE match_reports (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  job_id UUID NOT NULL REFERENCES job_postings(id) ON DELETE CASCADE,
  overall_score INTEGER NOT NULL CHECK (overall_score BETWEEN 0 AND 100),
  skill_score INTEGER NOT NULL CHECK (skill_score BETWEEN 0 AND 100),
  culture_score INTEGER NOT NULL CHECK (culture_score BETWEEN 0 AND 100),
  growth_score INTEGER NOT NULL CHECK (growth_score BETWEEN 0 AND 100),
  reasons TEXT[] DEFAULT '{}',       -- "이 회사가 맞는 이유"
  gaps TEXT[] DEFAULT '{}',          -- 보완 필요 영역
  interview_tips TEXT[] DEFAULT '{}',
  -- metadata
  is_bookmarked BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(user_id, job_id)  -- 중복 매칭 방지
);

CREATE INDEX idx_matches_user ON match_reports(user_id);
CREATE INDEX idx_matches_score ON match_reports(overall_score DESC);
CREATE INDEX idx_matches_bookmarked ON match_reports(user_id, is_bookmarked) 
  WHERE is_bookmarked = true;

-- ============================================
-- 4. Company Reviews (optional enrichment)
-- ============================================
CREATE TABLE company_reviews (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  company_name TEXT NOT NULL,
  source TEXT NOT NULL CHECK (source IN ('blind', 'glassdoor', 'jobplanet', 'manual')),
  culture_tags TEXT[] DEFAULT '{}',  -- ['야근많음', '수평적', '성장가능']
  avg_rating NUMERIC(2,1),
  pros TEXT,
  cons TEXT,
  scraped_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_company ON company_reviews(company_name);

-- ============================================
-- 5. RLS Policies (Row Level Security)
-- ============================================
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE match_reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE job_postings ENABLE ROW LEVEL SECURITY;
ALTER TABLE company_reviews ENABLE ROW LEVEL SECURITY;

-- Profiles: users can only see/edit their own
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = auth_id);
CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = auth_id);
CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = auth_id);

-- Match reports: users can only see their own
CREATE POLICY "Users can view own matches" ON match_reports
  FOR SELECT USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );
CREATE POLICY "Users can bookmark own matches" ON match_reports
  FOR UPDATE USING (
    user_id IN (SELECT id FROM profiles WHERE auth_id = auth.uid())
  );

-- Job postings: everyone can read
CREATE POLICY "Anyone can view active jobs" ON job_postings
  FOR SELECT USING (is_active = true);

-- Company reviews: everyone can read
CREATE POLICY "Anyone can view reviews" ON company_reviews
  FOR SELECT USING (true);

-- Service role can do everything (for scraper/matching engine)
CREATE POLICY "Service role full access profiles" ON profiles
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access jobs" ON job_postings
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access matches" ON match_reports
  FOR ALL USING (auth.role() = 'service_role');
CREATE POLICY "Service role full access reviews" ON company_reviews
  FOR ALL USING (auth.role() = 'service_role');
