import { useEffect, useRef } from "react";

export default function OrbBackground() {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return undefined;

    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const palette = [
      "13, 92, 99",
      "186, 63, 29",
      "57, 114, 142",
      "126, 58, 94"
    ];

    const pointer = { x: 0.5, y: 0.5 };
    const orbs = [
      { x: 0.18, y: 0.28, r: 0.24, vx: 0.00042, vy: 0.00027, c: palette[0] },
      { x: 0.72, y: 0.24, r: 0.2, vx: -0.00033, vy: 0.00038, c: palette[1] },
      { x: 0.63, y: 0.72, r: 0.25, vx: 0.0003, vy: -0.00024, c: palette[2] },
      { x: 0.22, y: 0.7, r: 0.18, vx: -0.00024, vy: -0.00035, c: palette[3] }
    ];

    let width = 0;
    let height = 0;
    let raf = 0;

    const resize = () => {
      width = window.innerWidth;
      height = window.innerHeight;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.floor(width * dpr);
      canvas.height = Math.floor(height * dpr);
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    const drawBackdrop = () => {
      const bg = ctx.createLinearGradient(0, 0, width, height);
      bg.addColorStop(0, "rgba(246,245,242,0.92)");
      bg.addColorStop(1, "rgba(240,237,230,0.75)");
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, width, height);
    };

    const drawOrb = (orb) => {
      const x = orb.x * width;
      const y = orb.y * height;
      const radius = Math.max(width, height) * orb.r;
      const grad = ctx.createRadialGradient(x, y, radius * 0.06, x, y, radius);
      grad.addColorStop(0, `rgba(${orb.c},0.34)`);
      grad.addColorStop(0.55, `rgba(${orb.c},0.18)`);
      grad.addColorStop(1, `rgba(${orb.c},0)`);
      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fill();
    };

    const animate = () => {
      drawBackdrop();
      orbs.forEach((orb, idx) => {
        const pull = (idx % 2 === 0 ? pointer.x : pointer.y) - 0.5;
        orb.x += orb.vx + pull * 0.00012;
        orb.y += orb.vy - pull * 0.0001;

        if (orb.x < -0.12 || orb.x > 1.12) orb.vx *= -1;
        if (orb.y < -0.12 || orb.y > 1.12) orb.vy *= -1;

        drawOrb(orb);
      });
      raf = window.requestAnimationFrame(animate);
    };

    const onPointerMove = (event) => {
      pointer.x = event.clientX / Math.max(width, 1);
      pointer.y = event.clientY / Math.max(height, 1);
    };

    resize();
    window.addEventListener("resize", resize, { passive: true });
    window.addEventListener("pointermove", onPointerMove, { passive: true });

    if (prefersReducedMotion) {
      drawBackdrop();
      orbs.forEach(drawOrb);
    } else {
      animate();
    }

    return () => {
      window.removeEventListener("resize", resize);
      window.removeEventListener("pointermove", onPointerMove);
      if (raf) window.cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className="orb-background" aria-hidden="true">
      <canvas id="orbCanvas" ref={canvasRef} />
      <div className="orb-noise" />
    </div>
  );
}