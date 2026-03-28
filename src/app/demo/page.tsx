"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

/**
 * /demo — 데모 프로필로 바로 매칭 결과 확인
 * sessionStorage에 데모 프로필 세팅 후 /results로 리다이렉트
 */
export default function DemoPage() {
  const router = useRouter();

  useEffect(() => {
    const demoProfile = {
      name: "데모 유저",
      skills: ["React", "TypeScript", "Python", "Next.js", "AWS", "Docker"],
      experience_years: 3,
      current_role: "프론트엔드 개발자",
      desired_roles: ["풀스택 개발자", "시니어 프론트엔드"],
      preferences: {
        remote_ok: true,
        min_salary: 5000,
        preferred_industries: ["IT/소프트웨어", "핀테크"],
        preferred_company_size: "any",
        preferred_culture: ["자율적", "성장지향", "수평적"],
      },
    };
    sessionStorage.setItem("jobfit_profile", JSON.stringify(demoProfile));
    router.replace("/results");
  }, [router]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white flex items-center justify-center">
      <div className="text-center space-y-4">
        <div className="text-4xl animate-spin-slow">🎯</div>
        <p className="text-gray-400">데모 매칭 결과를 불러오는 중...</p>
      </div>
    </div>
  );
}
