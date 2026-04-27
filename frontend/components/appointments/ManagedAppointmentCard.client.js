"use client";

import { useMemo, useState } from "react";

import { nextNDays } from "../../lib/slots";

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

function formatSlotLabel(iso) {
  const match = iso.match(
    /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})(?::(\d{2}))?$/
  );
  const date = match
    ? new Date(
        Number(match[1]),
        Number(match[2]) - 1,
        Number(match[3]),
        Number(match[4]),
        Number(match[5]),
        Number(match[6] || "00")
      )
    : new Date(iso);

  return new Intl.DateTimeFormat("en-US", {
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

function dateKeyFromValue(value) {
  const date = new Date(value);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function buildSlotIso(dateKey, timeValue) {
  return `${dateKey}T${timeValue}:00`;
}

function normalizeSlotIso(value) {
  return value.length === 16 ? `${value}:00` : value;
}

async function readErrorMessage(response, fallbackMessage) {
  const contentType = response.headers.get("content-type") || "";

  if (contentType.includes("application/json")) {
    const data = await response.json().catch(() => null);
    if (data && typeof data.message === "string" && data.message.trim()) {
      return data.message;
    }
  } else {
    const text = await response.text().catch(() => "");
    if (text.trim()) {
      return text;
    }
  }

  return fallbackMessage;
}

export default function ManagedAppointmentCard({
  appointment,
  variant,
  actorUserId,
  actorType,
  onUpdated,
  onDeleted,
}) {
  const [isEditing, setIsEditing] = useState(false);
  const [selectedDate, setSelectedDate] = useState(appointment.appointmentDate);
  const [selectedSlot, setSelectedSlot] = useState(
    buildSlotIso(appointment.appointmentDate, appointment.appointmentTime.slice(0, 5))
  );
  const [availableSlots, setAvailableSlots] = useState([]);
  const [isLoadingSlots, setIsLoadingSlots] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [actionError, setActionError] = useState("");

  const selectableDays = useMemo(() => nextNDays(14).map((day) => dateKeyFromValue(day)), []);
  const currentSlotIso = buildSlotIso(appointment.appointmentDate, appointment.appointmentTime.slice(0, 5));

  async function loadSlots(dateKey) {
    setIsLoadingSlots(true);
    setActionError("");

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/available-slots?branchId=${appointment.branchId}&dateISO=${dateKey}`
      );
      if (!response.ok) {
        setAvailableSlots([]);
        setActionError(
          await readErrorMessage(response, "We couldn't load available time slots.")
        );
        return;
      }

      const data = await response.json().catch(() => []);
      const slotValues = data.map(normalizeSlotIso);
      const nextSlots =
        dateKey === appointment.appointmentDate && !slotValues.includes(currentSlotIso)
          ? [...slotValues, currentSlotIso].sort()
          : slotValues;

      setAvailableSlots(nextSlots);
      setSelectedSlot((current) => (nextSlots.includes(current) ? current : nextSlots[0] || ""));
    } catch {
      setAvailableSlots([]);
      setActionError("We couldn't load available time slots.");
    } finally {
      setIsLoadingSlots(false);
    }
  }

  async function handleDelete() {
    setActionError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(
        `http://localhost:8080/api/appointments/${appointment.id}?actorUserId=${actorUserId}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        const message = await response.text().catch(() => "");
        setActionError(message || "We couldn't cancel this appointment.");
        return;
      }

      onDeleted(appointment.id);
    } catch {
      setActionError("We couldn't cancel this appointment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleReschedule() {
    if (!selectedSlot) {
      setActionError("Select a new appointment time first.");
      return;
    }

    setActionError("");
    setIsSubmitting(true);

    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${appointment.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          actorUserId,
          startISO: selectedSlot,
        }),
      });

      if (!response.ok) {
        setActionError(
          await readErrorMessage(response, "We couldn't reschedule this appointment.")
        );
        return;
      }

      const data = await response.json().catch(() => null);
      onUpdated(data);
      setIsEditing(false);
    } catch {
      setActionError("We couldn't reschedule this appointment.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-[#006747]">
            {variant === "upcoming" ? "Scheduled" : "Completed"}
          </p>
          <h3 className="mt-2 text-xl font-bold text-slate-900">{appointment.topicName}</h3>
          {actorType === "banker" ? (
            <>
              <p className="mt-2 text-sm font-semibold text-slate-700">{appointment.fullName}</p>
              <p className="text-sm text-slate-500">{appointment.email}</p>
            </>
          ) : null}
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

      {variant === "upcoming" ? (
        <div className="mt-5 border-t border-slate-200 pt-4">
          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                const nextEditing = !isEditing;
                setIsEditing(nextEditing);
                setActionError("");
                if (nextEditing) {
                  loadSlots(selectedDate);
                }
              }}
              className="inline-flex items-center justify-center rounded-2xl border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-800 transition-all duration-200 hover:-translate-y-0.5 hover:border-slate-900 hover:shadow-md"
            >
              {isEditing ? "Close Reschedule" : "Reschedule"}
            </button>
            <button
              type="button"
              disabled={isSubmitting}
              onClick={handleDelete}
              className="inline-flex items-center justify-center rounded-2xl border border-red-300 bg-red-50 px-4 py-2 text-sm font-semibold text-red-700 transition-all duration-200 hover:-translate-y-0.5 hover:border-red-500 hover:shadow-md disabled:cursor-not-allowed disabled:opacity-70"
            >
              Cancel Appointment
            </button>
          </div>

          {isEditing ? (
            <div className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="text-sm font-semibold text-slate-700">New Date</label>
                  <select
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15"
                    value={selectedDate}
                    onChange={(event) => {
                      const nextDate = event.target.value;
                      setSelectedDate(nextDate);
                      loadSlots(nextDate);
                    }}
                  >
                    {selectableDays.map((day) => (
                      <option key={day} value={day}>
                        {day}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">New Time</label>
                  <select
                    className="mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15"
                    value={selectedSlot}
                    onChange={(event) => setSelectedSlot(event.target.value)}
                    disabled={isLoadingSlots || !availableSlots.length}
                  >
                    {availableSlots.length ? (
                      availableSlots.map((slot) => (
                        <option key={slot} value={slot}>
                          {formatSlotLabel(slot)}
                        </option>
                      ))
                    ) : (
                      <option value="">No available times</option>
                    )}
                  </select>
                </div>
              </div>

              {actionError ? (
                <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                  {actionError}
                </div>
              ) : null}

              <div className="mt-4 flex flex-wrap gap-3">
                <button
                  type="button"
                  disabled={isSubmitting || isLoadingSlots || !selectedSlot}
                  onClick={handleReschedule}
                  className="inline-flex items-center justify-center rounded-2xl border border-[#006747] bg-[#006747] px-4 py-2 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
                >
                  {isSubmitting ? "Saving..." : "Save New Time"}
                </button>
              </div>
            </div>
          ) : actionError ? (
            <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {actionError}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
