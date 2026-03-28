const steps = [
  {
    number: '01',
    title: '기본 정보',
    description: '직군, 세부 직무, 경력을 탭 한 번으로 선택합니다. 10초면 끝!',
    icon: '💻',
    time: '10초',
  },
  {
    number: '02',
    title: '워크스타일 진단',
    description: '4개 질문 + 팀 규모 선택으로 당신의 업무 스타일을 진단합니다.',
    icon: '🧠',
    time: '15초',
  },
  {
    number: '03',
    title: '바로 결과!',
    description: 'AI가 종합 분석해서 최적의 회사를 추천합니다. 이력서는 나중에 추가해도 OK!',
    icon: '✨',
    time: '즉시',
  },
];

export default function StepFlow() {
  return (
    <div className="space-y-8 sm:space-y-0 sm:grid sm:grid-cols-3 sm:gap-8">
      {steps.map((step, i) => (
        <div key={step.number} className="relative">
          {/* Connector line (desktop) */}
          {i < steps.length - 1 && (
            <div className="hidden sm:block absolute top-8 left-[60%] w-[80%] h-px bg-[var(--color-border)]" />
          )}

          <div className="text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-blue-100 dark:bg-blue-900/30 text-3xl mb-4">
              {step.icon}
            </div>
            <div className="text-xs font-bold text-[var(--color-primary)] mb-2">STEP {step.number}</div>
            <h3 className="font-bold text-lg mb-1">{step.title}</h3>
            <span className="inline-block px-2 py-0.5 rounded-full bg-amber-100 dark:bg-amber-900/30 text-amber-700 dark:text-amber-300 text-xs font-medium mb-2">
              ⏱️ {step.time}
            </span>
            <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">{step.description}</p>
          </div>
        </div>
      ))}
    </div>
  );
}
