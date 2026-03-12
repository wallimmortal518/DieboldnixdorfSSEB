"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { GrocerData } from "@/lib/grocer-data";

function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

function lighten(hex: string): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 80);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 80);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 80);
  return `rgb(${r},${g},${b})`;
}

export default function GrocerPageClient({ grocer }: { grocer: GrocerData }) {
  const [activeSection, setActiveSection] = useState(0); // 0 = hero, 1..n = findings
  const containerRef = useRef<HTMLDivElement>(null);
  const sectionRefs  = useRef<(HTMLElement | null)[]>([]);

  const brand      = grocer.accentColor;
  const brandLight = lighten(brand);

  // Track which section is snapped into view
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
      { root: containerRef.current, threshold: 0.6 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollToSection = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const totalSections = grocer.provocations.length + 1; // hero + findings

  return (
    <div
      style={{
        background: `linear-gradient(160deg, ${rgba(brand, 0.04)} 0%, #070f1a 30%, #040d16 100%)`,
        position: "relative",
      }}
    >
      {/* ── STICKY NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="fixed top-0 left-0 right-0 z-50 px-6 py-3 border-b"
        style={{
          background: "rgba(4,13,22,0.88)",
          backdropFilter: "blur(20px)",
          borderColor: "rgba(255,255,255,0.06)",
        }}
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between gap-4">
          {/* Back */}
          <Link href="/" className="flex items-center gap-1.5 group shrink-0">
            <svg
              className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform"
              style={{ color: rgba(brand, 0.7) }}
              fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
            </svg>
            <span className="text-xs font-bold tracking-widest uppercase hidden sm:block" style={{ color: rgba(brand, 0.6) }}>
              SSEB
            </span>
          </Link>

          {/* Grocer pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
            style={{ background: rgba(brand, 0.12), border: `1px solid ${rgba(brand, 0.3)}` }}
          >
            <div className="w-2 h-2 rounded-full" style={{ background: brand }} />
            <span className="text-xs font-bold" style={{ color: brandLight }}>{grocer.shortName}</span>
          </div>

          {/* Finding pills */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto flex-1 justify-center">
            {grocer.provocations.map((p, i) => (
              <button
                key={i}
                onClick={() => scrollToSection(i + 1)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: activeSection === i + 1 ? rgba(brand, 0.15) : "transparent",
                  color:      activeSection === i + 1 ? brandLight : "rgba(255,255,255,0.3)",
                  border:     activeSection === i + 1 ? `1px solid ${rgba(brand, 0.35)}` : "1px solid transparent",
                }}
              >
                {p.number}
              </button>
            ))}
          </div>

          <div className="hidden sm:flex items-center gap-1.5 shrink-0">
            <span className="text-xs font-bold" style={{ color: "rgba(255,255,255,0.2)" }}>INCISIV</span>
            <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "9px" }}>×</span>
            <span className="text-xs font-semibold" style={{ color: "rgba(255,255,255,0.15)" }}>DIEBOLD NIXDORF</span>
          </div>
        </div>
      </nav>

      {/* ── SCROLL CONTAINER ───────────────────────────────────────────────── */}
      <div
        ref={containerRef}
        style={{
          height: "100vh",
          overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollBehavior: "smooth",
        }}
      >
        {/* ── HERO SECTION ─────────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current[0] = el; }}
          style={{
            height: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: "72px", // nav height
          }}
        >
          <div className="max-w-7xl mx-auto px-6 w-full">
            <div className="max-w-4xl">
              {/* Eyebrow */}
              <div
                className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 animate-fade-up"
                style={{ background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.25)}` }}
              >
                <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
                <span className="text-xs font-bold tracking-widest uppercase" style={{ color: brandLight }}>
                  {grocer.name} · Strategic Intelligence
                </span>
              </div>

              <h1 className="animate-fade-up animate-delay-100 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-6">
                {grocer.heroHeadline}
              </h1>

              <p className="animate-fade-up animate-delay-200 text-lg leading-relaxed mb-12 max-w-3xl" style={{ color: "rgba(255,255,255,0.45)" }}>
                {grocer.heroSubheadline}
              </p>
            </div>

            {/* Stats strip */}
            <div
              className="animate-fade-up animate-delay-300 grid grid-cols-1 sm:grid-cols-3 gap-px rounded-2xl overflow-hidden"
              style={{ background: rgba(brand, 0.15), maxWidth: "860px" }}
            >
              {grocer.contextStat.map((s, i) => (
                <div
                  key={s.label}
                  className="p-8"
                  style={{ background: i === 1 ? rgba(brand, 0.1) : "#070f1a" }}
                >
                  <div className="text-4xl sm:text-5xl font-black mb-2" style={{ color: brandLight }}>
                    {s.value}
                  </div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.45)" }}>
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* Scroll hint */}
            <div className="mt-12 flex items-center gap-3 animate-fade-up animate-delay-400">
              <button
                onClick={() => scrollToSection(1)}
                className="flex items-center gap-2 text-xs font-bold tracking-widest uppercase transition-all duration-200 hover:gap-3"
                style={{ color: rgba(brand, 0.6) }}
              >
                Explore {grocer.provocations.length} Key Findings
                <svg className="w-4 h-4 animate-bounce" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            </div>
          </div>
        </section>

        {/* ── FINDING SECTIONS ───────────────────────────────────────────────── */}
        {grocer.provocations.map((p, i) => {
          const isEven   = i % 2 === 0;
          const isActive = activeSection === i + 1;

          return (
            <section
              key={p.number}
              ref={(el) => { sectionRefs.current[i + 1] = el; }}
              id={`insight-${p.number}`}
              style={{
                height: "100vh",
                scrollSnapAlign: "start",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                paddingTop: "72px",
                position: "relative",
                opacity: isActive ? 1 : 0.96,
                transition: "opacity 0.4s ease",
              }}
            >
              {/* Brand top accent */}
              <div
                style={{
                  position: "absolute",
                  top: "72px",
                  left: 0,
                  right: 0,
                  height: "1px",
                  background: `linear-gradient(90deg, transparent, ${rgba(brand, 0.4)}, transparent)`,
                }}
              />

              <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col justify-center gap-6">

                {/* ── ROW 1: Number + Title + Hook ── */}
                <div className="flex items-start gap-6">
                  <div
                    className="shrink-0 w-14 h-14 rounded-2xl flex items-center justify-center text-sm font-black"
                    style={{ background: rgba(brand, 0.12), border: `1px solid ${rgba(brand, 0.3)}`, color: brandLight }}
                  >
                    {p.number}
                  </div>
                  <div className="flex-1">
                    <div className="text-xs font-bold tracking-widest uppercase mb-1" style={{ color: rgba(brand, 0.7) }}>
                      Finding {p.number} of {grocer.provocations.length}
                    </div>
                    <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-white leading-tight">
                      {p.title}
                    </h2>
                  </div>
                </div>

                {/* ── ROW 2: Stat + Hook + Body ── 3-col */}
                <div className={`grid grid-cols-1 lg:grid-cols-3 gap-6`}>
                  {/* Stat */}
                  <div
                    className="flex flex-col justify-center p-8 rounded-2xl"
                    style={{ background: rgba(brand, 0.07), border: `1px solid ${rgba(brand, 0.15)}` }}
                  >
                    <div className="text-6xl sm:text-7xl font-black leading-none mb-3" style={{ color: brandLight }}>
                      {p.stat}
                    </div>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {p.statLabel}
                    </p>
                  </div>

                  {/* Hook + Body */}
                  <div className="lg:col-span-2 flex flex-col gap-4 justify-center">
                    <blockquote
                      className="text-lg sm:text-xl font-bold leading-snug pl-5"
                      style={{ color: "rgba(255,255,255,0.92)", borderLeft: `3px solid ${rgba(brand, 0.6)}` }}
                    >
                      {p.hook}
                    </blockquote>
                    <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                      {p.body}
                    </p>
                  </div>
                </div>

                {/* ── ROW 3: Bullets ── */}
                <div
                  className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4"
                  style={{ borderTop: `1px solid ${rgba(brand, 0.1)}` }}
                >
                  {p.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-3">
                      <div
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        style={{ background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.25)}` }}
                      >
                        <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>

                {/* ── ROW 4: CTA + nav ── */}
                <div className="flex items-center justify-between">
                  <p className="text-xs italic" style={{ color: "rgba(255,255,255,0.18)" }}>
                    Source: SSEB 2025 — 131 retail executives · 2,533 shoppers
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                      style={{ background: rgba(brand, 0.12), border: `1px solid ${rgba(brand, 0.3)}`, color: brandLight }}
                      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.background = rgba(brand, 0.22); }}
                      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.background = rgba(brand, 0.12); }}
                    >
                      {p.cta}
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                      </svg>
                    </button>
                    {/* Next finding */}
                    {i < grocer.provocations.length - 1 && (
                      <button
                        onClick={() => scrollToSection(i + 2)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
                      >
                        Next
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                    {/* Last finding — show footer CTA */}
                    {i === grocer.provocations.length - 1 && (
                      <button
                        onClick={() => scrollToSection(i + 2)}
                        className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                        style={{ background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.2)}`, color: brandLight }}
                      >
                        Full Report
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </section>
          );
        })}

        {/* ── FOOTER CTA SECTION ─────────────────────────────────────────────── */}
        <section
          ref={(el) => { sectionRefs.current[totalSections] = el; }}
          style={{
            minHeight: "100vh",
            scrollSnapAlign: "start",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            paddingTop: "72px",
            background: rgba(brand, 0.04),
            borderTop: `1px solid ${rgba(brand, 0.12)}`,
          }}
        >
          <div className="max-w-2xl mx-auto px-6 text-center">
            <h3 className="text-4xl font-black text-white mb-6">
              Ready to go deeper with {grocer.shortName}?
            </h3>
            <p className="text-lg mb-12" style={{ color: "rgba(255,255,255,0.4)" }}>
              The full Self-Service Excellence Benchmark report is available now — 131 retail executives, 2,533 shoppers, and a comprehensive maturity framework built for operators at your scale.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <button
                className="px-10 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: `linear-gradient(135deg, ${brandLight}, ${brand})`,
                  color: "#040d16",
                  boxShadow: `0 0 40px ${rgba(brand, 0.35)}`,
                }}
              >
                Access the Full Benchmark Report
              </button>
              <Link
                href="/"
                className="px-10 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{
                  background: "rgba(255,255,255,0.05)",
                  border: "1px solid rgba(255,255,255,0.1)",
                  color: "rgba(255,255,255,0.55)",
                }}
              >
                ← Back to Login
              </Link>
            </div>
          </div>

          {/* Footer */}
          <div className="absolute bottom-0 left-0 right-0 px-6 py-6 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
            <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="flex items-center gap-3">
                <span className="font-black text-sm" style={{ color: "rgba(255,255,255,0.3)" }}>INCISIV</span>
                <span style={{ color: "rgba(255,255,255,0.1)", fontSize: "9px" }}>×</span>
                <span className="font-bold text-sm" style={{ color: "rgba(255,255,255,0.2)" }}>DIEBOLD NIXDORF</span>
              </div>
              <p className="text-xs text-center" style={{ color: "rgba(255,255,255,0.18)" }}>
                Self-Service Excellence Benchmark · 2025 · Personalized for {grocer.name}
              </p>
              <p className="text-xs" style={{ color: "rgba(255,255,255,0.12)" }}>© 2025 Incisiv</p>
            </div>
          </div>
        </section>
      </div>

      {/* ── SIDE PROGRESS DOTS ─────────────────────────────────────────────── */}
      <div
        className="fixed right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-2.5"
        style={{ display: "flex" }}
      >
        {[...Array(totalSections)].map((_, i) => (
          <button
            key={i}
            onClick={() => scrollToSection(i)}
            style={{
              width:         activeSection === i ? "8px" : "5px",
              height:        activeSection === i ? "8px" : "5px",
              borderRadius:  "50%",
              background:    activeSection === i ? brandLight : rgba(brand, 0.3),
              border:        activeSection === i ? `1px solid ${rgba(brand, 0.5)}` : "none",
              transition:    "all 0.3s ease",
              padding:       0,
              cursor:        "pointer",
            }}
          />
        ))}
      </div>
    </div>
  );
}
