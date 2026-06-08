import { useEffect, useRef } from 'react';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulse: number;
  pulseSpeed: number;
}

const CONNECTION_DISTANCE = 160;

const toCanvasRgb = (value: string): string => {
  const parts = value.trim().split(/\s+/).map(Number);
  if (parts.length >= 3 && parts.every((n) => !Number.isNaN(n))) {
    return `${parts[0]}, ${parts[1]}, ${parts[2]}`;
  }
  return value;
};

const toRgba = (value: string, alpha: number): string =>
  `rgba(${toCanvasRgb(value)}, ${alpha})`;

export const ParticleCanvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const colorsRef = useRef({ particle: '96, 165, 250', glow: '59, 130, 246', accent: '6, 182, 212' });
  const mouseRef = useRef({ x: -1000, y: -1000 });

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const readColors = () => {
      const style = getComputedStyle(document.documentElement);
      colorsRef.current = {
        particle: style.getPropertyValue('--particle-color').trim(),
        glow: style.getPropertyValue('--glow-color').trim(),
        accent: style.getPropertyValue('--accent').trim(),
      };
    };

    const resize = () => {
      const dpr = Math.min(window.devicePixelRatio, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      const count = window.innerWidth < 640 ? 55 : 90;
      particlesRef.current = Array.from({ length: count }, () => ({
        x: Math.random() * window.innerWidth,
        y: Math.random() * window.innerHeight,
        vx: (Math.random() - 0.5) * 0.7,
        vy: (Math.random() - 0.5) * 0.7,
        radius: Math.random() * 2.5 + 1.5,
        pulse: Math.random() * Math.PI * 2,
        pulseSpeed: 0.02 + Math.random() * 0.03,
      }));
    };

    const onMouseMove = (e: MouseEvent) => {
      mouseRef.current = { x: e.clientX, y: e.clientY };
    };

    readColors();
    resize();

    const observer = new MutationObserver(readColors);
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme-id', 'style'],
    });

    let frame: number;
    const animate = () => {
      const { particle, glow, accent } = colorsRef.current;
      const w = window.innerWidth;
      const h = window.innerHeight;
      const particles = particlesRef.current;
      const mouse = mouseRef.current;

      ctx.clearRect(0, 0, w, h);

      for (const p of particles) {
        p.pulse += p.pulseSpeed;
        const pulseScale = 1 + Math.sin(p.pulse) * 0.3;

        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 120 && dist > 0) {
          p.vx -= (dx / dist) * 0.02;
          p.vy -= (dy / dist) * 0.02;
        }

        p.x += p.vx;
        p.y += p.vy;
        if (p.x < 0 || p.x > w) p.vx *= -1;
        if (p.y < 0 || p.y > h) p.vy *= -1;

        const r = p.radius * pulseScale;

        ctx.beginPath();
        ctx.arc(p.x, p.y, r * 3, 0, Math.PI * 2);
        ctx.fillStyle = toRgba(glow, 0.08);
        ctx.fill();

        ctx.beginPath();
        ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
        ctx.fillStyle = toRgba(particle, 0.9);
        ctx.shadowBlur = 12;
        ctx.shadowColor = toRgba(glow, 0.8);
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < CONNECTION_DISTANCE) {
            const alpha = (1 - dist / CONNECTION_DISTANCE) * 0.45;
            const gradient = ctx.createLinearGradient(
              particles[i].x, particles[i].y,
              particles[j].x, particles[j].y
            );
            gradient.addColorStop(0, toRgba(glow, alpha));
            gradient.addColorStop(0.5, toRgba(accent, alpha * 1.2));
            gradient.addColorStop(1, toRgba(glow, alpha));

            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = gradient;
            ctx.lineWidth = 1.2;
            ctx.stroke();
          }
        }
      }

      frame = requestAnimationFrame(animate);
    };

    frame = requestAnimationFrame(animate);
    window.addEventListener('resize', resize);
    window.addEventListener('mousemove', onMouseMove);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener('resize', resize);
      window.removeEventListener('mousemove', onMouseMove);
      observer.disconnect();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="absolute inset-0"
      aria-hidden
    />
  );
};
