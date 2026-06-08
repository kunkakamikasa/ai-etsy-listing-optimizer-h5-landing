# AI Etsy Listing Optimizer — H5 Landing

Mobile-first H5 landing for the AI Etsy Listing Optimizer direction. Visitors paste an existing Etsy listing and get a structured rewrite (title, 13 tags, description) directly on-page. The page does not promise rankings — it offers structured, search-ready copy suggestions for sellers to review before publishing.

## Stack

- Vite + React 18 + TypeScript
- TailwindCSS 3
- GA4 (env-gated, runtime injection only when `VITE_GA4_MEASUREMENT_ID` is set; ID must match `^G-[A-Z0-9]+$`)

## Scripts

```
npm install
npm run dev       # local dev
npm run build     # tsc -b + vite build
npm run lint
```

## Structure

- `src/components/Hero.tsx` — first-screen pitch, inline disclaimer, before/after sample, primary CTA
- `src/components/Optimizer.tsx` — paste box + product-type step + dual CTA path (rewrite / waitlist) + on-device rewrite
- `src/components/StepsFlow.tsx` — 3-step explainer
- `src/components/Proof.tsx` — seller quotes (with `Individual results vary` per card)
- `src/components/Faq.tsx` — short FAQ
- `src/components/StickyBar.tsx` — persistent bottom CTA
- `src/utils/analytics.ts` — GA4/dataLayer wrapper, env-gated init, URL-param merge

## Analytics events

- `page_view`
- `section_impression` { section }
- `cta_click` { placement, target }
- `hero_cta_click` { target }
- `step_select_product_type` { product_type }
- `sample_run_view` { product_type }
- `waitlist_submit` { product_type }
- `optimize_attempt` { stage: 'submit' | 'render', length?, product_type? }
- `outbound_click` { placement, target }
- `interaction` { name, ... }

All events carry `source: ai-etsy-optimizer-h5` and (when present in the URL) the 6 feedback-loop fields:
`platform`, `published_asset_id`, `base_video_id`, `cta_module_id`, `product_type`, `hook_type`.

## GA4 enablement

Set `VITE_GA4_MEASUREMENT_ID=G-XXXXXXXXXX` in the Vercel project (or `.env.local`). The measurement ID is validated against `^G-[A-Z0-9]+$` before the gtag.js script is injected. With no value set, no GA4 script loads and `dataLayer` events are still buffered locally for debug.

## Visual slots / awaiting manifest t_0c2ebe3d

Five DOM elements expose `data-visual-slot` placeholders so a future visual manifest can drop in real assets without restructuring the page:

| Slot               | Where                                  | Purpose                                  |
|--------------------|----------------------------------------|------------------------------------------|
| `hero`             | Hero `<section>`                       | Hero artwork / product hero              |
| `proof-title`      | Optimized title result block           | Title proof asset                        |
| `proof-tags`       | Optimized tags result block            | Tags chip / badge proof                  |
| `proof-photos`     | Photo-order suggestion block           | Sample listing photo grid                |
| `proof-description`| Optimized description result block     | Long-copy proof block                    |

Awaiting the visual manifest produced by task `t_0c2ebe3d`. Do not replace these slots with stock imagery in the meantime.

## Compliance

- Disclaimer is inline near the hero and again in the footer: independent tool, not affiliated with Etsy; suggestions only, review before publishing; no sales guarantee.
- Each testimonial card carries `Individual results vary`.
- The page avoids ranking promises and outcome guarantees; copy stays focused on rewrite assistance, not search-position claims.

## Deploy

`vercel.json` rewrites everything to `index.html` and disables HTML cache. Bind a subdomain inside the target Vercel project before relying on alias-only routing.

## Notes

- The on-page rewriter is a deterministic local optimizer for the MVP — swap in a real API by replacing `optimizeLocally` in `Optimizer.tsx`.
