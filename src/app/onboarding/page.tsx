"use client";

import { useState } from "react";

type Step = "basics" | "skills" | "preferences" | "complete";

interface FormData {
  name: string;
  currentRole: string;
  experienceYears: number;
  skills: string[];
  desiredRoles: string[];
  githubUrl: string;
  remoteOk: boolean;
  minSalary: string;
  preferredIndustries: string[];
  preferredCompanySize: "startup" | "mid" | "enterprise" | "any";
  preferredCulture: string[];
}

const CULTURE_OPTIONS = [
  "자율적", "수평적", "성장지향", "워라밸",
  "빠른성장", "안정적", "글로벌", "스타트업문화",
  "체계적", "자유로운출퇴근"
];

const INDUSTRY_OPTIONS = [
  "IT/소프트웨어", "핀테크", "AI/ML", "게임",
  "이커머스", "헬스케어", "교육", "미디어",
  "제조업", "금융", "기타"
];

export default function OnboardingPage() {
  const [step, setStep] = useState<Step>("basics");
  const [form, setForm] = useState<FormData>({
    name: "",
    currentRole: "",
    experienceYears: 0,
    skills: [],
    desiredRoles: [],
    githubUrl: "",
    remoteOk: true,
    minSalary: "",
    preferredIndustries: [],
    preferredCompanySize: "any",
    preferredCulture: [],
  });
  const [skillInput, setSkillInput] = useState("");
  const [roleInput, setRoleInput] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addSkill = () => {
    const trimmed = skillInput.trim();
    if (trimmed && !form.skills.includes(trimmed)) {
      setForm({ ...form, skills: [...form.skills, trimmed] });
      setSkillInput("");
    }
  };

  const removeSkill = (skill: string) => {
    setForm({ ...form, skills: form.skills.filter((s) => s !== skill) });
  };

  const addRole = () => {
    const trimmed = roleInput.trim();
    if (trimmed && !form.desiredRoles.includes(trimmed)) {
      setForm({ ...form, desiredRoles: [...form.desiredRoles, trimmed] });
      setRoleInput("");
    }
  };

  const removeRole = (role: string) => {
    setForm({ ...form, desiredRoles: form.desiredRoles.filter((r) => r !== role) });
  };

  const toggleCulture = (tag: string) => {
    setForm({
      ...form,
      preferredCulture: form.preferredCulture.includes(tag)
        ? form.preferredCulture.filter((c) => c !== tag)
        : [...form.preferredCulture, tag],
    });
  };

  const toggleIndustry = (ind: string) => {
    setForm({
      ...form,
      preferredIndustries: form.preferredIndustries.includes(ind)
        ? form.preferredIndustries.filter((i) => i !== ind)
        : [...form.preferredIndustries, ind],
    });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);
    // Save profile to sessionStorage for the results page API call
    const profileForApi = {
      name: form.name,
      skills: form.skills,
      experience_years: form.experienceYears,
      current_role: form.currentRole,
      desired_roles: form.desiredRoles,
      preferences: {
        remote_ok: form.remoteOk,
        min_salary: form.minSalary ? parseInt(form.minSalary) : 0,
        preferred_industries: form.preferredIndustries,
        preferred_company_size: form.preferredCompanySize,
        preferred_culture: form.preferredCulture,
      },
    };
    sessionStorage.setItem("jobfit_profile", JSON.stringify(profileForApi));
    console.log("Profile saved:", profileForApi);
    setStep("complete");
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-950 to-gray-900 text-white">
      <div className="max-w-2xl mx-auto px-4 py-16">
        {/* Progress bar */}
        <div className="flex gap-2 mb-12">
          {(["basics", "skills", "preferences"] as Step[]).map((s, i) => (
            <div
              key={s}
              className={`h-1.5 flex-1 rounded-full transition-colors ${
                i <= ["basics", "skills", "preferences"].indexOf(step)
                  ? "bg-blue-500"
                  : "bg-gray-700"
              }`}
            />
          ))}
        </div>

        {/* Step 1: Basics */}
        {step === "basics" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">반갑습니다! 👋</h1>
              <p className="text-gray-400">기본 정보를 알려주세요. AI가 맞는 회사를 찾아드릴게요.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">이름</label>
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="홍길동"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">현재 직무</label>
                <input
                  type="text"
                  value={form.currentRole}
                  onChange={(e) => setForm({ ...form, currentRole: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="프론트엔드 개발자"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">경력 (년)</label>
                <input
                  type="number"
                  min={0}
                  max={50}
                  value={form.experienceYears}
                  onChange={(e) => setForm({ ...form, experienceYears: parseInt(e.target.value) || 0 })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">GitHub URL (선택)</label>
                <input
                  type="url"
                  value={form.githubUrl}
                  onChange={(e) => setForm({ ...form, githubUrl: e.target.value })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="https://github.com/username"
                />
              </div>
            </div>

            <button
              onClick={() => setStep("skills")}
              disabled={!form.name || !form.currentRole}
              className="w-full py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
            >
              다음 →
            </button>
          </div>
        )}

        {/* Step 2: Skills */}
        {step === "skills" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">스킬 & 희망 직무</h1>
              <p className="text-gray-400">보유 기술과 원하는 포지션을 알려주세요.</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">기술 스택</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={skillInput}
                    onChange={(e) => setSkillInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addSkill())}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="React, Python, AWS..."
                  />
                  <button
                    onClick={addSkill}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.skills.map((skill) => (
                    <span
                      key={skill}
                      onClick={() => removeSkill(skill)}
                      className="px-3 py-1.5 bg-blue-600/20 text-blue-400 rounded-lg text-sm cursor-pointer hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    >
                      {skill} ×
                    </span>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">희망 포지션</label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={roleInput}
                    onChange={(e) => setRoleInput(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addRole())}
                    className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                    placeholder="시니어 백엔드 개발자, AI 엔지니어..."
                  />
                  <button
                    onClick={addRole}
                    className="px-4 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl transition-colors"
                  >
                    추가
                  </button>
                </div>
                <div className="flex flex-wrap gap-2 mt-3">
                  {form.desiredRoles.map((role) => (
                    <span
                      key={role}
                      onClick={() => removeRole(role)}
                      className="px-3 py-1.5 bg-green-600/20 text-green-400 rounded-lg text-sm cursor-pointer hover:bg-red-600/20 hover:text-red-400 transition-colors"
                    >
                      {role} ×
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("basics")}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={() => setStep("preferences")}
                disabled={form.skills.length === 0}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 disabled:text-gray-500 rounded-xl font-medium transition-colors"
              >
                다음 →
              </button>
            </div>
          </div>
        )}

        {/* Step 3: Preferences */}
        {step === "preferences" && (
          <div className="space-y-8 animate-in fade-in">
            <div>
              <h1 className="text-3xl font-bold mb-2">선호도 설정</h1>
              <p className="text-gray-400">어떤 회사 문화와 환경을 원하시나요?</p>
            </div>

            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">선호하는 문화 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {CULTURE_OPTIONS.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleCulture(tag)}
                      className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                        form.preferredCulture.includes(tag)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-3">관심 산업 (복수 선택)</label>
                <div className="flex flex-wrap gap-2">
                  {INDUSTRY_OPTIONS.map((ind) => (
                    <button
                      key={ind}
                      onClick={() => toggleIndustry(ind)}
                      className={`px-4 py-2 rounded-xl text-sm transition-colors ${
                        form.preferredIndustries.includes(ind)
                          ? "bg-green-600 text-white"
                          : "bg-gray-800 text-gray-400 hover:bg-gray-700"
                      }`}
                    >
                      {ind}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">회사 규모</label>
                <select
                  value={form.preferredCompanySize}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      preferredCompanySize: e.target.value as FormData["preferredCompanySize"],
                    })
                  }
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 outline-none"
                >
                  <option value="any">상관없음</option>
                  <option value="startup">스타트업 (1~50명)</option>
                  <option value="mid">중견기업 (50~500명)</option>
                  <option value="enterprise">대기업 (500명+)</option>
                </select>
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="remote"
                  checked={form.remoteOk}
                  onChange={(e) => setForm({ ...form, remoteOk: e.target.checked })}
                  className="w-5 h-5 rounded bg-gray-800 border-gray-700 text-blue-600"
                />
                <label htmlFor="remote" className="text-gray-300">리모트/재택 근무 가능한 곳 선호</label>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-2">최소 희망 연봉 (만원, 선택)</label>
                <input
                  type="text"
                  value={form.minSalary}
                  onChange={(e) => setForm({ ...form, minSalary: e.target.value.replace(/[^0-9]/g, "") })}
                  className="w-full px-4 py-3 bg-gray-800 border border-gray-700 rounded-xl focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none"
                  placeholder="5000"
                />
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={() => setStep("skills")}
                className="flex-1 py-3 bg-gray-700 hover:bg-gray-600 rounded-xl font-medium transition-colors"
              >
                ← 이전
              </button>
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="flex-1 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 rounded-xl font-medium transition-colors"
              >
                {isSubmitting ? "저장 중..." : "완료 ✓"}
              </button>
            </div>
          </div>
        )}

        {/* Complete */}
        {step === "complete" && (
          <div className="text-center space-y-6 animate-in fade-in py-12">
            <div className="text-6xl">🎯</div>
            <h1 className="text-3xl font-bold">프로필 설정 완료!</h1>
            <p className="text-gray-400 max-w-md mx-auto">
              AI가 당신에게 맞는 회사를 분석할 준비가 되었습니다.
              <br />매칭 결과를 바로 확인해보세요!
            </p>
            <button
              onClick={() => (window.location.href = "/results")}
              className="px-8 py-3 bg-blue-600 hover:bg-blue-500 rounded-xl font-medium transition-colors"
            >
              매칭 결과 보기 →
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="block mx-auto mt-3 text-sm text-gray-500 hover:text-gray-300 transition-colors"
            >
              홈으로
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
