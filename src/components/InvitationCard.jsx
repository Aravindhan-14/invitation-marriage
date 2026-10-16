import { useState } from 'react';
import { motion } from 'framer-motion';
import wedding from '../config/wedding';
import { Corners, Divider } from './Ornaments';
import Photo from './Photo';
import { asset } from '../utils/asset';

/** Temple artwork from the printed card; until that image is added, a real temple photograph. */
export function InvitationArt({ className = '' }) {
  const [failed, setFailed] = useState(!wedding.images.invitationArt);
  if (failed) return <Photo name="gopuram-sunset" className={`invitation-art ${className}`} position="50% 60%" alt="சூரிய அஸ்தமனத்தில் ராஜகோபுரம்" />;
  return (
    <img
      className={`invitation-art ${className}`}
      src={asset(wedding.images.invitationArt)}
      alt="திருமண அழைப்பிதழில் உள்ள கோவில் ஓவியம்"
      onError={() => setFailed(true)}
      decoding="async"
    />
  );
}

const item = (i) => ({
  initial: { opacity: 0, y: 14 },
  animate: { opacity: 1, y: 0 },
  transition: { delay: 0.5 + i * 0.22, duration: 0.8, ease: 'easeOut' },
});

/** Digital recreation of the printed Tamil invitation card. */
export default function InvitationCard({ animate = false }) {
  const { groom, bride, date, venue } = wedding;
  const m = (i) => (animate ? item(i) : {});

  return (
    <article className="inv-card paper">
      <Corners />
      <div className="inv-inner">
        <motion.p className="inv-invocation" {...m(0)}>{wedding.invocation}</motion.p>
        <motion.div className="inv-art-frame" {...m(1)}>
          <InvitationArt />
        </motion.div>
        <motion.h2 className="inv-title" {...m(2)}>{wedding.title}</motion.h2>
        <Divider />
        <motion.div className="inv-couple" {...m(3)}>
          <p className="inv-name">
            {groom.initialTa} {groom.nameTa}
            <small>{groom.degree}</small>
          </p>
          <p className="inv-weds" aria-label="மற்றும்">❀ ❤ ❀</p>
          <p className="inv-name">
            {bride.initialTa} {bride.nameTa}
            <small>{bride.degree}</small>
          </p>
        </motion.div>
        <Divider />
        <motion.div className="inv-when" {...m(4)}>
          <p className="inv-date">{date.longTa}</p>
          <p className="inv-day">{date.weekdayTa}</p>
          {wedding.schedule.map((s) => (
            <p key={s.id} className="inv-time">{s.labelTa}: {s.timeTa}</p>
          ))}
        </motion.div>
        <motion.p className="inv-venue" {...m(5)}>
          <strong>{venue.nameTa}</strong>
          <br />
          {venue.addressTa.join(', ')}
        </motion.p>
      </div>
    </article>
  );
}
