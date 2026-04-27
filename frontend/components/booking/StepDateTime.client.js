"use client";

import { formatDate, formatTimeFromISO } from "../../lib/format";

export default function StepDateTime({
  days,
  availableDateKeys,
  dateISO,
  setDateISO,
  slots,
  slotISO,
  setSlotISO,
  branchId,
  isLoadingAvailability,
  slotUnavailable,
  staleSlotISO,
}) {
  function getLocalDateKey(value) {
    const date = new Date(value);
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  }

  const visibleDays = days.filter((d) => {
    const dayKey = getLocalDateKey(d);
    return availableDateKeys.includes(dayKey);
  });

  function handleSelectSlot(iso) {
    if (!slots.includes(iso)) return;
    setSlotISO(iso);
  }

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Select Date & Time</h2>
        <p className="mt-1 text-slate-600">
          Appointments are 30 minutes. Unavailable slots are shown in red.
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
            {visibleDays.length ? (
              <div className="mt-3 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                {visibleDays.map((d) => {
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
            ) : (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                No upcoming days have available appointments for this branch.
              </div>
            )}
          </div>

          {/* Times */}
          <div>
            <p className="text-sm font-semibold text-slate-700">
              Available times
            </p>

            {slotUnavailable ? (
              <div className="mt-3 rounded-2xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">
                That time is no longer available. Choose another available slot.
              </div>
            ) : null}

            {!dateISO ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                Pick a date to see times.
              </div>
            ) : isLoadingAvailability ? (
              <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                Loading available times...
              </div>
            ) : (
              <>
                {slots.length === 0 ? (
                  <div className="mt-3 rounded-2xl border border-slate-200 bg-slate-50 p-5 text-slate-700">
                    No times available for this day.
                  </div>
                ) : null}

                <div className="mt-3 flex flex-wrap gap-3">
                  {slots.map((iso) => {
                    const active = iso === slotISO;
                    const stale = slotUnavailable && iso === staleSlotISO;

                    return (
                      <button
                        type="button"
                        key={iso}
                        onClick={() => handleSelectSlot(iso)}
                        className={`rounded-full border px-4 py-1.5 text-sm transition-all duration-200 ${
                          active
                            ? "border-[#006747] bg-[#006747]/10 text-slate-900"
                            : "border-slate-200 bg-white hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-sm"
                        }`}
                      >
                        {formatTimeFromISO(iso)}
                        {stale ? " Unavailable" : ""}
                      </button>
                    );
                  })}
                </div>
              </>
            )}
          </div>

          {/* Helper text */}
          <div className="rounded-2xl border border-slate-200 bg-white p-4 text-sm text-slate-600">
            Tip: After confirming, this slot will be reserved and will no longer appear as available.
          </div>
        </>
      )}
    </div>
  );
}
