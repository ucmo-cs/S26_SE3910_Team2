import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      {/* Top accent bar */}
      <div className="h-2 w-full bg-[#78be20]" />

      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <section className="space-y-6 fade-up">
            <p className="inline-flex w-fit items-center gap-2 border border-slate-200 bg-white px-3 py-1 text-xs font-semibold uppercase tracking-widest text-[#006747]">
              Commerce Bank Prototype
              <span className="h-1.5 w-1.5 rounded-full bg-[#006747]" />
              Front-end only
            </p>

            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Schedule your in-branch appointment in minutes.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600">
              Choose a topic, pick a branch that supports it, and reserve an available 30-minute
              slot. Bookings become unavailable immediately to prevent double scheduling.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
              >
                Book an Appointment
              </Link>

              <a
                href="#how"
                className="inline-flex items-center justify-center border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
              >
                Learn More
              </a>
            </div>

            <div className="flex items-center gap-5 text-sm text-slate-600">
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006747]" />
                Topic-based branch filtering
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006747]" />
                30-minute time slots
              </div>
              <div className="flex items-center gap-2">
                <span className="h-2 w-2 rounded-full bg-[#006747]" />
                Instant reservation behavior
              </div>
            </div>
          </section>

          {/* RIGHT IMAGE CARD (with overlay + hover lift) */}
          <section className="fade-up [animation-delay:120ms]">
            <div className="group relative overflow-hidden border border-slate-200 bg-white shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-xl">
              <div className="relative aspect-[16/6] w-full">
                <Image
                  src="/homepageImg.jpg"
                  alt="Bank customer appointment"
                  fill
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                {/* Corner accent ring */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-[10px] border-cyan-500/40" />
              </div>

              <div className="border-t border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900">Prototype goals</p>
                <p className="mt-1 text-sm text-slate-600">
                  Build the complete booking UX now, then swap mock data for Spring Boot APIs later.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="mt-20 fade-up [animation-delay:200ms]">
          <div className="border-t border-slate-200" />

          <div className="pt-12">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  How it works
                </h2>
                <p className="mt-2 text-slate-600">
                  A simple, guided flow that prevents double booking.
                </p>
              </div>
            </div>
          </div>


          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "1. Choose a Topic",
                body: "Topics come from the database and drive branch availability.",
              },
              {
                title: "2. Select a Branch",
                body: "Branches filter based on which topics they support.",
              },
              {
                title: "3. Reserve a Time",
                body: "Available 30-minute slots update immediately after booking.",
              },
            ].map((card) => (
              <div
                key={card.title}
                className="border border-slate-200 bg-white p-6 shadow-sm transition-all duration-200 hover:-translate-y-1 hover:shadow-lg"
              >
                <h3 className="text-lg font-semibold text-slate-900">{card.title}</h3>
                <p className="mt-2 text-sm text-slate-600">{card.body}</p>

                <div className="mt-4 h-1 w-14 bg-[#006747]" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
