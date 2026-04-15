"use client";

import Link from "next/link";

import AppointmentsSection from "../../../components/appointments/AppointmentsSection.client";
import useManagedAppointments from "../../../lib/useManagedAppointments";

export default function BankerUpcomingAppointmentsPage() {
  const {
    actor: banker,
    upcomingAppointments,
    isLoading,
    error,
    handleUpdatedAppointment,
    handleDeletedAppointment,
  } = useManagedAppointments("banker");

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#bfdbfe,transparent_28%),linear-gradient(145deg,#ffffff,#eef4ff)] p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">
                Future Appointments
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {banker ? `${banker.fullName}'s appointment queue` : "Future appointments"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Review every scheduled customer appointment across the system.
              </p>
            </div>

            <Link
              href="/banker-dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:text-black hover:shadow-md"
            >
              Back to Banker Dashboard
            </Link>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <AppointmentsSection
          title="All Future Appointments"
          appointments={upcomingAppointments}
          isLoading={isLoading}
          loadingMessage="Loading future appointments..."
          emptyMessage="No future appointments are currently scheduled."
          variant="upcoming"
          actorUserId={banker?.id}
          actorType="banker"
          onUpdated={handleUpdatedAppointment}
          onDeleted={handleDeletedAppointment}
        />
      </div>
    </main>
  );
}
