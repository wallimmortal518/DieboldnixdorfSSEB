"use client";

import type { Provocation } from "@/lib/grocer-data";

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

interface Props {
  p: Provocation;
  i: number;
  total: number;
  brand: string;
  sectionRef: (el: HTMLElement | null) => void;
  onNext: () => void;
  onFullReport: () => void;
  isLast: boolean;
}

export default function FindingLayoutB({ p, i, total, brand, sectionRef, onNext, onFullReport, isLast }: Props) {
  const brandLight = lighten(brand);

  return (
    <section
      ref={sectionRef}
      id={`insight-${p.number}`}
      style={{
        height: "100vh",
        scrollSnapAlign: "start",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        paddingTop: "72px",
        position: "relative",
      }}
    >
      {/* Top accent line */}
      <div style={{
        position: "absolute",
        top: "72px",
        left: 0,
        right: 0,
        height: "1px",
        background: `linear-gradient(90deg, transparent, ${rgba(brand, 0.4)}, transparent)`,
      }} />

      <div className="max-w-7xl mx-auto px-6 w-full h-full flex flex-col justify-center gap-5">

        {/* ── ROW 1: Finding label + number badge ── */}
        <div className="flex items-center gap-4">
          <div
            className="shrink-0 w-12 h-12 rounded-2xl flex items-center justify-center text-sm font-black"
            style={{ background: rgba(brand, 0.12), border: `1px solid ${rgba(brand, 0.3)}`, color: brandLight }}
          >
            {p.number}
          </div>
          <div>
            <div className="text-xs font-bold tracking-widest uppercase" style={{ color: rgba(brand, 0.7) }}>
              Finding {p.number} of {total}
            </div>
            <h2 className="text-xl sm:text-2xl font-black text-white leading-tight">
              {p.title}
            </h2>
          </div>
        </div>

        {/* ── ROW 2: Full-width hero hook ── */}
        <div
          className="px-8 py-7 rounded-2xl"
          style={{ background: rgba(brand, 0.06), border: `1px solid ${rgba(brand, 0.14)}` }}
        >
          <blockquote
            className="text-xl sm:text-2xl lg:text-3xl font-black leading-snug text-center"
            style={{ color: "rgba(255,255,255,0.92)" }}
          >
            <span style={{ color: brandLight }}>&ldquo;</span>
            {p.hook}
            <span style={{ color: brandLight }}>&rdquo;</span>
          </blockquote>
        </div>

        {/* ── ROW 3: Stat left + Body right ── */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
          {/* Stat */}
          <div
            className="lg:col-span-2 flex flex-col justify-center items-center p-6 rounded-2xl text-center"
            style={{ background: rgba(brand, 0.08), border: `1px solid ${rgba(brand, 0.18)}` }}
          >
            <div className="text-6xl sm:text-7xl font-black leading-none mb-3" style={{ color: brandLight }}>
              {p.stat}
            </div>
            <p className="text-sm leading-relaxed max-w-xs" style={{ color: "rgba(255,255,255,0.5)" }}>
              {p.statLabel}
            </p>
          </div>

          {/* Body */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <p className="text-base leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
              {p.body}
            </p>
          </div>
        </div>

        {/* ── ROW 4: Bullets horizontal strip ── */}
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

        {/* ── ROW 5: CTA row ── */}
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
            {!isLast ? (
              <button
                onClick={onNext}
                className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 hover:-translate-y-0.5"
                style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.1)", color: "rgba(255,255,255,0.4)" }}
              >
                Next
                <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
            ) : (
              <button
                onClick={onFullReport}
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
}
