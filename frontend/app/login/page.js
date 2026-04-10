"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { saveSessionUser } from "../../lib/session";

const emptySignupForm = {
  fullName: "",
  phoneNumber: "",
  email: "",
  username: "",
  password: "",
};

const emptyLoginForm = {
  username: "",
  password: "",
};

export default function LoginPage() {
  const router = useRouter();
  const [mode, setMode] = useState("login");
  const [loginForm, setLoginForm] = useState(emptyLoginForm);
  const [signupForm, setSignupForm] = useState(emptySignupForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const inputClass =
    "mt-1 w-full rounded-2xl border border-slate-200 bg-white p-3 outline-none transition focus:border-[#006747] focus:ring-4 focus:ring-[#006747]/15";

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const fullName = params.get("fullName");
    const email = params.get("email");

    if (!fullName && !email) {
      return;
    }

    setMode("signup");
    setSignupForm((current) => ({
      ...current,
      fullName: fullName || current.fullName,
      email: email || current.email,
    }));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    const endpoint = mode === "signup" ? "signup" : "login";
    const payload = mode === "signup" ? signupForm : loginForm;

    try {
      const response = await fetch(`http://localhost:8080/api/users/${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const contentType = response.headers.get("content-type") || "";
      const data = contentType.includes("application/json")
        ? await response.json().catch(() => null)
        : await response.text().catch(() => "");

      if (!response.ok) {
        if (typeof data === "string" && data.trim()) {
          setError(data);
          return;
        }

        setError(data?.message || "We couldn't complete that request.");
        return;
      }

      saveSessionUser(data);
      router.push("/dashboard");
    } catch {
      setError("The server is unavailable right now. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function updateForm(setter, key, value) {
    setter((current) => ({
      ...current,
      [key]: value,
    }));
  }

  return (
    <main className="min-h-[calc(100vh-74px)] px-6 py-12">
      <div className="mx-auto grid max-w-5xl gap-8 lg:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[2rem] border border-slate-200 bg-[linear-gradient(145deg,#0b1f19,#006747_60%,#78be20)] p-10 text-white shadow-xl">
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-white/75">
            Online Banking Profile
          </p>
          <h1 className="mt-5 max-w-md text-4xl font-bold leading-tight">
            Sign in to manage every appointment in one place.
          </h1>
          <p className="mt-5 max-w-xl text-base leading-7 text-white/85">
            Create an account to save your contact information, review your upcoming visits, and
            keep a record of previous appointments.
          </p>

          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              "Save your profile in the database",
              "Review scheduled appointments instantly",
              "Track previous branch visits",
            ].map((item) => (
              <div key={item} className="rounded-2xl border border-white/15 bg-white/10 p-4 text-sm">
                {item}
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-[2rem] border border-slate-200 bg-white p-8 shadow-sm">
          <div className="inline-flex rounded-full border border-slate-200 bg-slate-100 p-1">
            <button
              type="button"
              onClick={() => {
                setMode("login");
                setError("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "login" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Login
            </button>
            <button
              type="button"
              onClick={() => {
                setMode("signup");
                setError("");
              }}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                mode === "signup" ? "bg-white text-slate-900 shadow-sm" : "text-slate-500"
              }`}
            >
              Sign Up
            </button>
          </div>

          <div className="mt-6">
            <h2 className="text-2xl font-bold text-slate-900">
              {mode === "signup" ? "Create your account" : "Welcome back"}
            </h2>
            <p className="mt-2 text-sm leading-6 text-slate-600">
              {mode === "signup"
                ? "We will save your profile so your appointments stay connected to your account."
                : "Use your username and password to open your appointment dashboard."}
            </p>
          </div>

          <form className="mt-8 space-y-4" onSubmit={handleSubmit}>
            {mode === "signup" ? (
              <>
                <div>
                  <label className="text-sm font-semibold text-slate-700">Full Name</label>
                  <input
                    className={inputClass}
                    value={signupForm.fullName}
                    onChange={(event) => updateForm(setSignupForm, "fullName", event.target.value)}
                    placeholder="Jane Doe"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Phone Number</label>
                  <input
                    className={inputClass}
                    value={signupForm.phoneNumber}
                    onChange={(event) => updateForm(setSignupForm, "phoneNumber", event.target.value)}
                    placeholder="816-555-0182"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-700">Email</label>
                  <input
                    className={inputClass}
                    type="email"
                    value={signupForm.email}
                    onChange={(event) => updateForm(setSignupForm, "email", event.target.value)}
                    placeholder="jane@email.com"
                    required
                  />
                </div>
              </>
            ) : null}

            <div>
              <label className="text-sm font-semibold text-slate-700">Username</label>
              <input
                className={inputClass}
                value={mode === "signup" ? signupForm.username : loginForm.username}
                onChange={(event) =>
                  updateForm(mode === "signup" ? setSignupForm : setLoginForm, "username", event.target.value)
                }
                placeholder="jane_doe"
                required
              />
            </div>

            <div>
              <label className="text-sm font-semibold text-slate-700">Password</label>
              <input
                className={inputClass}
                type="password"
                value={mode === "signup" ? signupForm.password : loginForm.password}
                onChange={(event) =>
                  updateForm(mode === "signup" ? setSignupForm : setLoginForm, "password", event.target.value)
                }
                placeholder={mode === "signup" ? "At least 8 characters" : "Your password"}
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
              {isSubmitting ? "Please wait..." : mode === "signup" ? "Create Account" : "Login"}
            </button>
          </form>
        </section>
      </div>
    </main>
  );
}
