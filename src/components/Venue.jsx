import { motion } from 'framer-motion';
import { CalendarPlus, MapPin, Navigation, Phone } from 'lucide-react';
import wedding from '../config/wedding';
import SectionTitle, { Reveal } from './SectionTitle';
import { Corners } from './Ornaments';
import { downloadICS, googleCalendarUrl } from '../utils/calendar';

export default function Venue() {
  const { date, venue, contacts = [] } = wedding;

  return (
    <section id="venue" className="section venue-section">
      <SectionTitle eyebrow="Save the Date" title="நாளும் இடமும்" />

      <div className="venue-grid">
        <motion.div
          className="date-card"
          initial={{ opacity: 0, rotateY: -25, y: 30 }}
          whileInView={{ opacity: 1, rotateY: 0, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 1.1, ease: 'easeOut' }}
        >
          <Corners />
          <p className="dc-month">{date.monthEn}</p>
          <p className="dc-day gold-text">{date.day}</p>
          <p className="dc-year">{date.year}</p>
          <p className="dc-weekday">{date.weekdayEn}</p>
          <p className="dc-ta">{date.longTa}, {date.weekdayTa}</p>
        </motion.div>

        <Reveal className="venue-card paper" delay={0.2}>
          <Corners />
          <div className="pin-wrap" aria-hidden="true">
            <motion.span
              className="pin"
              initial={{ y: -60, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ type: 'spring', stiffness: 220, damping: 11, delay: 0.5 }}
            >
              <MapPin size={44} strokeWidth={1.6} />
            </motion.span>
            <span className="pin-ripple" />
            <span className="pin-ripple r2" />
          </div>
          <h3 className="venue-name">{venue.nameTa}</h3>
          {venue.addressTa.map((l) => <p key={l} className="venue-line">{l}</p>)}
          <p className="venue-en">{venue.nameEn}, {venue.addressEn}</p>

          <div className="venue-actions">
            <a className="btn btn-gold" href={venue.mapsUrl} target="_blank" rel="noopener noreferrer">
              <Navigation size={17} aria-hidden="true" /> திருமண இடத்தைப் பார்க்க
            </a>
            <button type="button" className="btn btn-maroon" onClick={downloadICS}>
              <CalendarPlus size={17} aria-hidden="true" /> காலண்டரில் சேமிக்க
            </button>
            <a className="text-link" href={googleCalendarUrl()} target="_blank" rel="noopener noreferrer">
              Google Calendar-ல் சேர்க்க →
            </a>
          </div>

          {contacts.length > 0 && (
            <div className="venue-contacts">
              <p className="vc-title">தொடர்புக்கு</p>
              {contacts.map((c) => (
                <a key={c.phone} className="vc-item" href={`tel:${c.phone.replace(/\s/g, '')}`}>
                  <Phone size={17} aria-hidden="true" />
                  <span className="vc-name">
                    {c.nameTa}
                    {c.relationTa && <small>{c.relationTa}</small>}
                  </span>
                  <span className="vc-phone">{c.phone.replace(/^\+91/, '')}</span>
                </a>
              ))}
            </div>
          )}
        </Reveal>
      </div>
    </section>
  );
}
