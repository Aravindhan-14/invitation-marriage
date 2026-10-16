import { useState } from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, FileImage } from 'lucide-react';
import wedding from '../config/wedding';
import SectionTitle from './SectionTitle';
import { Corners, Divider } from './Ornaments';
import { whatsappUrl } from '../utils/calendar';
import { asset } from '../utils/asset';

export default function Blessings() {
  const { groom, bride, venue } = wedding;
  const [showScans, setShowScans] = useState(false);
  const scans = wedding.images.originalScans || [];

  return (
    <section id="blessings" className="section blessings-section">
      <SectionTitle eyebrow="With love & blessings" title="அன்பான அழைப்பு" light />

      {/* The trigger lives on an unclipped wrapper: a fully clipped element never reports as in view. */}
      <motion.div initial="hidden" whileInView="show" viewport={{ once: true, amount: 0.15 }}>
      <motion.article
        className="letter paper"
        variants={{
          hidden: { opacity: 0, y: 40, clipPath: 'inset(0 0 100% 0)' },
          show: { opacity: 1, y: 0, clipPath: 'inset(0 0 0% 0)', transition: { duration: 1.6, ease: [0.3, 0.6, 0.3, 1] } },
        }}
      >
        <Corners />
        <p className="letter-invocation">{wedding.invocation}</p>
        {wedding.invitationText.map((t) => <p key={t} className="letter-text">{t}</p>)}

        <div className="letter-couple">
          <p><strong>{groom.initialTa} {groom.nameTa}</strong>, {groom.degree}</p>
          <span className="letter-amp">மற்றும்</span>
          <p><strong>{bride.initialTa} {bride.nameTa}</strong>, {bride.degree}</p>
        </div>

        <p className="letter-text">{venue.nameTa}, {venue.addressTa.join(', ')}</p>
        <Divider />

        <div className="letter-families">
          <div>
            <p className="lf-label">மணமகன் {groom.family.labelTa}</p>
            {groom.family.membersTa.map((m) => <p key={m}>{m}</p>)}
            {groom.profession && <p className="lf-prof">{groom.profession}</p>}
          </div>
          <div>
            <p className="lf-label">மணமகள் {bride.family.labelTa}</p>
            {bride.family.membersTa.map((m) => <p key={m}>{m}</p>)}
            {bride.profession && <p className="lf-prof">{bride.profession}</p>}
          </div>
        </div>

        <p className="letter-closing">{wedding.closingMessage}</p>
      </motion.article>
      </motion.div>

      <motion.a
        className="btn btn-glow rsvp-btn"
        href={whatsappUrl()}
        target="_blank"
        rel="noopener noreferrer"
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4 }}
      >
        <MessageCircle size={18} aria-hidden="true" /> எங்கள் மகிழ்ச்சியில் பங்கேற்கிறீர்களா?
      </motion.a>

      {scans.length > 0 && (
        <div className="scans">
          <button type="button" className="text-link" onClick={() => setShowScans((s) => !s)} aria-expanded={showScans}>
            <FileImage size={15} aria-hidden="true" /> அசல் அழைப்பிதழைப் பார்க்க
          </button>
          {showScans && (
            <div className="scans-grid">
              {scans.map((src) => (
                <a key={src} href={asset(src)} target="_blank" rel="noopener noreferrer">
                  <img src={asset(src)} alt="அசல் அச்சிடப்பட்ட அழைப்பிதழ்" loading="lazy" />
                </a>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
}
