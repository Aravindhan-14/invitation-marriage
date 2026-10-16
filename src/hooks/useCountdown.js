import { useEffect, useState } from 'react';

function compute(targetMs, endOfDayMs) {
  const now = Date.now();
  const ms = targetMs - now;
  if (ms <= 0) return { phase: now < endOfDayMs ? 'today' : 'after', days: 0, hours: 0, minutes: 0, seconds: 0 };
  return {
    phase: 'before',
    days: Math.floor(ms / 86400000),
    hours: Math.floor((ms / 3600000) % 24),
    minutes: Math.floor((ms / 60000) % 60),
    seconds: Math.floor((ms / 1000) % 60),
  };
}

/** Live countdown. `targetIso` must include its UTC offset, e.g. 2026-11-15T07:00:00+05:30. */
export default function useCountdown(targetIso) {
  const target = new Date(targetIso).getTime();
  // End of the wedding day in the wedding's own timezone offset.
  const endOfDay = new Date(`${targetIso.slice(0, 10)}T23:59:59${targetIso.slice(19)}`).getTime();
  const [state, setState] = useState(() => compute(target, endOfDay));

  useEffect(() => {
    let id;
    const tick = () => {
      setState(compute(target, endOfDay));
      // align to the next whole second so all digits change together
      id = setTimeout(tick, 1000 - (Date.now() % 1000) + 5);
    };
    tick();
    return () => clearTimeout(id);
  }, [target, endOfDay]);

  return state;
}
