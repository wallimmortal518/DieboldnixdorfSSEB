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

    // Small delay for UX polish
    await new Promise((r) => setTimeout(r, 600));

    const grocerId = getGrocerIdFromEmail(email);

    if (!grocerId) {
      setLoading(false);
      setError(
        "We don't recognize your organization's email domain. Please contact your Incisiv representative to get access."
      );
      return;
    }

    router.push(`/${grocerId}`);
  }

  return (
    <div className="w-full max-w-md mx-auto">
      <form onSubmit={handleSubmit} noValidate>
        <div className="space-y-4">
          {/* Name field */}
          <div>
            <label
              htmlFor="name"
              className="block text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.45)" }}
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
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 text-sm transition-all duration-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(0,191,165,0.5)";
                e.currentTarget.style.background = "rgba(0,191,165,0.05)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            />
          </div>

          {/* Email field */}
          <div>
            <label
              htmlFor="email"
              className="block text-xs font-semibold tracking-wider uppercase mb-2"
              style={{ color: "rgba(255,255,255,0.45)" }}
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
              className="w-full px-4 py-3.5 rounded-xl text-white placeholder-white/20 text-sm transition-all duration-200 outline-none"
              style={{
                background: "rgba(255,255,255,0.05)",
                border: "1px solid rgba(255,255,255,0.1)",
              }}
              onFocus={(e) => {
                e.currentTarget.style.border = "1px solid rgba(0,191,165,0.5)";
                e.currentTarget.style.background = "rgba(0,191,165,0.05)";
              }}
              onBlur={(e) => {
                e.currentTarget.style.border = "1px solid rgba(255,255,255,0.1)";
                e.currentTarget.style.background = "rgba(255,255,255,0.05)";
              }}
            />
            <p className="mt-1.5 text-xs" style={{ color: "rgba(255,255,255,0.2)" }}>
              Your organization is identified automatically from your email domain.
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div
              className="px-4 py-3 rounded-xl text-sm leading-relaxed"
              style={{ background: "rgba(239,68,68,0.1)", border: "1px solid rgba(239,68,68,0.25)", color: "#fca5a5" }}
            >
              {error}
            </div>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 rounded-xl text-sm font-bold transition-all duration-200 relative overflow-hidden"
            style={{
              background: loading
                ? "rgba(0,191,165,0.3)"
                : "linear-gradient(135deg, #4ef0db 0%, #00bfa5 100%)",
              color: loading ? "rgba(255,255,255,0.5)" : "#040d16",
              cursor: loading ? "not-allowed" : "pointer",
              boxShadow: loading ? "none" : "0 0 30px rgba(0,191,165,0.25)",
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
