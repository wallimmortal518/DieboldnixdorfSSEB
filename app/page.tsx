import LoginForm from "@/components/LoginForm";

export default function HomePage() {
  return (
    <main
      className="min-h-screen flex flex-col noise-bg"
      style={{ background: "linear-gradient(160deg, #040d16 0%, #070f1a 60%, #040d16 100%)" }}
    >
      {/* Header */}
      <header className="border-b px-6 py-4 shrink-0" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-white font-black tracking-tighter text-sm">INCISIV</span>
            <span style={{ color: "rgba(255,255,255,0.15)", fontSize: "10px" }}>×</span>
            <span className="font-semibold tracking-tight text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>
              DIEBOLD NIXDORF
            </span>
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{ background: "rgba(0,191,165,0.08)", border: "1px solid rgba(0,191,165,0.18)" }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "#00bfa5", animation: "pulse 2s ease-in-out infinite" }}
            />
            <span className="text-xs font-semibold" style={{ color: "#4ef0db" }}>
              2025 Benchmark Report
            </span>
          </div>
        </div>
      </header>

      {/* Main — centered vertically */}
      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <div className="w-full max-w-lg">
          {/* Eyebrow */}
          <div className="text-center mb-10">
            <div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 animate-fade-up"
              style={{ background: "rgba(0,191,165,0.08)", border: "1px solid rgba(0,191,165,0.15)" }}
            >
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "#00bfa5" }}>
                Self-Service Excellence Benchmark
              </span>
            </div>

            <h1
              className="animate-fade-up animate-delay-100 text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] text-white mb-4"
            >
              Your Self-Service{" "}
              <span className="text-gradient-teal">Intelligence Report</span>
            </h1>

            <p
              className="animate-fade-up animate-delay-200 text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.4)" }}
            >
              Enter your work email to access findings from the SSEB tailored to your organization's competitive context.
            </p>
          </div>

          {/* Login card */}
          <div
            className="animate-fade-up animate-delay-300 rounded-2xl p-8"
            style={{
              background: "rgba(10,25,42,0.6)",
              border: "1px solid rgba(255,255,255,0.08)",
              backdropFilter: "blur(16px)",
            }}
          >
            <LoginForm />
          </div>

          {/* Trust strip */}
          <div className="animate-fade-up animate-delay-400 mt-8 grid grid-cols-3 gap-3 text-center">
            {[
              { value: "131", label: "Retail Executives" },
              { value: "2,533", label: "Shoppers Surveyed" },
              { value: "6", label: "Strategic Insights" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-xl"
                style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.05)" }}
              >
                <div className="text-xl font-black" style={{ color: "#4ef0db" }}>{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.3)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="shrink-0 px-6 py-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-3">
            <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>INCISIV</span>
            <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "10px" }}>×</span>
            <span className="font-semibold text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>DIEBOLD NIXDORF</span>
          </div>
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
            Research conducted June–July 2025 · © 2025 Incisiv. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
