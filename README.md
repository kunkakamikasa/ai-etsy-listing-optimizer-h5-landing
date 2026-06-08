# AI Etsy Listing Optimizer — H5 Landing

Mobile-first H5 landing for the AI Etsy Listing Optimizer direction. Visitors paste an existing Etsy listing and get an SEO-tuned rewrite (title, 13 tags, description) directly on-page.

## Stack

- Vite + React 18 + TypeScript
- TailwindCSS 3
- GA4 (placeholder ID `G-XXXXXXXXXX` — replace before launch)

## Scripts

```
npm install
npm run dev       # local dev
npm run build     # tsc -b + vite build
npm run lint
```

## Structure

- `src/components/Hero.tsx` — first-screen pitch + primary CTA
- `src/components/Optimizer.tsx` — paste box + on-device rewrite + copy buttons
- `src/components/StepsFlow.tsx` — 3-step explainer
- `src/components/Proof.tsx` — seller quotes
- `src/components/Faq.tsx` — short FAQ
- `src/components/StickyBar.tsx` — persistent bottom CTA
- `src/utils/analytics.ts` — GA4/dataLayer wrapper

## Analytics events

- `page_view`
- `section_impression` { section }
- `cta_click` { placement, target }
- `optimize_attempt` { stage: 'submit' | 'render', length? }

All events carry `source: ai-etsy-optimizer-h5`.

## Deploy

`vercel.json` rewrites everything to `index.html` and disables HTML cache. Bind a subdomain inside the target Vercel project before relying on alias-only routing.

## Notes

- Independent tool, not affiliated with Etsy. Footer carries the disclaimer.
- The on-page rewriter is a deterministic local optimizer for the MVP — swap in a real API by replacing `optimizeLocally` in `Optimizer.tsx`.
