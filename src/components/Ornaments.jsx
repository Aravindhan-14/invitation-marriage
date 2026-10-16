/**
 * Small SVG ornaments (dividers, corners, seal) shared across the site.
 * Temples, lamps and flowers are real photographs — see Photo.jsx.
 * Gradients live once in <SvgDefs/> (rendered in App) and are referenced by id.
 */

export function SvgDefs() {
  return (
    <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="g-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fbe7a6" />
          <stop offset=".45" stopColor="#d9ae52" />
          <stop offset="1" stopColor="#9c7224" />
        </linearGradient>
        <linearGradient id="g-gold-h" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#9c7224" />
          <stop offset=".5" stopColor="#f7dc8f" />
          <stop offset="1" stopColor="#9c7224" />
        </linearGradient>
        <linearGradient id="g-gold-dark" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#b88a35" />
          <stop offset="1" stopColor="#6e4c14" />
        </linearGradient>
        <linearGradient id="g-maroon" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#7d1a24" />
          <stop offset="1" stopColor="#3d070e" />
        </linearGradient>
      </defs>
    </svg>
  );
}

/** Gold ornamental divider with central lotus. */
export function Divider({ className = '' }) {
  return (
    <svg className={`divider ${className}`} viewBox="0 0 320 30" aria-hidden="true">
      <path d="M6 15 H118" stroke="url(#g-gold-h)" strokeWidth="1.4" />
      <path d="M202 15 H314" stroke="url(#g-gold-h)" strokeWidth="1.4" />
      <circle cx="122" cy="15" r="2.2" fill="#d9ae52" />
      <circle cx="198" cy="15" r="2.2" fill="#d9ae52" />
      <path d="M130 15 Q145 3 160 15 Q175 3 190 15 Q175 27 160 15 Q145 27 130 15 Z" fill="none" stroke="#d9ae52" strokeWidth="1.2" />
      <path d="M160 2 Q168 10 160 15 Q152 10 160 2 Z M160 28 Q168 20 160 15 Q152 20 160 28 Z" fill="url(#g-gold)" />
      <circle cx="160" cy="15" r="3" fill="#fbe7a6" />
    </svg>
  );
}

/** Ornamental filigree corner; rotate for the other three corners. */
export function Corner({ className = '', style }) {
  return (
    <svg className={`corner ${className}`} style={style} viewBox="0 0 80 80" aria-hidden="true">
      <path d="M4 76 V20 Q4 4 20 4 H76" fill="none" stroke="url(#g-gold)" strokeWidth="2" />
      <path d="M12 76 V26 Q12 12 26 12 H76" fill="none" stroke="url(#g-gold)" strokeWidth=".9" />
      <path d="M20 20 Q34 20 34 34 Q20 34 20 20 Z" fill="url(#g-gold)" />
      <path d="M34 34 Q46 30 52 18 M34 34 Q30 46 18 52" fill="none" stroke="url(#g-gold)" strokeWidth="1.1" />
      <circle cx="54" cy="16" r="2.4" fill="#d9ae52" />
      <circle cx="16" cy="54" r="2.4" fill="#d9ae52" />
      <circle cx="27" cy="27" r="2" fill="#fbe7a6" />
    </svg>
  );
}

export function Corners() {
  return (
    <>
      <Corner className="c-tl" />
      <Corner className="c-tr" />
      <Corner className="c-bl" />
      <Corner className="c-br" />
    </>
  );
}

/** Gold seal emblem (lotus) used on the envelope. */
export function LotusSeal({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" aria-hidden="true">
      <circle cx="50" cy="50" r="46" fill="url(#g-gold)" stroke="#7a5418" strokeWidth="2" />
      <circle cx="50" cy="50" r="38" fill="none" stroke="#7a5418" strokeWidth="1" strokeDasharray="2 3" />
      {[-60, -30, 0, 30, 60].map((r) => (
        <path key={r} transform={`rotate(${r} 50 66)`} d="M50 66 Q60 46 50 28 Q40 46 50 66 Z" fill="#a8302f" stroke="#7a1424" strokeWidth=".8" />
      ))}
      <path d="M30 68 Q50 76 70 68" stroke="#7a5418" strokeWidth="2" fill="none" />
    </svg>
  );
}
