import wedding from '../config/wedding';
import { asset } from './asset';

/**
 * All sound is created only after a user gesture (browser autoplay rules).
 * The temple bell is synthesised with Web Audio — no audio file needed.
 */
let ctx = null;
let master = null;
let ambient = null;
let muted = readMuted();

function readMuted() {
  try { return localStorage.getItem('wedding-muted') === '1'; } catch { return false; }
}

function ensureCtx() {
  if (!ctx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    ctx = new AC();
    master = ctx.createGain();
    master.gain.value = muted ? 0 : 1;
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') ctx.resume();
  return ctx;
}

export const isMuted = () => muted;

export function setMuted(value) {
  muted = value;
  try { localStorage.setItem('wedding-muted', value ? '1' : '0'); } catch { /* storage blocked */ }
  if (master && ctx) master.gain.setTargetAtTime(value ? 0 : 1, ctx.currentTime, 0.15);
  if (ambient?.el) ambient.el.muted = value;
  if (!value) ensureCtx();
}

/** Brass temple bell: inharmonic partials with long exponential decay. */
export function playBell(delay = 0) {
  const c = ensureCtx();
  if (!c) return;
  const t = c.currentTime + delay;
  const base = 523;
  const partials = [[0.5, 0.35, 6], [1, 0.5, 4.5], [1.19, 0.25, 3.5], [1.56, 0.2, 3], [2.0, 0.18, 2.5], [2.74, 0.12, 1.8], [3.76, 0.08, 1.2], [5.4, 0.05, 0.8]];
  const out = c.createGain();
  out.gain.value = 0.22;
  out.connect(master);
  partials.forEach(([ratio, amp, decay]) => {
    const o = c.createOscillator();
    const g = c.createGain();
    o.type = 'sine';
    o.frequency.value = base * ratio;
    o.detune.value = (Math.random() - 0.5) * 6;
    g.gain.setValueAtTime(0.0001, t);
    g.gain.exponentialRampToValueAtTime(amp, t + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t + decay);
    o.connect(g).connect(out);
    o.start(t);
    o.stop(t + decay + 0.1);
  });
}

/** Soft tanpura-like drone (Sa–Pa–Sa) or a user-supplied audio file. */
export function startAmbient() {
  const src = wedding.audio.ambient;
  if (!src || ambient) return;
  const vol = wedding.audio.ambientVolume ?? 0.35;

  if (src !== 'synth') {
    const el = new Audio(asset(src));
    el.loop = true;
    el.volume = vol;
    el.muted = muted;
    el.play().catch(() => {});
    ambient = { el };
    return;
  }

  const c = ensureCtx();
  if (!c) return;
  const bus = c.createGain();
  bus.gain.setValueAtTime(0.0001, c.currentTime);
  bus.gain.exponentialRampToValueAtTime(0.05 * vol, c.currentTime + 5);
  const filter = c.createBiquadFilter();
  filter.type = 'lowpass';
  filter.frequency.value = 900;
  bus.connect(filter).connect(master);

  [[130.81, 0], [196.0, 1.3], [261.63, 2.6], [65.41, 0.6]].forEach(([f, phase]) => {
    ['sawtooth', 'sine'].forEach((type, i) => {
      const o = c.createOscillator();
      const g = c.createGain();
      o.type = type;
      o.frequency.value = f;
      o.detune.value = i ? 3 : -3;
      g.gain.value = type === 'sine' ? 0.6 : 0.12;
      // slow swell, offset per string, like tanpura plucks
      const lfo = c.createOscillator();
      const lg = c.createGain();
      lfo.frequency.value = 0.18;
      lg.gain.value = 0.3;
      lfo.connect(lg).connect(g.gain);
      lfo.start(c.currentTime + phase);
      o.connect(g).connect(bus);
      o.start();
    });
  });
  ambient = { bus };
}

/** Pause audio while the tab is hidden (saves battery). */
if (typeof document !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (!ctx) return;
    if (document.hidden) ctx.suspend();
    else ctx.resume();
    if (ambient?.el) document.hidden ? ambient.el.pause() : ambient.el.play().catch(() => {});
  });
}
