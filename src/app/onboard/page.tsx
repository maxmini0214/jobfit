'use client';

import { useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import BasicInfoStep from '@/components/onboard/BasicInfoStep';
import WorkStyleStep from '@/components/onboard/WorkStyleStep';
import AnalyzingStep from '@/components/onboard/AnalyzingStep';
import type { WorkStyle, JobCategory, ExperienceLevel, OptionalProfile } from '@/types';
import { DEFAULT_OPTIONAL_PROFILE } from '@/types';

const TOTAL_STEPS = 2;

export default function OnboardPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [jobCategory, setJobCategory] = useState<JobCategory | null>(null);
  const [subRole, setSubRole] = useState<string | null>(null);
  const [experienceLevel, setExperienceLevel] = useState<ExperienceLevel | null>(null);
  const [workStyle, setWorkStyle] = useState<WorkStyle>({
    buildVsImprove: 3,
    speedVsPlan: 3,
    autonomyVsStructure: 3,
    depthVsBreadth: 3,
    teamSize: 'startup',
  });
  const [optionalProfile, setOptionalProfile] = useState<OptionalProfile>({ ...DEFAULT_OPTIONAL_PROFILE });
  const [analyzing, setAnalyzing] = useState(false);

  const next = () => {
    if (step === TOTAL_STEPS) {
      // Calculate accuracy from optional profile and save for results page
      let accuracy = 60;
      if (optionalProfile.resumeFile) accuracy += 20;
      if (optionalProfile.linkedinUrl) accuracy += 5;
      if (optionalProfile.githubUrl || optionalProfile.portfolioUrl || optionalProfile.blogUrl || optionalProfile.kaggleUrl) accuracy += 5;
      if (optionalProfile.customLinks.some((l) => l.url)) accuracy += 3;
      if (optionalProfile.preferences?.salaryMin || optionalProfile.preferences?.salaryMax) accuracy += 4;
      if (optionalProfile.preferences?.remotePolicy && optionalProfile.preferences.remotePolicy !== 'any') accuracy += 2;
      if (optionalProfile.preferences?.location && optionalProfile.preferences.location !== '상관없음' && optionalProfile.preferences.location !== '') accuracy += 1;
      try {
        localStorage.setItem('jobfit_accuracy', String(Math.min(accuracy, 100)));
      } catch {}
      setAnalyzing(true);
    } else {
      setStep((s) => Math.min(s + 1, TOTAL_STEPS));
    }
  };
  const prev = () => setStep((s) => Math.max(s - 1, 1));

  const handleCategoryChange = (cat: JobCategory) => {
    setJobCategory(cat);
    setSubRole(null); // Reset sub-role when category changes
  };

  const handleAnalysisComplete = useCallback(() => {
    router.push('/results');
  }, [router]);

  if (analyzing) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <AnalyzingStep onComplete={handleAnalysisComplete} />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress bar — 3 stages: 기본정보 / 워크스타일 / 결과 */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium text-[var(--color-text-secondary)]">
              {step}/{TOTAL_STEPS} 단계
            </span>
            <span className="text-sm text-[var(--color-text-secondary)]">
              {step === 1 && '기본 정보'}
              {step === 2 && '워크스타일 진단'}
            </span>
          </div>
          <div className="flex gap-2">
            {Array.from({ length: TOTAL_STEPS + 1 }).map((_, i) => (
              <div
                key={i}
                className={`h-2 flex-1 rounded-full transition-all duration-500 ${
                  i < step
                    ? 'bg-gradient-to-r from-blue-600 to-blue-400'
                    : i === step
                    ? 'bg-blue-200 dark:bg-blue-800'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            ))}
          </div>
          <div className="flex justify-between mt-2 text-xs text-[var(--color-text-secondary)]">
            <span>기본 정보</span>
            <span>워크스타일</span>
            <span>결과 🎉</span>
          </div>
        </div>

        {/* Steps */}
        {step === 1 && (
          <BasicInfoStep
            jobCategory={jobCategory}
            subRole={subRole}
            experienceLevel={experienceLevel}
            onCategoryChange={handleCategoryChange}
            onSubRoleChange={setSubRole}
            onExperienceChange={setExperienceLevel}
            onNext={next}
          />
        )}
        {step === 2 && (
          <WorkStyleStep
            workStyle={workStyle}
            onChange={setWorkStyle}
            onNext={next}
            onBack={prev}
            jobCategory={jobCategory}
            optionalProfile={optionalProfile}
            onOptionalProfileChange={setOptionalProfile}
          />
        )}
      </div>
    </div>
  );
}
