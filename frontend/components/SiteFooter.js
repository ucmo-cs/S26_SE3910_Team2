import Link from "next/link";

export default function SiteFooter() {
  return (
    <footer className="mt-auto border-t border-slate-200 bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <p className="text-sm text-slate-500">Commerce Bank Appointment Booking</p>
        <Link
          href="/banker-login"
          className="text-sm font-semibold text-[#006747] transition hover:text-black"
        >
          Banker Login
        </Link>
      </div>
    </footer>
  );
}
