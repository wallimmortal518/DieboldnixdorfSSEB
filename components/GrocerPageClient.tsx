"use client";

import Image from "next/image";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
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

function WordFadeTitle({ text, style }: { text: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLHeadingElement>(null);
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.3 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const words = text.split(" ");
  return (
    <h2 ref={ref} style={{ ...style, overflow: "hidden" }}>
      {words.map((word, i) => (
        <span key={i} style={{
          display: "inline-block",
          marginRight: "0.28em",
          opacity: started ? 1 : 0,
          transform: started ? "translateY(0)" : "translateY(18px)",
          transition: `opacity 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms, transform 0.5s cubic-bezier(0.16,1,0.3,1) ${i * 55}ms`,
        }}>{word}</span>
      ))}
    </h2>
  );
}

function CountUpStat({ value, suffix = "%", style }: { value: number; suffix?: string; style?: React.CSSProperties }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [digits, setDigits] = useState<number[]>(() => String(value).split("").map(Number));
  const [started, setStarted] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setStarted(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  useEffect(() => {
    if (!started) return;
    const target = String(value).split("").map(Number);
    const totalTicks = 18;
    let tick = 0;
    const interval = setInterval(() => {
      tick++;
      const progress = tick / totalTicks;
      setDigits(target.map((d, i) => {
        // Each digit locks in staggered — earlier digits lock sooner
        const lockAt = (i + 1) / target.length;
        if (progress >= lockAt) return d;
        return Math.floor(Math.random() * 10);
      }));
      if (tick >= totalTicks) {
        setDigits(target);
        clearInterval(interval);
      }
    }, 55);
    return () => clearInterval(interval);
  }, [started, value]);

  return <span ref={ref} style={{ ...style, fontVariantNumeric:"tabular-nums" }}>{digits.join("")}{suffix}</span>;
}

type Theme = "theme1" | "theme2";

export default function GrocerPageClient({ grocer }: { grocer: GrocerData }) {
  const router = useRouter();

  // Auth guard: ensure the URL grocer matches what the user logged in as
  useEffect(() => {
    const authorizedId = sessionStorage.getItem("sseb_grocer_id");
    if (!authorizedId) {
      router.replace("/");
    } else if (authorizedId !== grocer.id) {
      router.replace(`/${authorizedId}`);
    }
  }, [grocer.id, router]);

  const [theme, setTheme] = useState<Theme>("theme1");
  const brand = grocer.accentColor;
  const brandLight = lighten(brand);
  const total = grocer.provocations.length;
  const totalSections = total + 2;

  const [activeIdx, setActiveIdx] = useState(0);
  const [rippleIdx, setRippleIdx] = useState<number | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const sectionRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    const root = scrollRef.current;
    if (!root) return;
    // Reset scroll to top on theme change so snap positions are correct
    root.scrollTo({ top: 0 });
    setActiveIdx(0);
    let obs: IntersectionObserver;
    const timer = setTimeout(() => {
      obs = new IntersectionObserver(
        entries => entries.forEach(e => {
          if (e.isIntersecting) {
            const idx = sectionRefs.current.indexOf(e.target as HTMLElement);
            if (idx !== -1) setActiveIdx(idx);
          }
        }),
        { root, threshold: 0.5 }
      );
      sectionRefs.current.forEach(el => el && obs.observe(el));
    }, 100);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, [theme]);

  const scrollTo = (idx: number) => {
    if (!scrollRef.current) return;
    scrollRef.current.scrollTo({ top: idx * window.innerHeight, behavior: "smooth" });
  };

  const isLight = theme === "theme2";
  const isLightNav = isLight;
  // Scroll-reveal: wire up .reveal elements for T2 and light theme
  useEffect(() => {
    if (!isLight) return;
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
  }, [isLight]);

  // Scroll-reveal: wire up .t1-reveal elements for T1
  useEffect(() => {
    if (isLight) return;
    const root = scrollRef.current;
    if (!root) return;
    let obs: IntersectionObserver;
    const timer = setTimeout(() => {
      const els = root.querySelectorAll<HTMLElement>(".t1-reveal");
      // reset visibility so re-running after theme switch works
      els.forEach(el => el.classList.remove("t1-visible"));
      obs = new IntersectionObserver(
        entries => entries.forEach(e => { if (e.isIntersecting) e.target.classList.add("t1-visible"); }),
        { root, threshold: 0.08, rootMargin: "0px 0px -20px 0px" }
      );
      els.forEach(el => obs.observe(el));
    }, 50);
    return () => { clearTimeout(timer); obs?.disconnect(); };
  }, [isLight]);

  return (
    <div style={{ background: isLight ? "#f8f8f6" : "#080c12", position: "relative", cursor: "none" }}>
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
        @keyframes heroOrb1      { 0%{transform:translate(0,0) scale(1);opacity:.9} 33%{transform:translate(12%,-8%) scale(1.25);opacity:1} 66%{transform:translate(-8%,10%) scale(.82);opacity:.75} 100%{transform:translate(0,0) scale(1);opacity:.9} }
        @keyframes heroOrb2      { 0%{transform:translate(0,0) scale(1);opacity:.85} 40%{transform:translate(-14%,10%) scale(1.3);opacity:1} 70%{transform:translate(10%,-6%) scale(.8);opacity:.7} 100%{transform:translate(0,0) scale(1);opacity:.85} }
        @keyframes heroOrb3      { 0%{transform:translate(0,0) scale(.9);opacity:.6} 50%{transform:translate(8%,14%) scale(1.2);opacity:1} 100%{transform:translate(0,0) scale(.9);opacity:.6} }
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
          padding: 13px 28px; border-radius: 7px;
          background: #7c3aed; border: none; color: #fff; cursor: pointer;
          font-family: var(--font-heading), sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .04em;
          box-shadow: 0 4px 28px rgba(124,58,237,.45);
          transition: transform .2s, box-shadow .2s;
        }
        .t2-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 36px rgba(124,58,237,.55); }
        .t2-btn-ghost {
          display: inline-flex; align-items: center; gap: 8px;
          padding: 13px 28px; border-radius: 7px;
          background: rgba(255,255,255,.04); border: 1px solid rgba(255,255,255,.14);
          backdrop-filter: blur(12px); color: rgba(220,215,255,.65); cursor: pointer;
          font-family: var(--font-heading), sans-serif; font-size: 12px; font-weight: 700; letter-spacing: .04em;
          transition: transform .2s, background .2s;
        }
        .t2-btn-ghost:hover { transform: translateY(-2px); background: rgba(255,255,255,.08); }

        ::-webkit-scrollbar { display: none; }

        /* ── T1 bullet box — spinning conic border ── */
        @keyframes t1SpinBorder { from { transform: translate(-50%,-50%) rotate(0deg); } to { transform: translate(-50%,-50%) rotate(360deg); } }
        .t1-bullet-box {
          position: relative;
          border-radius: 7px;
          background: var(--bb-bg, rgba(124,58,237,.05));
          overflow: hidden;
        }
        .t1-bullet-box::before {
          content: '';
          position: absolute;
          top: 50%; left: 50%;
          width: 300%; height: 300%;
          background: conic-gradient(from 0deg, transparent 85%, var(--bb-color-bright, rgba(124,58,237,.9)) 92%, transparent 100%);
          animation: t1SpinBorder 4s linear infinite;
          z-index: 0;
        }
        .t1-bullet-box::after {
          content: '';
          position: absolute;
          inset: 1px;
          border-radius: 6px;
          background: var(--bb-fill, #080c12);
          z-index: 1;
        }
        .t1-bullet-grad {
          position: absolute; inset: 1px; border-radius: 6px;
          background: linear-gradient(135deg, var(--bb-grad-start, rgba(124,58,237,.06)) 0%, transparent 55%);
          z-index: 2; pointer-events: none;
        }
        .t1-bullet-box > *:not(.t1-bullet-grad) { position: relative; z-index: 3; }

        /* ── T1 scroll-reveal for bullet rows ── */
        .t1-reveal         { opacity:0; transform:translateY(14px); transition: opacity 0.55s cubic-bezier(0.16,1,0.3,1), transform 0.55s cubic-bezier(0.16,1,0.3,1); }
        .t1-reveal.t1-visible { opacity:1; transform:translateY(0); }
        .t1-reveal-d1      { transition-delay: 80ms; }
        .t1-reveal-d2      { transition-delay: 180ms; }
        .t1-reveal-d3      { transition-delay: 280ms; }

      `}</style>

      {/* ── NAV ── */}

      {/* Top-left: brand identity */}
      <div style={{
        position: "fixed", top: "20px", left: "28px", zIndex: 50,
        display: "flex", alignItems: "center", gap: "10px",
        pointerEvents: "none",
      }}>
        <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: brand, boxShadow: `0 0 10px ${rgba(brand, 0.9)}` }} />
        <span style={{ fontSize: "10px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: isLightNav ? "rgba(0,0,0,0.45)" : "rgba(255,255,255,0.4)" }}>
          SSEB · 2025
        </span>
      </div>

      {/* ── Right-side vertical floating nav ── */}
      <style>{`
        @keyframes sidenavEnter {
          from { opacity: 0; transform: translateX(20px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes inkDrop {
          0%   { transform: translate(-50%, -50%) scale(0.2); opacity: 0.6; }
          60%  { opacity: 0.25; }
          100% { transform: translate(-50%, -50%) scale(4.5); opacity: 0; }
        }
        @keyframes dotSettle {
          0%   { transform: scale(1); }
          40%  { transform: scale(1.45); }
          70%  { transform: scale(0.9); }
          100% { transform: scale(1); }
        }
        .sidenav-ink {
          position: absolute; top: 50%; left: 50%;
          width: 16px; height: 16px; border-radius: 50%;
          border: 1px solid var(--dot-color);
          background: transparent;
          pointer-events: none;
          animation: inkDrop 0.9s cubic-bezier(0.2,0.8,0.2,1) forwards;
        }
        .sidenav-dot-flash {
          animation: dotSettle 0.6s cubic-bezier(0.34,1.56,0.64,1) forwards !important;
        }
        @keyframes dotPulse {
          0%, 100% { box-shadow: 0 0 0 0 var(--dot-color), 0 0 6px var(--dot-color); }
          60%       { box-shadow: 0 0 0 5px transparent, 0 0 16px var(--dot-color); }
        }
        @keyframes progressFlow {
          0%   { background-position: 0% 0%; }
          100% { background-position: 0% 100%; }
        }
        .sidenav-item {
          display: flex; align-items: center; justify-content: flex-end; gap: 10px;
          cursor: pointer; opacity: 0;
          animation: sidenavEnter 0.6s cubic-bezier(0.16,1,0.3,1) forwards;
        }
        .sidenav-label-wrap {
          display: grid; grid-template-columns: 0fr;
          transition: grid-template-columns 0.45s cubic-bezier(0.4,0,0.2,1);
        }
        .sidenav-item:hover .sidenav-label-wrap { grid-template-columns: 1fr; }
        .sidenav-label {
          font-size: 10px; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;
          white-space: nowrap; overflow: hidden; min-width: 0;
          opacity: 0; transform: translateX(10px);
          transition: opacity 0.3s ease 0.1s, transform 0.4s cubic-bezier(0.16,1,0.3,1) 0.06s;
          pointer-events: none;
        }
        .sidenav-item:hover .sidenav-label { opacity: 1; transform: translateX(0); }
        .sidenav-dot {
          flex-shrink: 0; border-radius: 50%;
          transition:
            width  0.45s cubic-bezier(0.34,1.56,0.64,1),
            height 0.45s cubic-bezier(0.34,1.56,0.64,1),
            background 0.3s ease,
            box-shadow 0.3s ease,
            transform 0.4s cubic-bezier(0.34,1.56,0.64,1);
        }
        .sidenav-item:hover:not(.active) .sidenav-dot { transform: scale(1.6); }
        .sidenav-item.active .sidenav-dot {
          animation: dotPulse 2.8s ease-in-out infinite;
        }
      `}</style>
      <nav style={{
        position: "fixed", right: "24px", top: "50%", transform: "translateY(-50%)",
        zIndex: 50,
        display: "flex", flexDirection: "column", alignItems: "flex-end",
      }}>
        {(() => {
          const navItems = [
            { label: "Overview", idx: 0, number: "" },
            ...grocer.provocations.map((p, i) => ({ label: p.title.replace(/^The\s+/i, ""), idx: i + 1, number: p.number ?? "" })),
            { label: "Next Steps", idx: total + 1, number: "" },
          ];
          const totalItems = navItems.length;
          // progress: fraction of line filled (0 → 1)
          const progress = activeIdx / (totalItems - 1);

          return navItems.map((item, si) => {
            const isActive = activeIdx === item.idx;
            const isDone = activeIdx > item.idx;
            const labelColor = isActive
              ? (isLightNav ? "rgba(0,0,0,0.85)" : "#fff")
              : isLightNav ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)";
            const trackColor = isLightNav ? "rgba(0,0,0,0.1)" : "rgba(255,255,255,0.1)";
            const doneColor = rgba(brand, 0.45);
            const isLast = si === totalItems - 1;

            return (
              <div key={item.idx} style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
                <button
                  onClick={() => {
                    setRippleIdx(item.idx);
                    setTimeout(() => setRippleIdx(null), 900);
                    scrollTo(item.idx);
                  }}
                  className={`sidenav-item${isActive ? " active" : ""}`}
                  style={{
                    background: "none", border: "none", padding: "3px 0",
                    display: "flex", alignItems: "center", justifyContent: "flex-end", gap: "10px",
                    cursor: "pointer",
                    animationDelay: `${si * 70}ms`,
                  }}
                >
                  <div className="sidenav-label-wrap">
                    <span className="sidenav-label" style={{ color: labelColor }}>
                      {item.number ? `${item.number}  ${item.label}` : item.label}
                    </span>
                  </div>
                  {/* Dot — grows when active, particles + beam on click */}
                  <span style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center", width: "16px", height: "16px", flexShrink: 0 }}>
                    <span
                      className={`sidenav-dot${rippleIdx === item.idx ? " sidenav-dot-flash" : ""}`}
                      style={{
                        width:  isActive ? "11px" : "7px",
                        height: isActive ? "11px" : "7px",
                        background: isActive ? brand : isDone ? doneColor : isLightNav ? "rgba(0,0,0,0.18)" : "rgba(255,255,255,0.2)",
                        boxShadow: isActive ? `0 0 10px ${rgba(brand, 0.6)}` : "none",
                        ["--dot-color" as string]: rgba(brand, 0.6),
                      } as React.CSSProperties}
                    />
                    {rippleIdx === item.idx && (
                      <span className="sidenav-ink" style={{ ["--dot-color" as string]: rgba(brand, 0.7) } as React.CSSProperties} />
                    )}
                  </span>
                </button>

                {/* Connector segment between dots */}
                {!isLast && (
                  <div style={{
                    width: "2px", height: "18px",
                    marginRight: "7px",
                    borderRadius: "2px",
                    background: trackColor,
                    overflow: "hidden",
                    position: "relative",
                  }}>
                    {/* filled portion */}
                    <div style={{
                      position: "absolute", top: 0, left: 0, right: 0,
                      height: isDone ? "100%" : isActive ? "50%" : "0%",
                      background: `linear-gradient(to bottom, ${brand}, ${rgba(brand, 0.5)})`,
                      transition: "height 0.5s cubic-bezier(0.4,0,0.2,1)",
                      borderRadius: "2px",
                    }} />
                  </div>
                )}
              </div>
            );
          });
        })()}
      </nav>

      {/* Top-right: utilities */}
      <div style={{
        position: "fixed", top: "14px", right: "20px", zIndex: 50,
        display: "flex", alignItems: "center", gap: "10px",
      }}>
        {/* Powered by */}
        <div style={{ display: "flex", alignItems: "center", gap: "7px" }}>
          <span style={{ fontSize: "8px", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: isLightNav ? "rgba(0,0,0,0.35)" : "rgba(255,255,255,0.35)", whiteSpace: "nowrap" }}>Powered by</span>
          <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={28} height={21} style={{ objectFit: "contain", filter: isLightNav ? "none" : "brightness(0) invert(1)", opacity: 0.75, display: "block" }} />
        </div>

        {/* Theme toggle + logout pill */}
        <div style={{
          display: "flex", alignItems: "center", gap: "8px",
          padding: "7px 10px", borderRadius: "100px",
          background: isLightNav ? "rgba(255,255,255,0.82)" : "rgba(10,10,20,0.78)",
          backdropFilter: "blur(28px)", WebkitBackdropFilter: "blur(28px)",
          border: isLightNav ? "1px solid rgba(0,0,0,0.1)" : "1px solid rgba(255,255,255,0.1)",
          boxShadow: isLightNav ? "0 8px 32px rgba(0,0,0,0.1)" : "0 8px 32px rgba(0,0,0,0.5)",
        }}>
          <button onClick={() => setTheme(t => t === "theme1" ? "theme2" : "theme1")} title={isLight ? "Switch to Dark" : "Switch to Light"}
            style={{ padding: "0", borderRadius: "20px", border: "none", background: isLightNav ? "rgba(0,0,0,0.08)" : "rgba(255,255,255,0.1)", cursor: "pointer", width: "36px", height: "20px", position: "relative", transition: "background 0.2s", flexShrink: 0 }}>
            <span style={{ position: "absolute", inset: 0, borderRadius: "20px", border: isLightNav ? "1px solid rgba(0,0,0,0.12)" : "1px solid rgba(255,255,255,0.12)" }} />
            <span style={{ position: "absolute", left: isLightNav ? "17px" : "2px", top: "1px", width: "16px", height: "16px", borderRadius: "50%", background: isLightNav ? "#1e1b3a" : "#fff", boxShadow: isLightNav ? "0 1px 4px rgba(0,0,0,0.4)" : "0 1px 4px rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", transition: "left 0.2s cubic-bezier(0.4,0,0.2,1)" }}>
              {isLightNav ? <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="rgba(167,139,250,0.9)" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M21 12.79A9 9 0 1111.21 3 7 7 0 0021 12.79z" /></svg>
                          : <svg width="8" height="8" fill="none" viewBox="0 0 24 24" stroke="rgba(100,100,120,0.7)" strokeWidth={2}><circle cx="12" cy="12" r="4" /><path strokeLinecap="round" d="M12 2v2M12 20v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M2 12h2M20 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" /></svg>}
            </span>
          </button>
          <div style={{ width: "1px", height: "14px", background: isLightNav ? "rgba(0,0,0,0.12)" : "rgba(255,255,255,0.12)" }} />
          <button onClick={() => { sessionStorage.removeItem("sseb_grocer_id"); router.replace("/"); }} title="Log out"
            style={{ display: "flex", alignItems: "center", gap: "4px", padding: "3px 6px", borderRadius: "7px", border: "none", cursor: "pointer", background: "transparent", color: isLightNav ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)", fontSize: "9px", fontWeight: 600, letterSpacing: "0.06em", textTransform: "uppercase", transition: "color 0.15s" }}
            onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.color = isLightNav ? "rgba(0,0,0,0.85)" : "#fff"; }}
            onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.color = isLightNav ? "rgba(0,0,0,0.4)" : "rgba(255,255,255,0.4)"; }}>
            <svg width="10" height="10" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
            Logout
          </button>
        </div>
      </div>

      {/* ── NAV SPACER — pushes content below the 85px nav ── */}

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
          overscrollBehavior: "contain",
        }}
      >
        {/* ══ LIGHT THEME ══════════════════════════════════════════════════════ */}
        {isLight && (
          <>
            {/* LIGHT HERO */}
            <section
              ref={el => { sectionRefs.current[0] = el; }}
              style={{ height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", position: "relative", overflow: "hidden", display: "flex", flexDirection: "column", background: "#fafaf8" }}
            >
              {/* Base: clean white */}
              <div style={{ position: "absolute", inset: 0, background: "#fafaf8", zIndex: 0 }} />
              {/* Orb 1 — brand, top-right bloom */}
              <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "75vw", height: "80vh", background: `radial-gradient(ellipse, ${rgba(brand,.28)} 0%, ${rgba(brand,.1)} 38%, transparent 65%)`, animation: "heroOrb1 14s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Orb 2 — brand, bottom-left */}
              <div style={{ position: "absolute", bottom: "-15%", left: "-10%", width: "60vw", height: "65vh", background: `radial-gradient(ellipse, ${rgba(brand,.22)} 0%, ${rgba(brand,.07)} 40%, transparent 65%)`, animation: "heroOrb2 10s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Orb 3 — center-right soft pulse */}
              <div style={{ position: "absolute", top: "25%", right: "10%", width: "50vw", height: "50vh", background: `radial-gradient(ellipse, ${rgba(brand,.14)} 0%, transparent 60%)`, animation: "heroOrb3 7s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* White centre mask — keeps text area bright and clean */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 70% 70% at 30% 50%, rgba(250,250,248,0.82) 0%, rgba(250,250,248,0.45) 55%, transparent 80%)", zIndex: 2, pointerEvents: "none" }} />


              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw", position: "relative", zIndex: 2, gap: "0" }}>
                <div className="ru" style={{ animationDelay: "0.06s", marginBottom: "20px" }}>
                  <img src={grocer.logoUrl} alt={grocer.shortName} style={{ height: `${grocer.logoHeight ?? 36}px`, width: "auto", maxWidth: "200px", objectFit: "contain", display: "block" }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
                </div>
                <h1 className="ru" style={{ animationDelay: "0.1s", fontSize: "clamp(1.8rem,2.8vw,3rem)", fontWeight: 900, color: "#111", lineHeight: 1.0, letterSpacing: "-0.04em", maxWidth: "22ch", marginBottom: "32px" }}>
                  {grocer.heroHeadline}
                </h1>
                <div className="rfi" style={{ animationDelay: "0.14s", height: "1px", background: `linear-gradient(90deg, ${rgba(brand, 0.5)}, rgba(0,0,0,0.05), transparent)`, maxWidth: "60vw", marginBottom: "32px" }} />
                <div className="ru" style={{ animationDelay: "0.16s", display: "flex", gap: "0", marginBottom: "36px" }}>
                  {grocer.contextStat.map((s, i) => (
                    <div key={i} style={{ paddingRight: "48px", marginRight: "48px", borderRight: i < grocer.contextStat.length - 1 ? "1px solid rgba(0,0,0,0.08)" : "none" }}>
                      <div style={{ fontSize: "clamp(2.2rem,4vw,4.8rem)", fontWeight: 900, color: i === 0 ? brand : "rgba(0,0,0,0.25)", letterSpacing: "-0.05em", lineHeight: 0.9, marginBottom: "10px" }}>
                        {s.value}
                      </div>
                      <div style={{ fontSize: "11px", color: "rgba(0,0,0,0.35)", lineHeight: 1.5, maxWidth: "200px" }}>{s.label}</div>
                    </div>
                  ))}
                </div>
                <div className="ru" style={{ animationDelay: "0.2s", display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: "40px" }}>
                  <p style={{ fontSize: "clamp(0.9rem,1.1vw,1rem)", color: "rgba(0,0,0,0.45)", lineHeight: 1.75, maxWidth: "480px", margin: 0 }}>
                    {grocer.heroSubheadline}
                  </p>
                  <button onClick={() => scrollTo(1)} style={{ flexShrink: 0, padding: "14px 32px", borderRadius: "7px", background: brand, border: "none", color: "#fff", cursor: "pointer", fontSize: "11px", fontWeight: 800, letterSpacing: "0.12em", textTransform: "uppercase", boxShadow: `0 4px 20px ${rgba(brand, 0.3)}` }}>
                    View Insights →
                  </button>
                </div>
              </div>

              <div style={{ height: "1px", background: "rgba(0,0,0,0.07)", position: "relative", zIndex: 2 }} />
              <div style={{ padding: "12px 8vw", display: "flex", justifyContent: "space-between", position: "relative", zIndex: 2 }}>
                <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={24} height={18} style={{ objectFit: "contain", opacity: 0.4 }} />
                <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.38)" }}>131 retail executives · 2,533 shoppers</span>
              </div>
            </section>

            {/* LIGHT FINDINGS */}
            {[0,1,2,3,4,5].map((idx) => grocer.provocations[idx] && (() => {
              const p = grocer.provocations[idx];
              const isA = idx % 2 === 0;
              const bg = idx % 2 === 0 ? "#ffffff" : "#f4f4f2";

              const textCol = (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: `56px ${isA ? "48px" : "8vw"} 56px ${isA ? "8vw" : "48px"}`, position: "relative", zIndex: 1, gap: "20px" }}>
                  <div className="ru" style={{ animationDelay: "0.04s", display: "flex", alignItems: "center", gap: "10px" }}>
                    <span style={{ fontSize: "11px", fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: brand }}>{p.title}</span>
                  </div>
                  <WordFadeTitle text={p.hook} style={{ fontSize: "clamp(1.9rem,2.8vw,3rem)", fontWeight: 900, color: "#111", lineHeight: 1.05, letterSpacing: "-0.04em", margin: 0 }} />
                  <div className="rfi" style={{ animationDelay: "0.14s", height: "1px", background: `linear-gradient(90deg, ${rgba(brand, 0.3)}, transparent)` }} />
                  <p className="ru" style={{ animationDelay: "0.16s", fontSize: "clamp(1rem,1.2vw,1.1rem)", color: "rgba(0,0,0,0.65)", lineHeight: 1.9, margin: 0 }}>{p.body}</p>
                  <div className="rfi" style={{ animationDelay:"0.2s", display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(0,0,0,0.6)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(0,0,0,0.15)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(0,0,0,0.05)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(0,0,0,0.3)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(0,0,0,0.15)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
                </div>
              );

              const statCol = (
                <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", padding: `56px ${isA ? "8vw" : "48px"} 56px ${isA ? "48px" : "8vw"}`, position: "relative", zIndex: 1, gap: "20px" }}>
                  <div className="ru" style={{ animationDelay: "0.1s", display: "flex", alignItems: "center", gap: "24px" }}>
                    {(() => {
                      const vsMatch = p.stat.match(/^(\d+)%\s*vs\.?\s*(\d+)%$/i);
                      if (vsMatch) {
                        return (
                          <div style={{ display: "flex", alignItems: "baseline", gap: "8px", flexShrink: 0 }}>
                            <span style={{ fontSize: "clamp(3rem,5vw,5.5rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.06em", color: brand }}>{vsMatch[1]}%</span>
                            <span style={{ fontSize: "clamp(0.85rem,1.1vw,1rem)", fontWeight: 600, color: "rgba(0,0,0,0.25)", letterSpacing: "0.06em", textTransform: "uppercase" }}>vs.</span>
                            <span style={{ fontSize: "clamp(2rem,3.5vw,4rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.06em", color: "rgba(0,0,0,0.2)" }}>{vsMatch[2]}%</span>
                          </div>
                        );
                      }
                      const pctMatch = p.stat.match(/^(\d+)%$/);
                      if (pctMatch) {
                        return <CountUpStat value={parseInt(pctMatch[1])} style={{ fontSize: "clamp(3.5rem,6vw,7rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.06em", color: brand, flexShrink: 0 }} />;
                      }
                      // Try to extract a numeric prefix + suffix (e.g. "16pts", "$0.10+", "2.5x")
                      const generalMatch = p.stat.match(/^([\d.]+)(.*)$/);
                      if (generalMatch && !isNaN(parseFloat(generalMatch[1]))) {
                        const num = parseFloat(generalMatch[1]);
                        const sfx = generalMatch[2] || "";
                        if (Number.isInteger(num)) {
                          return <CountUpStat value={num} suffix={sfx} style={{ fontSize: "clamp(3.5rem,6vw,7rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.06em", color: brand, flexShrink: 0 }} />;
                        }
                      }
                      return <div style={{ fontSize: "clamp(3.5rem,6vw,7rem)", fontWeight: 900, lineHeight: 1, letterSpacing: "-0.06em", color: brand, flexShrink: 0 }}>{p.stat}</div>;
                    })()}
                    <p style={{ fontSize: "clamp(1rem,1.15vw,1.15rem)", color: "rgba(0,0,0,0.4)", lineHeight: 1.4, maxWidth: "160px", margin: 0 }}>{p.statLabel}</p>
                  </div>
                  <div className="reveal reveal-d2" style={{ height: "1px", background: "rgba(0,0,0,0.07)" }} />
                  <div className="reveal reveal-d3">
                    <div className="t1-bullet-box" style={{ display: "flex", flexDirection: "column", gap: "0", "--bb-color-bright": rgba(brand, 0.7), "--bb-grad-start": rgba(brand, 0.18), "--bb-fill": "#ffffff" } as React.CSSProperties}>
                      <div className="t1-bullet-grad" />
                      {p.bullets.map((b, bi) => (
                        <div key={bi} style={{ display: "flex", gap: "14px", alignItems: "flex-start", padding: "14px 18px" }}>
                          <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: brand, flexShrink: 0, marginTop: "7px" }} />
                          <p style={{ fontSize: "clamp(0.9rem,1.05vw,1rem)", color: "rgba(0,0,0,0.5)", lineHeight: 1.6, margin: 0 }}>{b}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  <p style={{ fontSize: "11px", color: "rgba(0,0,0,0.25)", fontStyle: "italic" }}>Source: SSEB 2025 · 131 retail executives · 2,533 shoppers</p>
                </div>
              );

              return (
                <section key={`light-${idx}`} ref={el => { sectionRefs.current[idx + 1] = el; }} style={{ height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "grid", gridTemplateColumns: isA ? "55% 45%" : "45% 55%", position: "relative", overflow: "hidden", background: bg }}>
                  <div style={{ position: "absolute", inset: 0, background: `radial-gradient(ellipse 55% 65% at ${isA ? "100%" : "0%"} 50%, ${rgba(brand, 0.05)} 0%, transparent 55%)`, pointerEvents: "none" }} />
                  {isA ? <>{textCol}{statCol}</> : <>{statCol}{textCol}</>}
                </section>
              );
            })())}

            {/* LIGHT END — CLOSING MANIFESTO */}
            <section
              ref={el => { sectionRefs.current[total + 1] = el; }}
              style={{ height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", flexDirection: "column", justifyContent: "center", padding: "0 8vw", paddingTop: "52px", position: "relative", overflow: "hidden", background: "#f8f8f6" }}
            >
              {/* Ambient accents */}
              <div style={{ position: "absolute", top: "0%", left: "-10%", width: "60vw", height: "60vh", background: `radial-gradient(ellipse,${rgba(brand,.06)} 0%,transparent 58%)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "0%", right: "-5%", width: "50vw", height: "50vh", background: `radial-gradient(ellipse,${rgba(brand,.04)} 0%,transparent 60%)`, pointerEvents: "none" }} />

              <div className="ru" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0" }}>

                {/* ZONE 1: Statement */}
                <div style={{ marginBottom: "36px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                    <div style={{ width: "20px", height: "1px", background: rgba(brand,.55) }} />
                    <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: rgba(brand,.55) }}>Next Steps</span>
                  </div>
                  <h2 style={{ fontSize: "clamp(2.2rem,3.6vw,4.2rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#0a0a0a", margin: 0, maxWidth: "720px" }}>
                    The gap between{" "}
                    <span style={{ color: brand }}>knowing</span>
                    {" "}and{" "}
                    <span style={{ WebkitTextStroke: `1.5px ${rgba(brand,.5)}`, color: "transparent" }}>acting</span>
                    {" "}is where{" "}
                    <span style={{ color: brand }}>{grocer.shortName}</span>
                    {" "}wins or loses.
                  </h2>
                </div>

                {/* ZONE 2: Divider + attribution pills */}
                <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${rgba(brand,.3)},transparent)` }} />
                  {[
                    { v: "131", l: "Retail Executives" },
                    { v: "2,533", l: "Shoppers Surveyed" },
                    { v: "10", l: "Retailers Benchmarked" },
                  ].map((chip) => (
                    <div key={chip.v} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "20px", background: rgba(brand,.05), border: `1px solid ${rgba(brand,.15)}`, flexShrink: 0 }}>
                      <span style={{ fontSize: "13px", fontWeight: 900, color: brand, lineHeight: 1, letterSpacing: "-.04em" }}>{chip.v}</span>
                      <span style={{ fontSize: "9px", color: "rgba(0,0,0,.4)", letterSpacing: ".04em" }}>{chip.l}</span>
                    </div>
                  ))}
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,transparent,${rgba(brand,.1)})` }} />
                </div>

                {/* ZONE 3: Two invitation cards */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                  {/* Card A — Full Report */}
                  <div style={{ borderRadius: "16px", background: "#fff", border: `1px solid ${rgba(brand,.18)}`, boxShadow: `0 4px 24px ${rgba(brand,.08)}`, padding: "32px 28px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.07)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.08), border: `1px solid ${rgba(brand,.2)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brand} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: rgba(brand,.5), marginBottom: "6px" }}>Full Report</div>
                        <div style={{ fontSize: "clamp(1rem,1.5vw,1.4rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "8px" }}>Access the Complete Benchmark</div>
                        <div style={{ fontSize: "11px", color: "rgba(0,0,0,.45)", lineHeight: 1.65 }}>Maturity framework, retailer-by-retailer comparisons, and a prioritized roadmap built for your scale.</div>
                      </div>
                      <div style={{ flex: 1 }} />
                      <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: brand, border: "none", color: "#fff", cursor: "pointer", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "background .2s", display: "flex", alignItems: "center", gap: "7px", boxShadow: `0 4px 16px ${rgba(brand,.25)}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.88"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Download Report →
                      </button>
                    </div>
                  </div>

                  {/* Card B — Schedule Call */}
                  <div style={{ borderRadius: "16px", background: "#fff", border: `1px solid ${rgba(brand,.18)}`, boxShadow: `0 4px 24px ${rgba(brand,.08)}`, padding: "32px 28px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.07)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.08), border: `1px solid ${rgba(brand,.2)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brand} strokeWidth={1.8}><path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/></svg>
                      </div>
                      <div>
                        <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: rgba(brand,.5), marginBottom: "6px" }}>Expert Walkthrough</div>
                        <div style={{ fontSize: "clamp(1rem,1.5vw,1.4rem)", fontWeight: 900, color: "#0a0a0a", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "8px" }}>30-Min Strategy Call</div>
                        <div style={{ fontSize: "11px", color: "rgba(0,0,0,.45)", lineHeight: 1.65 }}>A Diebold Nixdorf consultant walks you through the findings most relevant to {grocer.shortName}&apos;s operations.</div>
                      </div>
                      <div style={{ flex: 1 }} />
                      <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: "transparent", border: `1px solid ${rgba(brand,.35)}`, color: brand, cursor: "pointer", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "all .2s", display: "flex", alignItems: "center", gap: "7px" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = rgba(brand,.06); (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.6); }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.35); }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        Schedule a Call →
                      </button>
                    </div>
                  </div>

                </div>

                {/* Back to top */}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                  <button onClick={() => scrollTo(0)} style={{ padding: "7px 16px", borderRadius: "7px", background: "none", border: "1px solid rgba(0,0,0,0.15)", color: "rgba(0,0,0,0.5)", cursor: "pointer", fontSize: "10px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", transition: "all 0.15s" }}
                    onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(0,0,0,0.05)"; b.style.color = "rgba(0,0,0,0.8)"; }}
                    onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "none"; b.style.color = "rgba(0,0,0,0.5)"; }}>
                    ↑ Back to Top
                  </button>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 8vw", borderTop: "1px solid rgba(0,0,0,0.06)", display: "flex", justifyContent: "space-between", zIndex: 2 }}>
                <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={24} height={18} style={{ objectFit: "contain", opacity: 0.4 }} />
                <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.38)" }}>SSEB 2025 · Personalized for {grocer.name}</span>
                <span style={{ fontSize: "9px", color: "rgba(0,0,0,0.3)" }}>© 2025 Incisiv</span>
              </div>
            </section>
          </>
        )}

        {false && (
          <>
            {/* ══ T2 · HERO ═══════════════════════════════════════════════════════
                Two-zone layout: top 60% = headline content, bottom 40% = stat bento row.
                Headline sits vertically centered in the top zone, stat cards fill bottom.
            ════════════════════════════════════════════════════════════════════════ */}
            <section
              ref={el => { sectionRefs.current[0] = el; }}
              style={{
                height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always",
                display: "flex", flexDirection: "column",
                position: "relative", overflow: "hidden",
                background: "#06040f",
              }}
            >
              {/* ── Hero gradient background — brand-matched animated aurora ── */}
              {/* Base dark */}
              <div style={{ position: "absolute", inset: 0, background: "#06040f", zIndex: 0 }} />
              {/* Orb 1 — large brand blob, top-left, slow drift */}
              <div style={{ position: "absolute", top: "-20%", left: "-15%", width: "80vw", height: "80vh", background: `radial-gradient(ellipse, ${rgba(brand,.55)} 0%, ${rgba(brand,.18)} 35%, transparent 65%)`, animation: "heroOrb1 14s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Orb 2 — brand blob, bottom-right, medium */}
              <div style={{ position: "absolute", bottom: "-15%", right: "-10%", width: "65vw", height: "70vh", background: `radial-gradient(ellipse, ${rgba(brand,.45)} 0%, ${rgba(brand,.12)} 40%, transparent 65%)`, animation: "heroOrb2 10s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Orb 3 — center glow, gentle pulse */}
              <div style={{ position: "absolute", top: "20%", left: "30%", width: "55vw", height: "55vh", background: `radial-gradient(ellipse, ${rgba(brand,.25)} 0%, transparent 60%)`, animation: "heroOrb3 7s ease-in-out infinite", zIndex: 1, pointerEvents: "none" }} />
              {/* Dark vignette on edges only — keeps orbs visible in centre */}
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse 90% 90% at 50% 45%, transparent 45%, rgba(4,3,10,.65) 100%)", zIndex: 2, pointerEvents: "none" }} />
              {/* Left text-area overlay — only darkens left 35% for readability */}
              <div style={{ position: "absolute", inset: 0, background: "linear-gradient(90deg, rgba(4,3,12,.72) 0%, rgba(4,3,12,.3) 35%, transparent 60%)", zIndex: 2, pointerEvents: "none" }} />
              {/* Bottom fade */}
              <div style={{ position: "absolute", bottom: "38%", left: 0, right: 0, height: "120px", background: "linear-gradient(to top, rgba(4,3,12,.55) 0%, transparent 100%)", zIndex: 2, pointerEvents: "none" }} />

              {/* ── ZONE 1: Headline content (flex-grow fills top 60%) ── */}
              <div style={{ flex: 1, display: "flex", flexDirection: "column", justifyContent: "center", position: "relative", zIndex: 4, padding: "72px max(32px,calc(50vw - 620px)) 0" }}>

                {/* Eyebrow badge */}
                <div className="reveal" style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "5px 14px 5px 10px", borderRadius: "20px", background: rgba(brand, .1), border: `1px solid ${rgba(brand, .32)}`, marginBottom: "24px", alignSelf: "flex-start" }}>
                  <div style={{ width: "6px", height: "6px", borderRadius: "50%", background: brand, animation: "blink 2s ease-in-out infinite" }} />
                  <span style={{ fontFamily: "var(--font-heading),sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: ".15em", textTransform: "uppercase", color: brandLight }}>
                    Diebold Nixdorf &nbsp;·&nbsp; SSEB 2025
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
                    View Insights
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}><path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7"/></svg>
                  </button>
                  <button className="t2-btn-ghost">
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Download Report
                  </button>
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
                  <div style={{ width: "16px", height: "1px", background: "rgba(220,215,255,.25)" }} />
                  <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.35)", letterSpacing: ".12em", textTransform: "uppercase" }}>
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
                  <p className="t2-section-label reveal" style={{ marginBottom:"20px" }}>{p.title}</p>
                  {/* Giant stat */}
                  <div className="reveal reveal-d1" style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(4rem,8vw,9rem)", fontWeight:800, lineHeight:.85, color:brandLight, "--sb-color":rgba(brand,.5), animation:"statBreathe 2.5s ease-in-out infinite", marginBottom:"12px" } as React.CSSProperties}>
                    {p.stat}
                  </div>
                  <p className="reveal reveal-d1" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"14px", color:"rgba(220,215,255,.5)", lineHeight:1.5, maxWidth:"220px", marginBottom:"28px" }}>{p.statLabel}</p>
                  <div className="reveal reveal-d2" style={{ height:"1px", background:`linear-gradient(90deg,${rgba(brand,.5)},transparent)`, marginBottom:"22px", width:"80%" }} />

                </div>

                {/* RIGHT — title + body + bullets */}
                <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", paddingLeft:"48px", gap:"20px" }}>
                  <h2 className="t2-section-heading reveal reveal-right" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)" }}>{p.hook}</h2>
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
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.38)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
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
                <p className="t2-section-label reveal">{p.title}</p>
                <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", maxWidth:"680px" }}>{p.hook}</h2>



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
                <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.38)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
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
                  <p className="t2-section-label" style={{ margin:0, textAlign:"right" }}>{p.title}</p>
                </div>

                {/* ── Row 2: title + body side by side ── */}
                <div className="reveal reveal-d1" style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:"40px", marginBottom:"24px" }}>
                  <h2 className="t2-section-heading" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", margin:0 }}>{p.hook}</h2>
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.48)", lineHeight:1.85, margin:0, alignSelf:"center" }}>{p.body}</p>
                </div>

                {/* ── Row 3: pull-quote between rules ── */}


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
                <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
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
                  <p className="t2-section-label reveal">{p.title}</p>
                  <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(2rem,2.8vw,3rem)" }}>{p.hook}</h2>
                  <div className="reveal reveal-d2" style={{ height:"1px", background:`linear-gradient(90deg,${rgba(brand,.5)},transparent)` }} />

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
                  <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.38)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                  <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
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
                <p className="t2-section-label reveal" style={{ marginBottom:"4px" }}>{p.title}</p>
                <h2 className="t2-section-heading reveal reveal-d1" style={{ fontSize:"clamp(1.8rem,2.6vw,2.8rem)", maxWidth:"620px" }}>{p.hook}</h2>

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
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.38)", fontStyle:"italic", marginTop:"4px" }}>Source: SSEB 2025 · 131 executives · 2,533 shoppers</p>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
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
                  <p className="t2-section-label reveal" style={{ marginBottom:"20px" }}>{p.title}</p>
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
                  <h2 className="t2-section-heading reveal reveal-right" style={{ fontSize:"clamp(2rem,2.8vw,3rem)" }}>{p.hook}</h2>



                  {/* Body */}
                  <p className="reveal reveal-right reveal-d2" style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"1rem", color:"rgba(220,215,255,.45)", lineHeight:1.85 }}>{p.body}</p>

                  {/* Stat + source row */}
                  <div className="reveal reveal-right reveal-d3" style={{ display:"flex", alignItems:"center", gap:"20px", paddingTop:"8px", borderTop:`1px solid rgba(124,58,237,.15)` }}>
                    <div>
                      <div style={{ fontFamily:"var(--font-heading),sans-serif", fontSize:"clamp(1.8rem,2.8vw,3rem)", fontWeight:800, color:brandLight, "--sb-color":rgba(brand,.5), animation:"statBreathe 2.5s ease-in-out infinite", lineHeight:1 } as React.CSSProperties}>{p.stat}</div>
                      <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"13px", color:"rgba(220,215,255,.45)", lineHeight:1.4, maxWidth:"180px", marginTop:"4px" }}>{p.statLabel}</p>
                    </div>
                    <div style={{ flex:1, height:"1px", background:`linear-gradient(90deg,${rgba(brand,.3)},transparent)` }} />
                    <p style={{ fontFamily:"var(--font-sans),sans-serif", fontSize:"11px", color:"rgba(220,215,255,.38)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 executives</p>
                    <div style={{ display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                    {([
                      { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                      { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                    ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                      <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(220,215,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(220,215,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(220,215,255,0.08)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.4)"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(220,215,255,0.2)"; }}>
                        <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                        {label}
                      </a>
                    ))}
                  </div>
                  </div>
                </div>
              </div>
            </section>
            ); })()}

            {/* ══ T2 · END — CLOSING MANIFESTO ══════════════════════════════════════
                Full-viewport cinematic closer. Three zones stacked vertically:
                1. Top: eyebrow label + large provocative statement
                2. Middle: thin divider with 3 study attribution pills
                3. Bottom: two horizontal invitation cards side by side
            ════════════════════════════════════════════════════════════════════════ */}
            <section
              ref={el => { sectionRefs.current[total + 1] = el; }}
              style={{
                height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always",
                display: "flex", flexDirection: "column", justifyContent: "center",
                padding: `0 max(32px,calc(50vw - 620px))`,
                position: "relative", overflow: "hidden",
                background: "#080614",
              }}
            >
              {/* Ambient glows */}
              <div style={{ position: "absolute", top: "0%", left: "-10%", width: "70vw", height: "60vh", background: `radial-gradient(ellipse,${rgba(brand,.1)} 0%,transparent 60%)`, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: "0%", right: "-5%", width: "50vw", height: "50vh", background: "radial-gradient(ellipse,rgba(109,40,217,.1) 0%,transparent 60%)", pointerEvents: "none" }} />
              {/* Fine grid texture */}
              <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.015) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.015) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

              <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0" }}>

                {/* ── ZONE 1: Statement ── */}
                <div className="reveal" style={{ marginBottom: "36px" }}>
                  <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", marginBottom: "20px" }}>
                    <div style={{ width: "20px", height: "1px", background: rgba(brand,.6) }} />
                    <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: rgba(brand,.55) }}>Next Steps</span>
                  </div>
                  <h2 style={{ fontFamily: "var(--font-display),sans-serif", fontSize: "clamp(2.2rem,3.6vw,4.2rem)", fontWeight: 700, lineHeight: 1.0, letterSpacing: "-.01em", textTransform: "uppercase", color: "#f0eeff", margin: 0, maxWidth: "720px" }}>
                    The gap between{" "}
                    <span style={{ color: brandLight }}>knowing</span>
                    {" "}and{" "}
                    <span style={{ WebkitTextStroke: `1.5px ${rgba(brand,.6)}`, color: "transparent" }}>acting</span>
                    {" "}is where{" "}
                    <span style={{ color: brandLight }}>{grocer.shortName}</span>
                    {" "}wins or loses.
                  </h2>
                </div>

                {/* ── ZONE 2: Divider + attribution pills ── */}
                <div className="reveal reveal-d1" style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "36px" }}>
                  <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${rgba(brand,.4)},rgba(109,40,217,.2),transparent)` }} />
                  {[
                    { v: "131", l: "Retail Executives" },
                    { v: "2,533", l: "Shoppers Surveyed" },
                    { v: "10", l: "Retailers Benchmarked" },
                  ].map((chip) => (
                    <div key={chip.v} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "20px", background: rgba(brand,.06), border: `1px solid ${rgba(brand,.18)}`, flexShrink: 0 }}>
                      <span style={{ fontFamily: "var(--font-heading),sans-serif", fontSize: "13px", fontWeight: 800, color: brandLight, lineHeight: 1 }}>{chip.v}</span>
                      <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.35)", letterSpacing: ".05em" }}>{chip.l}</span>
                    </div>
                  ))}
                  <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,transparent,rgba(109,40,217,.1))" }} />
                </div>

                {/* ── ZONE 3: Two invitation cards ── */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

                  {/* Card A — Full Report */}
                  <div className="reveal reveal-d2" style={{ borderRadius: "16px", background: "#13102a", border: `1px solid ${rgba(brand,.25)}`, boxShadow: `0 8px 40px ${rgba(brand,.12)}`, padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.14)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.12), border: `1px solid ${rgba(brand,.28)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brandLight} strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(220,215,255,.35)", marginBottom: "6px" }}>Full Report</div>
                        <div style={{ fontFamily: "var(--font-display),sans-serif", fontSize: "clamp(1.1rem,1.6vw,1.5rem)", fontWeight: 700, color: "#f0eeff", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-.01em", marginBottom: "8px" }}>Access the Complete Benchmark</div>
                        <div style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "11px", color: "rgba(220,215,255,.42)", lineHeight: 1.65 }}>Maturity framework, retailer-by-retailer comparisons, and a prioritized roadmap built for your scale.</div>
                      </div>
                      <div style={{ flex: 1 }} />
                      <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: brandLight, border: "none", color: "#0a0012", cursor: "pointer", fontFamily: "var(--font-sans),sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "opacity .2s", display: "flex", alignItems: "center", gap: "7px", boxShadow: `0 4px 20px ${rgba(brand,.35)}` }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                        Download Report →
                      </button>
                    </div>
                  </div>

                  {/* Card B — Schedule Call */}
                  <div className="reveal reveal-d2" style={{ borderRadius: "16px", background: "#13102a", border: `1px solid ${rgba(brand,.25)}`, boxShadow: `0 8px 40px ${rgba(brand,.12)}`, padding: "32px 32px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.14)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                    <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                      <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.12), border: `1px solid ${rgba(brand,.28)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brandLight} strokeWidth={1.8}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                        </svg>
                      </div>
                      <div>
                        <div style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(220,215,255,.35)", marginBottom: "6px" }}>Expert Walkthrough</div>
                        <div style={{ fontFamily: "var(--font-display),sans-serif", fontSize: "clamp(1.1rem,1.6vw,1.5rem)", fontWeight: 700, color: "#f0eeff", lineHeight: 1.1, textTransform: "uppercase", letterSpacing: "-.01em", marginBottom: "8px" }}>30-Min Strategy Call</div>
                        <div style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "11px", color: "rgba(220,215,255,.42)", lineHeight: 1.65 }}>A Diebold Nixdorf consultant walks you through the findings most relevant to {grocer.shortName}&apos;s operations.</div>
                      </div>
                      <div style={{ flex: 1 }} />
                      <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: "transparent", border: `1px solid ${rgba(brand,.38)}`, color: brandLight, cursor: "pointer", fontFamily: "var(--font-sans),sans-serif", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "all .2s", display: "flex", alignItems: "center", gap: "7px" }}
                        onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = rgba(brand,.12); (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.6); }}
                        onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.38); }}>
                        <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                        Schedule a Call →
                      </button>
                    </div>
                  </div>

                </div>

                {/* Back to top */}
                <div className="reveal reveal-d3" style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
                  <button onClick={() => scrollTo(0)} style={{ padding: "7px 16px", borderRadius: "7px", background: "none", border: "1px solid rgba(220,215,255,0.2)", color: "rgba(220,215,255,0.5)", cursor: "pointer", fontFamily: "var(--font-sans),sans-serif", fontSize: "10px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", transition: "all 0.15s" }}
                    onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(220,215,255,0.07)"; b.style.color = "rgba(220,215,255,0.85)"; }}
                    onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "none"; b.style.color = "rgba(220,215,255,0.5)"; }}>
                    ↑ Back to Top
                  </button>
                </div>
              </div>

              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px max(32px,calc(50vw - 620px))", borderTop: "1px solid rgba(109,40,217,.15)", display: "flex", justifyContent: "space-between" }}>
                <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={24} height={18} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.4 }} />
                <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.35)" }}>SSEB 2025 · Personalized for {grocer.name}</span>
                <span style={{ fontFamily: "var(--font-sans),sans-serif", fontSize: "9px", color: "rgba(220,215,255,.25)" }}>© 2025 Incisiv</span>
              </div>
            </section>
          </>
        )}


        {theme === "theme1" && (<>

        {/* ══ HERO — Command Center ════════════════════════════════════════════ */}
        <section
          ref={el => { sectionRefs.current[0] = el; }}
          style={{ height:"100vh", scrollSnapAlign:"start", position:"relative", overflow:"hidden", display:"flex", flexDirection:"column", background:"#050810" }}
        >
          {/* ── Hero gradient background — brand-matched animated aurora ── */}
          <div style={{ position:"absolute", inset:0, background:"#050810", zIndex:0 }} />
          {/* Orb 1 — large brand blob, top-left, slow drift */}
          <div style={{ position:"absolute", top:"-20%", left:"-15%", width:"80vw", height:"80vh", background:`radial-gradient(ellipse, ${rgba(brand,.55)} 0%, ${rgba(brand,.18)} 35%, transparent 65%)`, animation:"heroOrb1 14s ease-in-out infinite", zIndex:1, pointerEvents:"none" }} />
          {/* Orb 2 — brand blob, bottom-right, medium */}
          <div style={{ position:"absolute", bottom:"-15%", right:"-10%", width:"65vw", height:"70vh", background:`radial-gradient(ellipse, ${rgba(brand,.45)} 0%, ${rgba(brand,.12)} 40%, transparent 65%)`, animation:"heroOrb2 10s ease-in-out infinite", zIndex:1, pointerEvents:"none" }} />
          {/* Orb 3 — center glow, gentle pulse */}
          <div style={{ position:"absolute", top:"20%", left:"30%", width:"55vw", height:"55vh", background:`radial-gradient(ellipse, ${rgba(brand,.25)} 0%, transparent 60%)`, animation:"heroOrb3 7s ease-in-out infinite", zIndex:1, pointerEvents:"none" }} />
          {/* Edge vignette */}
          <div style={{ position:"absolute", inset:0, background:"radial-gradient(ellipse 90% 90% at 50% 45%, transparent 45%, rgba(4,6,14,.65) 100%)", zIndex:2, pointerEvents:"none" }} />
          {/* Left text-area overlay */}
          <div style={{ position:"absolute", inset:0, background:"linear-gradient(90deg, rgba(4,6,14,.72) 0%, rgba(4,6,14,.3) 35%, transparent 60%)", zIndex:2, pointerEvents:"none" }} />


          {/* Main content — fills remaining height */}
          <div style={{ flex:1, display:"flex", flexDirection:"column", justifyContent:"center", padding:"0 8vw", position:"relative", zIndex:2, gap:"0" }}>

            {/* Grocer logo + name */}
            <div className="ru" style={{ animationDelay:"0.06s", marginBottom:"20px" }}>
              <img src={grocer.logoUrl} alt={grocer.shortName} style={{ height:`${grocer.logoHeight ?? 36}px`, width:"auto", maxWidth:"200px", objectFit:"contain", display:"block", filter: (!grocer.logoHasBg) ? "brightness(0) invert(1)" : "none", opacity: grocer.logoHasBg ? 1 : 0.9 }} onError={e => { (e.currentTarget as HTMLImageElement).style.display = "none"; }} />
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
              <button onClick={() => scrollTo(1)} style={{ flexShrink:0, padding:"14px 32px", borderRadius:"7px", background:brand, border:"none", color:"#fff", cursor:"pointer", fontSize:"11px", fontWeight:800, letterSpacing:"0.12em", textTransform:"uppercase", boxShadow:`0 0 32px ${rgba(brand,0.45)}` }}>
                View Insights →
              </button>
            </div>
          </div>

          {/* Bottom rule */}
          <div style={{ height:"1px", background:"rgba(255,255,255,0.04)", position:"relative", zIndex:2 }} />
          <div style={{ padding:"12px 8vw", display:"flex", justifyContent:"space-between", position:"relative", zIndex:2 }}>
            <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={24} height={18} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.4 }} />
            <span style={{ fontSize:"9px", color:"rgba(255,255,255,0.35)" }}>131 retail executives · 2,533 shoppers</span>
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
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:`56px ${isA?"48px":"8vw"} 56px ${isA?"8vw":"48px"}`, borderRight:"none", borderLeft:"none", position:"relative", zIndex:1, gap:"20px" }}>
              <div className="ru" style={{ animationDelay:"0.04s", display:"flex", alignItems:"center", gap:"10px" }}>
                <span style={{ fontSize:"11px", fontWeight:700, letterSpacing:"0.14em", textTransform:"uppercase", color:brandLight, textShadow:`0 0 12px ${rgba(brand,0.9)}, 0 0 28px ${rgba(brand,0.5)}` }}>{p.title}</span>
              </div>
              <WordFadeTitle text={p.hook} style={{ fontSize:"clamp(1.9rem,2.8vw,3rem)", fontWeight:900, color:"#fff", lineHeight:1.05, letterSpacing:"-0.04em", margin:0 }} />
              <div className="rfi" style={{ animationDelay:"0.14s", height:"1px", background:`linear-gradient(90deg,${isA?"":"transparent,"}${rgba(brand,0.4)}${isA?",transparent":""})`}} />
              <p className="ru" style={{ animationDelay:"0.16s", fontSize:"clamp(1rem,1.2vw,1.1rem)", color:"rgba(255,255,255,0.5)", lineHeight:1.9, margin:0 }}>{p.body}</p>
              <div className="rfi" style={{ animationDelay:"0.2s", display:"flex", gap:"8px", alignItems:"center", marginTop:"8px" }}>
                {([
                  { label:"Access Full Report", href:"#", icon:<><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></> },
                  { label:"Schedule a Call", href:"#", icon:<><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></> },
                ] as {label:string;href:string;icon:React.ReactNode}[]).map(({label,href,icon}) => (
                  <a key={label} href={href} onClick={e => { e.preventDefault(); scrollTo(total + 1); }} style={{ fontSize:"10px", fontWeight:700, letterSpacing:"0.1em", textTransform:"uppercase", color:"rgba(255,255,255,0.65)", textDecoration:"none", padding:"7px 14px", borderRadius:"7px", border:"1px solid rgba(255,255,255,0.2)", display:"inline-flex", alignItems:"center", gap:"6px", transition:"all 0.2s", cursor:"pointer" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLAnchorElement).style.background="rgba(255,255,255,0.07)"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.38)"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLAnchorElement).style.background="transparent"; (e.currentTarget as HTMLAnchorElement).style.borderColor="rgba(255,255,255,0.2)"; }}>
                    <svg width="11" height="11" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>{icon}</svg>
                    {label}
                  </a>
                ))}
              </div>
            </div>
          );

          const statCol = (
            <div style={{ display:"flex", flexDirection:"column", justifyContent:"center", padding:`56px ${isA?"8vw":"48px"} 56px ${isA?"48px":"8vw"}`, position:"relative", zIndex:1, gap:"20px" }}>
              {/* Stat + label inline */}
              <div className="ru" style={{ animationDelay:"0.1s", display:"flex", alignItems:"center", gap:"24px" }}>
                {(() => {
                  const vsMatch = p.stat.match(/^(\d+)%\s*vs\.?\s*(\d+)%$/i);
                  if (vsMatch) {
                    return (
                      <div style={{ display:"flex", alignItems:"baseline", gap:"8px", flexShrink:0, "--sb-color":rgba(brand,.55), animation:"statBreathe 2.5s ease-in-out infinite" } as React.CSSProperties}>
                        <CountUpStat value={parseInt(vsMatch[1])} style={{ fontSize:"clamp(3rem,5vw,5.5rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:brandLight }} />
                        <span style={{ fontSize:"clamp(0.85rem,1.1vw,1rem)", fontWeight:600, color:"rgba(255,255,255,0.3)", letterSpacing:"0.06em", textTransform:"uppercase" }}>vs.</span>
                        <CountUpStat value={parseInt(vsMatch[2])} style={{ fontSize:"clamp(2rem,3.5vw,4rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:"rgba(255,255,255,0.35)" }} />
                      </div>
                    );
                  }
                  const pctMatch = p.stat.match(/^(\d+)%$/);
                  if (pctMatch) {
                    return <CountUpStat value={parseInt(pctMatch[1])} style={{ fontSize:"clamp(3.5rem,6vw,7rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:brandLight, "--sb-color":rgba(brand,.55), animation:"statBreathe 2.5s ease-in-out infinite", flexShrink:0 } as React.CSSProperties} />;
                  }
                  const generalMatch = p.stat.match(/^([\d.]+)(.*)$/);
                  if (generalMatch && !isNaN(parseFloat(generalMatch[1]))) {
                    const num = parseFloat(generalMatch[1]);
                    const sfx = generalMatch[2] || "";
                    if (Number.isInteger(num)) {
                      return <CountUpStat value={num} suffix={sfx} style={{ fontSize:"clamp(3.5rem,6vw,7rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:brandLight, "--sb-color":rgba(brand,.55), animation:"statBreathe 2.5s ease-in-out infinite", flexShrink:0 } as React.CSSProperties} />;
                    }
                  }
                  return <div style={{ fontSize:"clamp(3.5rem,6vw,7rem)", fontWeight:900, lineHeight:1, letterSpacing:"-0.06em", color:brandLight, "--sb-color":rgba(brand,.55), animation:"statBreathe 2.5s ease-in-out infinite", flexShrink:0 } as React.CSSProperties}>{p.stat}</div>;
                })()}
                <p style={{ fontSize:"clamp(1rem,1.15vw,1.15rem)", color:"rgba(255,255,255,0.55)", lineHeight:1.4, maxWidth:"160px", margin:0 }}>{p.statLabel}</p>
              </div>
              <div className="rfi" style={{ animationDelay:"0.16s", height:"1px", background:"rgba(255,255,255,0.06)" }} />
              {/* Bullets in a box — animated border + scroll-reveal stagger */}
              <div className="t1-bullet-box" style={{ display:"flex", flexDirection:"column", gap:"0", "--bb-color-bright":rgba(brand,0.9), "--bb-grad-start":rgba(brand,0.18) } as React.CSSProperties}>
                <div className="t1-bullet-grad" />
                {p.bullets.map((b,bi) => (
                  <div key={bi} className={`t1-reveal t1-reveal-d${(bi + 1) as 1|2|3}`} style={{ display:"flex", gap:"14px", alignItems:"flex-start", padding:"14px 18px" }}>
                    <div style={{ width:"6px", height:"6px", borderRadius:"50%", background:brandLight, flexShrink:0, marginTop:"7px" }} />
                    <p style={{ fontSize:"clamp(0.9rem,1.05vw,1rem)", color:"rgba(255,255,255,0.55)", lineHeight:1.6, margin:0 }}>{b}</p>
                  </div>
                ))}
              </div>
              <p style={{ fontSize:"11px", color:"rgba(255,255,255,0.2)", fontStyle:"italic" }}>Source: SSEB 2025 · 131 retail executives · 2,533 shoppers</p>
            </div>
          );

          return (
            <section key={idx} ref={el => { sectionRefs.current[idx+1] = el; }} style={{ height:"100vh", scrollSnapAlign:"start", display:"grid", gridTemplateColumns:isA?"55% 45%":"45% 55%", position:"relative", overflow:"hidden", background:"#080c12" }}>
              <div style={{ position:"absolute", inset:0, background:`radial-gradient(ellipse 55% 65% at ${isA?"100%":"0%"} 50%,${rgba(brand,0.1)} 0%,transparent 55%)`, pointerEvents:"none" }} />
              {isA ? <>{textCol}{statCol}</> : <>{statCol}{textCol}</>}
            </section>
          );
        })())}
        {/* ══ END — CLOSING MANIFESTO ═══════════════════════════════════════════ */}
        <section
          ref={el => { sectionRefs.current[total + 1] = el; }}
          style={{ height: "100vh", scrollSnapAlign: "start", scrollSnapStop: "always", display: "flex", flexDirection: "column", justifyContent: "center", padding: `0 8vw`, paddingTop: "52px", position: "relative", overflow: "hidden", background: "#080c12" }}
        >
          {/* Ambient glows */}
          <div style={{ position: "absolute", top: "0%", left: "-10%", width: "60vw", height: "60vh", background: `radial-gradient(ellipse,${rgba(brand,.09)} 0%,transparent 58%)`, pointerEvents: "none" }} />
          <div style={{ position: "absolute", bottom: "0%", right: "-5%", width: "50vw", height: "50vh", background: "radial-gradient(ellipse,rgba(27,79,155,.08) 0%,transparent 60%)", pointerEvents: "none" }} />
          {/* Fine grid texture */}
          <div style={{ position: "absolute", inset: 0, backgroundImage: "linear-gradient(rgba(255,255,255,.012) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,.012) 1px,transparent 1px)", backgroundSize: "60px 60px", pointerEvents: "none" }} />

          <div className="ru" style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "0" }}>

            {/* ── ZONE 1: Statement ── */}
            <div style={{ marginBottom: "36px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "20px" }}>
                <div style={{ width: "20px", height: "1px", background: rgba(brand,.55) }} />
                <span style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".18em", textTransform: "uppercase", color: rgba(brand,.55) }}>Next Steps</span>
              </div>
              <h2 style={{ fontSize: "clamp(2.2rem,3.6vw,4.2rem)", fontWeight: 900, lineHeight: 1.0, letterSpacing: "-0.04em", color: "#fff", margin: 0, maxWidth: "720px" }}>
                The gap between{" "}
                <span style={{ color: brandLight }}>knowing</span>
                {" "}and{" "}
                <span style={{ WebkitTextStroke: `1.5px ${rgba(brand,.5)}`, color: "transparent" }}>acting</span>
                {" "}is where{" "}
                <span style={{ color: brandLight }}>{grocer.shortName}</span>
                {" "}wins or loses.
              </h2>
            </div>

            {/* ── ZONE 2: Divider + attribution pills ── */}
            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "32px" }}>
              <div style={{ flex: 1, height: "1px", background: `linear-gradient(90deg,${rgba(brand,.4)},rgba(27,79,155,.2),transparent)` }} />
              {[
                { v: "131", l: "Retail Executives" },
                { v: "2,533", l: "Shoppers Surveyed" },
                { v: "10", l: "Retailers Benchmarked" },
              ].map((chip) => (
                <div key={chip.v} style={{ display: "flex", alignItems: "center", gap: "7px", padding: "6px 14px", borderRadius: "20px", background: rgba(brand,.05), border: `1px solid ${rgba(brand,.14)}`, flexShrink: 0 }}>
                  <span style={{ fontSize: "13px", fontWeight: 900, color: brandLight, lineHeight: 1, letterSpacing: "-.04em" }}>{chip.v}</span>
                  <span style={{ fontSize: "9px", color: "rgba(255,255,255,.3)", letterSpacing: ".04em" }}>{chip.l}</span>
                </div>
              ))}
              <div style={{ flex: 1, height: "1px", background: "linear-gradient(90deg,transparent,rgba(27,79,155,.08))" }} />
            </div>

            {/* ── ZONE 3: Two invitation cards ── */}
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>

              {/* Card A — Full Report */}
              <div style={{ borderRadius: "16px", background: "rgba(255,255,255,.04)", border: `1px solid ${rgba(brand,.25)}`, boxShadow: `0 8px 40px ${rgba(brand,.1)}`, padding: "32px 28px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20%", left: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.12)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.1), border: `1px solid ${rgba(brand,.25)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brandLight} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.32)", marginBottom: "6px" }}>Full Report</div>
                    <div style={{ fontSize: "clamp(1rem,1.5vw,1.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "8px" }}>Access the Complete Benchmark</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,.42)", lineHeight: 1.65 }}>Maturity framework, retailer-by-retailer comparisons, and a prioritized roadmap built for your scale.</div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: brandLight, border: "none", color: "#0a0012", cursor: "pointer", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "opacity .2s", display: "flex", alignItems: "center", gap: "7px", boxShadow: `0 4px 20px ${rgba(brand,.35)}` }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "0.85"; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.opacity = "1"; }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"/></svg>
                    Download Report →
                  </button>
                </div>
              </div>

              {/* Card B — Schedule Call */}
              <div style={{ borderRadius: "16px", background: "rgba(255,255,255,.04)", border: `1px solid ${rgba(brand,.25)}`, boxShadow: `0 8px 40px ${rgba(brand,.1)}`, padding: "32px 28px 28px", display: "flex", flexDirection: "column", gap: "12px", position: "relative", overflow: "hidden" }}>
                <div style={{ position: "absolute", top: "-20%", right: "-10%", width: "65%", height: "65%", background: `radial-gradient(ellipse,${rgba(brand,.12)} 0%,transparent 60%)`, pointerEvents: "none" }} />
                <div style={{ position: "relative", zIndex: 1, display: "flex", flexDirection: "column", gap: "12px", height: "100%" }}>
                  <div style={{ width: "44px", height: "44px", borderRadius: "12px", background: rgba(brand,.1), border: `1px solid ${rgba(brand,.25)}`, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <svg width="20" height="20" fill="none" viewBox="0 0 24 24" stroke={brandLight} strokeWidth={1.8}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
                    </svg>
                  </div>
                  <div>
                    <div style={{ fontSize: "9px", fontWeight: 700, letterSpacing: ".14em", textTransform: "uppercase", color: "rgba(255,255,255,.32)", marginBottom: "6px" }}>Expert Walkthrough</div>
                    <div style={{ fontSize: "clamp(1rem,1.5vw,1.4rem)", fontWeight: 900, color: "#fff", lineHeight: 1.1, letterSpacing: "-.03em", marginBottom: "8px" }}>30-Min Strategy Call</div>
                    <div style={{ fontSize: "11px", color: "rgba(255,255,255,.42)", lineHeight: 1.65 }}>A Diebold Nixdorf consultant walks you through the findings most relevant to {grocer.shortName}&apos;s operations.</div>
                  </div>
                  <div style={{ flex: 1 }} />
                  <button style={{ alignSelf: "flex-start", padding: "10px 24px", borderRadius: "7px", background: "transparent", border: `1px solid ${rgba(brand,.38)}`, color: brandLight, cursor: "pointer", fontSize: "10px", fontWeight: 700, letterSpacing: ".1em", textTransform: "uppercase", transition: "all .2s", display: "flex", alignItems: "center", gap: "7px" }}
                    onMouseEnter={e => { (e.currentTarget as HTMLButtonElement).style.background = rgba(brand,.1); (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.55); }}
                    onMouseLeave={e => { (e.currentTarget as HTMLButtonElement).style.background = "transparent"; (e.currentTarget as HTMLButtonElement).style.borderColor = rgba(brand,.38); }}>
                    <svg width="12" height="12" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/></svg>
                    Schedule a Call →
                  </button>
                </div>
              </div>

            </div>

            {/* Back to top */}
            <div style={{ marginTop: "24px", display: "flex", justifyContent: "center" }}>
              <button onClick={() => scrollTo(0)} style={{ padding: "7px 16px", borderRadius: "7px", background: "none", border: "1px solid rgba(255,255,255,0.18)", color: "rgba(255,255,255,0.5)", cursor: "pointer", fontSize: "10px", fontWeight: 600, letterSpacing: ".1em", textTransform: "uppercase", transition: "all 0.15s" }}
                onMouseEnter={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "rgba(255,255,255,0.07)"; b.style.color = "rgba(255,255,255,0.85)"; }}
                onMouseLeave={e => { const b = e.currentTarget as HTMLButtonElement; b.style.background = "none"; b.style.color = "rgba(255,255,255,0.5)"; }}>
                ↑ Back to Top
              </button>
            </div>

          </div>

          <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "12px 8vw", borderTop: "1px solid rgba(255,255,255,0.07)", display: "flex", justifyContent: "space-between", zIndex: 2 }}>
            <Image src="/diebold-nixdorf-logo.png" alt="Diebold Nixdorf" width={24} height={18} style={{ objectFit: "contain", filter: "brightness(0) invert(1)", opacity: 0.4 }} />
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.35)" }}>SSEB 2025 · Personalized for {grocer.name}</span>
            <span style={{ fontSize: "9px", color: "rgba(255,255,255,0.25)" }}>© 2025 Incisiv</span>
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
