"use client";

import { useState, FormEvent } from "react";
import { useRouter } from "next/navigation";
import { getGrocerIdFromEmail, isValidEmail } from "@/lib/domain-map";

export default function LoginForm() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setError("");

    if (!name.trim()) {
      setError("Please enter your name.");
      return;
    }
    if (!isValidEmail(email)) {
      setError("Please enter a valid work email address.");
      return;
    }

    setLoading(true);
    await new Promise((r) => setTimeout(r, 600));

    const grocerId = getGrocerIdFromEmail(email);

    if (!grocerId) {
      setLoading(false);
      setError(
        "We don't recognize your organization's email domain. Please contact your Incisiv representative to get access."
      );
      return;
    }

    sessionStorage.setItem("sseb_grocer_id", grocerId);
    router.push(`/${grocerId}`);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-3">

          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Your Name
            </label>
            <input
              id="name"
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Jane Smith"
              autoComplete="name"
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm transition-all duration-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                WebkitTextFillColor: "#fff",
                caretColor: "#fff",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.5)";
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.7)" }}
            >
              Work Email
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="jane@yourcompany.com"
              autoComplete="email"
              className="w-full px-4 py-3.5 rounded-xl text-white text-sm transition-all duration-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,255,255,0.18)",
                backdropFilter: "blur(8px)",
                color: "#fff",
                WebkitTextFillColor: "#fff",
                caretColor: "#fff",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.5)";
                e.currentTarget.style.background = "rgba(255,255,255,0.13)";
                e.currentTarget.style.boxShadow = "0 0 0 3px rgba(255,255,255,0.06)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.18)";
                e.currentTarget.style.background = "rgba(255,255,255,0.08)";
                e.currentTarget.style.boxShadow = "none";
              }}
            />
            <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.4)" }}>
              Your organization is identified automatically from your email domain.
            </p>
          </div>

          {/* Error */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm leading-relaxed"
              style={{
                background: "rgba(255,255,255,0.08)",
                border: "1px solid rgba(255,100,100,0.4)",
                color: "#ffb3b3",
              }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-bold transition-all duration-200"
            style={{
              background: loading
                ? "rgba(255,255,255,0.15)"
                : "rgba(255,255,255,0.92)",
              color: loading ? "rgba(255,255,255,0.5)" : "#1a0a2e",
              cursor: loading ? "not-allowed" : "pointer",
              border: "1px solid rgba(255,255,255,0.3)",
              boxShadow: loading ? "none" : "0 4px 20px rgba(0,0,0,0.2), inset 0 1px 0 rgba(255,255,255,0.5)",
              backdropFilter: "blur(8px)",
            }}
            onMouseEnter={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background = "#fff";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(-1px)";
              }
            }}
            onMouseLeave={(e) => {
              if (!loading) {
                (e.currentTarget as HTMLButtonElement).style.background = "rgba(255,255,255,0.92)";
                (e.currentTarget as HTMLButtonElement).style.transform = "translateY(0)";
              }
            }}
          >
            {loading ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Identifying your organization…
              </span>
            ) : (
              "Access Your Report →"
            )}
          </button>

        </div>
      </form>
    </div>
  );
}
