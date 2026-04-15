"use client";

import AppointmentsSection from "../../components/appointments/AppointmentsSection.client";
import useManagedAppointments from "../../lib/useManagedAppointments";

export default function BankerDashboardPage() {
  const {
    actor: banker,
    upcomingAppointments,
    pastAppointments,
    isLoading,
    error,
    handleUpdatedAppointment,
    handleDeletedAppointment,
  } = useManagedAppointments("banker");

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#bfdbfe,transparent_28%),linear-gradient(145deg,#ffffff,#eef4ff)] p-8 shadow-sm">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">Banker Dashboard</p>
            <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
              {banker ? `Welcome, ${banker.fullName}` : "All appointments"}
            </h1>
            <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
              Review every scheduled customer appointment, including completed visits and future bookings.
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
            title="Future Appointments"
            appointments={upcomingAppointments}
            isLoading={isLoading}
            loadingMessage="Loading future appointments..."
            emptyMessage="No future appointments are currently scheduled."
            variant="upcoming"
            actorUserId={banker?.id}
            actorType="banker"
            onUpdated={handleUpdatedAppointment}
            onDeleted={handleDeletedAppointment}
            previewLimit={2}
            viewAllHref="/banker-dashboard/upcoming"
            viewAllLabel="View All Upcoming Appointments"
          />

          <AppointmentsSection
            title="Previous Appointments"
            appointments={pastAppointments}
            isLoading={isLoading}
            loadingMessage="Loading previous appointments..."
            emptyMessage="No previous appointments have been recorded yet."
            variant="past"
            actorUserId={banker?.id}
            actorType="banker"
            onUpdated={handleUpdatedAppointment}
            onDeleted={handleDeletedAppointment}
            previewLimit={2}
            viewAllHref="/banker-dashboard/previous"
            viewAllLabel="View All Previous Appointments"
          />
        </section>
      </div>
    </main>
  );
}
