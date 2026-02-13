"use client";

import { formatTimeFromISO } from "../../lib/format";

export default function StepConfirm({
  topic,
  branch,
  slotISO,
  name,
  email,
  reason,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Confirm Appointment</h2>
        <p className="mt-1 text-slate-600">
          Review your details before reserving the time slot.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
        <div className="mb-4 h-1 w-20 bg-[#006747]" />

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Topic
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {topic?.name ?? "-"}
            </p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Branch
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {branch?.name ?? "-"}
            </p>
            <p className="mt-1 text-sm text-slate-600">{branch?.address ?? ""}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Time
            </p>
            <p className="mt-1 font-semibold text-slate-900">
              {slotISO ? formatTimeFromISO(slotISO) : "-"}
            </p>
            <p className="mt-1 text-xs text-slate-500 break-all">{slotISO}</p>
          </div>

          <div>
            <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
              Contact
            </p>
            <p className="mt-1 font-semibold text-slate-900">{name || "-"}</p>
            <p className="mt-1 text-sm text-slate-600">{email || "-"}</p>
          </div>
        </div>

        <div className="mt-5 border-t border-slate-200 pt-4">
          <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
            Reason
          </p>
          <p className="mt-2 text-slate-700">{reason || "-"}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
        When you click <span className="font-semibold">Confirm Appointment</span>, this time slot will become unavailable for other users (prototype uses local storage).
      </div>
    </div>
  );
}
