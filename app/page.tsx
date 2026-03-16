import Image from "next/image";
import LoginForm from "@/components/LoginForm";
import NetworkBackground from "@/components/NetworkBackground";

export default function HomePage() {
  return (
    <main
      className="h-screen flex flex-col overflow-hidden"
      style={{ position: "relative", background: "transparent" }}
    >
      <NetworkBackground />

      {/* Header */}
      <header
        className="relative z-10 px-6 py-4 shrink-0"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-5xl mx-auto flex items-center justify-between">
          <div className="flex items-center">
            <Image
              src="/diebold-nixdorf-logo.png"
              alt="Diebold Nixdorf"
              width={64}
              height={21}
              style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.9 }}
            />
          </div>
          <div
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full"
            style={{
              background: "rgba(255,255,255,0.1)",
              border: "1px solid rgba(255,255,255,0.2)",
              backdropFilter: "blur(8px)",
            }}
          >
            <span
              className="w-1.5 h-1.5 rounded-full"
              style={{ background: "rgba(255,255,255,0.9)", animation: "pulse 2s ease-in-out infinite" }}
            />
            <span className="text-xs font-semibold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.9)" }}>
              Self-Service Excellence Benchmark
            </span>
          </div>
        </div>
      </header>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-6 relative z-10">
        <div className="w-full max-w-lg">

          {/* Eyebrow */}
          <div className="text-center mb-6">
            <h1 className="animate-fade-up text-4xl sm:text-5xl font-black tracking-tight leading-[1.08] text-white mb-4">
              Your Self-Service{" "}
              <span style={{
                background: "linear-gradient(135deg, #ffffff 0%, rgba(255,255,255,0.7) 100%)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
                backgroundClip: "text",
              }}>
                Intelligence Report
              </span>
            </h1>

            <p
              className="animate-fade-up animate-delay-200 text-base leading-relaxed"
              style={{ color: "rgba(255,255,255,0.65)" }}
            >
              Enter your work email to access findings from the SSEB tailored to your organization&apos;s competitive context.
            </p>
          </div>

          {/* Login card — glassmorphism */}
          <div
            className="animate-fade-up animate-delay-300 rounded-2xl p-6"
            style={{
              background: "rgba(255,255,255,0.08)",
              border: "1px solid rgba(255,255,255,0.18)",
              backdropFilter: "blur(24px)",
              WebkitBackdropFilter: "blur(24px)",
              boxShadow: "0 8px 32px rgba(0,0,0,0.25), inset 0 1px 0 rgba(255,255,255,0.15)",
            }}
          >
            <LoginForm />
          </div>

          {/* Trust strip */}
          <div className="animate-fade-up animate-delay-400 mt-4 grid grid-cols-3 gap-3 text-center">
            {[
              { value: "131",   label: "Retail Executives" },
              { value: "2,533", label: "Shoppers Surveyed" },
              { value: "6",     label: "Strategic Insights" },
            ].map((s) => (
              <div
                key={s.label}
                className="p-3 rounded-xl"
                style={{
                  background: "rgba(255,255,255,0.07)",
                  border: "1px solid rgba(255,255,255,0.12)",
                  backdropFilter: "blur(12px)",
                }}
              >
                <div className="text-xl font-black text-white">{s.value}</div>
                <div className="text-xs mt-0.5" style={{ color: "rgba(255,255,255,0.55)" }}>{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer
        className="shrink-0 px-6 py-5 relative z-10"
        style={{ borderTop: "1px solid rgba(255,255,255,0.1)" }}
      >
        <div className="max-w-5xl mx-auto flex justify-center">
          <p className="text-xs" style={{ color: "rgba(255,255,255,0.3)" }}>
            © 2026. All rights reserved.
          </p>
        </div>
      </footer>
    </main>
  );
}
