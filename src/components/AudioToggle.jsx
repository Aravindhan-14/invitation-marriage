import { useState } from 'react';
import { motion } from 'framer-motion';
import { Volume2, VolumeX } from 'lucide-react';
import { isMuted, setMuted, startAmbient } from '../utils/audio';

export default function AudioToggle() {
  const [muted, setM] = useState(isMuted());
  const toggle = () => {
    const next = !muted;
    setMuted(next);
    if (!next) startAmbient();
    setM(next);
  };
  return (
    <motion.button
      type="button"
      className="audio-toggle"
      onClick={toggle}
      aria-pressed={!muted}
      aria-label={muted ? 'ஒலியை இயக்கு — Unmute' : 'ஒலியை நிறுத்து — Mute'}
      initial={{ opacity: 0, scale: 0.6 }}
      animate={{ opacity: 1, scale: 1 }}
    >
      {muted ? <VolumeX size={20} /> : <Volume2 size={20} />}
      {!muted && <span className="audio-wave" aria-hidden="true" />}
    </motion.button>
  );
}
