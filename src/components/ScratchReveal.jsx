import { useCallback, useEffect, useRef, useState } from 'react';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import wedding from '../config/wedding';
import Particles from './Particles';
import { Corners } from './Ornaments';
import SectionTitle from './SectionTitle';

const THRESHOLD = 0.65;
const BRUSH = 26;

function paintCoating(ctx, w, h) {
  const g = ctx.createLinearGradient(0, 0, w, h);
  g.addColorStop(0, '#9c7224');
  g.addColorStop(0.25, '#e9c977');
  g.addColorStop(0.5, '#fbe7a6');
  g.addColorStop(0.75, '#d4a64a');
  g.addColorStop(1, '#8a6420');
  ctx.globalCompositeOperation = 'source-over';
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, w, h);

  // fine brushed-metal texture + tiny glints
  for (let i = 0; i < w * h * 0.004; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,248,220,.35)' : 'rgba(110,76,20,.22)';
    ctx.fillRect(Math.random() * w, Math.random() * h, 1 + Math.random() * 2, 1);
  }
  // ornamental frame
  ctx.strokeStyle = 'rgba(110,76,20,.7)';
  ctx.lineWidth = 1.5;
  ctx.setLineDash([5, 4]);
  ctx.strokeRect(10, 10, w - 20, h - 20);
  ctx.setLineDash([]);

  ctx.fillStyle = '#5a0f17';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  const big = Math.max(18, Math.min(26, w / 15));
  ctx.font = `700 ${big}px "Noto Serif Tamil", serif`;
  ctx.fillText('ஒரு சிறிய அன்புப் பரிசு ✨', w / 2, h / 2 - big * 0.9);
  ctx.font = `500 ${Math.max(13, big * 0.58)}px "Noto Serif Tamil", serif`;
  wrapText(ctx, 'தேதியைத் தெரிந்துகொள்ள விரலால் மெதுவாகத் தேய்க்கவும்', w / 2, h / 2 + big * 0.6, w - 60, big * 0.9);
}

function wrapText(ctx, text, x, y, maxW, lh) {
  const words = text.split(' ');
  const lines = [];
  let line = '';
  words.forEach((wd) => {
    const test = line ? `${line} ${wd}` : wd;
    if (ctx.measureText(test).width > maxW && line) { lines.push(line); line = wd; } else line = test;
  });
  lines.push(line);
  lines.forEach((l, i) => ctx.fillText(l, x, y + i * lh));
}

export default function ScratchReveal() {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);
  const st = useRef({ drawing: false, last: null, started: false, moves: 0 });
  const [progress, setProgress] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [burst, setBurst] = useState(0);

  const { date, schedule } = wedding;
  const details = [
    ['திருமண தேதி', date.longTa],
    ['நாள்', date.weekdayTa],
    ...schedule.map((s) => [s.labelTa, s.timeTa]),
  ];

  const reveal = useCallback(() => {
    setRevealed((r) => {
      if (!r) setBurst((b) => b + 1);
      return true;
    });
  }, []);

  // initialise / resize coating (only redraw if the guest hasn't started scratching)
  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const draw = () => {
      if (st.current.started) return;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const { width, height } = wrap.getBoundingClientRect();
      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      paintCoating(ctx, width, height);
    };
    draw();
    document.fonts?.ready.then(draw);
    const ro = new ResizeObserver(draw);
    ro.observe(wrap);
    return () => ro.disconnect();
  }, []);

  const measure = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
    let clear = 0;
    let total = 0;
    const step = 4 * 24; // sample every 24th pixel
    for (let i = 3; i < data.length; i += step) { total++; if (data[i] < 40) clear++; }
    const p = clear / total;
    setProgress(p);
    if (p >= THRESHOLD) reveal();
  };

  const pos = (e) => {
    const r = canvasRef.current.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const scratch = (from, to) => {
    const ctx = canvasRef.current.getContext('2d');
    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.lineWidth = BRUSH * 2;
    ctx.beginPath();
    ctx.moveTo(from.x, from.y);
    ctx.lineTo(to.x, to.y);
    ctx.stroke();
    ctx.beginPath();
    ctx.arc(to.x, to.y, BRUSH, 0, Math.PI * 2);
    ctx.fill();
  };

  const onDown = (e) => {
    if (revealed) return;
    e.currentTarget.setPointerCapture?.(e.pointerId);
    const s = st.current;
    s.drawing = true;
    s.started = true;
    s.last = pos(e);
    scratch(s.last, s.last);
  };
  const onMove = (e) => {
    const s = st.current;
    if (!s.drawing) return;
    const p = pos(e);
    scratch(s.last, p);
    s.last = p;
    if (++s.moves % 8 === 0) measure();
  };
  const onUp = () => {
    if (!st.current.drawing) return;
    st.current.drawing = false;
    measure();
  };

  return (
    <section id="scratch" className="section scratch-section">
      <Particles petals={6} sparks={16} burst={burst} origin={{ x: 0.5, y: 0.5 }} />
      <SectionTitle eyebrow="A little surprise" title="அன்புப் பரிசு" />

      <div className="scratch-card paper" ref={wrapRef}>
        <Corners />
        <ul className="scratch-details" aria-live="polite">
          {details.map(([k, v], i) => (
            <motion.li
              key={k}
              initial={false}
              animate={revealed ? { opacity: 1, y: 0, scale: [1, 1.04, 1] } : { opacity: Math.min(1, 0.35 + progress * 1.2), y: 0 }}
              transition={{ delay: revealed ? i * 0.25 : 0, duration: 0.6 }}
            >
              <span className="sd-label">{k}</span>
              <span className="sd-value">{v}</span>
            </motion.li>
          ))}
        </ul>
        <motion.canvas
          ref={canvasRef}
          className="scratch-canvas"
          aria-hidden="true"
          onPointerDown={onDown}
          onPointerMove={onMove}
          onPointerUp={onUp}
          onPointerCancel={onUp}
          onPointerLeave={onUp}
          animate={revealed ? { opacity: 0, scale: 1.04 } : { opacity: 1 }}
          transition={{ duration: 0.9 }}
          style={{ pointerEvents: revealed ? 'none' : 'auto' }}
        />
        {!revealed && <span className="scratch-shimmer" style={{ opacity: Math.max(0, 0.9 - progress * 2) }} aria-hidden="true" />}
      </div>

      <div className="scratch-actions">
        {!revealed ? (
          <>
            <div className="scratch-progress" role="progressbar" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round((progress / THRESHOLD) * 100)}>
              <span style={{ width: `${Math.min(100, (progress / THRESHOLD) * 100)}%` }} />
            </div>
            <button type="button" className="btn btn-ghost" onClick={reveal}>
              <Sparkles size={16} aria-hidden="true" /> விவரங்களைப் பார்க்கவும்
            </button>
          </>
        ) : (
          <motion.p className="scratch-done" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2 }}>
            உங்களுக்காக காத்திருக்கிறோம் 🙏
          </motion.p>
        )}
      </div>
    </section>
  );
}
