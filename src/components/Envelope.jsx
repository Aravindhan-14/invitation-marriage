import { useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ChevronDown, Hand } from 'lucide-react';
import wedding from '../config/wedding';
import { LotusSeal } from './Ornaments';
import Photo from './Photo';
import InvitationCard from './InvitationCard';
import Particles from './Particles';
import { playBell } from '../utils/audio';

/**
 * Stages: closed → seal → flap → card → open
 * Each stage is a step of the envelope-opening choreography.
 */
const STAGES = ['closed', 'seal', 'flap', 'card', 'open'];
const TIMING = [0, 350, 1150, 2250];

export default function Envelope({ active }) {
  const [stage, setStage] = useState('closed');
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();
  const timers = useRef([]);
  const at = (s) => STAGES.indexOf(stage) >= STAGES.indexOf(s);

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const open = () => {
    if (stage !== 'closed') return;
    playBell();
    if (reduce) { setStage('open'); return; }
    ['seal', 'flap', 'card', 'open'].forEach((s, i) => {
      timers.current.push(setTimeout(() => {
        setStage(s);
        if (s === 'open') setBurst((b) => b + 1);
      }, TIMING[i]));
    });
  };

  const { groom, bride } = wedding;

  return (
    <section id="invitation" className="section envelope-section" aria-label="திருமண அழைப்பிதழ்">
      <div className="section-photo" aria-hidden="true">
        <Photo name="sculptures" position="50% 30%" />
      </div>
      <Particles petals={8} sparks={22} burst={burst} origin={{ x: 0.5, y: 0.4 }} />

      <AnimatePresence mode="wait">
        {stage !== 'open' ? (
          <motion.div
            key="env"
            className="env-stage"
            exit={{ opacity: 0, y: 80, scale: 0.92, transition: { duration: 0.6, ease: 'easeIn' } }}
          >
            <motion.p
              className="env-hint"
              initial={{ opacity: 0 }}
              animate={{ opacity: at('seal') ? 0 : 1 }}
              transition={{ delay: active ? 0.6 : 0 }}
            >
              <Hand size={18} className="tap-hand" aria-hidden="true" /> அழைப்பிதழைத் திறக்கத் தொடவும்
            </motion.p>

            <motion.button
              type="button"
              className={`envelope ${at('flap') ? 'is-flapped' : ''}`}
              onClick={open}
              aria-label="அழைப்பிதழைத் திறக்கவும் — Open the invitation"
              initial={{ opacity: 0, y: 30, rotateX: 12 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 1.1, ease: 'easeOut' }}
            >
              <span className="env-back" />
              <motion.span
                className="env-card"
                animate={at('card') ? { y: '-58%' } : { y: '0%' }}
                transition={{ duration: 1, ease: [0.3, 0.7, 0.3, 1] }}
              >
                <span className="env-card-inner">
                  <span className="ec-invocation">{wedding.invocation}</span>
                  <span className="ec-title">{wedding.title}</span>
                  <span className="ec-names">{groom.nameTa} ❤ {bride.nameTa}</span>
                </span>
              </motion.span>
              <span className="env-pocket">
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 0 L50 52 L100 0" fill="none" stroke="url(#g-gold-h)" strokeWidth="1.2" vectorEffect="non-scaling-stroke" />
                  <rect x="2.5" y="4" width="95" height="92" fill="none" stroke="#d9ae52" strokeWidth=".8" strokeDasharray="3 2" vectorEffect="non-scaling-stroke" opacity=".6" />
                </svg>
              </span>
              <motion.span
                className="env-flap"
                animate={{ rotateX: at('flap') ? 180 : 0 }}
                transition={{ duration: 0.9, ease: [0.5, 0, 0.3, 1] }}
              >
                <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                  <path d="M0 0 L50 100 L100 0" fill="none" stroke="url(#g-gold-h)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" />
                </svg>
              </motion.span>
              <motion.span
                className="env-seal"
                animate={at('seal') ? { scale: 0, rotate: 90, opacity: 0 } : { scale: [1, 1.06, 1] }}
                transition={at('seal') ? { duration: 0.4 } : { duration: 2.4, repeat: Infinity }}
              >
                <LotusSeal />
              </motion.span>
            </motion.button>
          </motion.div>
        ) : (
          <motion.div
            key="card"
            className="card-stage"
            initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.7, y: 60, rotateX: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0, rotateX: 0 }}
            transition={{ duration: 1.2, ease: [0.2, 0.8, 0.2, 1] }}
          >
            <InvitationCard animate />
            <a href="#scratch" className="scroll-cue">
              கீழே தொடரவும் <ChevronDown size={18} aria-hidden="true" />
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
