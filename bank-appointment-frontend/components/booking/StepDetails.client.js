"use client";

export default function StepDetails({
  name,
  setName,
  email,
  setEmail,
  reason,
  setReason,
}) {
  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15";

  return (
    <div className="space-y-5">
      <div>
        <h2 className="text-xl font-bold text-slate-900">Your Details</h2>
        <p className="mt-1 text-slate-600">
          Enter your info for the appointment request.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-slate-700">
            Full Name
          </label>
          <input
            className={inputClass}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Jane Doe"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700">Email</label>
          <input
            className={inputClass}
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="jane@email.com"
          />
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold text-slate-700">
          Reason / Notes
        </label>
        <textarea
          className={inputClass}
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Briefly describe what you need help with..."
        />
      </div>

      <div className="rounded-2xl border border-slate-200 bg-slate-50 p-5 text-sm text-slate-700">
        This prototype does not send emails yet, but the confirmation step will display your appointment details.
      </div>
    </div>
  );
}
