"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

export default function SiteNav() {
  const router = useRouter();

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur">
      <div className="h-2 w-full bg-[#78be20]" />
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="inline-flex items-center">
          <Image
            src="/commerce-bank-logo-2x.png"
            alt="Commerce Bank"
            width={220}
            height={48}
            priority
            className="h-9 w-auto sm:h-10"
          />
        </Link>

        <nav className="flex items-center gap-3">
          <Link
            href="/book"
            className="inline-flex items-center justify-center border border-[#006747] bg-[#006747] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
          >
            Book an Appointment
          </Link>

          <button
            type="button"
            onClick={() => router.push("/login")}
            className="inline-flex items-center justify-center rounded-sm border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:text-black hover:shadow-md"
          >
            Login
          </button>
        </nav>
      </div>
    </header>
  );
}
