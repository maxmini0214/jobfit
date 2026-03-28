'use client';

import { useCallback, useState } from 'react';

interface Props {
  resumeFile: File | null;
  onResumeChange: (file: File | null) => void;
  githubUrl: string;
  onGithubChange: (url: string) => void;
  onNext: () => void;
}

export default function ResumeUpload({ resumeFile, onResumeChange, githubUrl, onGithubChange, onNext }: Props) {
  const [dragActive, setDragActive] = useState(false);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      setDragActive(false);
      const file = e.dataTransfer.files[0];
      if (file?.type === 'application/pdf') {
        onResumeChange(file);
      }
    },
    [onResumeChange]
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) onResumeChange(file);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-2xl sm:text-3xl font-bold mb-2">이력서를 올려주세요</h2>
        <p className="text-[var(--color-text-secondary)]">
          PDF 이력서를 업로드하면 AI가 스킬과 경험을 자동으로 분석합니다
        </p>
      </div>

      {/* Upload area */}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
        onDragLeave={() => setDragActive(false)}
        onDrop={handleDrop}
        className={`relative border-2 border-dashed rounded-2xl p-12 text-center transition-all cursor-pointer ${
          dragActive
            ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/10'
            : resumeFile
            ? 'border-emerald-500 bg-emerald-50 dark:bg-emerald-900/10'
            : 'border-[var(--color-border)] hover:border-[var(--color-primary)]'
        }`}
      >
        <input
          type="file"
          accept=".pdf"
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        {resumeFile ? (
          <div>
            <div className="text-4xl mb-3">✅</div>
            <p className="font-medium text-emerald-700 dark:text-emerald-400">{resumeFile.name}</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">
              {(resumeFile.size / 1024).toFixed(0)}KB · 클릭해서 변경
            </p>
          </div>
        ) : (
          <div>
            <div className="text-4xl mb-3">📄</div>
            <p className="font-medium">PDF 이력서를 드래그하거나 클릭해서 업로드</p>
            <p className="text-sm text-[var(--color-text-secondary)] mt-1">최대 10MB</p>
          </div>
        )}
      </div>

      {/* GitHub URL */}
      <div>
        <label className="block text-sm font-medium mb-2">
          GitHub 프로필 URL <span className="text-[var(--color-text-secondary)]">(선택)</span>
        </label>
        <div className="relative">
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-[var(--color-text-secondary)]">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
          </span>
          <input
            type="url"
            value={githubUrl}
            onChange={(e) => onGithubChange(e.target.value)}
            placeholder="https://github.com/username"
            className="w-full pl-12 pr-4 py-3 rounded-xl border border-[var(--color-border)] bg-[var(--color-bg)] focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:border-transparent transition-all"
          />
        </div>
        <p className="text-xs text-[var(--color-text-secondary)] mt-2">
          GitHub를 연결하면 기술 스택과 프로젝트 경험을 더 정밀하게 분석할 수 있습니다
        </p>
      </div>

      {/* Next button */}
      <button
        onClick={onNext}
        disabled={!resumeFile}
        className="w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg disabled:opacity-40 disabled:cursor-not-allowed hover:bg-[var(--color-primary-dark)] transition-all"
      >
        다음 단계로 →
      </button>
    </div>
  );
}
