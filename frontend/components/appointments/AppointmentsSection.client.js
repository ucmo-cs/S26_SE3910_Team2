"use client";

import Link from "next/link";

import ManagedAppointmentCard from "./ManagedAppointmentCard.client";

export default function AppointmentsSection({
  title,
  appointments,
  isLoading,
  loadingMessage,
  emptyMessage,
  variant,
  actorUserId,
  actorType,
  onUpdated,
  onDeleted,
  previewLimit,
  viewAllHref,
  viewAllLabel,
}) {
  const visibleAppointments =
    typeof previewLimit === "number" ? appointments.slice(0, previewLimit) : appointments;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-slate-900">{title}</h2>
        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {appointments.length}
        </span>
      </div>

      {isLoading ? (
        <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
          {loadingMessage}
        </div>
      ) : appointments.length ? (
        <>
          {visibleAppointments.map((appointment) => (
            <ManagedAppointmentCard
              key={appointment.id}
              appointment={appointment}
              variant={variant}
              actorUserId={actorUserId}
              actorType={actorType}
              onUpdated={onUpdated}
              onDeleted={onDeleted}
            />
          ))}

          {viewAllHref ? (
            <Link
              href={viewAllHref}
              className="inline-flex w-full items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:text-black hover:shadow-md"
            >
              {viewAllLabel}
            </Link>
          ) : null}
        </>
      ) : (
        <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
          {emptyMessage}
        </div>
      )}
    </div>
  );
}
