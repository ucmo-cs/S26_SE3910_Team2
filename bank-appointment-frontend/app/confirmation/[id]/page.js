"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { getBookings } from "../../../lib/bookingStorage";
import { branches } from "../../../data/branches";
import { topics } from "../../../data/topics";
import { formatTimeFromISO } from "../../../lib/format";

function findTopicName(topicId) {
  return topics.find((t) => t.id === topicId)?.name || topicId;
}

function findBranch(branchId) {
  return branches.find((b) => b.id === branchId) || null;
}

export default function ConfirmationPage() {
  const params = useParams();
  const id = params?.id;

  const booking = getBookings().find((b) => b.id === id) || null;
  const branch = booking ? findBranch(booking.branchId) : null;

  return (
    <main className="min-h-screen bg-gradient-to-b from-white via-white to-slate-50">
      {/* Top accent bar */}
      <div className="h-2 w-full bg-[#78be20]" />

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
                Your appointment has been reserved. A confirmation email can be added as a stretch goal.
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
        {!booking ? (
          <div className="fade-up mt-8 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-900">
              We couldn’t find that booking
            </h2>
            <p className="mt-2 text-slate-600">
              This can happen if local storage was cleared. Try booking again.
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
          <div className="mt-8 grid gap-6 lg:grid-cols-3">
            {/* Details card */}
            <div className="fade-up lg:col-span-2 rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <div className="flex items-center justify-between gap-4">
                <h2 className="text-lg font-semibold text-slate-900">
                  Appointment Details
                </h2>
                <span className="rounded-full bg-[#006747]/10 px-3 py-1 text-xs font-semibold text-[#006747]">
                  Reserved
                </span>
              </div>

              <div className="mt-5 h-1 w-20 bg-[#006747]" />

              <div className="mt-6 grid gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Confirmation ID
                  </p>
                  <p className="mt-1 font-mono text-base text-slate-900">{booking.id}</p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Topic
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {findTopicName(booking.topicId)}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Time
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {formatTimeFromISO(booking.startISO)}
                  </p>
                  <p className="mt-1 text-xs text-slate-500 break-all">
                    {booking.startISO}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Branch
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">
                    {branch?.name || booking.branchId}
                  </p>
                  <p className="mt-1 text-sm text-slate-600">
                    {branch?.address || "Address not available in mock data."}
                  </p>
                </div>

                <div>
                  <p className="text-xs font-semibold uppercase tracking-widest text-slate-500">
                    Name
                  </p>
                  <p className="mt-1 font-semibold text-slate-900">{booking.name}</p>
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
                <p className="mt-2 text-slate-700">{booking.reason}</p>
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
              </div>
            </div>

            {/* Sidebar card */}
            <div className="fade-up [animation-delay:120ms] rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
              <h3 className="text-base font-semibold text-slate-900">
                What happens next?
              </h3>

              <div className="mt-4 space-y-3 text-sm text-slate-600">
                <div className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#006747]" />
                  <p>
                    This time slot is now <span className="font-semibold">unavailable</span> for future bookings.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#006747]" />
                  <p>
                    Stretch goal: send a simple confirmation email with branch + date/time.
                  </p>
                </div>
                <div className="flex gap-3">
                  <span className="mt-1 h-2 w-2 rounded-full bg-[#006747]" />
                  <p>
                    Stretch goal: support different business hours by day of week.
                  </p>
                </div>
              </div>

              <div className="mt-6 h-px w-full bg-gradient-to-r from-transparent via-slate-300 to-transparent" />

              <p className="mt-6 text-xs text-slate-500">
                Prototype note: data is stored in local storage for front-end behavior testing.
              </p>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
