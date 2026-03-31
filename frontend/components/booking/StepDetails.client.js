"use client";

import { useState, useEffect } from "react";

export default function StepDetails({
  name,
  setName,
  email,
  setEmail,
  reason,
  setReason,
  setEmailValid, // Optional: allow parent to know if email is valid
}) {
  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15";

  const [emailError, setEmailError] = useState("");

  // Simple email regex for format validation
  function isValidEmail(val) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  }

  useEffect(() => {
    if (typeof setEmailValid === "function") {
      setEmailValid(isValidEmail(email));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [email]);

  function handleEmailChange(e) {
    const val = e.target.value;
    setEmail(val);
    if (!val) {
      setEmailError("");
    } else if (!isValidEmail(val)) {
      setEmailError("Please enter a valid email address.");
    } else {
      setEmailError("");
    }
  }

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
            className={inputClass + (emailError ? " border-red-400" : "")}
            value={email}
            onChange={handleEmailChange}
            placeholder="jane@email.com"
            aria-invalid={!!emailError}
            aria-describedby={emailError ? "email-error" : undefined}
          />
          {emailError && (
            <div id="email-error" className="mt-1 text-xs text-red-600">
              {emailError}
            </div>
          )}
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
        A confirmation step will display your appointment details once your booking is complete.
      </div>
    </div>
  );
}
