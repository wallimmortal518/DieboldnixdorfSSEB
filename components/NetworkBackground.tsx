"use client";

import { useEffect, useRef } from "react";

export default function NetworkBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animId: number;
    let t = 0;

    function resize() {
      if (!canvas) return;
      canvas.width  = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener("resize", resize);

    function toRgb(r: number, g: number, b: number) {
      return `rgb(${Math.round(Math.min(255,Math.max(0,r)))},${Math.round(Math.min(255,Math.max(0,g)))},${Math.round(Math.min(255,Math.max(0,b)))})`;
    }

    function draw() {
      if (!canvas || !ctx) return;

      t += 0.008;

      const W = canvas.width;
      const H = canvas.height;

      // Move the gradient origin point in a slow elliptical path
      // so the colors visibly flow and shift across the screen
      const ox = W * (0.5 + Math.sin(t * 0.5) * 0.55);
      const oy = H * (0.5 + Math.cos(t * 0.38) * 0.55);

      // End point moves opposite — creates a sweeping flow
      const ex = W * (0.5 - Math.sin(t * 0.5) * 0.55);
      const ey = H * (0.5 - Math.cos(t * 0.38) * 0.55);

      // Midpoint oscillates 35%–65%
      const midStop = 0.49 + Math.sin(t * 0.6) * 0.16;

      // Colors breathe in brightness together — all 3 always visible
      const b = Math.sin(t * 0.9) * 22;

      const grad = ctx.createLinearGradient(ox, oy, ex, ey);
      grad.addColorStop(0,                                   toRgb(3+b,   100+b,  165+b));
      grad.addColorStop(Math.min(Math.max(midStop,0.2),0.8), toRgb(87+b,  35+b,   126+b));
      grad.addColorStop(1,                                   toRgb(196+b, 18+b,   47+b));

      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, W, H);

      animId = requestAnimationFrame(draw);
    }

    animId = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        pointerEvents: "none",
        zIndex: 0,
      }}
    />
  );
}
