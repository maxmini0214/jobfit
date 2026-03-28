-- JobFit AI Database Schema
-- Run this in Supabase SQL Editor

-- Enable pgvector extension for embeddings
create extension if not exists vector;

-- Users / Profiles
create table profiles (
  id uuid primary key default gen_random_uuid(),
  email text unique not null,
  name text,
  resume_url text,
  github_url text,
  parsed_resume jsonb,
  work_style jsonb,      -- 5개 설문 결과
  preferences jsonb,     -- 연봉, 리모트, 지역
  created_at timestamptz default now()
);

-- 크롤링한 공고 데이터
create table job_postings (
  id uuid primary key default gen_random_uuid(),
  company_name text not null,
  position_title text not null,
  source text,           -- wanted/jumpit/saramin
  source_url text,
  description text,
  requirements jsonb,
  tech_stack text[],
  salary_range jsonb,
  location text,
  remote_policy text,
  company_size text,
  company_culture jsonb, -- 크롤링한 리뷰/블로그 분석 결과
  embedding vector(1536),
  created_at timestamptz default now(),
  expires_at timestamptz
);

-- 매칭 결과
create table matches (
  id uuid primary key default gen_random_uuid(),
  profile_id uuid references profiles(id) on delete cascade,
  job_posting_id uuid references job_postings(id) on delete cascade,
  skill_score float,
  culture_score float,
  growth_score float,
  timing_score float,
  total_score float,
  reasons jsonb,         -- AI 생성 "맞는 이유 3가지"
  detailed_report jsonb, -- 프리미엄 상세 리포트
  is_premium boolean default false,
  created_at timestamptz default now()
);

-- Indexes
create index idx_job_postings_embedding on job_postings using ivfflat (embedding vector_cosine_ops) with (lists = 100);
create index idx_matches_profile_id on matches(profile_id);
create index idx_matches_total_score on matches(total_score desc);
create index idx_job_postings_company on job_postings(company_name);

-- RLS Policies
alter table profiles enable row level security;
alter table matches enable row level security;

create policy "Users can view own profile"
  on profiles for select using (auth.uid() = id);

create policy "Users can update own profile"
  on profiles for update using (auth.uid() = id);

create policy "Users can view own matches"
  on matches for select using (profile_id = auth.uid());
