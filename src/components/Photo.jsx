import { useState } from 'react';
import photoCredits from '../config/credits';
import { asset } from '../utils/asset';

/** Look up a bundled photograph (and its credit) by short name, e.g. 'gopuram-madurai'. */
export const photo = (name) => photoCredits.find((c) => c.file.endsWith(`/${name}.webp`));

/**
 * Real photograph with intrinsic size (no layout shift) and a soft fade-in once decoded.
 * `wide` names an alternative landscape photo used on landscape screens.
 */
export default function Photo({ name, wide, alt = '', className = '', priority = false, position, widePosition, style, ...rest }) {
  const [loaded, setLoaded] = useState(false);
  const p = photo(name);
  const w = wide && photo(wide);
  if (!p) return null;
  const img = (
    <img
      src={asset(p.file)}
      width={p.w}
      height={p.h}
      alt={alt}
      className={`photo ${loaded ? 'is-loaded' : ''} ${className}`}
      style={{ '--pos': position, '--pos-wide': widePosition || position, ...style }}
      loading={priority ? 'eager' : 'lazy'}
      fetchpriority={priority ? 'high' : undefined}
      decoding="async"
      onLoad={() => setLoaded(true)}
      {...rest}
    />
  );
  if (!w) return img;
  return (
    <picture className="photo-picture">
      <source media="(min-aspect-ratio: 1/1)" srcSet={asset(w.file)} width={w.w} height={w.h} />
      {img}
    </picture>
  );
}
