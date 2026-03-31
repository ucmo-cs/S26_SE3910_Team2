import Link from "next/link";

export default function LoginPage() {
  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-2xl rounded-2xl border border-slate-200 bg-white p-10 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">
          Login
        </p>
        <h1 className="mt-4 text-4xl font-bold text-slate-900">Coming Soon</h1>
        <p className="mt-4 text-base leading-7 text-slate-600">
          Online login is not available yet, but we&apos;re working on it.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center justify-center border border-[#006747] bg-[#006747] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
        >
          Back to Home
        </Link>
      </div>
    </main>
  );
}
