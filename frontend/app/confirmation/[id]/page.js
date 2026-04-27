"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import { formatTimeFromISO } from "../../../lib/format";
import { getSessionUser } from "../../../lib/session";

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export default function ConfirmationPage() {
  const params = useParams();
  const id = params?.id;
  const [booking, setBooking] = useState(null);
  const [loaded, setLoaded] = useState(false);
  const [emailStatus, setEmailStatus] = useState(null);
  const [resendEmail, setResendEmail] = useState("");
  const [resendMessage, setResendMessage] = useState("");
  const [resendError, setResendError] = useState("");
  const [isResending, setIsResending] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    setUser(getSessionUser());
  }, []);

  useEffect(() => {
    if (!id || typeof window === "undefined") return;

    const storageKey = `appointment-confirmation-${id}`;
    const searchParams = new URLSearchParams(window.location.search);
    const email = searchParams.get("email");
    const emailSent = searchParams.get("emailSent");

    if (emailSent === "true" || emailSent === "false") {
      const nextStatus = {
        emailSent: emailSent === "true",
        email: email || "",
      };

      setEmailStatus(nextStatus);
      setResendEmail(nextStatus.email);
      window.sessionStorage.setItem(storageKey, JSON.stringify(nextStatus));
      return;
    }

    const savedStatus = window.sessionStorage.getItem(storageKey);
    if (!savedStatus) return;

    try {
      const parsedStatus = JSON.parse(savedStatus);
      setEmailStatus(parsedStatus);
      setResendEmail(parsedStatus.email || "");
    } catch {
      window.sessionStorage.removeItem(storageKey);
    }
  }, [id]);

  useEffect(() => {
    async function loadAppointment() {
      if (!id) return;

      try {
        const response = await fetch(`http://localhost:8080/api/appointments/${id}`);
        if (!response.ok) {
          setBooking(null);
          setLoaded(true);
          return;
        }

        const data = await response.json();
        setBooking(data);
      } catch {
        setBooking(null);
      } finally {
        setLoaded(true);
      }
    }

    loadAppointment();
  }, [id]);

  const slotISO = booking
    ? `${booking.appointmentDate}T${booking.appointmentTime}`
    : "";

  const emailStatusMessage = emailStatus?.emailSent
    ? `A confirmation email has been sent to ${emailStatus.email || booking?.email || "your email address"}.`
    : "Your appointment is confirmed, but we were unable to send a confirmation email.";

  async function handleResend(event) {
    event.preventDefault();

    const nextEmail = resendEmail.trim();
    setResendMessage("");
    setResendError("");

    if (!EMAIL_PATTERN.test(nextEmail)) {
      setResendError("Enter a valid email address.");
      return;
    }

    setIsResending(true);

    try {
      const response = await fetch(`http://localhost:8080/api/appointments/${id}/resend-confirmation`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email: nextEmail }),
      });

      if (!response.ok) {
        setResendError("We couldn't resend the confirmation email. Please try again.");
        return;
      }

      const data = await response.json();
      const nextStatus = {
        emailSent: Boolean(data.emailSent),
        email: data.email || nextEmail,
      };

      setEmailStatus(nextStatus);

      if (typeof window !== "undefined") {
        window.sessionStorage.setItem(
          `appointment-confirmation-${id}`,
          JSON.stringify(nextStatus)
        );
      }

      if (nextStatus.emailSent) {
        setResendMessage(`A confirmation email has been sent to ${nextStatus.email}.`);
      } else {
        setResendError("Your appointment is still confirmed, but the email could not be sent.");
      }
    } catch {
      setResendError("We couldn't resend the confirmation email. Please try again.");
    } finally {
      setIsResending(false);
    }
  }

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      <div className="mx-auto max-w-4xl px-6 py-12">
        {/* Header */}
        <div className="fade-up rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="flex flex-col gap-6 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-xs font-semibold uppercase tracking-widest text-[#006747]">
                Confirmation
              </p>
              <h1 className="mt-2 text-3xl font-bold tracking-tight text-slate-900">
                Appointment Confirmed
              </h1>
              <p className="mt-2 text-slate-600">
                Your appointment has been reserved.
              </p>
            </div>

            {/* “Check” badge */}
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#006747]/10">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                className="h-7 w-7"
                stroke="#006747"
                strokeWidth="2.5"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20 6L9 17l-5-5"
                />
              </svg>
            </div>
          </div>
        </div>

        {/* Content */}
        {!loaded ? (
          <div className="fade-up mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              Loading appointment
            </h2>
          </div>
        ) : !booking ? (
          <div className="fade-up mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              We couldn’t find that booking
            </h2>
            <p className="mt-2 text-slate-600">
              Try booking again.
            </p>

            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href="/book"
                className="inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
              >
                Book Another Appointment
              </Link>
              <Link href="/" className="self-center text-blue-600 hover:underline">
                Back to Home
              </Link>
            </div>
          </div>
        ) : (
          <div className={`mt-8 grid gap-6 ${user ? "justify-items-center" : "lg:grid-cols-3"}`}>
            {/* Details card */}
            <div className={`fade-up rounded-2xl border border-slate-200 bg-white p-8 shadow-sm ${user ? "w-full max-w-3xl" : "lg:col-span-2"}`}>
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Appointment Details
                </h2>
                <span className="rounded-full bg-[#006747]/10 px-3 py-1 text-xs font-semibold text-[#006747]">
                  Reserved
                </span>
              </div>

              {emailStatus ? (
                <div
                  className={`mt-6 rounded-2xl border px-4 py-3 text-sm ${
                    emailStatus.emailSent
                      ? "border-[#006747]/20 bg-[#006747]/5 text-[#006747]"
                      : "border-amber-200 bg-amber-50 text-amber-800"
                  }`}
                >
                  {emailStatusMessage}
                </div>
              ) : null}

              {emailStatus?.emailSent === false ? (
                <form onSubmit={handleResend} className="mt-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                  <label htmlFor="resend-email" className="text-sm font-semibold text-slate-900">
                    Resend confirmation email
                  </label>
                  <div className="mt-3 flex flex-col gap-3 sm:flex-row">
                    <input
                      id="resend-email"
                      type="email"
                      value={resendEmail}
                      onChange={(event) => setResendEmail(event.target.value)}
                      className="min-w-0 flex-1 border border-slate-300 bg-white px-3 py-2 text-sm text-slate-900 outline-none focus:border-[#006747] focus:ring-2 focus:ring-[#006747]/20"
                      placeholder="name@example.com"
                    />
                    <button
                      type="submit"
                      disabled={isResending}
                      className="inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-5 py-2 text-sm font-semibold text-white transition-all duration-200 hover:border-black hover:bg-black disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isResending ? "Sending..." : "Resend"}
                    </button>
                  </div>
                  {resendError ? (
                    <p className="mt-3 text-sm text-red-700">{resendError}</p>
                  ) : null}
                  {resendMessage ? (
                    <p className="mt-3 text-sm text-[#006747]">{resendMessage}</p>
                  ) : null}
                </form>
              ) : null}

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Appointment Number
                  </p>
                  <p className="mt-1 font-mono text-base font-semibold text-slate-900">{booking.id}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Topic
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {booking.topic?.name || "-"}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Time
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatTimeFromISO(slotISO)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 break-all">
                    {slotISO}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Branch
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {booking.branch?.name || "-"}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {booking.branch?.address || ""}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Name
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">{booking.fullName}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Email
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">{booking.email}</p>
                </div>
              </div>

              <div className="mt-6 border-t border-slate-200 pt-5">
                <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                  Notes
                </p>
                <p className="mt-2 text-slate-700">{booking.notes}</p>
              </div>

              <div className="mt-8 flex flex-wrap gap-3">
                <Link
                  href="/book"
                  className="inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-6 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
                >
                  Book Another
                </Link>
                <Link
                  href="/"
                  className="inline-flex items-center justify-center border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                >
                  Home
                </Link>
                {user ? (
                  <Link
                    href="/dashboard"
                    className="inline-flex items-center justify-center border-2 border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-900 transition-all duration-200 hover:-translate-y-0.5 hover:bg-slate-50 hover:shadow-md"
                  >
                    Go to Dashboard
                  </Link>
                ) : null}
              </div>
            </div>

            {/* Sidebar card */}
            {!user ? (
              <div className="fade-up [animation-delay:120ms] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
                <h3 className="text-base font-semibold text-slate-900">
                  What happens next?
                </h3>
                <p className="mt-4 text-sm text-slate-600">
                  Create an account today to view, reshedule, or cancel appointments!
                </p>
                <Link
                  href={{
                    pathname: "/login",
                    query: {
                      fullName: booking.fullName || "",
                      email: booking.email || "",
                    },
                  }}
                  className="mt-6 inline-flex items-center justify-center border-2 border-[#006747] bg-[#006747] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg"
                >
                  Create Account
                </Link>
              </div>
            ) : null}
          </div>
        )}
      </div>
    </main>
  );
}
