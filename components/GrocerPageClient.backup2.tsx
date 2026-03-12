"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { GrocerData } from "@/lib/grocer-data";
import StatViz from "@/components/StatViz";

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lighten(hex: string): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 90);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 90);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 90);
  return `rgb(${r},${g},${b})`;
}

function FindingBody({ body, bullets, brand }: { body: string; bullets: string[]; brand: string }) {
  const brandLight = lighten(brand);

  return (
    <div className="flex flex-col gap-4">
      <p
        className="leading-relaxed"
        style={{
          fontSize: "clamp(0.875rem, 1.05vw, 0.95rem)",
          color: "rgba(255,255,255,0.68)",
        }}
      >
        {body}
      </p>

      <div className="flex flex-col gap-2 pt-3" style={{ borderTop: `1px solid rgba(255,255,255,0.06)` }}>
        <p className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: "rgba(255,255,255,0.18)" }}>
          Key Insights
        </p>
        {bullets.map((bullet, bi) => (
          <div
            key={bi}
            className="flex gap-3 items-start px-4 py-3 rounded-xl"
            style={{
              background: "rgba(255,255,255,0.03)",
              border: `1px solid rgba(255,255,255,0.06)`,
            }}
          >
            <span
              className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
              style={{
                background: rgba(brand, 0.15),
                color: brandLight,
                border: `1px solid ${rgba(brand, 0.35)}`,
                fontSize: "10px",
                fontWeight: 900,
              }}
            >
              {bi + 1}
            </span>
            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {bullet}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function GrocerPageClient({ grocer }: { grocer: GrocerData }) {
  const [activeSection, setActiveSection] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs  = useRef<(HTMLElement | null)[]>([]);

  const brand      = grocer.accentColor;
  const brandLight = lighten(brand);
  const total      = grocer.provocations.length;
  const totalSections = total + 2; // hero + findings + end

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const idx = sectionRefs.current.indexOf(entry.target as HTMLElement);
            if (idx !== -1) setActiveSection(idx);
          }
        });
      },
      { root: containerRef.current, threshold: 0.55 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) =>
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div style={{ background: "#050d18", position: "relative" }}>

      {/* ━━━ NAV ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <nav
        className="fixed top-0 left-0 right-0 z-50"
        style={{
          background: "rgba(5,13,24,0.92)",
          backdropFilter: "blur(16px)",
          borderBottom: "1px solid rgba(255,255,255,0.05)",
        }}
      >
        <div className="max-w-screen-xl mx-auto px-8 h-12 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group" style={{ color: "rgba(255,255,255,0.28)" }}>
            <svg className="w-3.5 h-3.5 group-hover:-translate-x-0.5 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-semibold tracking-widest uppercase">Back</span>
          </Link>

          <div className="flex items-center gap-2.5">
            <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
            <span className="text-xs font-black tracking-wide" style={{ color: brandLight }}>{grocer.shortName}</span>
            <span style={{ color: "rgba(255,255,255,0.12)" }}>·</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.28)" }}>
              {activeSection === 0 ? "Overview" : activeSection <= total ? `Finding ${grocer.provocations[activeSection - 1].number}` : "End of Report"}
            </span>
          </div>

          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.16)" }}>INCISIV</span>
            <span style={{ color: "rgba(255,255,255,0.08)", fontSize: "8px" }}>×</span>
            <span className="text-xs" style={{ color: "rgba(255,255,255,0.11)" }}>DIEBOLD NIXDORF</span>
          </div>
        </div>
        <div style={{ height: "1.5px", background: "rgba(255,255,255,0.04)" }}>
          <div style={{
            height: "100%",
            width: `${(activeSection / (totalSections - 1)) * 100}%`,
            background: `linear-gradient(90deg, ${rgba(brand, 0.6)}, ${brandLight})`,
            transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
          }} />
        </div>
      </nav>

      {/* ━━━ SCROLL CONTAINER ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div
        ref={containerRef}
        style={{ height: "100vh", overflowY: "scroll", scrollSnapType: "y mandatory" }}
      >

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            HERO — full-bleed cover, vertically centered, pure typography
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "flex-end",
            paddingTop: "48px",
            paddingBottom: "72px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* full-bleed brand gradient — top portion only */}
          <div style={{
            position: "absolute",
            inset: 0,
            background: `linear-gradient(180deg, ${rgba(brand, 0.16)} 0%, transparent 55%)`,
            pointerEvents: "none",
          }} />

          {/* grocer name — giant centered watermark */}
          <div aria-hidden style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            fontSize: "clamp(120px, 20vw, 260px)",
            fontWeight: 900,
            color: rgba(brand, 0.055),
            letterSpacing: "-0.06em",
            whiteSpace: "nowrap",
            userSelect: "none",
            pointerEvents: "none",
          }}>
            {grocer.shortName.toUpperCase()}
          </div>

          {/* content — sits at bottom third */}
          <div className="relative max-w-screen-xl mx-auto px-12 w-full">

            {/* eyebrow */}
            <div className="flex items-center gap-3 mb-6">
              <div style={{ width: "32px", height: "1.5px", background: brand }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: rgba(brand, 0.8) }}>
                Self-Service Excellence Benchmark · 2025
              </span>
            </div>

            {/* headline — the biggest thing on the page */}
            <h1
              className="font-black text-white mb-8"
              style={{
                fontSize: "clamp(2.2rem, 4.5vw, 4rem)",
                lineHeight: 1.06,
                letterSpacing: "-0.03em",
                maxWidth: "820px",
              }}
            >
              {grocer.heroHeadline}
            </h1>

            {/* divider + stats row */}
            <div
              className="flex items-center gap-12 mb-10 pt-8"
              style={{ borderTop: `1px solid ${rgba(brand, 0.15)}` }}
            >
              {grocer.contextStat.map((s, i) => (
                <div key={s.label} className="flex items-baseline gap-3">
                  <span
                    className="font-black"
                    style={{
                      fontSize: "clamp(1.6rem, 2.5vw, 2.2rem)",
                      color: i === 0 ? brandLight : "rgba(255,255,255,0.55)",
                      letterSpacing: "-0.03em",
                    }}
                  >
                    {s.value}
                  </span>
                  <span className="text-xs leading-tight max-w-[160px]" style={{ color: "rgba(255,255,255,0.3)" }}>
                    {s.label}
                  </span>
                </div>
              ))}
            </div>

            {/* subhead + CTA in a row */}
            <div className="flex items-end justify-between gap-10">
              <p className="text-sm leading-relaxed max-w-xl" style={{ color: "rgba(255,255,255,0.38)" }}>
                {grocer.heroSubheadline}
              </p>
              <button
                onClick={() => scrollTo(1)}
                className="shrink-0 flex items-center gap-2.5 px-7 py-3.5 rounded-lg text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: brand,
                  color: "#fff",
                  boxShadow: `0 6px 28px ${rgba(brand, 0.4)}`,
                  whiteSpace: "nowrap",
                }}
              >
                Explore {total} Findings
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            FINDINGS — title dominates top, stat anchors left, body fills right
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        {grocer.provocations.map((p, i) => (
          <section
            key={p.number}
            ref={(el) => { sectionRefs.current[i + 1] = el; }}
            style={{
              height: "100vh",
              scrollSnapAlign: "start",
              paddingTop: "48px",
              display: "flex",
              flexDirection: "column",
              position: "relative",
              overflow: "hidden",
            }}
          >
            {/* faint brand top line */}
            <div style={{
              position: "absolute",
              top: "48px",
              left: 0,
              right: 0,
              height: "1px",
              background: rgba(brand, 0.12),
            }} />

            {/* ── ZONE 1: Eyebrow + Title ── */}
            <div
              className="shrink-0 px-12 pt-8 pb-6"
              style={{ borderBottom: `1px solid rgba(255,255,255,0.05)` }}
            >
              <div className="max-w-screen-xl mx-auto">
                <p className="text-xs font-bold tracking-widest uppercase mb-3" style={{ color: rgba(brand, 0.6) }}>
                  Finding {p.number} <span style={{ color: "rgba(255,255,255,0.18)" }}>/ {total}</span>
                </p>
                <h2
                  className="font-black text-white"
                  style={{
                    fontSize: "clamp(1.6rem, 2.8vw, 2.4rem)",
                    lineHeight: 1.1,
                    letterSpacing: "-0.025em",
                    maxWidth: "780px",
                  }}
                >
                  {p.title}
                </h2>
              </div>
            </div>

            {/* ── ZONE 2: Hook banner ── */}
            <div className="shrink-0 px-12 py-5" style={{ borderBottom: `1px solid rgba(255,255,255,0.05)`, background: rgba(brand, 0.04) }}>
              <div className="max-w-screen-xl mx-auto flex items-start gap-4">
                <div className="shrink-0 w-0.5 self-stretch rounded-full" style={{ background: rgba(brand, 0.5) }} />
                <p
                  className="leading-relaxed"
                  style={{
                    fontSize: "clamp(1rem, 1.4vw, 1.15rem)",
                    color: "rgba(255,255,255,0.82)",
                    fontStyle: "italic",
                    maxWidth: "860px",
                  }}
                >
                  {p.hook}
                </p>
              </div>
            </div>

            {/* ── ZONE 3: Stat + Body ── */}
            <div className="flex-1 flex min-h-0">
              <div className="max-w-screen-xl mx-auto px-12 w-full flex gap-0">

                {/* LEFT — stat visualization */}
                <div
                  className="w-56 shrink-0 flex flex-col items-center justify-center py-8 pr-10 gap-4"
                  style={{ borderRight: `1px solid rgba(255,255,255,0.05)` }}
                >
                  <StatViz stat={p.stat} brand={brand} size={136} />
                  <p className="text-xs leading-relaxed text-center" style={{ color: "rgba(255,255,255,0.38)" }}>
                    {p.statLabel}
                  </p>
                </div>

                {/* RIGHT — body + interactive insight cards */}
                <div className="flex-1 flex flex-col justify-center py-8 pl-10 min-w-0 overflow-hidden">
                  <FindingBody body={p.body} bullets={p.bullets} brand={brand} />
                </div>
              </div>
            </div>

            {/* ── ZONE 4: Bottom bar ── */}
            <div
              className="shrink-0 px-12 py-4"
              style={{ borderTop: `1px solid rgba(255,255,255,0.05)` }}
            >
              <div className="max-w-screen-xl mx-auto flex items-center justify-between">
                <p className="text-xs" style={{ color: "rgba(255,255,255,0.15)" }}>
                  Source: SSEB 2025 · 131 retail executives · 2,533 shoppers
                </p>
                <div className="flex items-center gap-2">
                  {i > 0 && (
                    <button
                      onClick={() => scrollTo(i)}
                      className="px-3 py-1.5 rounded text-xs font-semibold transition-colors"
                      style={{ color: "rgba(255,255,255,0.22)", background: "rgba(255,255,255,0.04)" }}
                    >
                      ← Prev
                    </button>
                  )}
                  <button
                    onClick={() => scrollTo(i < total - 1 ? i + 2 : total + 1)}
                    className="flex items-center gap-1.5 px-4 py-1.5 rounded text-xs font-bold transition-all duration-150 hover:-translate-y-px"
                    style={{ background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.25)}`, color: brandLight }}
                  >
                    {i < total - 1 ? "Next Finding" : "End of Report"} →
                  </button>
                </div>
              </div>
            </div>
          </section>
        ))}

        {/* ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
            END OF REPORT
        ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
        <section
          ref={(el) => { sectionRefs.current[total + 1] = el; }}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "48px",
            position: "relative",
            overflow: "hidden",
          }}
        >
          <div style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: "700px",
            height: "500px",
            background: `radial-gradient(ellipse, ${rgba(brand, 0.09)} 0%, transparent 65%)`,
            pointerEvents: "none",
          }} />

          <div className="relative flex flex-col items-center text-center max-w-md px-8">
            <div className="flex items-center gap-3 mb-10">
              <div style={{ width: "24px", height: "1px", background: rgba(brand, 0.5) }} />
              <span className="text-xs font-bold tracking-widest uppercase" style={{ color: rgba(brand, 0.6) }}>
                End of Report
              </span>
              <div style={{ width: "24px", height: "1px", background: rgba(brand, 0.5) }} />
            </div>

            <h2
              className="font-black text-white mb-4"
              style={{
                fontSize: "clamp(1.8rem, 3.5vw, 2.75rem)",
                letterSpacing: "-0.025em",
                lineHeight: 1.08,
              }}
            >
              Take the Next Step with {grocer.shortName}
            </h2>

            <p className="text-sm leading-relaxed mb-10" style={{ color: "rgba(255,255,255,0.33)", maxWidth: "360px" }}>
              The full SSEB report includes the complete maturity framework, retailer benchmarking, and a prioritized roadmap built for your scale.
            </p>

            <div className="flex items-stretch gap-3 w-full">
              <button
                className="flex-1 flex flex-col items-center gap-1 px-5 py-5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: brand,
                  color: "#fff",
                  boxShadow: `0 8px 32px ${rgba(brand, 0.35)}`,
                }}
              >
                <span className="text-sm font-bold">Access Full Report</span>
                <span className="text-xs font-normal" style={{ opacity: 0.7 }}>Download the benchmark</span>
              </button>
              <button
                className="flex-1 flex flex-col items-center gap-1 px-5 py-5 rounded-xl font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.65)",
                }}
              >
                <span className="text-sm font-bold">Connect With Us</span>
                <span className="text-xs font-normal" style={{ opacity: 0.6 }}>Talk to an Incisiv advisor</span>
              </button>
            </div>

            <button
              onClick={() => scrollTo(0)}
              className="mt-8 text-xs font-semibold hover:opacity-60 transition-opacity"
              style={{ color: "rgba(255,255,255,0.18)" }}
            >
              ↑ Back to top
            </button>
          </div>

          <div className="absolute bottom-0 left-0 right-0 px-8 py-4" style={{ borderTop: "1px solid rgba(255,255,255,0.04)" }}>
            <div className="max-w-screen-xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="text-xs font-black" style={{ color: "rgba(255,255,255,0.18)" }}>INCISIV</span>
                <span style={{ color: "rgba(255,255,255,0.08)", fontSize: "8px" }}>×</span>
                <span className="text-xs" style={{ color: "rgba(255,255,255,0.13)" }}>DIEBOLD NIXDORF</span>
              </div>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>SSEB 2025 · Personalized for {grocer.name}</p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.09)" }}>© 2025 Incisiv</p>
            </div>
          </div>
        </section>

      </div>

      {/* ━━━ SIDE DOTS ━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━ */}
      <div className="fixed right-4 top-1/2 -translate-y-1/2 z-50 flex flex-col items-center gap-1.5">
        {Array.from({ length: totalSections }).map((_, i) => (
          <button
            key={i}
            onClick={() => scrollTo(i)}
            style={{
              width: "3px",
              height: activeSection === i ? "24px" : "5px",
              borderRadius: "2px",
              background: activeSection === i ? brandLight : rgba(brand, 0.2),
              transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
              padding: 0,
              cursor: "pointer",
            }}
          />
        ))}
      </div>

    </div>
  );
}
