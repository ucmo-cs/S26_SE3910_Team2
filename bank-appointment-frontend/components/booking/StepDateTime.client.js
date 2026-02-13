"use client";

import { formatDate, formatTimeFromISO } from "../../lib/format";

export default function StepDateTime({
  days,
  dateISO,
  setDateISO,
  slots,
  slotISO,
  setSlotISO,
  branchId,
}) {
  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Select Date & Time</h2>
        <p className="mt-1 text-slate-600">
          Appointments are 30 minutes. Only available slots are shown.
        </p>
      </div>

      {!branchId ? (
        <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
          Select a branch first.
        </div>
      ) : (
        <>
          {/* Dates */}
          <div>
            <p className="text-sm font-semibold text-slate-700">Choose a date</p>
            <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
              {days.map((d) => {
                const iso = new Date(d).toISOString();
                const active = iso === dateISO;

                return (
                  <button
                    key={iso}
                    onClick={() => setDateISO(iso)}
                    className={`rounded-2xl border px-4 py-3 text-left text-sm transition-all duration-200 ${
                      active
                        ? "border-[#006747] bg-[#006747]/5 shadow-sm"
                        : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                    }`}
                  >
                    <div className="font-semibold text-slate-900">
                      {formatDate(d)}
                    </div>
                    <div className="mt-1 text-xs text-slate-500">
                      {active ? "Selected" : "Select"}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Times */}
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Available times
            </p>

            {!dateISO ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                Pick a date to see times.
              </div>
            ) : slots.length === 0 ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                No times available for this day.
              </div>
            ) : (
              <div className="mt-3 flex flex-wrap gap-3">
                {slots.map((iso) => {
                  const active = iso === slotISO;

                  return (
                    <button
                      key={iso}
                      onClick={() => setSlotISO(iso)}
                      className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                        active
                          ? "border-[#006747] bg-[#006747]/10 text-slate-900"
                          : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                      }`}
                    >
                      {formatTimeFromISO(iso)}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Helper text */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Tip: After confirming, this slot will be “reserved” (stored locally) and will no longer appear as available.
          </div>
        </>
      )}
    </div>
  );
}
