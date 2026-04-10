"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { clearSessionBanker, getSessionBanker } from "../../lib/session";

function toDateTimeValue(appointment) {
  return new Date(`${appointment.appointmentDate}T${appointment.appointmentTime}`);
}

function formatAppointmentDate(appointment) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(toDateTimeValue(appointment));
}

function AppointmentCard({ appointment, variant }) {
  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#006747]">
            {variant === "upcoming" ? "Upcoming Visit" : "Past Visit"}
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{appointment.topicName}</h3>
          <p className="mt-2 text-sm font-semibold text-slate-700">{appointment.fullName}</p>
          <p className="text-sm text-slate-500">{appointment.email}</p>
          <p className="mt-2 text-sm text-slate-600">{appointment.branchName}</p>
          <p className="text-sm text-slate-500">{appointment.branchAddress}</p>
        </div>

        <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
          {formatAppointmentDate(appointment)}
        </span>
      </div>

      <div className="mt-5 border-t border-slate-200 pt-4">
        <p className="text-xs font-semibold uppercase tracking-[0.28em] text-slate-500">Notes</p>
        <p className="mt-2 text-sm leading-6 text-slate-700">
          {appointment.notes || "No notes were added for this appointment."}
        </p>
      </div>
    </div>
  );
}

export default function BankerDashboardPage() {
  const router = useRouter();
  const [banker, setBanker] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const storedBanker = getSessionBanker();
    if (!storedBanker) {
      router.replace("/banker-login");
      return;
    }

    setBanker(storedBanker);
  }, [router]);

  useEffect(() => {
    async function loadAppointments() {
      if (!banker?.id) {
        return;
      }

      setIsLoading(true);
      setError("");

      try {
        const response = await fetch(`http://localhost:8080/api/users/${banker.id}/banker-appointments`);
        const contentType = response.headers.get("content-type") || "";
        const data = contentType.includes("application/json")
          ? await response.json().catch(() => [])
          : await response.text().catch(() => "");

        if (!response.ok) {
          setError(typeof data === "string" && data.trim() ? data : "We couldn't load appointments.");
          setAppointments([]);
          return;
        }

        setAppointments(data);
      } catch {
        setError("We couldn't load appointments.");
        setAppointments([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadAppointments();
  }, [banker]);

  const now = new Date();
  const upcomingAppointments = appointments.filter((appointment) => toDateTimeValue(appointment) >= now);
  const pastAppointments = appointments.filter((appointment) => toDateTimeValue(appointment) < now).reverse();

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-6xl space-y-8">
        <section className="rounded-[2rem] border border-slate-200 bg-[radial-gradient(circle_at_top_left,#bfdbfe,transparent_28%),linear-gradient(145deg,#ffffff,#eef4ff)] p-8 shadow-sm">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-[#006747]">Banker Dashboard</p>
              <h1 className="mt-3 text-4xl font-bold tracking-tight text-slate-900">
                {banker ? `Welcome, ${banker.fullName}` : "All appointments"}
              </h1>
              <p className="mt-3 max-w-2xl text-sm leading-7 text-slate-600">
                Review every scheduled customer appointment, including completed visits and future bookings.
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                clearSessionBanker();
                router.push("/banker-login");
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-5 py-3 text-sm font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
            >
              Log Out
            </button>
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
              <h2 className="text-2xl font-bold text-slate-900">Future Appointments</h2>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
                {upcomingAppointments.length}
              </span>
            </div>

            {isLoading ? (
              <div className="rounded-3xl border border-slate-200 bg-white p-6 text-sm text-slate-600 shadow-sm">
                Loading future appointments...
              </div>
            ) : upcomingAppointments.length ? (
              upcomingAppointments.map((appointment) => (
                <AppointmentCard key={appointment.id} appointment={appointment} variant="upcoming" />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                No future appointments are currently scheduled.
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
                <AppointmentCard key={appointment.id} appointment={appointment} variant="past" />
              ))
            ) : (
              <div className="rounded-3xl border border-dashed border-slate-300 bg-white/70 p-6 text-sm text-slate-600">
                No previous appointments have been recorded yet.
              </div>
            )}
          </div>
        </section>
      </div>
    </main>
  );
}
