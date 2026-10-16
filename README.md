# கார்த்திகேயன் ❤ தீபிகா — Wedding Invitation Website

An animated Tamil wedding invitation built with **React + Vite + Framer Motion**.

**Flow:** temple doors (with a bell sound) → envelope opening → invitation card → scratch-to-reveal → couple → temple gallery → date & venue → live countdown → programme → family invitation & WhatsApp RSVP → closing blessing.

---

## 1. Run locally

Requires [Node.js](https://nodejs.org) 18 or newer.

```bash
npm install
npm run dev        # opens http://localhost:5173 (also reachable from your phone on the same Wi-Fi)
```

Production build:

```bash
npm run build      # outputs to /dist
npm run preview    # preview the built site
```

---

## 2. Edit wedding details: `src/config/wedding.js`

**Every name, date, time, address, link and message lives in this one file.** Lines marked `VERIFY` must be checked against the printed card before you share the link:

| Field | What to check |
|---|---|
| `groom.family`, `bride.family` | Names and spelling. `labelTa` is currently the neutral `குடும்பத்தினர்`. Change it to `பெற்றோர்` if these are the parents. |
| `schedule` | Wedding and muhurtham times. These also drive the scratch card, programme and calendar file. |
| `venue.addressTa` | Address lines. |
| `invitationText` | Replace with the exact wording printed on the card. |
| `venue.mapsUrl` | Currently a Google Maps **search** link. For an exact pin, open the hall in Google Maps → **Share → Copy link** and paste it here. |
| `rsvp.whatsappNumber` | Add the family's number, e.g. `'919876543210'` (country code, no `+` or spaces). If left empty, WhatsApp asks guests to choose a contact. |
| `date.countdownTarget` | Countdown target, with `+05:30` (India) so it is correct for guests abroad too. |

After the wedding, the countdown automatically shows a wedding-day message, then a thank-you message. It never shows negative numbers.

---

## 3. Add the invitation artwork and original scans

Until this image is added, the card shows a real sunset photograph of a rajagopuram.

1. Crop the temple illustration from a photo/scan of the printed card.
2. Convert it to WebP (free: <https://squoosh.app>, quality ≈ 80, width ≈ 1200 px).
3. Save it as **`public/images/invitation-temple.webp`**.

It then appears automatically on the invitation card and in the gallery.

To let guests view the original printed card for verification, add the photos and list them in the config:

```js
images: {
  invitationArt: 'images/invitation-temple.webp',
  originalScans: ['images/original-front.webp', 'images/original-inside.webp'],
},
```

A "அசல் அழைப்பிதழைப் பார்க்க" link then appears under the RSVP button.

---

## 4. Add the couple's photos

1. Choose portrait photos (3:4 ratio works best), compress them to WebP, about 800 px wide.
2. Save them as `public/images/groom.webp` and `public/images/bride.webp`.
3. In `wedding.js`, set:
   ```js
   groom: { ..., photo: 'images/groom.webp' },
   bride: { ..., photo: 'images/bride.webp' },
   ```

Photos are lazy-loaded and shown in the gold temple-arch frames.

---

## 5. Audio

- The temple bell is generated in the browser, so no audio file is needed. It plays only after the guest taps **திறந்து பார்க்கவும்** (mobile autoplay rules).
- Background ambience defaults to a soft generated tanpura-style drone (`audio.ambient: 'synth'`).
  - To use your own music, put an MP3 in `public/audio/` and set `ambient: 'audio/your-file.mp3'`.
  - Set `ambient: null` for no background sound.
- The floating speaker button mutes and unmutes sound. The choice is remembered on that device.
- Audio pauses when the tab is hidden.

---

## 6. Deploy for free

The build is a static site with relative paths, so it works on any static host.

### Netlify Drop (easiest, no account setup)
1. `npm run build`
2. Go to <https://app.netlify.com/drop> and drag the **`dist`** folder in.
3. You get a link like `https://something.netlify.app` (rename it in *Site settings*).

### Vercel
1. Push the project to GitHub.
2. Go to <https://vercel.com/new> and import the repo. The Vite settings are auto-detected.

### GitHub Pages
1. `npm run build`
2. Publish the contents of `dist/` to a `gh-pages` branch (e.g. `npx gh-pages -d dist`).
3. Enable Pages in the repo settings and choose the `gh-pages` branch.

---

## 7. Project structure

```
src/
  config/wedding.js        ← all wedding details (edit this)
  config/credits.js        photo list + licence credits (shown in the footer)
  components/
    TempleWelcome.jsx      temple doors opening, bell, petals
    Envelope.jsx           envelope → card choreography
    InvitationCard.jsx     printed-card recreation + artwork fallback
    ScratchReveal.jsx      canvas scratch card (touch + mouse, auto-reveal at 65%)
    Couple.jsx             bride & groom with photo placeholders
    Gallery.jsx            photo grid with tap-to-enlarge lightbox
    Venue.jsx              date card, venue, Maps + calendar buttons
    Countdown.jsx          live countdown (Asia/Kolkata)
    Programme.jsx          timeline from config schedule
    Blessings.jsx          family invitation letter + WhatsApp RSVP
    Finale.jsx             closing blessing screen
    Photo.jsx              real photographs (lazy, fade-in, portrait/landscape variants)
    Ornaments.jsx          small SVG ornaments: dividers, corners, envelope seal
    Particles.jsx          lightweight canvas petals & gold sparks
    AudioToggle.jsx        mute / unmute
  utils/calendar.js        .ics file, Google Calendar & WhatsApp links
  utils/audio.js           Web Audio bell + ambience
  hooks/useCountdown.js
  styles/global.css        design tokens & all styles
```

## 8. Temple photographs & credits

The temples, lamp, flowers and kolam are real photographs from **Wikimedia Commons** (`public/images/photos/`, WebP, ~2.4 MB total, lazy-loaded except the opening screen).
They are used under Creative Commons licences (CC BY / CC BY-SA) that require crediting the photographer, so `src/config/credits.js` lists each author and licence, and the site shows them under **Photo credits** in the footer. Keep that list if you keep the photos.

To swap a photo, replace the `.webp` file with the same name (and update its `w`, `h`, author and licence in `credits.js`), or use your own photos. The opening screen uses `gopuram-madurai` on phones and `gopuram-thanjavur` on landscape screens.

## 9. Performance & accessibility notes

- Particle canvases pause when off-screen or when the tab is hidden, and use fewer particles on phones.
- With *Reduce motion* enabled on the phone or PC, animations are minimised and particles are off.
- If the guest can't scratch, the **விவரங்களைப் பார்க்கவும்** button reveals the details.
- The scratch canvas captures touch only inside the card, so page scrolling elsewhere is unaffected.
- A `<noscript>` block in `index.html` still shows the key details if JavaScript fails. Update it if you change the details.
