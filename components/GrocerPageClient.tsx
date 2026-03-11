"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import type { GrocerData } from "@/lib/grocer-data";

/** Converts a hex color + alpha → rgba string */
function rgba(hex: string, alpha: number): string {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgba(${r},${g},${b},${alpha})`;
}

/** Lightens a hex color by mixing it with white */
function lighten(hex: string): string {
  const r = Math.min(255, parseInt(hex.slice(1, 3), 16) + 80);
  const g = Math.min(255, parseInt(hex.slice(3, 5), 16) + 80);
  const b = Math.min(255, parseInt(hex.slice(5, 7), 16) + 80);
  return `rgb(${r},${g},${b})`;
}

export default function GrocerPageClient({ grocer }: { grocer: GrocerData }) {
  const [activeSection, setActiveSection] = useState(0);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  const brand = grocer.accentColor;
  const brandLight = lighten(brand);

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
      { rootMargin: "-40% 0px -40% 0px", threshold: 0 }
    );
    sectionRefs.current.forEach((ref) => ref && observer.observe(ref));
    return () => observer.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    sectionRefs.current[idx]?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <div
      className="min-h-screen noise-bg"
      style={{
        // Subtle brand color tint in the hero gradient
        background: `linear-gradient(160deg, ${rgba(brand, 0.04)} 0%, #070f1a 30%, #040d16 100%)`,
      }}
    >
      {/* ── STICKY NAV ─────────────────────────────────────────────────────── */}
      <nav
        className="sticky top-0 z-50 px-4 py-3 border-b"
        style={{
          background: `rgba(4,13,22,0.88)`,
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
            <span
              className="text-xs font-bold tracking-widest uppercase hidden sm:block"
              style={{ color: rgba(brand, 0.6) }}
            >
              SSEB
            </span>
          </Link>

          {/* Grocer brand pill */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-full shrink-0"
            style={{ background: rgba(brand, 0.12), border: `1px solid ${rgba(brand, 0.3)}` }}
          >
            <div
              className="w-2 h-2 rounded-full"
              style={{ background: brand }}
            />
            <span className="text-xs font-bold" style={{ color: brandLight }}>
              {grocer.shortName}
            </span>
          </div>

          {/* Section pills */}
          <div className="hidden md:flex items-center gap-1 overflow-x-auto flex-1 justify-center">
            {grocer.provocations.map((p, i) => (
              <button
                key={i}
                onClick={() => scrollTo(i)}
                className="shrink-0 px-3 py-1.5 rounded-lg text-xs font-bold transition-all duration-200"
                style={{
                  background: activeSection === i ? rgba(brand, 0.15) : "transparent",
                  color: activeSection === i ? brandLight : "rgba(255,255,255,0.3)",
                  border: activeSection === i ? `1px solid ${rgba(brand, 0.35)}` : "1px solid transparent",
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

      {/* ── HERO ───────────────────────────────────────────────────────────── */}
      <section className="px-6 pt-16 pb-14 max-w-5xl mx-auto">
        {/* Brand eyebrow */}
        <div
          className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full mb-8 animate-fade-up"
          style={{ background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.25)}` }}
        >
          <div className="w-1.5 h-1.5 rounded-full" style={{ background: brand }} />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: brandLight }}>
            {grocer.name} · Strategic Intelligence
          </span>
        </div>

        <h1
          className="animate-fade-up animate-delay-100 text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight leading-[1.05] text-white mb-6 max-w-4xl"
        >
          {grocer.heroHeadline}
        </h1>

        <p
          className="animate-fade-up animate-delay-200 text-lg leading-relaxed max-w-3xl mb-10"
          style={{ color: "rgba(255,255,255,0.45)" }}
        >
          {grocer.heroSubheadline}
        </p>

        {/* Context stats — brand colored */}
        <div className="animate-fade-up animate-delay-300 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl">
          {grocer.contextStat.map((s) => (
            <div
              key={s.label}
              className="p-5 rounded-2xl"
              style={{
                background: rgba(brand, 0.06),
                border: `1px solid ${rgba(brand, 0.18)}`,
              }}
            >
              <div className="text-3xl font-black mb-1" style={{ color: brandLight }}>
                {s.value}
              </div>
              <div className="text-xs leading-relaxed" style={{ color: "rgba(255,255,255,0.4)" }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── DIVIDER ────────────────────────────────────────────────────────── */}
      <div className="px-6 max-w-5xl mx-auto mb-2">
        <div className="flex items-center gap-4">
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(90deg, ${rgba(brand, 0.4)}, transparent)` }}
          />
          <span className="text-xs font-bold tracking-widest uppercase" style={{ color: "rgba(255,255,255,0.2)" }}>
            Key Findings
          </span>
          <div
            className="h-px flex-1"
            style={{ background: `linear-gradient(270deg, ${rgba(brand, 0.4)}, transparent)` }}
          />
        </div>
      </div>

      {/* ── INSIGHT SECTIONS ───────────────────────────────────────────────── */}
      <div className="px-6 pb-20 max-w-5xl mx-auto space-y-6 mt-8">
        {grocer.provocations.map((p, i) => (
          <section
            key={p.number}
            ref={(el) => { sectionRefs.current[i] = el; }}
            id={`insight-${p.number}`}
            className="relative rounded-3xl overflow-hidden"
            style={{
              background: "rgba(10,25,42,0.55)",
              border: `1px solid ${rgba(brand, 0.12)}`,
            }}
          >
            {/* Brand color top accent */}
            <div
              className="absolute top-0 left-0 right-0 h-0.5"
              style={{
                background: `linear-gradient(90deg, ${rgba(brand, 0.7)} 0%, ${rgba(brand, 0.15)} 60%, transparent 100%)`,
              }}
            />

            <div className="p-8 sm:p-10 lg:p-12">
              {/* Number + Title */}
              <div className="flex items-start gap-5 mb-6">
                <div
                  className="shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-sm font-black"
                  style={{
                    background: rgba(brand, 0.12),
                    border: `1px solid ${rgba(brand, 0.3)}`,
                    color: brandLight,
                  }}
                >
                  {p.number}
                </div>
                <div>
                  <div
                    className="text-xs font-bold tracking-widest uppercase mb-1"
                    style={{ color: rgba(brand, 0.7) }}
                  >
                    Finding {p.number}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-white leading-tight">
                    {p.title}
                  </h2>
                </div>
              </div>

              {/* Hook — brand accent border */}
              <blockquote
                className="text-xl sm:text-2xl font-bold leading-snug mb-6 pl-5"
                style={{
                  color: "rgba(255,255,255,0.92)",
                  borderLeft: `3px solid ${rgba(brand, 0.6)}`,
                }}
              >
                {p.hook}
              </blockquote>

              {/* Body */}
              <p
                className="text-base leading-relaxed mb-8"
                style={{ color: "rgba(255,255,255,0.55)" }}
              >
                {p.body}
              </p>

              {/* Stat callout + bullets */}
              <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
                {/* Stat — brand colored */}
                <div
                  className="lg:col-span-2 p-6 rounded-2xl flex flex-col justify-center"
                  style={{
                    background: rgba(brand, 0.08),
                    border: `1px solid ${rgba(brand, 0.2)}`,
                  }}
                >
                  <div
                    className="text-4xl sm:text-5xl font-black leading-none mb-3"
                    style={{ color: brandLight }}
                  >
                    {p.stat}
                  </div>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>
                    {p.statLabel}
                  </p>
                </div>

                {/* Bullets */}
                <div className="lg:col-span-3 space-y-4">
                  {p.bullets.map((bullet, bi) => (
                    <div key={bi} className="flex gap-3">
                      <div
                        className="shrink-0 w-5 h-5 rounded-full flex items-center justify-center mt-0.5"
                        style={{
                          background: rgba(brand, 0.1),
                          border: `1px solid ${rgba(brand, 0.25)}`,
                        }}
                      >
                        <div
                          className="w-1.5 h-1.5 rounded-full"
                          style={{ background: brand }}
                        />
                      </div>
                      <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.6)" }}>
                        {bullet}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

              {/* CTA row */}
              <div
                className="flex items-center justify-between pt-6"
                style={{ borderTop: "1px solid rgba(255,255,255,0.05)" }}
              >
                <p className="text-sm italic" style={{ color: "rgba(255,255,255,0.2)" }}>
                  Source: SSEB 2025 — 131 retail executives · 2,533 shoppers
                </p>
                <button
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-bold transition-all duration-200 hover:-translate-y-0.5"
                  style={{
                    background: rgba(brand, 0.12),
                    border: `1px solid ${rgba(brand, 0.3)}`,
                    color: brandLight,
                  }}
                  onMouseEnter={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = rgba(brand, 0.22);
                  }}
                  onMouseLeave={(e) => {
                    (e.currentTarget as HTMLButtonElement).style.background = rgba(brand, 0.12);
                  }}
                >
                  {p.cta}
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* ── FOOTER CTA ─────────────────────────────────────────────────────── */}
      <section
        className="px-6 py-16 text-center"
        style={{
          background: rgba(brand, 0.04),
          borderTop: `1px solid ${rgba(brand, 0.12)}`,
        }}
      >
        <div className="max-w-2xl mx-auto">
          <h3 className="text-3xl font-black text-white mb-4">
            Ready to go deeper with {grocer.shortName}?
          </h3>
          <p className="text-base mb-8" style={{ color: "rgba(255,255,255,0.4)" }}>
            The full Self-Service Excellence Benchmark report is available now — 131 retail executives, 2,533 shoppers, and a comprehensive maturity framework built for operators at your scale.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <button
              className="px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5"
              style={{
                background: `linear-gradient(135deg, ${brandLight}, ${brand})`,
                color: "#040d16",
                boxShadow: `0 0 30px ${rgba(brand, 0.3)}`,
              }}
            >
              Access the Full Benchmark Report
            </button>
            <Link
              href="/"
              className="px-8 py-4 rounded-2xl text-base font-bold transition-all duration-200 hover:-translate-y-0.5"
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
      </section>

      {/* Footer */}
      <footer className="px-6 py-8 border-t" style={{ borderColor: "rgba(255,255,255,0.05)" }}>
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
      </footer>
    </div>
  );
}
