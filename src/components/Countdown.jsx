import { AnimatePresence, motion } from 'framer-motion';
import wedding from '../config/wedding';
import useCountdown from '../hooks/useCountdown';
import SectionTitle from './SectionTitle';
import Photo from './Photo';

function Digit({ value }) {
  return (
    <span className="cd-digit">
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.span
          key={value}
          initial={{ y: '-100%', opacity: 0, rotateX: 60 }}
          animate={{ y: '0%', opacity: 1, rotateX: 0 }}
          exit={{ y: '100%', opacity: 0, rotateX: -60 }}
          transition={{ duration: 0.45, ease: 'easeOut' }}
        >
          {value}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function Unit({ n, ta, en, pad = 2, delay }) {
  const digits = String(n).padStart(pad, '0').split('');
  return (
    <motion.div
      className="cd-unit"
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay }}
    >
      <div className="cd-num" aria-hidden="true">
        {digits.map((d, i) => <Digit key={digits.length - i} value={d} />)}
      </div>
      <p className="cd-ta">{ta}</p>
      <p className="cd-en">{en}</p>
    </motion.div>
  );
}

export default function Countdown() {
  const { phase, days, hours, minutes, seconds } = useCountdown(wedding.date.countdownTarget);

  return (
    <section id="countdown" className="section countdown-section">
      <div className="section-photo cd-photo" aria-hidden="true">
        <Photo name="vilakku" position="50% 40%" />
      </div>
      <SectionTitle
        eyebrow="Counting the moments"
        title="இனிய திருமண நாளை எதிர்நோக்கி..."
        sub="எங்கள் மகிழ்ச்சியில் நீங்களும் பங்கேற்க வாருங்கள்!"
        light
      />

      {phase === 'before' ? (
        <>
          <div className="cd-grid" role="timer" aria-live="off" aria-label={`${days} நாட்கள் ${hours} மணி ${minutes} நிமிடங்கள்`}>
            <Unit n={days} ta="நாட்கள்" en="Days" pad={days > 99 ? 3 : 2} delay={0} />
            <Unit n={hours} ta="மணி" en="Hours" delay={0.1} />
            <Unit n={minutes} ta="நிமிடம்" en="Minutes" delay={0.2} />
            <Unit n={seconds} ta="விநாடி" en="Seconds" delay={0.3} />
          </div>
          <p className="cd-note">{wedding.date.longTa} · {wedding.date.weekdayTa}</p>
        </>
      ) : (
        <motion.div className="cd-celebrate" initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }}>
          {phase === 'today' ? (
            <>
              <p className="cd-big gold-text">இன்று திருமண நாள்! 🎉</p>
              <p>மணமக்களை வாழ்த்த அன்புடன் வாருங்கள்.</p>
            </>
          ) : (
            <>
              <p className="cd-big gold-text">திருமணம் இனிதே நடைபெற்றது 🙏</p>
              <p>தங்கள் அன்பான வாழ்த்துகளுக்கு நன்றி.</p>
            </>
          )}
        </motion.div>
      )}
    </section>
  );
}
