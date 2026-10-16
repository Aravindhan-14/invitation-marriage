import { motion } from 'framer-motion';
import { Clock } from 'lucide-react';
import wedding from '../config/wedding';
import SectionTitle from './SectionTitle';

export default function Programme() {
  return (
    <section id="programme" className="section programme-section">
      <SectionTitle eyebrow="Wedding Programme" title="நிகழ்ச்சி நிரல்" sub={`${wedding.date.longTa} · ${wedding.date.weekdayTa}`} />
      <ol className="timeline">
        <motion.span
          className="tl-line"
          initial={{ scaleY: 0 }}
          whileInView={{ scaleY: 1 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 1.4, ease: 'easeInOut' }}
          aria-hidden="true"
        />
        {wedding.schedule.map((s, i) => (
          <motion.li
            key={s.id}
            className="tl-item"
            initial={{ opacity: 0, x: i % 2 ? 40 : -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.9, delay: 0.3 + i * 0.3 }}
          >
            <span className="tl-dot" aria-hidden="true"><span /></span>
            <div className="tl-card paper">
              <p className="tl-time"><Clock size={15} aria-hidden="true" /> {s.timeEn}</p>
              <h3>{s.labelTa}</h3>
              <p className="tl-ta">{s.timeTa}</p>
              <p className="tl-en">{s.labelEn}</p>
            </div>
          </motion.li>
        ))}
      </ol>
    </section>
  );
}
