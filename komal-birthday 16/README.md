# Happy Birthday, Komal 🎬❤️

A scroll-driven, cinematic birthday website — built as a private digital
gift. Plain HTML/CSS/JS, no build step, no tracking, no third-party
branding.

## What's inside

```
komal-birthday/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── script.js            ← all personal text/photos/music are configured here
├── assets/
│   ├── images/               ← photo-01.jpg already in place
│   ├── music/                ← put your song here
│   └── video/                 ← 7 scroll-scrubbed scenes — see status below
└── README.md
```

## The experience, in order

1. **Loader** — "Preparing your surprise…"
2. **Gate** — tap to start (also starts the music and unlocks audio on mobile)
3. **Cinematic title cards** — "Presenting… A Film By Sai… Starring Komal…"
4. **Hero** — "Hello, Komal ❤️" with her photo
5. **Envelope** — tap to open, unfolds into a personal letter
6. **Seven scroll-scrubbed scenes**, back to back, each a little vignette:
   1. **Kneel / The Grand Gesture** — "For the one who makes my world beautiful"
   2. **Flower Field** — "I'd still choose to wander with you"
   3. **Campfire / Lakeside Night** — "Quiet nights, loudest feelings"
   4. **Sunset Ride** — "Chasing sunsets with you"
   5. **Rain** — "Some moments don't need any words"
   6. **Red Carpet** — "My favourite kind of spotlight"
   7. **Dance** — "Hold my hand. Never let go." *(polaroid memories sit between
      this and the red carpet scene, see below)*
7. **Polaroid memories** — a numbered stack of your photos, between the
   red carpet and dance scenes
8. **Chocolate surprise** — tap a button and a shower of chocolates falls
   across the screen while a line of dialogue types itself out
9. **Scratch card** — a "🏆 JACKPOT!" style card she scratches to reveal
10. **Finale** — closing message, confetti, and your signature

## Video status

All 7 scenes are in, in this order: Kneel → Red Carpet → Flower Field →
Sunset Ride → Campfire → Rain → Dance (polaroids sit between Rain and
Dance). Each scene's caption is set from your reference screenshots.

| Scene | File | Status |
|---|---|---|
| Kneel | `assets/video/kneel-scene.mp4` | ✅ included |
| Red Carpet | `assets/video/redcarpet-scene.mp4` | ✅ included |
| Flower Field | `assets/video/field-scene.mp4` | ✅ included |
| Sunset Ride | `assets/video/ride-scene.mp4` | ✅ included |
| Campfire | `assets/video/campfire-scene.mp4` | ✅ included |
| Rain | `assets/video/rain-scene.mp4` | ✅ included |
| Dance | `assets/video/dance-scene.mp4` | ✅ included |

If you ever swap a clip, just overwrite the file at the same path — nothing
else to wire. Any scene whose file goes missing shows a soft placeholder
(icon + filename reminder) instead of breaking.

## How the scroll-scrubbed scenes work

Each scene is a tall (320vh) wrapper section with a "sticky" inner stage
that stays pinned in the viewport while she scrolls through it. A small
JS engine (`bindScrollProgress` in `script.js`) converts how far she's
scrolled through that wrapper into a 0→1 progress value.

`bindVideoScrollScene` sets each scene's `video.currentTime` to match that
0→1 progress on every scroll frame — scroll down and the moment advances,
scroll up and it reverses. Nothing plays on a timer; it's entirely tied to
scroll position. The three captions per scene (open / mid / close) fade
in and out at fixed points along that same 0→1 range.

To keep things light on mobile data, each video only starts downloading
once its scene is actually getting close on screen (a lazy-load observer
watches for that), rather than all seven loading at once.

## How to personalize it

Open `js/script.js` and edit the `birthdayConfig` object at the top:

- `letter` — heading, body, and signature for the envelope scene
- `photos` — filenames + captions for the polaroid stack (currently just
  the one photo — add more entries and matching files in `assets/images/`
  any time)
- `bollywoodLine` — the dialogue line for the chocolate scene
- `jackpot` — title/prize/footer text for the scratch card
- `finaleMessage` — the closing line
- `song.src` — path to your music file

Scene captions live directly in `index.html` (search for `scroll-caption`)
if you want to tweak the wording per scene.

### Photos
`assets/images/photo-01.jpg` is already in place. Add more the same way —
drop the file in and add a matching entry to `birthdayConfig.photos`.

### Music
Drop one MP3 into `assets/music/` as `komal-birthday-song.mp3` (or change
`song.src`). The site attempts to start it automatically right after she
taps "Open Your Surprise" (most mobile browsers allow this since it
follows a tap); if the browser blocks it anyway, she can start it anytime
with the pill-shaped toggle button, top right.

## Running it locally

No build tools needed. Either:

- Double-click `index.html` to open it directly in a browser, or
- Serve it locally for the most accurate experience (recommended — some
  browsers restrict local audio/canvas access when opened directly as a
  file, and video seeking is smoother over an actual server):
  ```
  cd komal-birthday
  python3 -m http.server 8000
  ```
  then open `http://localhost:8000`

## Deploying it (free options)

**GitHub Pages**
1. Create a new GitHub repo and push this folder's contents to it.
2. Repo Settings → Pages → set source to the `main` branch, root folder.
3. Your site will be live at `https://<username>.github.io/<repo>/`.

**Netlify**
1. Go to netlify.com → "Add new site" → "Deploy manually."
2. Drag the whole `komal-birthday` folder into the upload area.
3. Netlify gives you a live link instantly.

**Vercel**
1. `npm i -g vercel` (one-time), then from inside the folder run `vercel`.
2. Follow the prompts — no framework/build settings needed for a static site.

## Notes

- No analytics, tracking pixels, or third-party branding are included.
- All copy is original.
- Built mobile-first; the scroll-scrubbed scenes use `position: sticky`,
  well supported on modern iOS Safari and Android Chrome.
- Videos should be H.264-encoded mp4 (the standard export setting from
  almost any editor/phone) — universally supported by real browsers.
