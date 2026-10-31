# travel.sankhacooray.com

Static site on GitHub Pages from `main` (deploy = `git push`); see README.md. Bump `VERSION` in `sw.js` whenever a cached asset changes.

## Lighthouse
<!-- lighthouse-optimized: 2026-10-31 -->
- Baseline mobile: performance 100 · accessibility 95 · best-practices 100 · SEO 100.
- Fixed: LCP avatar now a 96px WebP (4 KB vs 133 KB JPG) with width/height + `fetchpriority=high`; nus-isb thumb served as WebP with srcset; timeline year buttons min-height 24px (tap targets); removed hover translateY on the avatar.
- Left: vendored jsVectorMap CSS (2 KB render-blocking) and its non-passive listeners (vendor code); cache TTLs (GitHub Pages can't set headers); shared scripts/gtag handled centrally.
