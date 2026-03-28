import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Hero */}
      <header className="max-w-5xl mx-auto px-6 pt-20 pb-16">
        <nav className="flex items-center justify-between mb-20">
          <h1 className="text-2xl font-bold text-slate-900">
            JobFit <span className="text-blue-600">AI</span>
          </h1>
          <div className="flex gap-4">
            <Link
              href="/onboarding"
              className="text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              로그인
            </Link>
            <Link
              href="/onboarding"
              className="bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition"
            >
              무료로 시작하기
            </Link>
          </div>
        </nav>

        <div className="text-center max-w-3xl mx-auto">
          <h2 className="text-5xl font-bold text-slate-900 mb-6 leading-tight">
            나한테 <span className="text-blue-600">진짜 맞는 회사</span>를
            <br />
            AI가 찾아드립니다
          </h2>
          <p className="text-xl text-slate-600 mb-10 leading-relaxed">
            스킬 매칭이 아닌, 컬쳐핏 + 성장궤적 분석으로
            <br />
            당신에게 최적인 회사를 매칭해드립니다.
          </p>
          <Link
            href="/onboarding"
            className="inline-block bg-blue-600 text-white text-lg px-8 py-4 rounded-xl hover:bg-blue-700 transition shadow-lg shadow-blue-200"
          >
            무료 매칭 리포트 받기 →
          </Link>
          <p className="text-sm text-slate-400 mt-4">
            기본 매칭 3개 무료 · 신용카드 불필요
          </p>
          <Link
            href="/demo"
            className="inline-block text-sm text-blue-600 hover:text-blue-700 mt-3 underline underline-offset-4"
          >
            👀 데모 결과 먼저 보기
          </Link>
        </div>
      </header>

      {/* How it works */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-16">
          어떻게 작동하나요?
        </h3>
        <div className="grid md:grid-cols-3 gap-10">
          {[
            {
              step: "1",
              icon: "📄",
              title: "이력서 업로드",
              desc: "이력서나 GitHub 프로필을 연결하세요. AI가 자동으로 스킬과 경험을 분석합니다.",
            },
            {
              step: "2",
              icon: "🔍",
              title: "AI 매칭 분석",
              desc: "공고의 기술 요구사항뿐 아니라 회사 문화, 성장 방향, 팀 분위기까지 종합 분석합니다.",
            },
            {
              step: "3",
              icon: "📊",
              title: "맞춤 리포트",
              desc: "'왜 이 회사가 나에게 맞는지' 근거와 함께 상세 매칭 리포트를 제공합니다.",
            },
          ].map((item) => (
            <div
              key={item.step}
              className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100"
            >
              <div className="text-4xl mb-4">{item.icon}</div>
              <h4 className="text-xl font-semibold text-slate-900 mb-3">
                {item.title}
              </h4>
              <p className="text-slate-600 leading-relaxed">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Differentiator */}
      <section className="bg-white py-20">
        <div className="max-w-5xl mx-auto px-6">
          <h3 className="text-3xl font-bold text-center text-slate-900 mb-16">
            기존 플랫폼과 뭐가 다른가요?
          </h3>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-red-50 rounded-2xl p-8 border border-red-100">
              <h4 className="text-lg font-semibold text-red-700 mb-4">
                ❌ 기존 채용 플랫폼
              </h4>
              <ul className="space-y-3 text-slate-600">
                <li>• 키워드 매칭 (Python → Python 공고)</li>
                <li>• 회사 문화? 리뷰 직접 찾아보세요</li>
                <li>• 지원 후 무한 기다림</li>
                <li>• 나에게 맞는 이유 설명 없음</li>
              </ul>
            </div>
            <div className="bg-blue-50 rounded-2xl p-8 border border-blue-100">
              <h4 className="text-lg font-semibold text-blue-700 mb-4">
                ✅ JobFit AI
              </h4>
              <ul className="space-y-3 text-slate-600">
                <li>• 컬쳐핏 + 성장궤적 + 스킬 종합 매칭</li>
                <li>• &ldquo;이 회사가 당신에게 맞는 3가지 이유&rdquo;</li>
                <li>• 갭 분석 + 면접 포인트 자동 생성</li>
                <li>• AI가 설명하는 개인화 리포트</li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section className="max-w-5xl mx-auto px-6 py-20">
        <h3 className="text-3xl font-bold text-center text-slate-900 mb-16">
          가격
        </h3>
        <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
          <div className="bg-white rounded-2xl p-8 shadow-sm border border-slate-100">
            <h4 className="text-xl font-semibold text-slate-900 mb-2">무료</h4>
            <p className="text-4xl font-bold text-slate-900 mb-6">₩0</p>
            <ul className="space-y-3 text-slate-600 mb-8">
              <li>✓ 기본 매칭 리포트 3개</li>
              <li>✓ 스킬 분석</li>
              <li>✓ 공고 크롤링</li>
            </ul>
            <Link
              href="/onboarding"
              className="block text-center border-2 border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition"
            >
              시작하기
            </Link>
          </div>
          <div className="bg-blue-600 rounded-2xl p-8 shadow-lg text-white">
            <h4 className="text-xl font-semibold mb-2">프리미엄</h4>
            <p className="text-4xl font-bold mb-6">
              ₩9,900<span className="text-lg font-normal">/월</span>
            </p>
            <ul className="space-y-3 text-blue-100 mb-8">
              <li>✓ 무제한 매칭 리포트</li>
              <li>✓ 상세 컬쳐핏 분석</li>
              <li>✓ 갭 분석 + 보완 전략</li>
              <li>✓ 면접 코칭 리포트</li>
            </ul>
            <button className="block w-full text-center bg-white text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold">
              출시 알림 받기
            </button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-200 py-8">
        <div className="max-w-5xl mx-auto px-6 text-center text-slate-400 text-sm">
          © 2026 JobFit AI. Built by MaxMini.
        </div>
      </footer>
    </div>
  );
}
