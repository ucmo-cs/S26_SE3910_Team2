"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { getSessionUser } from "../../lib/session";
import ManagedAppointmentCard from "../../components/appointments/ManagedAppointmentCard.client";

function toDateTimeValue(appointment) {
  return new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedUser = getSessionUser();
    if (!storedUser) {
      router.replace("/login");
      return;
    }

    setUser(storedUser);
  }, [router]);

  useEffect(() => {
    async function loadAppointments() {
      if (!user?.id) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:8080/api/users/${user.id}/appointments`);
        const data = await response.json().catch(() => []);

        if (!response.ok) {
          setError(data?.message || "We couldn't load your appointments.");
          setAppointments([]);
          return;
        }

        setAppointments(data);
      } catch {
        setError("We couldn't load your appointments.");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [user]);

  const now = new Date();
  const upcomingAppointments = appointments.filter((appointment) => toDateTimeValue(appointment) >= now);
  const pastAppointments = appointments.filter((appointment) => toDateTimeValue(appointment) < now).reverse();

  function handleUpdatedAppointment(updatedAppointment) {
    setAppointments((current) =>
      current.map((appointment) => (appointment.id === updatedAppointment.id ? updatedAppointment : appointment))
    );
  }

  function handleDeletedAppointment(appointmentId) {
    setAppointments((current) => current.filter((appointment) => appointment.id !== appointmentId));
  }

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
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Upcoming Appointments</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {upcomingAppointments.length}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading upcoming appointments...
              </div>
            ) : upcomingAppointments.length ? (
              upcomingAppointments.map((appointment) => (
                <ManagedAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  variant="upcoming"
                  actorUserId={user.id}
                  actorType="user"
                  onUpdated={handleUpdatedAppointment}
                  onDeleted={handleDeletedAppointment}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                You do not have any upcoming appointments yet.
              </div>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900">Previous Appointments</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {pastAppointments.length}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading previous appointments...
              </div>
            ) : pastAppointments.length ? (
              pastAppointments.map((appointment) => (
                <ManagedAppointmentCard
                  key={appointment.id}
                  appointment={appointment}
                  variant="past"
                  actorUserId={user.id}
                  actorType="user"
                  onUpdated={handleUpdatedAppointment}
                  onDeleted={handleDeletedAppointment}
                />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                No previous appointments have been recorded for this account.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
