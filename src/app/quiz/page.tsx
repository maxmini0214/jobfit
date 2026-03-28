'use client';

import { useState } from 'react';
import Link from 'next/link';

interface Question {
  id: string;
  question: string;
  type: 'emoji' | 'choice' | 'rating';
  options?: { emoji: string; label: string; value: number }[];
}

const questions: Question[] = [
  {
    id: 'monday',
    question: '월요일 아침, 출근할 때 기분은?',
    type: 'emoji',
    options: [
      { emoji: '😊', label: '설렘', value: 1 },
      { emoji: '😐', label: '그냥 그래', value: 2 },
      { emoji: '😩', label: '힘들어...', value: 3 },
      { emoji: '😭', label: '제발...', value: 4 },
    ],
  },
  {
    id: 'future',
    question: '지금 회사에서 6개월 뒤의 나는?',
    type: 'choice',
    options: [
      { emoji: '📈', label: '성장하고 있을 것', value: 1 },
      { emoji: '➡️', label: '비슷할 것', value: 2 },
      { emoji: '📉', label: '정체/퇴보할 것', value: 3 },
    ],
  },
  {
    id: 'salary',
    question: '현재 연봉에 만족하시나요?',
    type: 'rating',
  },
  {
    id: 'culture',
    question: '팀 문화에 만족하시나요?',
    type: 'rating',
  },
  {
    id: 'growth',
    question: '성장 기회에 만족하시나요?',
    type: 'rating',
  },
];

interface QuizResult {
  score: number;
  type: string;
  emoji: string;
  description: string;
  color: string;
}

function calculateResult(answers: Record<string, number>): QuizResult {
  // Higher answer values = more dissatisfied
  const mondayScore = (answers.monday || 1) * 10;  // 10-40
  const futureScore = (answers.future || 1) * 12;  // 12-36
  // For rating: 5 = satisfied (low need), 1 = unsatisfied (high need)
  const salaryScore = (6 - (answers.salary || 3)) * 8;  // 8-40
  const cultureScore = (6 - (answers.culture || 3)) * 8; // 8-40
  const growthScore = (6 - (answers.growth || 3)) * 8;   // 8-40

  const total = mondayScore + futureScore + salaryScore + cultureScore + growthScore;
  // total range: 46 ~ 196, normalize to 0-100
  const normalized = Math.round(Math.min(100, Math.max(0, ((total - 46) / 150) * 100)));

  if (normalized >= 70) {
    return {
      score: normalized,
      type: '탈출 시급형',
      emoji: '🔥',
      description: '지금 상황이 꽤 힘드시네요. 이직을 적극적으로 준비하는 것을 추천합니다. 나에게 맞는 회사를 찾아보세요!',
      color: 'from-red-500 to-orange-500',
    };
  } else if (normalized >= 40) {
    return {
      score: normalized,
      type: '탐색 추천형',
      emoji: '🤔',
      description: '현재 상황에 약간의 불만족이 있네요. 지금이 시장을 탐색하기 좋은 시점입니다. 어떤 회사가 맞을지 확인해보세요.',
      color: 'from-amber-500 to-yellow-500',
    };
  } else {
    return {
      score: normalized,
      type: '현재 적합형',
      emoji: '✅',
      description: '현재 회사에 꽤 만족하고 계시네요! 하지만 시장에 어떤 기회가 있는지 확인하는 것도 나쁘지 않아요.',
      color: 'from-emerald-500 to-green-500',
    };
  }
}

export default function QuizPage() {
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [showResult, setShowResult] = useState(false);

  const q = questions[currentQ];
  const isLast = currentQ === questions.length - 1;

  const handleAnswer = (value: number) => {
    const newAnswers = { ...answers, [q.id]: value };
    setAnswers(newAnswers);

    if (isLast) {
      setTimeout(() => setShowResult(true), 300);
    } else {
      setTimeout(() => setCurrentQ((c) => c + 1), 300);
    }
  };

  const result = calculateResult(answers);

  const handleShare = (platform: string) => {
    const text = `이직 필요도 ${result.score}% — ${result.emoji} ${result.type}\n나도 테스트하기 👉`;
    const url = typeof window !== 'undefined' ? window.location.href : '';

    if (platform === 'twitter') {
      window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
    } else if (platform === 'kakao') {
      // Kakao sharing would need SDK, fallback to clipboard
      navigator.clipboard?.writeText(`${text} ${url}`);
      alert('링크가 복사되었습니다! 카카오톡에 붙여넣기 하세요 📋');
    }
  };

  if (showResult) {
    return (
      <div className="min-h-screen bg-[var(--color-bg)]">
        <div className="max-w-2xl mx-auto px-4 py-12">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{result.emoji}</div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2">이직 필요도</h1>
            <div className="text-6xl font-black bg-gradient-to-r bg-clip-text text-transparent" style={{ backgroundImage: `linear-gradient(to right, var(--tw-gradient-stops))` }}>
              <span className={`bg-gradient-to-r ${result.color} bg-clip-text text-transparent`}>
                {result.score}%
              </span>
            </div>
          </div>

          <div className={`rounded-3xl p-8 text-white bg-gradient-to-br ${result.color} mb-8`}>
            <div className="text-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-white/20 text-sm font-bold mb-4">
                {result.emoji} {result.type}
              </span>
              <p className="text-lg leading-relaxed opacity-95">{result.description}</p>
            </div>
          </div>

          {/* Share buttons */}
          <div className="flex gap-3 mb-8">
            <button
              onClick={() => handleShare('kakao')}
              className="flex-1 py-3 rounded-2xl bg-[#FEE500] text-[#3C1E1E] font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              💬 카카오톡 공유
            </button>
            <button
              onClick={() => handleShare('twitter')}
              className="flex-1 py-3 rounded-2xl bg-[#1DA1F2] text-white font-semibold text-sm flex items-center justify-center gap-2 hover:opacity-90 transition-all"
            >
              🐦 트위터 공유
            </button>
          </div>

          {/* CTA */}
          <div className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg-secondary)] p-8 text-center">
            <h3 className="text-xl font-bold mb-2">그럼 어디가 맞을까? 🎯</h3>
            <p className="text-[var(--color-text-secondary)] mb-6">
              AI가 당신의 워크스타일에 맞는 회사를 찾아드립니다
            </p>
            <Link
              href="/onboard"
              className="inline-block w-full py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] transition-all"
            >
              매칭 시작하기 →
            </Link>
          </div>

          {/* Restart */}
          <div className="text-center mt-6">
            <button
              onClick={() => { setShowResult(false); setCurrentQ(0); setAnswers({}); }}
              className="text-sm text-[var(--color-text-secondary)] hover:text-[var(--color-primary)] transition-colors"
            >
              🔄 다시 테스트하기
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Progress */}
        <div className="mb-8">
          <div className="flex gap-2 mb-2">
            {questions.map((_, i) => (
              <div
                key={i}
                className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${
                  i < currentQ
                    ? 'bg-[var(--color-primary)]'
                    : i === currentQ
                    ? 'bg-blue-300 dark:bg-blue-700'
                    : 'bg-[var(--color-border)]'
                }`}
              />
            ))}
          </div>
          <p className="text-sm text-[var(--color-text-secondary)]">
            {currentQ + 1}/{questions.length}
          </p>
        </div>

        {/* Question */}
        <div className="text-center mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold">{q.question}</h2>
        </div>

        {/* Answers */}
        {q.type === 'emoji' && q.options && (
          <div className="grid grid-cols-2 gap-4 max-w-sm mx-auto">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`p-6 rounded-2xl border-2 text-center transition-all active:scale-95 ${
                  answers[q.id] === opt.value
                    ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <div className="text-4xl mb-2">{opt.emoji}</div>
                <div className="text-sm font-medium">{opt.label}</div>
              </button>
            ))}
          </div>
        )}

        {q.type === 'choice' && q.options && (
          <div className="space-y-3 max-w-md mx-auto">
            {q.options.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleAnswer(opt.value)}
                className={`w-full p-5 rounded-2xl border-2 text-left flex items-center gap-4 transition-all active:scale-[0.98] ${
                  answers[q.id] === opt.value
                    ? 'border-[var(--color-primary)] bg-blue-50 dark:bg-blue-900/20'
                    : 'border-[var(--color-border)] hover:border-[var(--color-primary)]/50'
                }`}
              >
                <span className="text-2xl">{opt.emoji}</span>
                <span className="font-medium">{opt.label}</span>
              </button>
            ))}
          </div>
        )}

        {q.type === 'rating' && (
          <div className="flex justify-center gap-3 max-w-sm mx-auto">
            {[1, 2, 3, 4, 5].map((val) => (
              <button
                key={val}
                onClick={() => handleAnswer(val)}
                className={`w-14 h-14 rounded-2xl text-lg font-bold transition-all active:scale-95 ${
                  answers[q.id] === val
                    ? 'bg-[var(--color-primary)] text-white shadow-lg shadow-blue-500/20'
                    : 'border-2 border-[var(--color-border)] text-[var(--color-text-secondary)] hover:border-[var(--color-primary)]'
                }`}
              >
                {val}
              </button>
            ))}
          </div>
        )}

        {q.type === 'rating' && (
          <div className="flex justify-between max-w-sm mx-auto mt-3 text-xs text-[var(--color-text-secondary)]">
            <span>매우 불만족</span>
            <span>매우 만족</span>
          </div>
        )}
      </div>
    </div>
  );
}
