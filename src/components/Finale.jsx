import { motion } from 'framer-motion';
import { ArrowUp } from 'lucide-react';
import wedding from '../config/wedding';
import photoCredits from '../config/credits';
import { Divider } from './Ornaments';
import Photo from './Photo';
import Particles from './Particles';

export default function Finale() {
  const { groom, bride, date } = wedding;
  const toTop = () => document.getElementById('invitation')?.scrollIntoView({ behavior: 'smooth' });

  return (
    <footer id="finale" className="section finale-section">
      <div className="section-photo finale-photo" aria-hidden="true">
        <Photo name="gopuram-dusk" wide="gopuram-sunset" position="50% 30%" widePosition="50% 55%" />
      </div>
      <Particles petals={14} sparks={30} />

      <motion.div
        className="finale-content"
        initial={{ opacity: 0, scale: 0.94 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true, amount: 0.4 }}
        transition={{ duration: 1.4, ease: 'easeOut' }}
      >
        <p className="finale-invocation">{wedding.invocation}</p>
        <h2 className="finale-names gold-text">
          {groom.nameTa} <span className="heart">❤️</span> {bride.nameTa}
        </h2>
        <p className="finale-names-en">{groom.name} &amp; {bride.name}</p>
        <Divider />
        <p className="finale-date">{date.short}</p>
        <p className="finale-blessing">{wedding.finalBlessing}</p>
        <button type="button" className="btn btn-ghost" onClick={toTop}>
          <ArrowUp size={16} aria-hidden="true" /> மீண்டும் தொடக்கத்திற்கு
        </button>
      </motion.div>

      <details className="credits">
        <summary></summary>
        <ul>
          {photoCredits.map((c) => (
            <li key={c.file}>
              <a href={c.source} target="_blank" rel="noopener noreferrer">{c.label}</a> — {c.author},{' '}
              {c.licenseUrl ? <a href={c.licenseUrl} target="_blank" rel="noopener noreferrer">{c.license}</a> : c.license}
            </li>
          ))}
        </ul>
        <p>via Wikimedia Commons; resized and colour-graded.</p>
      </details>
    </footer>
  );
}
