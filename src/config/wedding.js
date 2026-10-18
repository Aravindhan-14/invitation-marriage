/**
 * ─────────────────────────────────────────────────────────────
 *  WEDDING CONFIGURATION — the single source of truth.
 *  Edit this file to change any detail shown on the website.
 *
 *  ⚠  Fields marked  VERIFY  should be checked against the
 *     printed invitation card before sharing the link.
 *  ⚠  Never put a guessed phone number / GPS location here.
 * ─────────────────────────────────────────────────────────────
 */

const wedding = {
  // Shown in the browser tab and when the link is shared.
  siteTitle: 'கார்த்திகேயன் ❤ தீபிகா — திருமண அழைப்பிதழ்',

  invocation: '',
  title: 'திருமண அழைப்பிதழ்',
  welcomeMessage: 'எங்கள் இல்லத் திருமண விழாவிற்கு தங்களை அன்புடன் அழைக்கிறோம்',

  groom: {
    initial: 'S.',
    initialTa: 'S.',
    name: 'Karthikeyan',
    nameTa: 'கார்த்திகேயன்',
    degree: 'M.Com.',
    // VERIFY: printed as the groom's family on the card.
    family: { label: 'Family', labelTa: 'குடும்பத்தினர்', members: ['S. Saravanan', 'S. Chitra'], membersTa: ['திரு. S. சரவணன்', 'திருமதி. S. சித்ரா'] },
    profession: '',
    photo: 'images/photos/groom.jpeg',
  },

  bride: {
    initial: 'K.',
    initialTa: 'K.',
    name: 'Deepika',
    nameTa: 'தீபிகா',
    degree: 'B.Com.',
    // VERIFY: printed as the bride's family on the card.
    family: { label: 'Family', labelTa: 'குடும்பத்தினர்', members: ['N. Kanthasamy', 'K. Nanthini'], membersTa: ['திரு. N. கந்தசாமி', 'திருமதி. K. நந்தினி'] },
    profession: '',
    photo: 'images/photos/bride.jpeg',
  },

  date: {
    // ISO dates WITH the India offset so the countdown is correct worldwide.
    timezone: 'Asia/Kolkata',
    day: '15',
    monthEn: 'NOVEMBER',
    year: '2026',
    weekdayEn: 'SUNDAY',
    weekdayTa: 'ஞாயிற்றுக்கிழமை',
    dotted: '15 • 11 • 2026',
    short: '15.11.2026',
    longTa: '15 நவம்பர் 2026',
    countdownTarget: '2026-11-15T07:00:00+05:30',
  },

  // VERIFY: timings as printed on the invitation.
  schedule: [
    { id: 'wedding', labelTa: 'திருமண சுபமுகூர்த்தம்', labelEn: 'Wedding', start: '2026-11-15T07:00:00+05:30', end: '2026-11-15T08:30:00+05:30', timeTa: 'காலை 7:00 மணி முதல் 8:30 மணி வரை', timeEn: '7:00 AM – 8:30 AM' },
    { id: 'muhurtham', labelTa: 'திருமண வரவேற்பு', labelEn: 'Reception', start: '2026-11-15T08:30:00+05:30', end: '2026-11-15T10:30:00+05:30', timeTa: 'காலை 8:30 மணி முதல் 10:30 மணி வரை', timeEn: '8:30 AM – 10:30 AM' },
  ],

  venue: {
    nameTa: 'செட்டிநாடு பேலஸ் மண்டபம்',
    nameEn: 'Chettinad Palace Mahal',
    // VERIFY: address lines from the card.
    addressTa: ['ஆஸ்ரம் பள்ளி அருகில்,', 'கொல்லம்பாளையம் பைபாஸ்,', 'ஈரோடு'],
    addressEn: 'Near Ashram School, Kollampalayam Bypass, Erode, Tamil Nadu',
    // A *search* URL — no invented coordinates. Replace with the exact
    // "Share → Copy link" URL from Google Maps once you have it.
    mapsUrl: 'https://www.google.com/maps/search/?api=1&query=' + encodeURIComponent('Chettinad Palace Mahal Kollampalayam Bypass Erode'),
  },

  // Tap-to-call numbers shown on the venue card. Section stays hidden while empty.
  // phone: digits with country code, e.g. '+919876543210'.
  contacts: [
    { nameTa: 'S. கார்த்திகேயன்', relationTa: 'மணமகன்', phone: '+919585609970' },
  ],

  rsvp: {
    // International format without "+" or spaces, e.g. '919876543210'.
    // Leave empty to let guests pick a WhatsApp contact themselves.
    whatsappNumber: '',
    message: 'வணக்கம்! கார்த்திகேயன் – தீபிகா திருமணத்தில் (15.11.2026) கலந்துகொள்கிறேன். வாழ்த்துகள்! 🙏',
  },

  // VERIFY: replace with the exact wording printed on the card if it differs.
  invitationText: [
    'நிகழும் மங்களகரமான 2026 ஆம் ஆண்டு நவம்பர் மாதம் 15 ஆம் நாள் ஞாயிற்றுக்கிழமை,',
    'எங்கள் இல்லத் திருமண விழாவிற்கு தங்களை அன்புடன் அழைக்கிறோம்.',
  ],
  closingMessage: 'தங்களின் வருகையும் வாழ்த்துகளும் எங்கள் திருமண விழாவை மேலும் சிறப்பிக்கும்.',
  finalBlessing: 'அன்புடன் வரவேற்கிறோம்!',

  images: {
    // Temple artwork from the printed invitation (crop it & save as WebP).
    // If the file is missing, a hand-drawn SVG temple is shown instead.
    invitationArt: 'images/invitation-temple.webp',
    // Original photographs of the printed card, shown for verification.
    // e.g. ['images/original-front.webp', 'images/original-inside.webp']
    originalScans: [],
  },

  audio: {
    // 'synth' = gentle generated drone; a path like 'audio/ambient.mp3'; or null for none.
    ambient: 'audio/wedding-song.mp3',
    ambientVolume: 0.6,
  },
};

export default wedding;
