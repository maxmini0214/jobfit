'use client';

import { useState, useCallback } from 'react';

interface BoostItem {
  id: string;
  label: string;
  emoji: string;
  boost: number;
  completed: boolean;
}

interface Props {
  accuracy: number;
  onAccuracyChange: (newAccuracy: number) => void;
  onReanalyze: () => void;
}

export default function ProfileBoost({ accuracy, onAccuracyChange, onReanalyze }: Props) {
  const [boosts, setBoosts] = useState<BoostItem[]>([
    { id: 'resume', label: '이력서 업로드', emoji: '📎', boost: 20, completed: false },
    { id: 'linkedin', label: 'LinkedIn URL', emoji: '🔗', boost: 15, completed: false },
    { id: 'github', label: 'GitHub URL', emoji: '🐙', boost: 10, completed: false },
    { id: 'preferences', label: '희망 연봉/조건', emoji: '💰', boost: 5, completed: false },
  ]);

  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [linkedinUrl, setLinkedinUrl] = useState('');
  const [githubUrl, setGithubUrl] = useState('');
  const [showPreferences, setShowPreferences] = useState(false);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [hasChanges, setHasChanges] = useState(false);

  const toggleBoost = useCallback((id: string, completed: boolean) => {
    setBoosts((prev) => {
      const updated = prev.map((b) => (b.id === id ? { ...b, completed } : b));
      const totalBoost = updated.filter((b) => b.completed).reduce((sum, b) => sum + b.boost, 0);
      onAccuracyChange(60 + totalBoost);
      return updated;
    });
    setHasChanges(true);
  }, [onAccuracyChange]);

  const handleResumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
      toggleBoost('resume', true);
    }
  };

  const handleUrlSubmit = (id: string, url: string) => {
    if (url.trim()) {
      toggleBoost(id, true);
      setExpandedId(null);
    }
  };

  return (
    <div className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-bg)] p-6">
      <h3 className="font-bold text-lg mb-2">🚀 더 정확한 결과 받기</h3>
      <p className="text-sm text-[var(--color-text-secondary)] mb-5">
        정보를 추가할수록 매칭 정확도가 올라갑니다
      </p>

      <div className="space-y-3">
        {boosts.map((item) => (
          <div key={item.id}>
            <button
              onClick={() => {
                if (!item.completed) {
                  setExpandedId(expandedId === item.id ? null : item.id);
                }
              }}
              className={`w-full flex items-center gap-3 p-4 rounded-xl border transition-all ${
                item.completed
                  ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
                  : 'border-[var(--color-border)] hover:border-[var(--color-primary)] cursor-pointer'
              }`}
            >
              <span className="text-xl">{item.completed ? '✅' : item.emoji}</span>
              <span className="flex-1 text-left font-medium text-sm">{item.label}</span>
              <span
                className={`text-xs font-bold px-2 py-1 rounded-full ${
                  item.completed
                    ? 'bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600'
                    : 'bg-blue-100 dark:bg-blue-900/30 text-blue-600'
                }`}
              >
                +{item.boost}%
              </span>
            </button>

            {/* Expanded input area */}
            {expandedId === item.id && !item.completed && (
              <div className="mt-2 ml-10 p-4 rounded-xl bg-[var(--color-bg-secondary)] border border-[var(--color-border)] animate-in">
                {item.id === 'resume' && (
                  <div>
                    <label className="block">
                      <span className="text-sm text-[var(--color-text-secondary)] mb-2 block">PDF 이력서를 업로드하세요</span>
                      <input
                        type="file"
                        accept=".pdf"
                        onChange={handleResumeChange}
                        className="block w-full text-sm text-[var(--color-text-secondary)] file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 dark:file:bg-blue-900/30 dark:file:text-blue-300"
                      />
                    </label>
                    {resumeFile && (
                      <p className="text-xs text-emerald-600 mt-2">✅ {resumeFile.name}</p>
                    )}
                  </div>
                )}
                {item.id === 'linkedin' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={linkedinUrl}
                      onChange={(e) => setLinkedinUrl(e.target.value)}
                      placeholder="https://linkedin.com/in/..."
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <button
                      onClick={() => handleUrlSubmit('linkedin', linkedinUrl)}
                      className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
                    >
                      추가
                    </button>
                  </div>
                )}
                {item.id === 'github' && (
                  <div className="flex gap-2">
                    <input
                      type="url"
                      value={githubUrl}
                      onChange={(e) => setGithubUrl(e.target.value)}
                      placeholder="https://github.com/username"
                      className="flex-1 px-3 py-2 rounded-lg border border-[var(--color-border)] bg-[var(--color-bg)] text-sm focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)]"
                    />
                    <button
                      onClick={() => handleUrlSubmit('github', githubUrl)}
                      className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
                    >
                      추가
                    </button>
                  </div>
                )}
                {item.id === 'preferences' && (
                  <div className="space-y-3">
                    <p className="text-sm text-[var(--color-text-secondary)]">희망 연봉과 근무 조건을 설정합니다</p>
                    <button
                      onClick={() => {
                        setShowPreferences(true);
                        toggleBoost('preferences', true);
                      }}
                      className="px-4 py-2 rounded-lg bg-[var(--color-primary)] text-white text-sm font-medium"
                    >
                      조건 설정 완료
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Reanalyze button */}
      {hasChanges && (
        <button
          onClick={() => {
            onReanalyze();
            setHasChanges(false);
          }}
          className="w-full mt-5 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-amber-500 text-white font-semibold transition-all hover:opacity-90 active:scale-[0.98]"
        >
          🔄 다시 분석하기
        </button>
      )}
    </div>
  );
}
