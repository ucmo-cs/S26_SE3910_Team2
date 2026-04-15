import Link from "next/link";
import Image from "next/image";

export default function Home() {
  return (
    <main className="min-h-[calc(100vh-74px)]">
      <div className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          {/* LEFT CONTENT */}
          <section className="space-y-6 fade-up">
            <h1 className="text-4xl font-bold leading-tight tracking-tight text-slate-900 sm:text-5xl">
              Schedule your in-branch appointment in minutes.
            </h1>

            <p className="max-w-xl text-base leading-7 text-slate-600">
              Choose a topic, pick a branch that supports it, and reserve an available 30-minute
              slot.
            </p>

            <div className="flex flex-wrap gap-4">
              <Link
                href="/book"
                className="inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
              >
                Book an Appointment
              </Link>
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
                  sizes="(min-width: 1024px) 50vw, 100vw"
                  priority
                  className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                />
                {/* Gradient overlay */}
                <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-black/10 to-transparent" />
                {/* Corner accent ring */}
                <div className="pointer-events-none absolute -right-16 -top-16 h-52 w-52 rounded-full border-[10px] border-cyan-500/40" />
              </div>

              <div className="border-t border-slate-200 p-4">
                <p className="text-sm font-semibold text-slate-900">Booking goals</p>
                <p className="mt-1 text-sm text-slate-600">
                  Book an appointment with your local branch to get personalized assistance and support for your banking needs.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* HOW IT WORKS */}
        <section id="how" className="mt-6 fade-up [animation-delay:200ms]">
          <div className="border-t border-slate-200" />

          <div className="mt-6">
            <div className="flex items-end justify-between gap-6">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">
                  How it works
                </h2>
                <p className="mt-2 text-slate-600">
                  A simple 3-step process to get you booked in no time.
                </p>
              </div>
            </div>
          </div>


          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {[
              {
                title: "1. Choose a Topic",
                body: "Topics include account help, loan questions, and more.",
              },
              {
                title: "2. Select a Branch",
                body: "Select a branch that supports your chosen topic.",
              },
              {
                title: "3. Reserve a Time",
                body: "Choose an available 30-minute slot that works for you.",
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
