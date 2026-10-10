# Chennuru Tejith — Portfolio

A premium editorial portfolio (midnight · ivory · cobalt · clay) with a recruiter résumé view (`?view=resume`).

## Edit content
Everything lives in `js/data.js`:

| Field | What it controls |
|---|---|
| `profile` | Name, summary, stats, email, links, loyalty quote |
| `gyms` | The five disciplines (credential, evidence, skills, optional `referee`) |
| `experience`, `leadership` | Experience timeline |
| `outcomes` | Before → after block on each internship |
| `cases` | Case-study reader for each internship (`takeaway` is a draft — edit freely) |
| `projects` | Projects (first one is featured; `live` / `repo` links) |
| `writing` | Papers and essays; add `status: "In progress"` for unpublished work (no link needed) |
| `recommendations` | Only real, permission-given recommendations, with a LinkedIn `link` |
| `currently` | "Working on / Reading / Learning" line in the hero (empty fields are hidden) |
| `books` | Bookshelf (section stays hidden until you add a book) |
| `documents` | Documents vault (CV, certificates…) |
| `offClock` | The "Off the clock" line |
| `availability`, `programme`, `places`, `faq` | Availability panel, progress bar, India map, Q&A |
| `photo`, `signature`, `voice`, `homeNote` | Hero portrait, written signature, voice clip, hometown line on the map |
| `roles`, `updates`, `geoStage`, `decision`, `notes`, `seasons`, `details` | Rotating line, "Now" strip, GEO tracker, decision, field notes, seasonal greetings, hidden details |
| `bookingUrl`, `goatcounter` | Call booking link, optional visitor counter |

## What I still need
See [CHECKLIST.md](CHECKLIST.md).

## Testing motion
Add `?motion=1` to the URL to force full animations even if your system asks for reduced motion.

## After editing
Bump the `?v=` number on the css/js links in `index.html` so returning visitors get the new files.

## Link previews
`assets/og.png` is the share image. Once the site has a domain, change `og:image` and `twitter:image` in `index.html` to the full URL (e.g. `https://tejith.in/assets/og.png`); LinkedIn and WhatsApp need absolute URLs.

## Printing
Ctrl+P (or "Print / save" on the résumé) always prints the clean one-page résumé.

## Security & speed
- Content-Security-Policy in `index.html`; `_headers` (Netlify) and `vercel.json` (Vercel) add HSTS, clickjacking protection, nosniff and caching.
- External links use `rel="noopener noreferrer"`; all content is HTML-escaped; the email address is assembled at runtime.
- India map: simplified from DataMeet `india-composite` (CC-0, official boundary incl. J&K and Ladakh).

## Run locally
    python -m http.server 5173

## Deploy
Import the GitHub repo in Vercel (recommended, applies the security headers) or drag the folder onto app.netlify.com/drop.
