import { useState } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import wedding from '../config/wedding';
import { Corners } from './Ornaments';
import Photo from './Photo';
import Particles from './Particles';
import { playBell, startAmbient } from '../utils/audio';

const ease = [0.65, 0, 0.35, 1];

/**
 * Opening screen: a real photograph of a temple gopuram (portrait on phones,
 * landscape on wide screens), split down the middle.
 * Each half is a temple door; tapping the button swings them open into golden light.
 */
export default function TempleWelcome({ onOpened }) {
  const [opening, setOpening] = useState(false);
  const [burst, setBurst] = useState(0);
  const reduce = useReducedMotion();
  const { groom, bride, date } = wedding;

  const open = () => {
    if (opening) return;
    setOpening(true);
    playBell();
    playBell(1.4);
    startAmbient();
    setTimeout(() => setBurst((b) => b + 1), 700);
    setTimeout(onOpened, reduce ? 500 : 2900);
  };

  // temple doors swing inward, away from the visitor, into the light
  const door = (side) => ({
    initial: false,
    animate: opening
      ? { rotateY: reduce ? 0 : side * -96, opacity: reduce ? 0 : 1, filter: 'brightness(0.55)' }
      : { rotateY: 0, filter: 'brightness(1)' },
    transition: { duration: reduce ? 0.4 : 2.2, ease, delay: 0.55 },
  });

  return (
    <motion.div className="welcome" role="dialog" aria-label={wedding.title} exit={{ opacity: 0 }} transition={{ duration: 0.9 }}>
      <motion.div
        className="w-glow"
        aria-hidden="true"
        animate={opening ? { opacity: 1, scale: 1.25 } : { opacity: 0, scale: 0.9 }}
        transition={{ duration: 2.4, ease: 'easeOut', delay: 0.5 }}
      />

      <div className="w-doors" aria-hidden="true">
        {[-1, 1].map((side) => (
          <motion.div
            key={side}
            className={`door ${side < 0 ? 'door-l' : 'door-r'}`}
            style={{ transformOrigin: side < 0 ? 'left center' : 'right center' }}
            {...door(side)}
          >
            <div className="door-view">
              <Photo name="gopuram-madurai" wide="gopuram-thanjavur" priority position="50% 18%" widePosition="50% 20%" />
              <div className="door-shade" />
            </div>
            <span className="door-seam" />
          </motion.div>
        ))}
      </div>

      <Particles petals={8} sparks={26} burst={burst} origin={{ x: 0.5, y: 0.5 }} className="w-particles" />

      <motion.div
        className="w-frame"
        aria-hidden="true"
        animate={{ opacity: opening ? 0 : 1 }}
        transition={{ duration: 0.5 }}
      >
        <Corners />
      </motion.div>

      <motion.div
        className="w-content"
        initial="hidden"
        animate={opening ? 'gone' : 'show'}
        variants={{
          hidden: {},
          show: { transition: { staggerChildren: 0.16, delayChildren: 0.6 } },
          gone: { opacity: 0, y: 20, transition: { duration: 0.5 } },
        }}
      >
        {[
          <p key="i" className="w-invocation"><span>{wedding.invocation}</span></p>,
          <h1 key="t" className="w-title gold-text">{wedding.title}</h1>,
          <p key="m" className="w-message">{wedding.welcomeMessage}</p>,
          <div key="n" className="w-names">
            <span>{groom.nameTa}</span>
            <span className="w-amp">&amp;</span>
            <span>{bride.nameTa}</span>
          </div>,
          <p key="d" className="w-date">{date.dotted}</p>,
          <button key="b" type="button" className="btn btn-glow w-open" onClick={open}>
            திறந்து பார்க்கவும்
          </button>,
        ].map((el) => (
          <motion.div key={el.key} variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0, transition: { duration: 0.9, ease: 'easeOut' } } }}>
            {el}
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
}
