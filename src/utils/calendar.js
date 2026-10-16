import wedding from '../config/wedding';

const toICSDate = (iso) => new Date(iso).toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
// RFC 5545: lines longer than 75 octets must be folded (Tamil characters are 3 bytes each).
const enc = new TextEncoder();
function fold(line) {
  const out = [];
  let cur = '';
  let bytes = 0;
  for (const ch of line) {
    const b = enc.encode(ch).length;
    if (bytes + b > (out.length ? 74 : 75)) { out.push(cur); cur = ''; bytes = 0; }
    cur += ch;
    bytes += b;
  }
  out.push(cur);
  return out.join('\r\n ');
}
const esc = (s) => String(s).replace(/\\/g, '\\\\').replace(/;/g, '\\;').replace(/,/g, '\\,').replace(/\n/g, '\\n');

function eventInfo() {
  const { schedule, venue, groom, bride } = wedding;
  const start = schedule.map((s) => s.start).sort()[0];
  const end = schedule.map((s) => s.end).sort().at(-1);
  const title = `${groom.name} ❤ ${bride.name} – Wedding`;
  const location = `${venue.nameTa}, ${venue.addressTa.join(', ')} (${venue.nameEn}, ${venue.addressEn})`;
  const description = [
    ...schedule.map((s) => `${s.labelTa} (${s.labelEn}): ${s.timeEn}`),
    '',
    `Map: ${venue.mapsUrl}`,
  ].join('\n');
  return { start, end, title, location, description };
}

/** Builds a valid RFC 5545 .ics file and triggers a download (iOS / Android / desktop). */
export function downloadICS() {
  const { start, end, title, location, description } = eventInfo();
  const ics = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Wedding Invitation//TA',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:wedding-${toICSDate(start)}@invitation`,
    `DTSTAMP:${toICSDate(new Date().toISOString())}`,
    `DTSTART:${toICSDate(start)}`,
    `DTEND:${toICSDate(end)}`,
    `SUMMARY:${esc(title)}`,
    `LOCATION:${esc(location)}`,
    `DESCRIPTION:${esc(description)}`,
    'BEGIN:VALARM',
    'TRIGGER:-P1D',
    'ACTION:DISPLAY',
    `DESCRIPTION:${esc(title)}`,
    'END:VALARM',
    'END:VEVENT',
    'END:VCALENDAR',
  ].map(fold).join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'karthikeyan-deepika-wedding.ics';
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 2000);
}

export function googleCalendarUrl() {
  const { start, end, title, location, description } = eventInfo();
  const p = new URLSearchParams({
    action: 'TEMPLATE',
    text: title,
    dates: `${toICSDate(start)}/${toICSDate(end)}`,
    details: description,
    location,
    ctz: wedding.date.timezone,
  });
  return `https://calendar.google.com/calendar/render?${p}`;
}

export function whatsappUrl() {
  const { whatsappNumber, message } = wedding.rsvp;
  const text = encodeURIComponent(message);
  return whatsappNumber ? `https://wa.me/${whatsappNumber}?text=${text}` : `https://wa.me/?text=${text}`;
}
