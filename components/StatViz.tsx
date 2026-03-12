"use client";

import { useEffect, useRef, useState } from "react";

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

// ── Hook: fires once when element enters viewport ────────────────────────────
function useInView() {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setInView(true); obs.disconnect(); } },
      { threshold: 0.4 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return { ref, inView };
}

// ── Radial arc ───────────────────────────────────────────────────────────────
function RadialArc({ value, brand, size = 120 }: { value: number; brand: string; size?: number }) {
  const brandLight = lighten(brand);
  const { ref, inView } = useInView();
  const stroke = 7;
  const r = (size - stroke) / 2;
  const cx = size / 2;
  const cy = size / 2;
  const circumference = 2 * Math.PI * r;
  const filled = (value / 100) * circumference;

  // Animate: start fully hidden (offset = circumference), animate to target
  const animDuration = 1.2;

  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <defs>
          <linearGradient id={`arc-grad-${brand.replace("#", "")}`} x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={rgba(brand, 0.55)} />
            <stop offset="100%" stopColor={brandLight} />
          </linearGradient>
        </defs>
        {/* Track */}
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={rgba(brand, 0.1)} strokeWidth={stroke} />
        {/* Animated fill */}
        <circle
          cx={cx} cy={cy} r={r}
          fill="none"
          stroke={`url(#arc-grad-${brand.replace("#", "")})`}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${filled} ${circumference}`}
          strokeDashoffset={inView ? 0 : filled}
          style={{
            transition: inView ? `stroke-dashoffset ${animDuration}s cubic-bezier(0.4,0,0.2,1)` : "none",
          }}
        />
      </svg>
      {/* Center label — count up */}
      <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
        <CountUp to={value} run={inView} duration={animDuration} suffix="%" style={{
          fontSize: size * 0.22,
          fontWeight: 900,
          color: brandLight,
          letterSpacing: "-0.04em",
          lineHeight: 1,
        }} />
      </div>
    </div>
  );
}

// ── Dual arc ─────────────────────────────────────────────────────────────────
function DualArc({ a, b, brand, size = 120 }: { a: number; b: number; brand: string; size?: number }) {
  const brandLight = lighten(brand);
  const { ref, inView } = useInView();
  const outerStroke = 7;
  const innerStroke = 6;
  const outerR = (size - outerStroke) / 2;
  const innerR = outerR - outerStroke - 6;
  const cx = size / 2;
  const cy = size / 2;
  const animDuration = 1.2;

  function AnimArc({ val, r, stroke, alpha, delay = 0 }: { val: number; r: number; stroke: number; alpha: number; delay?: number }) {
    const circ = 2 * Math.PI * r;
    const filled = (val / 100) * circ;
    return (
      <>
        <circle cx={cx} cy={cy} r={r} fill="none" stroke={rgba(brand, 0.08)} strokeWidth={stroke} />
        <circle
          cx={cx} cy={cy} r={r} fill="none"
          stroke={brandLight} strokeOpacity={alpha}
          strokeWidth={stroke} strokeLinecap="round"
          strokeDasharray={`${filled} ${circ}`}
          strokeDashoffset={inView ? 0 : filled}
          style={{
            transition: inView ? `stroke-dashoffset ${animDuration}s ${delay}s cubic-bezier(0.4,0,0.2,1)` : "none",
          }}
        />
      </>
    );
  }

  return (
    <div ref={ref} style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <AnimArc val={a} r={outerR} stroke={outerStroke} alpha={1} delay={0} />
        <AnimArc val={b} r={innerR} stroke={innerStroke} alpha={0.35} delay={0.15} />
      </svg>
      <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center" }}>
        <CountUp to={a} run={inView} duration={animDuration} suffix="%" style={{ fontSize: size * 0.16, fontWeight: 900, color: brandLight, lineHeight: 1.1 }} />
        <span style={{ fontSize: size * 0.09, color: rgba(brand, 0.4), margin: "1px 0" }}>vs</span>
        <CountUp to={b} run={inView} duration={animDuration} suffix="%" delay={0.15} style={{ fontSize: size * 0.13, fontWeight: 700, color: "rgba(255,255,255,0.3)", lineHeight: 1 }} />
      </div>
    </div>
  );
}

// ── Count-up number ──────────────────────────────────────────────────────────
function CountUp({ to, run, duration, suffix = "", delay = 0, style }: {
  to: number; run: boolean; duration: number; suffix?: string; delay?: number; style?: React.CSSProperties;
}) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    if (!run) return;
    const timeout = setTimeout(() => {
      const start = performance.now();
      const tick = (now: number) => {
        const progress = Math.min((now - start) / (duration * 1000), 1);
        const ease = 1 - Math.pow(1 - progress, 3); // ease-out cubic
        setVal(Math.round(ease * to));
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    }, delay * 1000);
    return () => clearTimeout(timeout);
  }, [run, to, duration, delay]);

  return <span style={style}>{val}{suffix}</span>;
}

// ── Icon fallback ────────────────────────────────────────────────────────────
function IconGrid({ stat, brand }: { stat: string; brand: string }) {
  const brandLight = lighten(brand);
  return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "6px" }}>
      <div style={{
        width: 56, height: 56, borderRadius: "16px",
        background: rgba(brand, 0.1), border: `1px solid ${rgba(brand, 0.25)}`,
        display: "flex", alignItems: "center", justifyContent: "center",
      }}>
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke={brandLight} strokeWidth={1.5} strokeLinecap="round" strokeLinejoin="round">
          <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
          <polyline points="9 22 9 12 15 12 15 22" />
        </svg>
      </div>
      <span style={{ fontSize: "1.4rem", fontWeight: 900, color: brandLight, letterSpacing: "-0.04em", lineHeight: 1 }}>
        {stat}
      </span>
    </div>
  );
}

// ── Main export ──────────────────────────────────────────────────────────────
export default function StatViz({ stat, brand, size = 128 }: { stat: string; brand: string; size?: number }) {
  const vsMatch = stat.match(/(\d+)%\s*vs\.?\s*(\d+)%/i);
  if (vsMatch) return <DualArc a={parseInt(vsMatch[1])} b={parseInt(vsMatch[2])} brand={brand} size={size} />;

  const pctMatch = stat.match(/^(\d+)%$/);
  if (pctMatch) return <RadialArc value={parseInt(pctMatch[1])} brand={brand} size={size} />;

  return <IconGrid stat={stat} brand={brand} />;
}
