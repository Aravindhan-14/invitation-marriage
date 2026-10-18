import { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import SectionTitle, { Reveal } from './SectionTitle';
import Photo, { photo } from './Photo';
import Particles from './Particles';

const tiles = [
  { name: 'gopuram-sky', ta: 'கோபுரம்', en: 'Temple Gopuram', span: 'tall' },
  { name: 'vilakku', ta: 'குத்து விளக்கு', en: 'Sacred Lamp', span: 'tall' },
  { name: 'wedding-ritual', ta: 'திருமணச் சடங்கு', en: 'Wedding Rituals', span: 'wide' },
  { name: 'marigold', ta: 'மலர் மாலை', en: 'Marigold Garland' },
  { name: 'thaali', ta: 'திருமாங்கல்யம்', en: 'Sacred Thaali' },
  { name: 'ring-exchange', ta: 'மோதிரம் மாற்றுதல்', en: 'Ring Exchange', span: 'wide-sm' },
  { name: 'holding-hands', ta: 'கைகோர்த்து', en: 'Hand in Hand', span: 'full' },
];

export default function Gallery() {
  const [open, setOpen] = useState(null);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(null);
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open]);

  return (
    <section id="gallery" className="section gallery-section">
      <Particles petals={6} sparks={12} />
      <SectionTitle eyebrow="Sacred Traditions" title="மங்கள மரபுகள்" sub="கோவில் மணியோசையுடன், விளக்கின் ஒளியில் ஒரு புனித பந்தம்" light />

      <ul className="gallery-grid">
        {tiles.map((t, i) => (
          <Reveal as="li" key={t.name} className={`g-tile ${t.span ? `is-${t.span}` : ''}`} delay={(i % 3) * 0.1}>
            <button type="button" className="g-btn" onClick={() => setOpen(t)} aria-label={`${t.en} — ${t.ta}: பெரிதாகப் பார்க்க`}>
              <Photo name={t.name} alt={t.en} />
              <span className="g-caption">
                <span className="g-en">{t.en}</span>
                <span className="g-ta">{t.ta}</span>
              </span>
            </button>
          </Reveal>
        ))}
      </ul>

      {createPortal(
        <AnimatePresence>
          {open && (
            <motion.div
              className="lightbox"
              role="dialog"
              aria-modal="true"
              aria-label={open.ta}
              onClick={() => setOpen(null)}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.figure
                initial={{ scale: 0.94, y: 16 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.96, opacity: 0 }}
                transition={{ duration: 0.4, ease: [0.2, 0.8, 0.2, 1] }}
                onClick={(e) => e.stopPropagation()}
              >
                <Photo name={open.name} alt={open.en} />
                <figcaption>
                  <strong>{open.en}</strong> · {open.ta}
                  <small>Photo: {photo(open.name)?.author} · {photo(open.name)?.license}</small>
                </figcaption>
              </motion.figure>
              <button type="button" className="lightbox-close" aria-label="மூடு — Close" autoFocus onClick={() => setOpen(null)}>
                <X size={22} />
              </button>
            </motion.div>
          )}
        </AnimatePresence>,
        document.body,
      )}
    </section>
  );
}
