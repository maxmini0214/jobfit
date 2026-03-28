import Link from "next/link";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center">
      <div className="text-center max-w-md mx-auto px-6">
        <div className="text-7xl mb-6">🔍</div>
        <h1 className="text-3xl font-bold text-slate-900 mb-3">
          페이지를 찾을 수 없습니다
        </h1>
        <p className="text-slate-600 mb-8">
          요청하신 페이지가 존재하지 않거나 이동되었습니다.
        </p>
        <div className="flex gap-3 justify-center">
          <Link
            href="/"
            className="bg-blue-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-blue-700 transition"
          >
            홈으로 가기
          </Link>
          <Link
            href="/demo"
            className="bg-white text-slate-700 px-6 py-3 rounded-lg font-medium border border-slate-200 hover:bg-slate-50 transition"
          >
            데모 체험하기
          </Link>
        </div>
      </div>
    </div>
  );
}
