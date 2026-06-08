import { useSectionImpression } from '../hooks/useIntersectionObserver';
import {
  trackHeroCtaClick,
  trackSectionImpression,
} from '../utils/analytics';

const PRIMARY_TARGET = '#optimizer';

export default function Hero() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('hero'));

  const handleCta = () => {
    trackHeroCtaClick(PRIMARY_TARGET);
  };

  return (
    <section ref={ref} data-visual-slot="hero" className="pt-4 pb-4">
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-2.5 py-0.5 text-[10px] text-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        Built for Etsy sellers
      </div>
      <h1 className="mt-2 text-[22px] font-semibold leading-[1.15]">
        Rewrite your Etsy listing into search-ready copy — in under a minute.
      </h1>
      <p className="mt-2 text-[11px] leading-snug text-slate-300">
        Paste your title, tags, and description. We restructure them in plain US English, tuned for Etsy shoppers.
      </p>

      <div className="mt-2 rounded-lg border border-white/10 bg-white/5 px-3 py-1.5 text-[11px] leading-snug text-slate-300">
        <div>Independent tool · not affiliated with Etsy.</div>
        <div>Suggestions only — review before publishing.</div>
        <div>No sales guarantee.</div>
      </div>

      <div className="mt-3 overflow-hidden rounded-xl border border-white/10 bg-white/5">
        <img
          src="/mobile_hero_first_screen_864x1536_v1.png"
          alt="Phone mockup with rewritten Etsy listing — title, tags, photo order and description"
          width={864}
          height={1536}
          loading="eager"
          decoding="async"
          className="block w-full max-h-[160px] object-cover object-top"
        />
      </div>

      <div className="mt-3 rounded-xl border border-white/10 bg-white/5 p-2.5 text-[11px] leading-snug text-slate-200">
        <div className="text-[10px] uppercase tracking-wide text-amber-200">Sample rewrite</div>
        <div className="mt-1">
          <span className="text-slate-400">Before:</span>{' '}
          <span className="line-through text-slate-400">Cute necklace handmade gift for her — by my shop</span>
        </div>
        <div className="mt-1">
          <span className="text-slate-400">After:</span>{' '}
          <span className="text-slate-100">Personalized Name Necklace · Dainty Gold Gift for Her · Handmade Minimalist Jewelry</span>
        </div>
      </div>

      <a
        href={PRIMARY_TARGET}
        onClick={handleCta}
        className="mt-3 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-950 active:scale-[0.99]"
      >
        Rewrite one listing — free
      </a>
      <a
        href={PRIMARY_TARGET}
        className="mt-2 block text-center text-[11px] text-amber-200"
      >
        Step 1 · Paste your listing →
      </a>
      <p className="mt-1 text-center text-[10px] text-slate-400">
        Individual results vary. Suggestions only.
      </p>

      <div className="mt-4 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <div className="text-amber-200">SEO title</div>
          <div className="mt-1 text-slate-400">Keyword-led</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <div className="text-amber-200">13 tags</div>
          <div className="mt-1 text-slate-400">No duplicates</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-2">
          <div className="text-amber-200">Description</div>
          <div className="mt-1 text-slate-400">Skimmable</div>
        </div>
      </div>
    </section>
  );
}
