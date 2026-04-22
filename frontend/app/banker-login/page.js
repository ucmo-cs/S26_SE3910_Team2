"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { saveSessionBanker } from "../../lib/session";

export default function BankerLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15";

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("http://localhost:8080/api/users/banker-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => "");

      if (!response.ok) {
        setError(typeof data === "string" && data.trim() ? data : data?.message || "Login failed.");
        return;
      }

      saveSessionBanker(data);
      router.push("/banker-dashboard");
    } catch {
      setError("The server is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto max-w-xl rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-[#006747]">
          Banker Portal
        </p>
        <h1 className="mt-4 text-3xl font-bold text-slate-900">Banker Login</h1>
        <p className="mt-3 text-sm leading-6 text-slate-600">
          Sign in with the banker account to review all previous and future customer appointments.
        </p>

        <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
          <div>
            <label className="text-sm font-semibold text-slate-700">Username</label>
            <input
              className={inputClass}
              value={form.username}
              onChange={(event) => setForm((current) => ({ ...current, username: event.target.value }))}
              placeholder="BestBanker"
              required
            />
          </div>

          <div>
            <label className="text-sm font-semibold text-slate-700">Password</label>
            <input
              className={inputClass}
              type="password"
              value={form.password}
              onChange={(event) => setForm((current) => ({ ...current, password: event.target.value }))}
              placeholder="TestPassword1!"
              required
            />
          </div>

          {error ? (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {error}
            </div>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex w-full items-center justify-center rounded-2xl border border-[#006747] bg-[#006747] px-5 py-3 text-sm font-semibold text-white transition-all duration-200 hover:-translate-y-0.5 hover:border-black hover:bg-black hover:shadow-lg disabled:cursor-not-allowed disabled:opacity-70"
          >
            {isSubmitting ? "Please wait..." : "Enter Banker Portal"}
          </button>
        </form>
      </div>
    </main>
  );
}
