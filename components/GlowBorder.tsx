"use client";

import { useEffect, useRef } from "react";

export default function GlowBorder() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let angle = 0;

    const RADIUS = 16;
    const PAD    = 2;

    function resize() {
      if (!canvas) return;
      canvas.width  = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    }
    resize();

    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    function getPerimeter(w: number, h: number, r: number): number {
      return 2 * (w - 2 * r) + 2 * (h - 2 * r) + 2 * Math.PI * r;
    }

    // Returns point on rounded-rect perimeter at progress t (0→1)
    function perimPoint(t: number, w: number, h: number, r: number): { x: number; y: number } {
      const top    = w - 2 * r;
      const right  = h - 2 * r;
      const bottom = w - 2 * r;
      const left   = h - 2 * r;
      const arc    = (Math.PI / 2) * r;
      const total  = top + arc + right + arc + bottom + arc + left + arc;
      const dist   = ((t % 1) + 1) % 1 * total;

      let d = dist;

      // Top edge (left→right)
      if (d < top) return { x: r + d, y: 0 };
      d -= top;

      // Top-right arc
      if (d < arc) {
        const a = -Math.PI / 2 + (d / arc) * (Math.PI / 2);
        return { x: w - r + Math.cos(a) * r, y: r + Math.sin(a) * r };
      }
      d -= arc;

      // Right edge (top→bottom)
      if (d < right) return { x: w, y: r + d };
      d -= right;

      // Bottom-right arc
      if (d < arc) {
        const a = (d / arc) * (Math.PI / 2);
        return { x: w - r + Math.cos(a) * r, y: h - r + Math.sin(a) * r };
      }
      d -= arc;

      // Bottom edge (right→left)
      if (d < bottom) return { x: w - r - d, y: h };
      d -= bottom;

      // Bottom-left arc
      if (d < arc) {
        const a = Math.PI / 2 + (d / arc) * (Math.PI / 2);
        return { x: r + Math.cos(a) * r, y: h - r + Math.sin(a) * r };
      }
      d -= arc;

      // Left edge (bottom→top)
      if (d < left) return { x: 0, y: h - r - d };
      d -= left;

      // Top-left arc
      const a = Math.PI + (d / arc) * (Math.PI / 2);
      return { x: r + Math.cos(a) * r, y: r + Math.sin(a) * r };
    }

    function draw() {
      if (!canvas || !ctx) return;
      const W = canvas.width;
      const H = canvas.height;

      ctx.clearRect(0, 0, W, H);

      angle = (angle + 0.0022) % 1; // slow — one lap every ~14s

      // Static dim border
      ctx.beginPath();
      ctx.moveTo(RADIUS + PAD, PAD);
      ctx.lineTo(W - RADIUS - PAD, PAD);
      ctx.arcTo(W - PAD, PAD, W - PAD, RADIUS + PAD, RADIUS);
      ctx.lineTo(W - PAD, H - RADIUS - PAD);
      ctx.arcTo(W - PAD, H - PAD, W - RADIUS - PAD, H - PAD, RADIUS);
      ctx.lineTo(RADIUS + PAD, H - PAD);
      ctx.arcTo(PAD, H - PAD, PAD, H - RADIUS - PAD, RADIUS);
      ctx.lineTo(PAD, RADIUS + PAD);
      ctx.arcTo(PAD, PAD, RADIUS + PAD, PAD, RADIUS);
      ctx.closePath();
      ctx.strokeStyle = "rgba(255,255,255,0.07)";
      ctx.lineWidth   = 1;
      ctx.stroke();

      // Glow streak — draw as line segments with fading opacity
      const tailLength = 0.18;
      const steps      = 60;

      for (let i = 0; i < steps; i++) {
        const t0 = (angle - (i / steps)       * tailLength + 1) % 1;
        const t1 = (angle - ((i + 1) / steps) * tailLength + 1) % 1;

        const p0 = perimPoint(t0, W - PAD * 2, H - PAD * 2, RADIUS);
        const p1 = perimPoint(t1, W - PAD * 2, H - PAD * 2, RADIUS);

        const fade = Math.pow(1 - i / steps, 1.6);

        ctx.beginPath();
        ctx.moveTo(p0.x + PAD, p0.y + PAD);
        ctx.lineTo(p1.x + PAD, p1.y + PAD);
        // Bright shine at the head, fades into tail
        const shine = i < 4 ? 0.7 : 0.22;
        ctx.strokeStyle = `rgba(255,255,255,${fade * shine})`;
        ctx.lineWidth   = i < 4 ? 1.2 : 0.8;
        ctx.lineCap     = "round";
        ctx.stroke();
      }

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      ro.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 2,
        borderRadius: "1rem",
      }}
    />
  );
}
