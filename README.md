# Chennuru Tejith: "Every badge, earned."

An editorial portfolio with two views:
- **Story** (default): hero, five Gyms (each has a challenge and an enamel badge to earn), Journey, Selected Work, Honours, Contact.
- **Résumé** (`?view=resume`): a clean CV page for recruiters. Put this link on your CV and LinkedIn.

The theme button switches between night (ink and brass) and day (paper and ink).

## Edit content
All text lives in `js/data.js`:
- `gyms`: the five gyms
- `projects`: the first entry is shown as the featured project; `live` = public URL, `repo` = GitHub
- `experience`, `leadership`, `education`, `achievements`
- `profile.quote`: the loyalty quote. Wrap words in `*stars*` to make them gold italic.

## Security & speed
- Content-Security-Policy in `index.html` (scripts only from this site, no plugins, no forms, no framing).
- `_headers` (Netlify / Cloudflare Pages) and `vercel.json` (Vercel) add HSTS, clickjacking protection, nosniff, a strict referrer policy and long caching. GitHub Pages ignores these files but still uses the in-page policy.
- All external links use `rel="noopener noreferrer"`; all content is HTML-escaped before rendering.
- The email address is assembled at runtime so simple scrapers don't pick it up.
- Images come in sized WebP versions (`-560`, `-900`, `-300`); the hero image is preloaded and the rest load lazily.

## After editing
Bump the `?v=` number on the css/js links in `index.html` (e.g. `?v=4` → `?v=5`) so returning visitors get the new files.

## Run locally
    python -m http.server 5173

## Deploy (free)
Drag this folder onto app.netlify.com/drop, or push it to GitHub and import it in Vercel or GitHub Pages.
