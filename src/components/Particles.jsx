import { useEffect, useRef } from 'react';

const PETAL_COLORS = ['#b3263a', '#c9364a', '#fbf8ef', '#f6efe0', '#f39a1c', '#ffcf5a'];
const reducedMotion = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

function makeParticle(w, h, kind, fromBurst, origin) {
  const isPetal = kind === 'petal';
  if (fromBurst) {
    const a = -Math.PI / 2 + (Math.random() - 0.5) * Math.PI * 1.3;
    const v = 3 + Math.random() * 7;
    return {
      kind, x: origin.x * w, y: origin.y * h,
      vx: Math.cos(a) * v, vy: Math.sin(a) * v,
      size: isPetal ? 5 + Math.random() * 6 : 1 + Math.random() * 2.2,
      rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.2,
      color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
      life: 1, decay: 0.004 + Math.random() * 0.004, burst: true, sway: Math.random() * 6,
    };
  }
  return {
    kind, x: Math.random() * w, y: isPetal ? -20 - Math.random() * h : Math.random() * h,
    vx: (Math.random() - 0.5) * 0.3, vy: isPetal ? 0.35 + Math.random() * 0.6 : -0.1 - Math.random() * 0.25,
    size: isPetal ? 4 + Math.random() * 5 : 0.8 + Math.random() * 1.8,
    rot: Math.random() * Math.PI * 2, vr: (Math.random() - 0.5) * 0.03,
    color: PETAL_COLORS[(Math.random() * PETAL_COLORS.length) | 0],
    life: 1, decay: 0, burst: false, sway: Math.random() * 6, tw: Math.random() * Math.PI * 2,
  };
}

/**
 * Falling petals + rising gold sparks on a single canvas.
 * Increment `burst` to fire a celebratory burst from `origin` (0–1 relative coords).
 */
export default function Particles({ petals = 14, sparks = 24, burst = 0, origin = { x: 0.5, y: 0.5 }, className = '' }) {
  const canvasRef = useRef(null);
  const state = useRef({ list: [], w: 0, h: 0, visible: true, raf: 0 });

  useEffect(() => {
    if (reducedMotion()) return undefined;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    const s = state.current;
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    const small = window.innerWidth < 640;
    const nPetals = Math.round(petals * (small ? 0.6 : 1));
    const nSparks = Math.round(sparks * (small ? 0.6 : 1));

    const resize = () => {
      const r = canvas.getBoundingClientRect();
      s.w = r.width; s.h = r.height;
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    s.list = [
      ...Array.from({ length: nPetals }, () => makeParticle(s.w, s.h, 'petal')),
      ...Array.from({ length: nSparks }, () => makeParticle(s.w, s.h, 'spark')),
    ];

    let t = 0;
    const frame = () => {
      t += 1;
      ctx.clearRect(0, 0, s.w, s.h);
      for (let i = s.list.length - 1; i >= 0; i--) {
        const p = s.list[i];
        if (p.burst) { p.vy += 0.09; p.vx *= 0.985; p.vy *= 0.985; p.life -= p.decay; }
        p.x += p.vx + Math.sin((t + p.sway * 40) / 60) * (p.kind === 'petal' ? 0.4 : 0.15);
        p.y += p.vy;
        p.rot += p.vr;
        if (p.burst && (p.life <= 0 || p.y > s.h + 30)) { s.list.splice(i, 1); continue; }
        if (!p.burst) {
          if (p.kind === 'petal' && p.y > s.h + 20) Object.assign(p, makeParticle(s.w, s.h, 'petal'), { y: -20 });
          if (p.kind === 'spark' && p.y < -10) Object.assign(p, makeParticle(s.w, s.h, 'spark'), { y: s.h + 10 });
        }
        ctx.globalAlpha = Math.max(0, Math.min(1, p.life));
        if (p.kind === 'petal') {
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rot);
          ctx.scale(1, 0.55 + 0.45 * Math.abs(Math.sin(p.rot * 2)));
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.quadraticCurveTo(p.size, 0, 0, p.size);
          ctx.quadraticCurveTo(-p.size, 0, 0, -p.size);
          ctx.fill();
          ctx.restore();
        } else {
          const tw = 0.55 + 0.45 * Math.sin(t / 18 + (p.tw || 0));
          ctx.globalAlpha *= tw;
          ctx.fillStyle = '#ffe3a0';
          ctx.shadowColor = '#ffc75a';
          ctx.shadowBlur = 8;
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
          ctx.fill();
          ctx.shadowBlur = 0;
        }
      }
      ctx.globalAlpha = 1;
      s.raf = s.visible && !document.hidden ? requestAnimationFrame(frame) : 0;
    };

    const restart = () => { if (!s.raf && s.visible && !document.hidden) s.raf = requestAnimationFrame(frame); };
    const io = new IntersectionObserver(([e]) => { s.visible = e.isIntersecting; restart(); });
    io.observe(canvas);
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);
    document.addEventListener('visibilitychange', restart);
    restart();
    s.fire = (o) => {
      const n = small ? 50 : 90;
      for (let i = 0; i < n; i++) s.list.push(makeParticle(s.w, s.h, i % 3 ? 'petal' : 'spark', true, o));
      restart();
    };

    return () => {
      cancelAnimationFrame(s.raf);
      s.raf = 0;
      io.disconnect();
      ro.disconnect();
      document.removeEventListener('visibilitychange', restart);
    };
  }, [petals, sparks]);

  useEffect(() => {
    if (burst > 0) state.current.fire?.(origin);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [burst]);

  return <canvas ref={canvasRef} className={`particles ${className}`} aria-hidden="true" />;
}
