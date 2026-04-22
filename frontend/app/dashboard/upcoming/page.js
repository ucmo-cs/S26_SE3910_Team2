"use client";

import Link from "next/link";

import AppointmentsSection from "../../../components/appointments/AppointmentsSection.client";
import useManagedAppointments from "../../../lib/useManagedAppointments";

export default function UpcomingAppointmentsPage() {
  const {
    actor: user,
    upcomingAppointments,
    isLoading,
    error,
    handleUpdatedAppointment,
    handleDeletedAppointment,
  } = useManagedAppointments("user");

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#d9f99d,transparent_28%),linear-gradient(140deg,#ffffff,#eef8f3)] p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">
                Upcoming Appointments
              </p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {user ? `${user.fullName}'s scheduled visits` : "Upcoming appointments"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Review every upcoming appointment connected to this account in one place.
              </p>
            </div>

            <Link
              href="/dashboard"
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:text-black hover:shadow-md"
            >
              Back to Dashboard
            </Link>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <AppointmentsSection
          title="All Upcoming Appointments"
          appointments={upcomingAppointments}
          isLoading={isLoading}
          loadingMessage="Loading upcoming appointments..."
          emptyMessage="You do not have any upcoming appointments yet."
          variant="upcoming"
          actorUserId={user?.id}
          actorType="user"
          onUpdated={handleUpdatedAppointment}
          onDeleted={handleDeletedAppointment}
        />
      </div>
    </main>
  );
}
