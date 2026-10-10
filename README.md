# Chennuru Tejith: Portfolio

An editorial portfolio (obsidian, ivory, champagne, rose-copper) split into pages: Home, Work, Arenas, Research, About, Ask AI and Contact (`#work`, `#ask`…). There is also a recruiter résumé view (`?view=resume`), a press kit (`press.html`) and a plain text profile (`profile.html`).

## Edit content
Everything lives in `js/data.js`:

| Field | What it controls |
|---|---|
| `profile` | Name, summary, stats, email, links, loyalty quote |
| `gyms` | The five disciplines (credential, evidence, skills, optional `referee`) |
| `experience`, `leadership` | Experience timeline |
| `outcomes` | Before and after block on each internship |
| `cases` | Case-study reader for each internship (`takeaway` is a draft, edit freely) |
| `projects` | Projects (first one is featured; `live` / `repo` links) |
| `writing` | Papers and essays; add `status: "In progress"` for unpublished work (no link needed) |
| `recommendations` | Only real, permission-given recommendations, with a LinkedIn `link` |
| `currently` | "Working on / Reading / Learning" line in the hero (empty fields are hidden) |
| `books` | Bookshelf (section stays hidden until you add a book) |
| `documents` | Documents vault (CV, certificates…) |
| `offClock` | The "Off the clock" line |
| `availability`, `programme`, `places`, `faq` | Availability panel, progress bar, India map, Q&A |
| `photo`, `signature`, `voice`, `homeNote` | Hero portrait, written signature, voice clip, hometown line on the map |
| `updates`, `geoStage`, `decision`, `notes`, `seasons`, `details` | "Now" strip, GEO tracker, decision, field notes, seasonal greetings, hidden details |
| `bios`, `changelog` | Short and long bio (press kit, llms.txt, assistant), monthly change log |
| `askEndpoint` | The AI assistant's endpoint (`/api/ask`); empty = answers from the site only |
| `bookingUrl`, `goatcounter` | Call booking link, optional visitor counter |

## What I still need
See [CHECKLIST.md](CHECKLIST.md).

## Testing motion
Add `?motion=1` to the URL to force full animations even if your system asks for reduced motion.

## After editing
1. Run `node build.js`. It rewrites `profile.html`, `press.html`, `llms.txt`, `api/_profile.mjs`, the structured data and the static résumé from `js/data.js`, so AI crawlers (which don't run JavaScript) and the assistant see current facts.
2. Bump the `?v=` number on the css/js links in `index.html` so returning visitors get the new files.

## AI assistant
`api/ask.mjs` is a Vercel serverless function that answers visitors' questions with Claude (default model `claude-opus-5-5`, override with `ANTHROPIC_MODEL`). It only knows what is in `api/_profile.mjs`, which `node build.js` writes from `js/data.js`. Set `ANTHROPIC_API_KEY` in Vercel. Requests are capped (short questions, last few turns, 20 questions per 10 minutes per visitor) and declined requests fall back server-side (`fallbacks: "default"`). If the endpoint is missing, the page answers by quoting the site instead.

## GEO (being found by AI assistants)
- `profile.html`: a plain, question-led, no-JavaScript profile page
- `llms.txt`: a short summary for AI tools
- Structured data: ProfilePage + Person + FAQPage (JSON-LD)
- `robots.txt` explicitly allows GPTBot, ClaudeBot, PerplexityBot, Google-Extended and others
- Set `siteUrl` in `js/data.js` once live, then run `node build.js` for absolute URLs and `sitemap.xml`

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
Import the GitHub repo in Vercel (recommended: applies the security headers and runs the AI assistant). Netlify also works for the static site, without the assistant.
