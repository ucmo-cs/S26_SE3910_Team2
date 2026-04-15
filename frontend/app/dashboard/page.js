"use client";

import AppointmentsSection from "../../components/appointments/AppointmentsSection.client";
import useManagedAppointments from "../../lib/useManagedAppointments";

export default function DashboardPage() {
  const {
    actor: user,
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error,
    handleUpdatedAppointment,
    handleDeletedAppointment,
  } = useManagedAppointments("user");

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#d9f99d,transparent_28%),linear-gradient(140deg,#ffffff,#eef8f3)] p-8 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {user ? `Welcome, ${user.fullName}` : "Your appointments"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Review your upcoming branch visits and look back at previous appointments connected
              to your account.
            </p>
          </div>
        </section>

        {error ? (
          <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
            {error}
          </div>
        ) : null}

        <section className="grid gap-8 lg:grid-cols-2">
          <AppointmentsSection
            title="Upcoming Appointments"
            appointments={upcomingAppointments}
            isLoading={isLoading}
            loadingMessage="Loading upcoming appointments..."
            emptyMessage="You do not have any upcoming appointments yet."
            variant="upcoming"
            actorUserId={user?.id}
            actorType="user"
            onUpdated={handleUpdatedAppointment}
            onDeleted={handleDeletedAppointment}
            previewLimit={2}
            viewAllHref="/dashboard/upcoming"
            viewAllLabel="View All Upcoming Appointments"
          />

          <AppointmentsSection
            title="Previous Appointments"
            appointments={pastAppointments}
            isLoading={isLoading}
            loadingMessage="Loading previous appointments..."
            emptyMessage="No previous appointments have been recorded for this account."
            variant="past"
            actorUserId={user?.id}
            actorType="user"
            onUpdated={handleUpdatedAppointment}
            onDeleted={handleDeletedAppointment}
            previewLimit={2}
            viewAllHref="/dashboard/previous"
            viewAllLabel="View All Previous Appointments"
          />
        </section>
      </div>
    </main>
  );
}
