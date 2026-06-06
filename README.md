# travel-sankhacooray-com

Interactive travel map for [travel.sankhacooray.com](https://travel.sankhacooray.com) —
a colourable world map of the countries I've visited, shaded by how often
(deeper shade = more visits). Hover a country (or tap on mobile) to see the
name and visit count. A profile-circle button (top-right) signs me in to a
private **visa pack** served entirely by the Apps Script gate.

Single-file static site (plain HTML/CSS/JS, no build step), hosted on GitHub
Pages — same convention as the other `*-sankhacooray-com` sites.

## How it fits together

```
travel.sankhacooray.com (this repo)        travel-sankhacooray-com-gate (Apps Script)
  index.html  — map + login modal   ──POST──►  doPost action=login → signed token
  data.js     — baked visit counts             doPost page=visa+token → visa page
  config.js   — GATE_URL                        doGet ?action=mapdata → public JSON
        ▲                                              ▲ reads
        │ commit                                       │
  .github/workflows/bake.yml ◄── repository_dispatch ──┘ (Google Sheet onChange)
     fetch mapdata → write data.js → commit → Pages redeploys
```

- **Public, non-sensitive data** (country + visit count) is baked into
  [data.js](data.js) and committed. Trip details and documents never enter this
  repo — they're served only by the gate after login.

## Structure

| File | Purpose |
|------|---------|
| [index.html](index.html) | Map (jsVectorMap) + login modal, all CSS inline |
| [config.js](config.js) | `window.GATE_URL` — the Apps Script `/exec` URL (fill in after deploying the gate) |
| [data.js](data.js) | `window.TRAVEL_DATA` — baked visit counts (seed; auto-overwritten by the workflow) |
| [vendor/](vendor/) | Vendored jsVectorMap v1.6.0 (js + css + world map) |
| [.github/workflows/bake.yml](.github/workflows/bake.yml) | Rebakes `data.js` from the Sheet on `repository_dispatch` / manual run |
| `manifest.webmanifest`, `sw.js`, `icon*.png`, `og-image.png` | PWA + social-share assets |

## Local dev

```bash
python3 -m http.server 8000
# open http://localhost:8000
```

The map renders from baked `data.js`. On `localhost`, if `data.js` is absent it
falls back to fetching `GATE_URL?action=mapdata` live.

## Setup checklist (one-time)

1. **Deploy the gate** ([travel-sankhacooray-com-gate](../travel-sankhacooray-com-gate)) and copy its `/exec` URL.
2. Put that URL in [config.js](config.js) → `window.GATE_URL`, commit.
3. Repo **Settings → Pages**: deploy from `main`.
4. Repo **Settings → Secrets and variables → Actions → Variables**: add
   `GATE_URL` = the same `/exec` URL (used by `bake.yml`).
5. Cloudflare (`sankhacooray.com` zone): add a `travel` CNAME pointing at GitHub Pages.
6. In the gate, run `installTrigger()` once so sheet edits auto-rebake.

## Rebuilding the map data

- **Automatic**: edit the Google Sheet → Apps Script `onChange` trigger fires a
  GitHub `repository_dispatch` (`bake-travel`) → workflow rewrites `data.js`.
- **Manual**: Actions → *Bake travel data* → *Run workflow*.

## Credits

Map rendering by [jsVectorMap](https://github.com/themustafaomar/jsvectormap) (vendored).
