import { motion } from 'framer-motion';
import { Divider } from './Ornaments';

export default function SectionTitle({ eyebrow, title, sub, light = false }) {
  return (
    <motion.header
      className={`section-title ${light ? 'is-light' : ''}`}
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.9, ease: 'easeOut' }}
    >
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2>{title}</h2>
      <Divider />
      {sub && <p className="section-sub">{sub}</p>}
    </motion.header>
  );
}

/** Generic scroll-triggered reveal wrapper. */
export function Reveal({ children, delay = 0, y = 28, className, as = 'div' }) {
  const M = motion[as];
  return (
    <M
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.25 }}
      transition={{ duration: 0.9, delay, ease: 'easeOut' }}
    >
      {children}
    </M>
  );
}
