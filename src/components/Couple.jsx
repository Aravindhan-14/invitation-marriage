import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { Briefcase, Users } from 'lucide-react';
import wedding from '../config/wedding';
import SectionTitle, { Reveal } from './SectionTitle';
import { Corners } from './Ornaments';
import { asset } from '../utils/asset';

function Person({ p, role, roleTa, side }) {
  return (
    <Reveal className={`person person-${side}`} y={40} delay={side === 'right' ? 0.2 : 0}>
      <div className="photo-frame">
        <div className="photo-arch">
          {p.photo ? (
            <img src={asset(p.photo)} alt={`${p.name} photo`} loading="lazy" decoding="async" />
          ) : (
            <div className="photo-placeholder" aria-label="புகைப்படம் விரைவில் / Photo coming soon">
              <span className="ph-initial gold-text">{p.nameTa.charAt(0)}</span>
              <span className="ph-note">புகைப்படம் விரைவில்</span>
            </div>
          )}
        </div>
      </div>
      <div className="person-info paper">
        <Corners />
        <p className="person-role">{roleTa} · {role}</p>
        <h3 className="person-name">{p.initialTa} {p.nameTa}</h3>
        <p className="person-name-en">{p.initial} {p.name}, <span>{p.degree}</span></p>
        <div className="person-meta">
          <p><Users size={15} aria-hidden="true" /> <span className="pm-label">{p.family.labelTa}:</span> {p.family.membersTa.join(' – ')}</p>
          <p className="pm-en">{p.family.members.join(' & ')}</p>
          {p.profession && <p><Briefcase size={15} aria-hidden="true" /> {p.profession}</p>}
        </div>
      </div>
    </Reveal>
  );
}

export default function Couple() {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start end', 'end start'] });
  const y = useTransform(scrollYProgress, [0, 1], ['-8%', '8%']);
  const { groom, bride } = wedding;

  return (
    <section ref={ref} id="couple" className="section couple-section">
      <motion.div className="couple-bg" style={{ y }} aria-hidden="true" />
      <SectionTitle eyebrow="The Bride & Groom" title="மணமக்கள்" sub="இறைவன் அருளால் இணையும் இரு இதயங்கள்" light />
      <div className="couple-grid">
        <Person p={groom} role="Groom" roleTa="மணமகன்" side="left" />
        <motion.div
          className="couple-heart"
          initial={{ scale: 0, opacity: 0 }}
          whileInView={{ scale: 1, opacity: 1 }}
          viewport={{ once: true }}
          transition={{ type: 'spring', stiffness: 120, damping: 12, delay: 0.3 }}
          aria-hidden="true"
        >
          ❤
        </motion.div>
        <Person p={bride} role="Bride" roleTa="மணமகள்" side="right" />
      </div>
    </section>
  );
}
