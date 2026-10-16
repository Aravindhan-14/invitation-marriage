import { useEffect, useState } from 'react';
import { AnimatePresence, MotionConfig } from 'framer-motion';
import wedding from './config/wedding';
import { SvgDefs } from './components/Ornaments';
import TempleWelcome from './components/TempleWelcome';
import Envelope from './components/Envelope';
import ScratchReveal from './components/ScratchReveal';
import Couple from './components/Couple';
import Gallery from './components/Gallery';
import Venue from './components/Venue';
import Countdown from './components/Countdown';
import Programme from './components/Programme';
import Blessings from './components/Blessings';
import Finale from './components/Finale';
import AudioToggle from './components/AudioToggle';

export default function App() {
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    document.title = wedding.siteTitle;
  }, []);

  // Lock page scroll while the temple doors are closed.
  useEffect(() => {
    document.documentElement.classList.toggle('is-locked', !entered);
    if (entered) window.scrollTo(0, 0);
  }, [entered]);

  return (
    <MotionConfig reducedMotion="user">
      <SvgDefs />
      <AnimatePresence>{!entered && <TempleWelcome key="welcome" onOpened={() => setEntered(true)} />}</AnimatePresence>
      {entered && <AudioToggle />}
      <main>
        <Envelope active={entered} />
        <ScratchReveal />
        <Couple />
        <Gallery />
        <Venue />
        <Countdown />
        <Programme />
        <Blessings />
        <Finale />
      </main>
    </MotionConfig>
  );
}
