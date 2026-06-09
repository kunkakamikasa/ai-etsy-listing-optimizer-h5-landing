import { useEffect, useState } from 'react';
import {
  trackCtaClick,
  trackHeroCtaClick,
  trackSampleRunView,
  trackSectionImpression,
} from '../utils/analytics';
import { useSectionImpression } from '../hooks/useIntersectionObserver';

const HERO_VARIANT = 'v2_proof_led_tool_entry';

const SAMPLE_LISTING = [
  'Handmade soy candle, lavender scent, gift for mom, mothers day, birthday gift, hostess gift, eco friendly, vegan candle, small batch, jar candle',
].join('\n');

const PROOF_CHIPS = [
  { id: 'title', label: 'Title scannable' },
  { id: 'tags', label: 'Tags cover intent' },
  { id: 'desc', label: 'Description reviewable' },
];

function focusOptimizerInput(prefill?: string) {
  if (typeof window === 'undefined') return;
  if (prefill) {
    try {
      sessionStorage.setItem('hero_prefill', prefill);
    } catch (_e) {
      // sessionStorage may be blocked; non-fatal.
    }
  }
  const target = document.getElementById('optimizer');
  if (target) target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  setTimeout(() => {
    const ta = document.querySelector<HTMLTextAreaElement>('#optimizer textarea');
    if (ta) ta.focus();
  }, 320);
}

export default function Hero() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression(`hero:${HERO_VARIANT}`));
  const [draft, setDraft] = useState('');

  useEffect(() => {
    // Mark hero variant impression once for funnel analysis.
    trackSampleRunView({ hero_variant: HERO_VARIANT, role: 'hero_view' });
  }, []);

  const goRunCheck = () => {
    trackHeroCtaClick('run_listing_check', {
      placement: 'hero_primary',
      hero_variant: HERO_VARIANT,
      has_draft: draft.trim().length > 0,
    });
    trackCtaClick('hero_primary', 'run_listing_check');
    focusOptimizerInput(draft.trim() || undefined);
  };

  const goSample = () => {
    trackHeroCtaClick('sample_listing', {
      placement: 'hero_secondary',
      hero_variant: HERO_VARIANT,
    });
    trackCtaClick('hero_secondary', 'sample_listing');
    focusOptimizerInput(SAMPLE_LISTING);
  };

  return (
    <section
      ref={ref}
      aria-label="AI Etsy listing optimizer hero"
      className="pt-3"
    >
      {/* 1. Compact brand row */}
      <div className="flex items-center justify-between text-[12px] text-slate-300">
        <span className="font-semibold tracking-tight text-slate-100">Listing Check AI</span>
        <button
          type="button"
          onClick={goSample}
          className="rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-[11px] text-slate-200 active:scale-[0.98]"
        >
          Sample first
        </button>
      </div>

      {/* 2. Trust badge */}
      <div className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-amber-300/30 bg-amber-300/10 px-2.5 py-1 text-[11px] font-medium text-amber-200">
        <span aria-hidden>•</span>
        For Etsy sellers before they publish
      </div>

      {/* 3. Headline (locked copy) */}
      <h1 className="mt-2.5 text-[22px] font-semibold leading-snug tracking-tight text-slate-50">
        Turn one listing into a clearer{' '}
        <span className="text-amber-300">title, tags</span>, and buyer-friendly description.
      </h1>

      {/* 4. Subcopy (locked copy) */}
      <p className="mt-3 text-[13px] leading-relaxed text-slate-300">
        Paste a product title or description. Get a reviewable checklist —
        no auto-posting, no sales promises.
      </p>

      {/* 5. Mini before/after proof strip (lightweight, no big asset) */}
      <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-3">
        <div className="grid grid-cols-2 gap-2">
          <div className="rounded-xl border border-white/10 bg-slate-950/60 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-slate-500">Messy listing</div>
            <div className="mt-1 text-[11px] leading-tight text-slate-300">
              Title stuffed with tags. Description repeats keywords. Buyer
              cannot scan it.
            </div>
          </div>
          <div className="rounded-xl border border-amber-300/30 bg-amber-300/10 p-2.5">
            <div className="text-[10px] uppercase tracking-wider text-amber-200">Clearer draft</div>
            <div className="mt-1 text-[11px] leading-tight text-amber-100/90">
              Title leads with the buyer intent. Tags cover variants. Description
              guides the click.
            </div>
          </div>
        </div>
        <div className="mt-2.5 flex flex-wrap gap-1.5">
          {PROOF_CHIPS.map((c) => (
            <span
              key={c.id}
              className="rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] text-slate-300"
            >
              {c.label}
            </span>
          ))}
        </div>
      </div>

      {/* 6. Input block — never empty, structured placeholder */}
      <div className="mt-4">
        <div className="mb-1.5 flex items-center justify-between">
          <label
            htmlFor="hero-listing-input"
            className="text-[11px] font-semibold uppercase tracking-wider text-slate-400"
          >
            Start with one listing
          </label>
          <span className="text-[10px] text-emerald-300/80">Sample accepted</span>
        </div>
        <textarea
          id="hero-listing-input"
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={
            'Paste your Etsy title or product description…\nExample: Handmade soy candle, lavender scent, gift for mom'
          }
          className="block h-[120px] w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-[13px] leading-relaxed text-slate-100 placeholder:whitespace-pre-line placeholder:text-slate-500 focus:border-amber-300/50 focus:outline-none"
        />
      </div>

      {/* 7. Primary CTA right after input */}
      <button
        type="button"
        onClick={goRunCheck}
        className="mt-3 w-full rounded-2xl bg-amber-400 px-4 py-3 text-[14px] font-semibold text-slate-950 shadow-[0_8px_24px_-12px_rgba(251,191,36,0.7)] active:scale-[0.99]"
      >
        Run a listing check
      </button>

      {/* 8. Reassurance directly under CTA */}
      <p className="mt-2 text-[11px] leading-tight text-slate-400">
        Not affiliated with Etsy. Suggestions only — review before publishing.
      </p>

      {/* Secondary action — kept compact, below reassurance */}
      <button
        type="button"
        onClick={goSample}
        className="mt-2 w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-2.5 text-[12px] text-slate-200 active:scale-[0.99]"
      >
        Try sample listing
      </button>
    </section>
  );
}
