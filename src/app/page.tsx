import Link from 'next/link';
import FeatureCard from '@/components/landing/FeatureCard';
import ScorePreview from '@/components/landing/ScorePreview';
import StepFlow from '@/components/landing/StepFlow';

export default function LandingPage() {
  return (
    <div className="relative">
      {/* Hero */}
      <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Background gradient */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50 via-white to-amber-50 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800" />
        <div className="absolute top-20 left-1/4 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-1/4 w-96 h-96 bg-amber-400/10 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium mb-8">
            <span className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />
            AI 기반 커리어 매칭
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold leading-tight mb-6">
            나한테{' '}
            <span className="gradient-text">진짜 맞는 회사</span>를<br />
            AI가 찾아드립니다
          </h1>

          <p className="text-lg sm:text-xl text-[var(--color-text-secondary)] max-w-2xl mx-auto mb-10 leading-relaxed">
            이력서 없이 30초면 결과가 나옵니다.<br className="hidden sm:block" />
            <strong>워크스타일 · 컬쳐핏 · 성장궤적</strong>까지 분석해서<br className="hidden sm:block" />
            당신에게 딱 맞는 회사를 찾아드립니다.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/onboard"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-[var(--color-primary)] text-white font-semibold text-lg hover:bg-[var(--color-primary-dark)] transition-all hover:scale-105 shadow-lg shadow-blue-500/25"
            >
              30초 매칭 시작 →
            </Link>
            <Link
              href="#how-it-works"
              className="w-full sm:w-auto px-8 py-4 rounded-2xl border border-[var(--color-border)] text-[var(--color-text-secondary)] font-medium hover:border-[var(--color-primary)] hover:text-[var(--color-primary)] transition-all"
            >
              어떻게 작동하나요?
            </Link>
          </div>

          <p className="mt-6 text-sm text-[var(--color-text-secondary)]">
            ✨ 이력서 없이 가능 · 30초면 끝 · 3개 회사 무료
          </p>
        </div>
      </section>

      {/* Quick Entry Points */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="grid sm:grid-cols-2 gap-6">
            <Link href="/check" className="card-hover block rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 group">
              <div className="text-3xl mb-4">🏢</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                이 회사, 나한테 맞을까?
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                관심 있는 회사와 나의 핏을 빠르게 확인해보세요. 3문항이면 끝!
              </p>
              <span className="inline-block mt-4 text-[var(--color-primary)] text-sm font-medium">
                확인하기 →
              </span>
            </Link>

            <Link href="/quiz" className="card-hover block rounded-3xl border border-[var(--color-border)] bg-[var(--color-bg)] p-8 group">
              <div className="text-3xl mb-4">🤔</div>
              <h3 className="text-xl font-bold mb-2 group-hover:text-[var(--color-primary)] transition-colors">
                이직해야 할까?
              </h3>
              <p className="text-[var(--color-text-secondary)] text-sm leading-relaxed">
                재미있는 5문항 퀴즈로 이직 필요도를 진단해보세요. 결과 SNS 공유 가능!
              </p>
              <span className="inline-block mt-4 text-[var(--color-primary)] text-sm font-medium">
                테스트하기 →
              </span>
            </Link>
          </div>
        </div>
      </section>

      {/* Score Preview */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <ScorePreview />
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4 bg-[var(--color-bg-secondary)]">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            이렇게 작동합니다
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-16 text-lg">
            단 2단계, 30초면 매칭 결과를 확인할 수 있어요
          </p>
          <StepFlow />
        </div>
      </section>

      {/* Features */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl sm:text-4xl font-bold text-center mb-4">
            기존 채용 플랫폼과 다릅니다
          </h2>
          <p className="text-center text-[var(--color-text-secondary)] mb-16 text-lg">
            스킬만 보는 매칭은 이제 그만
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <FeatureCard
              icon="🎯"
              title="스킬 매칭 35%"
              description="기술 스택과 경험을 정밀 분석해서 실제로 활약할 수 있는 포지션을 찾습니다"
            />
            <FeatureCard
              icon="🤝"
              title="컬쳐핏 30%"
              description="워크스타일 진단으로 당신의 성향에 맞는 조직 문화를 매칭합니다"
            />
            <FeatureCard
              icon="📈"
              title="성장궤적 20%"
              description="3년 후 커리어 시나리오를 분석해서 장기적으로 성장할 수 있는 곳을 추천합니다"
            />
            <FeatureCard
              icon="⏰"
              title="타이밍 15%"
              description="채용 시장 동향과 회사 상황을 분석해서 지금 들어가기 좋은 곳을 알려드립니다"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="rounded-3xl bg-gradient-to-br from-blue-600 to-blue-800 p-12 sm:p-16 text-white">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">
              지금 바로 시작하세요
            </h2>
            <p className="text-blue-100 text-lg mb-8 max-w-xl mx-auto">
              이력서 없이도 30초면 매칭 결과를 볼 수 있습니다.
              무료로 3개 회사를 먼저 확인해보세요.
            </p>
            <Link
              href="/onboard"
              className="inline-block px-8 py-4 rounded-2xl bg-white text-blue-700 font-semibold text-lg hover:bg-blue-50 transition-all hover:scale-105"
            >
              무료 매칭 시작하기
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 px-4 border-t border-[var(--color-border)]">
        <div className="max-w-6xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-[var(--color-text-secondary)]">
          <div className="flex items-center gap-2">
            <div className="w-6 h-6 rounded bg-gradient-to-br from-blue-600 to-amber-500 flex items-center justify-center">
              <span className="text-white font-bold text-xs">JF</span>
            </div>
            <span>JobFit AI</span>
          </div>
          <div className="flex items-center gap-6">
            <Link href="/check" className="hover:text-[var(--color-primary)] transition-colors">회사 핏 체크</Link>
            <Link href="/quiz" className="hover:text-[var(--color-primary)] transition-colors">이직 퀴즈</Link>
            <Link href="/onboard" className="hover:text-[var(--color-primary)] transition-colors">매칭 시작</Link>
          </div>
          <p>© 2026 JobFit AI. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
