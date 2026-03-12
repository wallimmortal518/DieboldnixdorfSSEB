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

type Theme = "theme1" | "theme2";

export default function GrocerPageClient({ grocer }: { grocer: GrocerData }) {
  const [theme, setTheme] = useState<Theme>("theme1");
  const [themeOpen, setThemeOpen] = useState(false);
  const brand = grocer.accentColor;
  const brandLight = lighten(brand);
  const total = grocer.provocations.length;
  const totalSections = total + 2;

  const [activeIdx, setActiveIdx] = useState(0);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => {
        if (e.isIntersecting) {
          const idx = sectionRefs.current.indexOf(e.target as HTMLElement);
          if (idx !== -1) setActiveIdx(idx);
        }
      }),
      { root, threshold: 0.6 }
    );
    sectionRefs.current.forEach(el => el && obs.observe(el));
    return () => obs.disconnect();
  }, []);

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
  };

  const isT2 = theme === "theme2";
  // Scroll-reveal: wire up .reveal elements for T2
  useEffect(() => {
    if (!isT2) return;
    const root = scrollRef.current;
    if (!root) return;
    let obs: IntersectionObserver;
    const timer = setTimeout(() => {
      const els = root.querySelectorAll<HTMLElement>(".reveal");
      obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("visible"); }),
        { root, threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );
      els.forEach(el => obs.observe(el));
    }, 50);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, [isT2]);

  return (
    <div style={{ background: isT2 ? "#080614" : "#080c12", position: "relative", cursor: "none" }}>
      <style>{`
        /* ── T1 animations ── */
        @keyframes fadeUp  { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes fadeIn  { from { opacity:0; } to { opacity:1; } }
        .ru  { animation: fadeUp 0.8s cubic-bezier(0.16,1,0.3,1) both; }
        .rfi { animation: fadeIn 0.8s cubic-bezier(0.16,1,0.3,1) both; }

        /* ── Shoptalk design system animations ── */
        @keyframes navLightSpin  { to { transform: rotate(360deg); } }
        @keyframes blink         { 0%,100%{opacity:1} 50%{opacity:0.3} }
        @keyframes glowDrift     { 0%,100%{transform:scale(1) translate(0,0);opacity:.7} 50%{transform:scale(1.18) translate(2%,2%);opacity:1} }
        @keyframes floatBob      { 0%,100%{transform:translateY(0) rotate(0deg)} 50%{transform:translateY(-18px) rotate(4deg)} }
        @keyframes labelShimmer  { from{background-position:-200% center} to{background-position:200% center} }
        @keyframes iconPulse     { 0%,100%{transform:scale(1)} 50%{transform:scale(1.35)} }
        @keyframes statBreathe   { 0%,100%{text-shadow:0 0 20px var(--sb-color,rgba(124,58,237,.4))} 50%{text-shadow:0 0 48px var(--sb-color,rgba(124,58,237,.7)),0 0 90px var(--sb-color,rgba(124,58,237,.25))} }
        @keyframes borderPulse   { 0%,100%{border-top-color:rgba(124,58,237,.25);box-shadow:none} 50%{border-top-color:rgba(124,58,237,.75);box-shadow:0 -2px 16px rgba(124,58,237,.2)} }
        @keyframes stripFlash    { 0%,100%{opacity:.7} 50%{opacity:1} }
        @keyframes fadeUpPanel   { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }

        /* ── Scroll reveal ── */
        .reveal            { opacity:0; transform:translateY(40px); transition:.7s cubic-bezier(.22,.61,.36,1); }
        .reveal.visible    { opacity:1; transform:none; }
        .reveal-left       { transform:translateX(-50px); }
        .reveal-right      { transform:translateX(50px); }
        .reveal-scale      { transform:scale(.92); transition-duration:.65s; }
        .reveal-d1         { transition-delay:80ms; }
        .reveal-d2         { transition-delay:180ms; }
        .reveal-d3         { transition-delay:280ms; }
        .reveal-d4         { transition-delay:380ms; }

        /* ── Shoptalk component classes ── */
        .t2-section-label {
          font-family: var(--font-heading), sans-serif;
          font-size: 10px; font-weight: 700; letter-spacing: .18em; text-transform: uppercase;
          background: linear-gradient(90deg, rgba(167,139,250,.45) 0%, #a78bfa 40%, rgba(167,139,250,.45) 100%);
          background-size: 200% auto;
          -webkit-background-clip: text; -webkit-text-fill-color: transparent;
          animation: labelShimmer 2.5s linear infinite;
          display: flex; align-items: center; gap: 10px;
        }
        .t2-section-label::before {
          content: '';
          display: block; width: 20px; height: 2px;
          background: #7c3aed; border-radius: 1px;
          flex-shrink: 0;
        }
        .t2-section-heading {
          font-family: var(--font-display), sans-serif;
          font-size: clamp(1.6rem, 2.8vw, 2.8rem);
          font-weight: 700; color: #f0eeff;
          line-height: 1.05; letter-spacing: .01em; text-transform: uppercase;
        }

        /* Bento card */
        .t2-bento {
          background: #13102a;
          border: 1px solid rgba(109,40,217,.22);
          border-radius: 20px;
          transition: transform .3s ease, box-shadow .3s ease;
        }
        .t2-bento:hover { transform: translateY(-4px); box-shadow: 0 16px 48px rgba(109,40,217,.18); }

        /* Stat number */
        .t2-stat {
          font-family: var(--font-heading), sans-serif;
          font-size: 3.4rem; font-weight: 800; line-height: 1;
          animation: statBreathe 2.5s ease-in-out infinite;
        }

        /* Session-strip card (finding layout) */
        .t2-session {
          display: grid; grid-template-columns: 160px 1fr;
          background: #13102a; border: 1px solid rgba(109,40,217,.22); border-radius: 16px;
          overflow: hidden;
          transition: transform .25s ease, box-shadow .25s ease;
        }
        .t2-session:hover { transform: translateY(-3px); box-shadow: 0 12px 40px rgba(109,40,217,.15); }
        .t2-session-left {
          background: rgba(124,58,237,.12); border-right: 1px solid rgba(109,40,217,.22);
          padding: 24px 18px;
          display: flex; flex-direction: column; justify-content: center; align-items: center; gap: 8px;
          animation: stripFlash 4s ease-in-out infinite;
        }
        .t2-session-right { padding: 22px 26px; display: flex; flex-direction: column; justify-content: center; gap: 10px; }

        /* Keynote row (bullet) */
        .t2-keynote {
          border-top: 2px solid rgba(124,58,237,.25);
          border-radius: 12px; padding: 14px 18px;
          background: rgba(124,58,237,.06);
          animation: borderPulse 3s ease-in-out infinite;
          display: flex; align-items: flex-start; gap: 10px;
        }

        /* Pill buttons */
        .t2-btn-primary {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 50px;
          background: #7c3aed; border: none; color: #fff; cursor: pointer;
          font-family: var(--font-heading), sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .04em;
          box-shadow: 0 4px 28px rgba(124,58,237,.45);
          transition: transform .2s, box-shadow .2s;
        }
        .t2-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(124,58,237,.55); }
        .t2-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 50px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(12px); color: rgba(220,215,255,.65); cursor: pointer;
          font-family: var(--font-heading), sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .04em;
          transition: transform .2s, background .2s;
        }
        .t2-btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,.08); }

        ::-webkit-scrollbar { display: none; }

      `}</style>

      {/* ── NAV ── */}
      <nav style={{
        position: "fixed", top: 0, left: 0, right: 0, zIndex: 50,
        height: "44px", padding: "0 56px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        background: isT2 ? "rgba(8,6,20,0.95)" : "rgba(8,12,18,0.95)",
        backdropFilter: "blur(16px)",
        borderBottom: isT2 ? "1px solid rgba(109,40,217,0.18)" : "1px solid rgba(255,255,255,0.04)",
      }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "8px", color: "rgba(255,255,255,0.22)", textDecoration: "none" }}>
          <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
          </svg>
          <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.1em", textTransform: "uppercase" }}>Back</span>
        </Link>

        <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
          <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: brand }} />
          <span style={{ fontSize: "10px", fontWeight: 800, color: brandLight, letterSpacing: "0.08em" }}>
            {grocer.shortName.toUpperCase()}
          </span>
          <span style={{ color: "rgba(255,255,255,0.1)", margin: "0 2px" }}>·</span>
          <span style={{ fontSize: "10px", color: "rgba(255,255,255,0.25)", letterSpacing: "0.04em" }}>
            Self-Service Excellence Benchmark
          </span>
        </div>

        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
            <span style={{ fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}>INCISIV</span>
            <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.06)" }}>×</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.08)", letterSpacing: "0.06em" }}>DIEBOLD NIXDORF</span>
          </div>

          {/* ── Theme Dropdown ── */}
          <div style={{ position: "relative" }}>
            <button
              onClick={() => setThemeOpen(o => !o)}
              style={{
                display: "flex", alignItems: "center", gap: "5px",
                padding: "4px 10px", borderRadius: "5px",
                background: isT2 ? "rgba(109,40,217,0.15)" : "rgba(255,255,255,0.05)",
                border: isT2 ? "1px solid rgba(109,40,217,0.35)" : "1px solid rgba(255,255,255,0.08)",
                color: isT2 ? "#a78bfa" : "rgba(255,255,255,0.4)",
                cursor: "pointer", fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
              }}
            >
              <svg width="9" height="9" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                <circle cx="12" cy="12" r="3" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
              </svg>
              {theme === "theme1" ? "Theme 1" : "Theme 2"}
              <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5} style={{ opacity: 0.5, transform: themeOpen ? "rotate(180deg)" : "none", transition: "transform 0.2s" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {themeOpen && (
              <div style={{
                position: "absolute", top: "calc(100% + 6px)", right: 0,
                background: "#0e0b1e", border: "1px solid rgba(109,40,217,0.25)",
                borderRadius: "8px", overflow: "hidden", minWidth: "110px",
                boxShadow: "0 8px 24px rgba(0,0,0,0.4)",
              }}>
                {(["theme1", "theme2"] as Theme[]).map(t => (
                  <button key={t} onClick={() => { setTheme(t); setThemeOpen(false); }} style={{
                    display: "flex", alignItems: "center", gap: "7px",
                    width: "100%", padding: "8px 12px",
                    background: theme === t ? "rgba(109,40,217,0.15)" : "none",
                    border: "none", cursor: "pointer", textAlign: "left",
                    color: theme === t ? "#a78bfa" : "rgba(255,255,255,0.35)",
                    fontSize: "9px", fontWeight: 700, letterSpacing: "0.08em",
                    transition: "background 0.15s",
                  }}
                    onMouseEnter={e => { if (theme !== t) (e.currentTarget as HTMLElement).style.background = "rgba(255,255,255,0.04)"; }}
                    onMouseLeave={e => { if (theme !== t) (e.currentTarget as HTMLElement).style.background = "none"; }}
                  >
                    <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: theme === t ? "#a78bfa" : "rgba(255,255,255,0.15)", flexShrink: 0 }} />
                    {t === "theme1" ? "Theme 1" : "Theme 2"}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* ── PROGRESS ── */}
      <div style={{ position: "fixed", top: "44px", left: 0, right: 0, height: "1px", background: "rgba(255,255,255,0.03)", zIndex: 50 }}>
        <div style={{
          height: "100%",
          width: `${(activeIdx / (totalSections - 1)) * 100}%`,
          background: brand,
          transition: "width 0.6s cubic-bezier(0.4,0,0.2,1)",
        }} />
      </div>

      {/* ── SIDE DOTS ── */}
      <div style={{
        position: "fixed", right: "20px", top: "50%", transform: "translateY(-50%)",
        zIndex: 50, display: "flex", flexDirection: "column", gap: "5px",
      }}>
        {Array.from({ length: totalSections }).map((_, i) => (
          <button key={i} onClick={() => scrollTo(i)} style={{
            width: "2px", height: activeIdx === i ? "20px" : "4px",
            borderRadius: "2px", border: "none", padding: 0, cursor: "pointer",
            background: activeIdx === i ? brand : "rgba(255,255,255,0.08)",
            transition: "all 0.3s cubic-bezier(0.4,0,0.2,1)",
          }} />
        ))}
      </div>

      {/* ── CURSOR ── */}
      <CustomCursor brand={brand} />

      {/* ── SCROLL CONTAINER ── */}
      <div
        ref={scrollRef}
        style={{
          height: "100vh", overflowY: "scroll",
          scrollSnapType: "y mandatory",
          scrollbarWidth: "none",
          position: "relative", zIndex: 2,
        }}
      >
        {isT2 && (
          <>
            {/* ══ T2 · HERO ═══════════════════════════════════════════════════════
                Two-zone layout: top 60% = headline content, bottom 40% = stat bento row.
                Headline sits vertically centered in the top zone, stat cards fill bottom.
            ════════════════════════════════════════════════════════════════════════ */}
            <section
              ref={el => { sectionRefs.current[0] = el; }}
              style={{
                height: "100vh", scrollSnapAlign: "start",
                display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden",
              }}
            >
              {/* Background layers */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg,#080614 0%,#0d0b1f 55%,#090618 100%)", zIndex: 0 }} />
              {/* Primary purple glow — upper centre */}
              <div style={{ position: "absolute", top: "-5%", left: "35%", width: "90vw", height: "70vh", background: "radial-gradient(ellipse,rgba(109,40,217,.2) 0%,transparent 60%)", animation: "glowDrift 6s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Brand accent glow — lower right */}
              <div style={{ position: "absolute", bottom: "20%", right: "0%", width: "500px", height: "500px", background: `radial-gradient(ellipse,${rgba(brand, .18)} 0%,transparent 58%)`, animation: "glowDrift 9s ease-in-out infinite reverse", zIndex: 1, pointerEvents: "none" }} />
              {/* Diagonal overlay */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(125deg,rgba(8,6,20,.9) 0%,rgba(8,6,20,.4) 55%,transparent 100%)", zIndex: 2, pointerEvents: "none" }} />
              {/* Divider fade between zones */}
              <div style={{ position: "absolute", bottom: "38%", left: 0, right: 0, height: "120px", background: "linear-gradient(to top,rgba(8,6,20,.6) 0%,transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

              {/* ── ZONE 1: Headline content (flex-grow fills top 60%) ── */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 4, padding: "72px max(32px,calc(50vw - 620px)) 0" }}>

                {/* Eyebrow badge */}
                <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px 5px 10px", borderRadius: "20px", background: rgba(brand, .1), border: `1px solid ${rgba(brand, .32)}`, marginBottom: "24px", alignSelf: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: brand, animation: "blink 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: "var(--font-heading),sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: brandLight }}>
                    Incisiv × Diebold Nixdorf &nbsp;·&nbsp; SSEB 2025
                  </span>
                </div>

                {/* Hero title — Oswald, split at em-dash for two-line drama */}
                <h1 className="reveal reveal-d1" style={{
                  fontFamily: "var(--font-display),sans-serif",
                  fontSize: "clamp(1.6rem,2.4vw,2.8rem)",
                  fontWeight: 700, color: "#f0eeff",
                  lineHeight: .94, letterSpacing: "-.01em", textTransform: "uppercase",
                  maxWidth: "860px", marginBottom: "20px",
                }}>
                  {grocer.heroHeadline.includes("—") ? (
                    <>
                      <span>{grocer.heroHeadline.split("—")[0].trim()}</span>
                      <br />
                      <span style={{ color: brandLight }}>— {grocer.heroHeadline.split("—").slice(1).join("—").trim()}</span>
                    </>
                  ) : (
                    grocer.heroHeadline.split(" ").map((word, wi) => (
                      <span key={wi} style={{ color: wi === 0 ? brandLight : "#f0eeff" }}>{word}{" "}</span>
                    ))
                  )}
                </h1>

                {/* Subheadline */}
                <p className="reveal reveal-d2" style={{
                  fontFamily: "var(--font-sans),sans-serif",
                  fontSize: "clamp(.95rem,1.05vw,1.05rem)",
                  color: "rgba(220,215,255,.45)", lineHeight: 1.75,
                  maxWidth: "580px", marginBottom: "32px",
                }}>
                  {grocer.heroSubheadline}
                </p>

                {/* CTA row */}
                <div className="reveal reveal-d3" style={{ display: "flex", alignItems: "center", gap: "12px", flexWrap: "wrap" }}>
                  <button className="t2-btn-primary" onClick={() => scrollTo(1)}>
                    View {total} Findings
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <button className="t2-btn-ghost">Download Report</button>
                  {/* Meta pills */}
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginLeft: "4px" }}>
                    {[
                      { icon: <><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></>, label: "SSEB 2025" },
                      { icon: <><path d="M12 22s-8-4.5-8-11.8A8 8 0 0112 2a8 8 0 018 8.2c0 7.3-8 11.8-8 11.8z"/><circle cx="12" cy="10" r="3"/></>, label: `${grocer.shortName}` },
                    ].map((m, mi) => (
                      <div key={mi} style={{ display: "flex", alignItems: "center", gap: "5px", padding: "5px 10px", borderRadius: "20px", background: "rgba(255,255,255,.03)", border: "1px solid rgba(255,255,255,.07)" }}>
                        <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,.6)" strokeWidth={1.8}>{m.icon}</svg>
                        <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "10px", color: "rgba(220,215,255,.4)" }}>{m.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* ── ZONE 2: Stat bento cards (fixed height ~38%) ── */}
              <div style={{ position: "relative", zIndex: 4, padding: "0 max(32px,calc(50vw - 620px)) 32px" }}>
                {/* Thin separator line */}
                <div className="reveal" style={{ height: "1px", background: `linear-gradient(90deg, ${rgba(brand,.5)}, rgba(124,58,237,.3), transparent)`, marginBottom: "20px" }} />

                <div className="reveal reveal-d1" style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "14px" }}>
                  {grocer.contextStat.map((s, si) => (
                    <div key={si} className="t2-bento" style={{ padding: "22px 24px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {/* Stat number with glow */}
                      <div style={{
                        fontFamily: "var(--font-heading),sans-serif",
                        fontSize: "clamp(2rem,3vw,3.2rem)", fontWeight: 800, lineHeight: 1,
                        color: si === 0 ? brandLight : "#a78bfa",
                        "--sb-color": si === 0 ? rgba(brand,.5) : "rgba(124,58,237,.5)",
                        animation: `statBreathe 2.5s ${si * 0.5}s ease-in-out infinite`,
                      } as React.CSSProperties}>
                        {s.value}
                      </div>
                      {/* Thin accent line */}
                      <div style={{ width: "28px", height: "2px", borderRadius: "1px", background: si === 0 ? brand : "#7c3aed", opacity: .6 }} />
                      {/* Label */}
                      <p style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "11px", color: "rgba(220,215,255,.45)", lineHeight: 1.5 }}>
                        {s.label}
                      </p>
                    </div>
                  ))}
                </div>

                {/* Scroll hint */}
                <div className="reveal reveal-d2" style={{ display: "flex", alignItems: "center", gap: "8px", marginTop: "18px" }}>
                  <div style={{ width: "16px", height: "1px", background: "rgba(220,215,255,.12)" }} />
                  <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.18)", letterSpacing: ".12em", textTransform: "uppercase" }}>
                    Scroll to explore {total} findings
                  </span>
                </div>
              </div>

            </section>

            {/* ══ T2 · FINDING 01 — "MAGAZINE SPLIT" ══════════════════════════════
                Left half: giant stat number + label + hook quote stacked vertically
                Right half: title at top, body paragraph, 3 numbered bullet rows below
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[0] && (() => { const p = grocer.provocations[0]; return (
            <section ref={el => { sectionRefs.current[1] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", position:"relative", overflow:"hidden", background:"#080614" }}>
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 80% at 0% 50%, ${rgba(brand,.12)} 0%, transparent 55%)`, pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:"10%", right:"5%", width:"400px", height:"400px", background:"radial-gradient(ellipse,rgba(109,40,217,.1) 0%,transparent 60%)", pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr 1fr", height:"100%", padding:`44px max(32px,calc(50vw - 620px)) 48px` }}>

                {/* LEFT — big stat + hook */}
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", paddingRight:"48px", borderRight:`1px solid rgba(124,58,237,.15)` }}>
                  <p className="t2-section-label reveal" style={{ marginBottom:"20px" }}>Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                  {/* Giant stat */}
                  <div className="reveal reveal-d1" style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(4rem,8vw,9rem)", fontWeight:800, lineHeight:.85, color:brandLight, "--sb-color":rgba(brand,.5), animation:"statBreathe 2.5s ease-in-out infinite", marginBottom:"12px" } as React.CSSProperties}>
                    {p.stat}
                  </div>
                  <p className="reveal reveal-d1" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"14px", color:"rgba(220,215,255,.5)", lineHeight:1.5, maxWidth:"220px", marginBottom:"28px" }}>{p.statLabel}</p>
                  <div className="reveal reveal-d2" style={{ height:"1px", background:`linear-gradient(90deg,${rgba(brand,.5)},transparent)`, marginBottom:"22px", width:"80%" }} />
                  <blockquote className="reveal reveal-d2" style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(1.25rem,1.6vw,1.5rem)", fontStyle:"italic", color:"rgba(240,238,255,.82)", lineHeight:1.55, margin:0 }}>
                    &ldquo;{p.hook}&rdquo;
                  </blockquote>
                </div>

                {/* RIGHT — title + body + bullets */}
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", paddingLeft:"48px", gap:"20px" }}>
                  <h2 className="t2-section-heading reveal reveal-right" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)" }}>{p.title}</h2>
                  <p className="reveal reveal-right reveal-d1" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"clamp(.8rem,.9vw,.88rem)", color:"rgba(220,215,255,.5)", lineHeight:1.85 }}>{p.body}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {p.bullets.map((b, bi) => (
                      <div key={bi} className="t2-keynote reveal reveal-right reveal-d2" style={{ "--sb-color":rgba(brand,.4) } as React.CSSProperties}>
                        <div style={{ width:"22px", height:"22px", borderRadius:"6px", background:rgba(brand,.14), border:`1px solid ${rgba(brand,.35)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"var(--font-heading),sans-serif", fontSize:"9px", fontWeight:800, color:brandLight }}>
                          {String(bi+1).padStart(2,"0")}
                        </div>
                        <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.45)", lineHeight:1.65 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.18)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                </div>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · FINDING 02 — "FULL-WIDTH HOOK + BENTO GRID" ════════════════
                Full-width hook blockquote spans the top third. Bottom two-thirds:
                stat card left (tall), body+bullets split into 2 bento cards right.
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[1] && (() => { const p = grocer.provocations[1]; return (
            <section ref={el => { sectionRefs.current[2] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", padding:`44px max(32px,calc(50vw - 620px)) 40px`, position:"relative", overflow:"hidden", background:"#080614" }}>
              <div style={{ position:"absolute", top:"30%", left:"50%", transform:"translate(-50%,-50%)", width:"70vw", height:"50vh", background:"radial-gradient(ellipse,rgba(109,40,217,.1) 0%,transparent 65%)", pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"10%", left:"5%", width:"350px", height:"350px", background:`radial-gradient(ellipse,${rgba(brand,.1)} 0%,transparent 60%)`, pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"20px", height:"100%", justifyContent:"center" }}>
                <p className="t2-section-label reveal">Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", maxWidth:"680px" }}>{p.title}</h2>

                {/* Full-width hook — like Shoptalk's make-most interlude */}
                <div className="reveal reveal-d2" style={{ padding:"24px 32px", borderRadius:"16px", background:`linear-gradient(135deg,${rgba(brand,.08)},rgba(124,58,237,.06))`, border:`1px solid ${rgba(brand,.2)}`, position:"relative", overflow:"hidden" }}>
                  <div style={{ position:"absolute", left:0, top:0, bottom:0, width:"3px", background:`linear-gradient(to bottom,${brand},#7c3aed)` }} />
                  <blockquote style={{ fontFamily:"var(--font-display),sans-serif", fontSize:"clamp(1.1rem,1.6vw,1.55rem)", fontWeight:700, color:"#f0eeff", lineHeight:1.1, textTransform:"uppercase", letterSpacing:".01em", margin:0 }}>
                    {p.hook}
                  </blockquote>
                </div>

                {/* 3-col bento: stat | body | bullets */}
                <div className="reveal reveal-d3" style={{ display:"grid", gridTemplateColumns:"180px 1fr 1fr", gap:"14px", flex:1, maxHeight:"220px" }}>
                  {/* Stat card */}
                  <div className="t2-bento" style={{ padding:"20px", display:"flex", flexDirection:"column", justifyContent:"center", alignItems:"center", textAlign:"center", gap:"10px" }}>
                    <StatViz stat={p.stat} brand={brand} size={88} />
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"13px", color:"rgba(220,215,255,.45)", lineHeight:1.5 }}>{p.statLabel}</p>
                  </div>
                  {/* Body card */}
                  <div className="t2-bento" style={{ padding:"20px 22px", display:"flex", flexDirection:"column", justifyContent:"center" }}>
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.5)", lineHeight:1.85 }}>{p.body}</p>
                  </div>
                  {/* Bullets card */}
                  <div className="t2-bento" style={{ padding:"18px 20px", display:"flex", flexDirection:"column", gap:"10px", justifyContent:"center" }}>
                    {p.bullets.map((b, bi) => (
                      <div key={bi} style={{ display:"flex", gap:"10px", alignItems:"flex-start" }}>
                        <div style={{ width:"14px", height:"14px", borderRadius:"50%", background:rgba(brand,.18), border:`1px solid ${rgba(brand,.4)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, marginTop:"2px" }}>
                          <div style={{ width:"5px", height:"5px", borderRadius:"50%", background:brand }} />
                        </div>
                        <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.42)", lineHeight:1.6 }}>{b}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.18)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · FINDING 03 — "SCORECARD" ══════════════════════════════════
                Full-width stat bar spans top. Title + body in a single column.
                Hook as a large centred pull-quote between two horizontal rules.
                3 bullets as a bare horizontal row — no cards, no columns.
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[2] && (() => { const p = grocer.provocations[2]; return (
            <section ref={el => { sectionRefs.current[3] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", padding:`44px max(32px,calc(50vw - 620px)) 40px`, position:"relative", overflow:"hidden", background:"#080614" }}>
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 65% 50% at 50% 60%, ${rgba(brand,.09)} 0%, transparent 60%)`, pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, display:"flex", flexDirection:"column", gap:"0" }}>

                {/* ── Row 1: full-width stat bar ── */}
                <div className="reveal" style={{ display:"flex", alignItems:"center", justifyContent:"space-between", paddingBottom:"20px", borderBottom:`1px solid rgba(124,58,237,.2)`, marginBottom:"20px" }}>
                  <div style={{ display:"flex", alignItems:"baseline", gap:"12px" }}>
                    <span style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(3rem,6vw,6.5rem)", fontWeight:800, lineHeight:.9, color:brandLight, "--sb-color":rgba(brand,.5), animation:"statBreathe 2.5s ease-in-out infinite" } as React.CSSProperties}>{p.stat}</span>
                    <span style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"13px", color:"rgba(220,215,255,.4)", maxWidth:"180px", lineHeight:1.4 }}>{p.statLabel}</span>
                  </div>
                  <p className="t2-section-label" style={{ margin:0, textAlign:"right" }}>Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                </div>

                {/* ── Row 2: title + body side by side ── */}
                <div className="reveal reveal-d1" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", marginBottom:"24px" }}>
                  <h2 className="t2-section-heading" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", margin:0 }}>{p.title}</h2>
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.48)", lineHeight:1.85, margin:0, alignSelf:"center" }}>{p.body}</p>
                </div>

                {/* ── Row 3: pull-quote between rules ── */}
                <div className="reveal reveal-d2" style={{ borderTop:`1px solid rgba(124,58,237,.18)`, borderBottom:`1px solid rgba(124,58,237,.18)`, padding:"20px 0", marginBottom:"24px", textAlign:"center" }}>
                  <blockquote style={{ fontFamily:"var(--font-display),sans-serif", fontSize:"clamp(1.2rem,1.9vw,1.8rem)", fontWeight:700, color:"rgba(240,238,255,.75)", lineHeight:1.2, fontStyle:"italic", letterSpacing:"-.01em", margin:0 }}>
                    &ldquo;{p.hook}&rdquo;
                  </blockquote>
                </div>

                {/* ── Row 4: 3 bullets as bare horizontal list ── */}
                <div className="reveal reveal-d3" style={{ display:"grid", gridTemplateColumns:"repeat(3,1fr)", gap:"0" }}>
                  {p.bullets.map((b, bi) => (
                    <div key={bi} style={{ padding:`14px ${bi===1?"28px":"0"} 14px ${bi===0?"0":"28px"}`, borderLeft: bi>0 ? `1px solid rgba(124,58,237,.15)` : "none", display:"flex", flexDirection:"column", gap:"8px" }}>
                      <div style={{ width:"24px", height:"2px", background: bi===0 ? brand : bi===1 ? "#7c3aed" : brandLight }} />
                      <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.48)", lineHeight:1.65, margin:0 }}>{b}</p>
                    </div>
                  ))}
                </div>

                <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.15)", fontStyle:"italic", marginTop:"16px" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · FINDING 04 — "ASYMMETRIC EDITORIAL" ═══════════════════════
                Narrow left column: number + title + body stacked.
                Wide right: oversized stat arc top-right, then 3 keynote rows below it.
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[3] && (() => { const p = grocer.provocations[3]; return (
            <section ref={el => { sectionRefs.current[4] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", padding:`44px max(32px,calc(50vw - 620px)) 40px`, position:"relative", overflow:"hidden", background:"#080614" }}>
              <div style={{ position:"absolute", top:0, right:0, width:"55vw", height:"60vh", background:`radial-gradient(ellipse at top right,${rgba(brand,.1)} 0%,transparent 55%)`, pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:"15%", left:"10%", width:"300px", height:"300px", background:"radial-gradient(ellipse,rgba(124,58,237,.08) 0%,transparent 60%)", pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"2fr 3fr", gap:"40px", alignItems:"center" }}>

                {/* Left — editorial text column */}
                <div style={{ display:"flex", flexDirection:"column", gap:"18px" }}>
                  <p className="t2-section-label reveal">Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                  <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(2rem,2.8vw,3rem)" }}>{p.title}</h2>
                  <div className="reveal reveal-d2" style={{ height:"1px", background:`linear-gradient(90deg,${rgba(brand,.5)},transparent)` }} />
                  <blockquote className="reveal reveal-d2" style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(1.15rem,1.4vw,1.35rem)", fontStyle:"italic", color:"rgba(240,238,255,.78)", lineHeight:1.6, margin:0, paddingLeft:"14px", borderLeft:`2px solid ${rgba(brand,.5)}` }}>
                    &ldquo;{p.hook}&rdquo;
                  </blockquote>
                  <p className="reveal reveal-d3" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.45)", lineHeight:1.85 }}>{p.body}</p>
                </div>

                {/* Right — stat large + keynote rows */}
                <div style={{ display:"flex", flexDirection:"column", gap:"16px" }}>
                  {/* Large stat arc centred */}
                  <div className="reveal reveal-right" style={{ display:"flex", alignItems:"center", gap:"24px", padding:"24px 28px", borderRadius:"20px", background:"#13102a", border:"1px solid rgba(109,40,217,.22)" }}>
                    <StatViz stat={p.stat} brand={brand} size={120} />
                    <div>
                      <div style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"12px", fontWeight:700, letterSpacing:".12em", color:rgba(brand,.7), textTransform:"uppercase", marginBottom:"8px" }}>By the numbers</div>
                      <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.4)", lineHeight:1.6, maxWidth:"260px" }}>{p.statLabel}</p>
                    </div>
                  </div>
                  {/* Keynote rows */}
                  {p.bullets.map((b, bi) => (
                    <div key={bi} className={`t2-keynote reveal reveal-right reveal-d${bi+1 as 1|2|3}`} style={{ "--sb-color":rgba(brand,.4) } as React.CSSProperties}>
                      <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:rgba(brand,.14), border:`1px solid ${rgba(brand,.35)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                        <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:brand }} />
                      </div>
                      <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.45)", lineHeight:1.65 }}>{b}</p>
                    </div>
                  ))}
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.18)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                </div>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · FINDING 05 — "DARK INTERLUDE" ═════════════════════════════
                Full-bleed accent gradient background (darker, more intense purple).
                Massive stat number centered with glow. Hook below it. Body + bullets
                in a 2-col row underneath — feels like a chapter break.
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[4] && (() => { const p = grocer.provocations[4]; return (
            <section ref={el => { sectionRefs.current[5] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", padding:`44px max(32px,calc(50vw - 620px)) 40px`, position:"relative", overflow:"hidden", background:"#06041a" }}>
              {/* Deep purple + brand gradient */}
              <div style={{ position:"absolute", inset:0, background:`linear-gradient(135deg,#06041a 0%,#0d0926 50%,#06041a 100%)`, zIndex:0 }} />
              <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 70% 60% at 50% 45%,rgba(124,58,237,.22) 0%,transparent 65%)", zIndex:1, pointerEvents:"none" }} />
              <div style={{ position:"absolute", bottom:0, left:"50%", transform:"translateX(-50%)", width:"80vw", height:"50vh", background:`radial-gradient(ellipse,${rgba(brand,.15)} 0%,transparent 55%)`, zIndex:1, pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:2, display:"flex", flexDirection:"column", gap:"20px" }}>
                <p className="t2-section-label reveal" style={{ marginBottom:"4px" }}>Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", maxWidth:"620px" }}>{p.title}</h2>

                {/* Giant centered stat — chapter-break energy */}
                <div className="reveal reveal-d2" style={{ display:"flex", alignItems:"baseline", gap:"16px", padding:"20px 0 16px" }}>
                  <div style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(5rem,10vw,11rem)", fontWeight:800, lineHeight:.85, color:brandLight, "--sb-color":rgba(brand,.6), animation:"statBreathe 2.5s ease-in-out infinite" } as React.CSSProperties}>
                    {p.stat}
                  </div>
                  <div style={{ paddingBottom:"8px" }}>
                    <div style={{ height:"2px", width:"48px", background:brand, marginBottom:"10px" }} />
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"14px", color:"rgba(220,215,255,.5)", lineHeight:1.5, maxWidth:"200px" }}>{p.statLabel}</p>
                  </div>
                </div>

                {/* Hook */}
                <div className="reveal reveal-d2" style={{ height:"1px", background:`linear-gradient(90deg,${rgba(brand,.6)},rgba(124,58,237,.3),transparent)`, marginBottom:"4px" }} />
                <blockquote className="reveal reveal-d3" style={{ fontFamily:"var(--font-display),sans-serif", fontSize:"clamp(1.1rem,1.5vw,1.4rem)", fontWeight:700, color:"rgba(240,238,255,.88)", lineHeight:1.1, textTransform:"uppercase", letterSpacing:".01em", margin:0, maxWidth:"720px" }}>
                  {p.hook}
                </blockquote>

                {/* 2-col: body + bullets */}
                <div className="reveal reveal-d3" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"24px", paddingTop:"4px" }}>
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.45)", lineHeight:1.85 }}>{p.body}</p>
                  <div style={{ display:"flex", flexDirection:"column", gap:"10px" }}>
                    {p.bullets.map((b, bi) => (
                      <div key={bi} className="t2-keynote" style={{ "--sb-color":rgba(brand,.5) } as React.CSSProperties}>
                        <div style={{ width:"20px", height:"20px", borderRadius:"50%", background:rgba(brand,.2), border:`1px solid ${rgba(brand,.45)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0 }}>
                          <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:brandLight }} />
                        </div>
                        <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.5)", lineHeight:1.65 }}>{b}</p>
                      </div>
                    ))}
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.18)", fontStyle:"italic", marginTop:"4px" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                  </div>
                </div>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · FINDING 06 — "TIMELINE / STEP LAYOUT" ═════════════════════
                Left: vertical numbered step-list (3 bullets as a process flow).
                Right: title at top, hook quote centre, stat + CTA at bottom.
                Feels like a roadmap / action plan — fitting for the final finding.
            ════════════════════════════════════════════════════════════════════════ */}
            {grocer.provocations[5] && (() => { const p = grocer.provocations[5]; return (
            <section ref={el => { sectionRefs.current[6] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"flex", flexDirection:"column", justifyContent:"center", padding:`44px max(32px,calc(50vw - 620px)) 40px`, position:"relative", overflow:"hidden", background:"#080614" }}>
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 50% 70% at 100% 50%, ${rgba(brand,.12)} 0%, transparent 55%)`, pointerEvents:"none" }} />
              <div style={{ position:"absolute", top:"10%", left:"5%", width:"360px", height:"360px", background:"radial-gradient(ellipse,rgba(124,58,237,.09) 0%,transparent 60%)", pointerEvents:"none" }} />

              <div style={{ position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1fr 1.6fr", gap:"48px", alignItems:"center" }}>

                {/* Left — vertical step list */}
                <div style={{ display:"flex", flexDirection:"column", gap:"0" }}>
                  <p className="t2-section-label reveal" style={{ marginBottom:"20px" }}>Finding {p.number} <span style={{ opacity:.4, fontWeight:400 }}>/ {total}</span></p>
                  {p.bullets.map((b, bi) => (
                    <div key={bi} className={`reveal reveal-d${bi+1 as 1|2|3}`} style={{ display:"flex", gap:"16px", paddingBottom: bi < p.bullets.length-1 ? "20px" : "0", position:"relative" }}>
                      {/* Vertical line connector */}
                      {bi < p.bullets.length-1 && (
                        <div style={{ position:"absolute", left:"13px", top:"28px", bottom:0, width:"1px", background:`linear-gradient(to bottom,${rgba(brand,.4)},transparent)` }} />
                      )}
                      {/* Step dot */}
                      <div style={{ width:"28px", height:"28px", borderRadius:"50%", background:rgba(brand,.15), border:`1.5px solid ${rgba(brand,.5)}`, display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0, fontFamily:"var(--font-heading),sans-serif", fontSize:"10px", fontWeight:800, color:brandLight }}>
                        {bi+1}
                      </div>
                      <div style={{ paddingTop:"4px" }}>
                        <div style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"12px", fontWeight:700, letterSpacing:".1em", color:rgba(brand,.6), marginBottom:"5px", textTransform:"uppercase" }}>
                          {bi===0?"Recognize":bi===1?"Prioritize":"Execute"}
                        </div>
                        <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:".92rem", color:"rgba(220,215,255,.45)", lineHeight:1.65 }}>{b}</p>
                      </div>
                    </div>
                  ))}
                </div>

                {/* Right — title + hook + stat */}
                <div style={{ display:"flex", flexDirection:"column", gap:"20px" }}>
                  <h2 className="t2-section-heading reveal reveal-right" style={{ fontSize:"clamp(2rem,2.8vw,3rem)" }}>{p.title}</h2>

                  {/* Hook in a bordered card */}
                  <div className="reveal reveal-right reveal-d1 t2-bento" style={{ padding:"28px 32px", position:"relative", overflow:"hidden" }}>
                    <div style={{ position:"absolute", top:0, left:0, right:0, height:"2px", background:`linear-gradient(90deg,${brand},#7c3aed,transparent)`, animation:"borderPulse 3s ease-in-out infinite" }} />
                    <blockquote style={{ fontFamily:"var(--font-display),sans-serif", fontSize:"clamp(1.1rem,1.6vw,1.5rem)", fontWeight:700, color:"#f0eeff", lineHeight:1.1, textTransform:"uppercase", letterSpacing:".01em", margin:0 }}>
                      {p.hook}
                    </blockquote>
                  </div>

                  {/* Body */}
                  <p className="reveal reveal-right reveal-d2" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.45)", lineHeight:1.85 }}>{p.body}</p>

                  {/* Stat + source row */}
                  <div className="reveal reveal-right reveal-d3" style={{ display:"flex", alignItems:"center", gap:"20px", paddingTop:"8px", borderTop:`1px solid rgba(124,58,237,.15)` }}>
                    <div>
                      <div style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(1.8rem,2.8vw,3rem)", fontWeight:800, color:brandLight, "--sb-color":rgba(brand,.5), animation:"statBreathe 2.5s ease-in-out infinite", lineHeight:1 } as React.CSSProperties}>{p.stat}</div>
                      <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"13px", color:"rgba(220,215,255,.45)", lineHeight:1.4, maxWidth:"180px", marginTop:"4px" }}>{p.statLabel}</p>
                    </div>
                    <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,${rgba(brand,.3)},transparent)` }} />
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.18)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives</p>
                  </div>
                </div>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · END ══════════════════════════════════════════════════════════
                Download-CTA section pattern from Shoptalk
            ════════════════════════════════════════════════════════════════════════ */}
            <section
              ref={el => { sectionRefs.current[total + 1] = el; }}
              style={{
                height: "100vh", scrollSnapAlign: "start",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: `44px max(32px,calc(50vw - 620px)) 0`,
                position: "relative", overflow: "hidden",
                background: "#080614",
              }}
            >
              {/* Centered glow */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 65% 55% at 50% 50%,rgba(109,40,217,.13) 0%,transparent 65%)", pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "5%", right: "5%", width: "480px", height: "380px", background: `radial-gradient(ellipse,${rgba(brand,.09)} 0%,transparent 60%)`, pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1 }}>
                <p className="t2-section-label reveal" style={{ marginBottom: "20px" }}>End of Report</p>

                <h2 className="reveal reveal-d1" style={{
                  fontFamily: "var(--font-display),sans-serif",
                  fontSize: "clamp(2.2rem,4.5vw,4.6rem)",
                  fontWeight: 700, color: "#f0eeff",
                  lineHeight: .95, letterSpacing: ".01em", textTransform: "uppercase",
                  marginBottom: "22px", maxWidth: "680px",
                }}>
                  Take the Next Step with <span style={{ color: brandLight }}>{grocer.shortName}</span>
                </h2>

                <div style={{ height: "1px", background: `linear-gradient(90deg,${rgba(brand,.5)},rgba(109,40,217,.25),transparent)`, marginBottom: "22px", maxWidth: "560px" }} />

                <p className="reveal reveal-d2" style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: ".95rem", color: "rgba(220,215,255,.3)", lineHeight: 1.82, maxWidth: "500px", marginBottom: "38px" }}>
                  The full SSEB report includes the complete maturity framework, retailer benchmarking, and a prioritized roadmap built for your scale.
                </p>

                <div className="reveal reveal-d3" style={{ display: "flex", gap: "12px", alignItems: "center", flexWrap: "wrap" }}>
                  <button className="t2-btn-primary">Access Full Report</button>
                  <button className="t2-btn-ghost">Connect With Us</button>
                  <button onClick={() => scrollTo(0)} style={{ padding: "13px 18px", background: "none", border: "none", color: "rgba(220,215,255,.2)", cursor: "pointer", fontFamily: "var(--font-sans),sans-serif", fontSize: "11px", letterSpacing: ".06em" }}>
                    ↑ Back to top
                  </button>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px max(32px,calc(50vw - 620px))", borderTop: "1px solid rgba(109,40,217,.1)", display: "flex", justifyContent: "space-between" }}>
                <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", fontWeight: 800, color: "rgba(220,215,255,.1)", letterSpacing: ".1em" }}>INCISIV × DIEBOLD NIXDORF</span>
                <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.07)" }}>SSEB 2025 · Personalized for {grocer.name}</span>
                <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.05)" }}>© 2025 Incisiv</span>
              </div>
            </section>
          </>
        )}


        {!isT2 && (<>

        {/* ══ HERO — Command Center ════════════════════════════════════════════ */}
        <section
          ref={el => { sectionRefs.current[0] = el; }}
          style={{ height:"100vh", scrollSnapAlign:"start", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", background:"#080c12" }}
        >
          {/* Ambient glow top-left */}
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 60% 70% at 0% 0%,${rgba(brand,0.13)} 0%,transparent 55%)`, pointerEvents:"none" }} />
          <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 40% 40% at 100% 100%,${rgba(brand,0.06)} 0%,transparent 55%)`, pointerEvents:"none" }} />

          {/* Top bar — eyebrow */}
          <div className="ru" style={{ animationDelay:"0.02s", padding:"28px 8vw 0", display:"flex", justifyContent:"space-between", alignItems:"center", position:"relative", zIndex:2 }}>
            <div style={{ display:"flex", alignItems:"center", gap:"10px" }}>
              <div style={{ width:"16px", height:"1px", background:brand }} />
              <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.18em", textTransform:"uppercase", color:rgba(brand,0.75) }}>SSEB · 2025</span>
            </div>
            <span style={{ fontSize:"10px", color:"rgba(255,255,255,0.18)", letterSpacing:"0.06em" }}>Personalized for {grocer.name}</span>
          </div>

          {/* Main content — fills remaining height */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 8vw", position:"relative", zIndex:2, gap:"0" }}>

            {/* Grocer name — large accent */}
            <div className="ru" style={{ animationDelay:"0.06s", fontSize:"clamp(0.7rem,1vw,0.85rem)", fontWeight:700, letterSpacing:"0.22em", textTransform:"uppercase", color:rgba(brand,0.5), marginBottom:"16px" }}>
              {grocer.shortName.toUpperCase()}
            </div>

            {/* Main headline — full width, very large */}
            <h1 className="ru" style={{ animationDelay:"0.1s", fontSize:"clamp(1.8rem,2.8vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.0, letterSpacing:"-0.04em", maxWidth:"22ch", marginBottom:"32px" }}>
              {grocer.heroHeadline}
            </h1>

            {/* Divider */}
            <div className="rfi" style={{ animationDelay:"0.14s", height:"1px", background:`linear-gradient(90deg,${rgba(brand,0.7)},rgba(255,255,255,0.06),transparent)`, maxWidth:"60vw", marginBottom:"32px" }} />

            {/* Stats row — large numbers spread horizontally */}
            <div className="ru" style={{ animationDelay:"0.16s", display:"flex", gap:"0", marginBottom:"36px" }}>
              {grocer.contextStat.map((s, i) => (
                <div key={i} style={{ paddingRight:"48px", marginRight:"48px", borderRight: i < grocer.contextStat.length-1 ? "1px solid rgba(255,255,255,0.07)" : "none" }}>
                  <div style={{ fontSize:"clamp(2.2rem,4vw,4.8rem)", fontWeight:900, color: i===0 ? brandLight : "rgba(255,255,255,0.5)", letterSpacing:"-0.05em", lineHeight:0.9, marginBottom:"10px" }}>
                    {s.value}
                  </div>
                  <div style={{ fontSize:"11px", color:"rgba(255,255,255,0.28)", lineHeight:1.5, maxWidth:"200px" }}>{s.label}</div>
                </div>
              ))}
            </div>

            {/* Subheadline + CTA row */}
            <div className="ru" style={{ animationDelay:"0.2s", display:"flex", alignItems:"flex-end", justifyContent:"space-between", gap:"40px" }}>
              <p style={{ fontSize:"clamp(0.9rem,1.1vw,1rem)", color:"rgba(255,255,255,0.32)", lineHeight:1.75, maxWidth:"480px", margin:0 }}>
                {grocer.heroSubheadline}
              </p>
              <button onClick={() => scrollTo(1)} style={{ flexShrink:0, padding:"14px 32px", background:brand, border:"none", color:"#fff", cursor:"pointer", fontSize:"11px", fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", boxShadow:`0 0 32px ${rgba(brand,0.45)}` }}>
                View {total} Findings →
              </button>
            </div>
          </div>

          {/* Bottom rule */}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.04)", position:"relative", zIndex:2 }} />
          <div style={{ padding:"12px 8vw", display:"flex", justifyContent:"space-between", position:"relative", zIndex:2 }}>
            <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.12)", letterSpacing:"0.1em", fontWeight:700 }}>INCISIV × DIEBOLD NIXDORF</span>
            <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.08)" }}>131 retail executives · 2,533 shoppers</span>
          </div>

        </section>

        {/* ══ T1 · FINDINGS 01–06 — alternating Layout A / Layout B ══════════
            Layout A (odd): text left 55%, stat+bullets right 45%
            Layout B (even): stat+bullets left 45%, text right 55%
            Both follow the same content flow: Title → Hook → Body → Stat → Bullets
        ═════════════════════════════════════════════════════════════════════= */}
        {[0,1,2,3,4,5].map((idx) => grocer.provocations[idx] && (() => {
          const p = grocer.provocations[idx];
          const isA = idx % 2 === 0; // Layout A on odd findings (1,3,5), B on even (2,4,6)

          const textCol = (
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:`56px ${isA?"48px":"8vw"} 56px ${isA?"8vw":"48px"}`, borderRight:isA?`1px solid rgba(255,255,255,0.06)`:"none", borderLeft:isA?"none":`1px solid rgba(255,255,255,0.06)`, position:"relative", zIndex:1, gap:"20px" }}>
              <div className="ru" style={{ animationDelay:"0.04s", display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:rgba(brand,0.8) }}>Finding {p.number}</span>
                <span style={{ color:"rgba(255,255,255,0.14)", fontSize:"10px" }}>/ {total}</span>
              </div>
              <h2 className="ru" style={{ animationDelay:"0.08s", fontSize:"clamp(1.6rem,2.4vw,2.6rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.04em", margin:0 }}>{p.title}</h2>
              <p className="ru" style={{ animationDelay:"0.12s", fontSize:"clamp(1rem,1.4vw,1.3rem)", fontStyle:"italic", color:"rgba(255,255,255,0.68)", lineHeight:1.5, margin:0 }}>&ldquo;{p.hook}&rdquo;</p>
              <div className="rfi" style={{ animationDelay:"0.14s", height:"1px", background:`linear-gradient(90deg,${isA?"":"transparent,"}${rgba(brand,0.4)}${isA?",transparent":""})`}} />
              <p className="ru" style={{ animationDelay:"0.16s", fontSize:"clamp(1rem,1.2vw,1.1rem)", color:"rgba(255,255,255,0.5)", lineHeight:1.9, margin:0 }}>{p.body}</p>
            </div>
          );

          const statCol = (
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:`56px ${isA?"8vw":"48px"} 56px ${isA?"48px":"8vw"}`, position:"relative", zIndex:1, gap:"20px" }}>
              {/* Stat + label inline */}
              <div className="ru" style={{ animationDelay:"0.1s", display:"flex", alignItems:"center", gap:"16px" }}>
                <div style={{ fontSize:"clamp(3.5rem,6vw,7rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:brandLight, "--sb-color":rgba(brand,.55), animation:"statBreathe 2.5s ease-in-out infinite", flexShrink:0 } as React.CSSProperties}>{p.stat}</div>
                <p style={{ fontSize:"clamp(0.85rem,1vw,1rem)", color:"rgba(255,255,255,0.45)", lineHeight:1.4, maxWidth:"160px", margin:0 }}>{p.statLabel}</p>
              </div>
              <div className="rfi" style={{ animationDelay:"0.16s", height:"1px", background:"rgba(255,255,255,0.06)" }} />
              {/* Bullets in a box */}
              <div className="ru" style={{ animationDelay:"0.18s", display:"flex", flexDirection:"column", gap:"0", border:`1px solid ${rgba(brand,0.25)}`, borderRadius:"8px", overflow:"hidden", background:rgba(brand,0.05) }}>
                {p.bullets.map((b,bi) => (
                  <div key={bi} style={{ display:"flex", gap:"14px", alignItems:"flex-start", padding:"14px 18px", borderTop: bi>0 ? `1px solid ${rgba(brand,0.15)}` : "none" }}>
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:brandLight, flexShrink:0, marginTop:"7px" }} />
                    <p style={{ fontSize:"clamp(0.9rem,1.05vw,1rem)", color:"rgba(255,255,255,0.55)", lineHeight:1.6, margin:0 }}>{b}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:"9px", color:"rgba(255,255,255,0.1)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 retail executives · 2,533 shoppers</p>
            </div>
          );

          return (
            <section key={idx} ref={el => { sectionRefs.current[idx+1] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"grid", gridTemplateColumns:isA?"55% 45%":"45% 55%", position:"relative", overflow:"hidden", background:"#080c12" }}>
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 55% 65% at ${isA?"100%":"0%"} 50%,${rgba(brand,0.1)} 0%,transparent 55%)`, pointerEvents:"none" }} />
              {isA ? <>{textCol}{statCol}</> : <>{statCol}{textCol}</>}
            </section>
          );
        })())}
        {/* ══ END ═══════════════════════════════════════════════════════════════ */}
        <section
          ref={el => { sectionRefs.current[total + 1] = el; }}
          style={{
            height: "100vh", scrollSnapAlign: "start",
            display: "flex", flexDirection: "column", justifyContent: "center",
            paddingTop: "44px", position: "relative", overflow: "hidden",
          }}
        >
          <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 60% 60% at 50% 50%, ${rgba(brand, 0.07)} 0%, transparent 70%)`, pointerEvents: "none" }} />

          <div className="ru" style={{ position: "relative", maxWidth: "960px", margin: "0 auto", padding: "0 56px", width: "100%" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "28px" }}>
              <div style={{ width: "16px", height: "1px", background: rgba(brand, 0.6) }} />
              <span style={{ fontSize: "10px", fontWeight: 600, letterSpacing: "0.14em", textTransform: "uppercase", color: rgba(brand, 0.6) }}>End of Report</span>
            </div>

            <h2 style={{
              fontSize: "clamp(1.6rem, 2.4vw, 2.8rem)",
              fontWeight: 900, color: "#fff",
              lineHeight: 1.04, letterSpacing: "-0.04em",
              marginBottom: "20px", maxWidth: "640px",
            }}>
              Take the Next Step with {grocer.shortName}
            </h2>

            <div style={{ height: "1px", background: `linear-gradient(90deg, ${rgba(brand, 0.5)}, transparent)`, marginBottom: "28px" }} />

            <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.3)", lineHeight: 1.75, maxWidth: "480px", marginBottom: "36px" }}>
              The full SSEB report includes the complete maturity framework, retailer benchmarking, and a prioritized roadmap built for your scale.
            </p>

            <div style={{ display: "flex", gap: "12px" }}>
              <button style={{
                padding: "13px 28px", borderRadius: "4px",
                background: brand, color: "#fff", border: "none", cursor: "pointer",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
                boxShadow: `0 4px 24px ${rgba(brand, 0.3)}`,
              }}>
                Access Full Report
              </button>
              <button style={{
                padding: "13px 28px", borderRadius: "4px",
                background: "transparent", border: "1px solid rgba(255,255,255,0.12)",
                color: "rgba(255,255,255,0.5)", cursor: "pointer",
                fontSize: "11px", fontWeight: 700, letterSpacing: "0.08em", textTransform: "uppercase",
              }}>
                Connect With Us
              </button>
              <button onClick={() => scrollTo(0)} style={{
                padding: "13px 20px", background: "none", border: "none",
                color: "rgba(255,255,255,0.18)", cursor: "pointer",
                fontSize: "11px", letterSpacing: "0.08em",
              }}>
                ↑ Back to top
              </button>
            </div>
          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 56px", borderTop: "1px solid rgba(255,255,255,0.04)", display: "flex", justifyContent: "space-between" }}>
            <div style={{ display: "flex", gap: "5px", alignItems: "center" }}>
              <span style={{ fontSize: "9px", fontWeight: 800, color: "rgba(255,255,255,0.12)", letterSpacing: "0.1em" }}>INCISIV</span>
              <span style={{ fontSize: "7px", color: "rgba(255,255,255,0.06)" }}>×</span>
              <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.08)" }}>DIEBOLD NIXDORF</span>
            </div>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.08)" }}>SSEB 2025 · Personalized for {grocer.name}</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.06)" }}>© 2025 Incisiv</span>
          </div>
        </section>

        </>)}

      </div>
    </div>
  );
}

function CustomCursor({ brand }: { brand: string }) {
  const brandLight = lighten(brand);
  const [pos, setPos] = useState({ x: -100, y: -100 });
  const [down, setDown] = useState(false);
  useEffect(() => {
    const m = (e: MouseEvent) => setPos({ x: e.clientX, y: e.clientY });
    const d = () => setDown(true);
    const u = () => setDown(false);
    window.addEventListener("mousemove", m);
    window.addEventListener("mousedown", d);
    window.addEventListener("mouseup", u);
    return () => {
      window.removeEventListener("mousemove", m);
      window.removeEventListener("mousedown", d);
      window.removeEventListener("mouseup", u);
    };
  }, []);
  return (
    <>
      <div style={{
        position: "fixed", zIndex: 9999, pointerEvents: "none",
        left: pos.x, top: pos.y,
        width: down ? "22px" : "30px", height: down ? "22px" : "30px",
        borderRadius: "50%", border: `1px solid ${rgba(brand, 0.45)}`,
        transform: "translate(-50%,-50%)",
        transition: "width 0.12s, height 0.12s",
      }} />
      <div style={{
        position: "fixed", zIndex: 9999, pointerEvents: "none",
        left: pos.x, top: pos.y,
        width: "3px", height: "3px", borderRadius: "50%",
        background: brandLight, transform: "translate(-50%,-50%)",
      }} />
    </>
  );
}
