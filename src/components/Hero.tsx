import { useSectionImpression } from '../hooks/useIntersectionObserver';
import { trackCtaClick, trackSectionImpression } from '../utils/analytics';

const PRIMARY_TARGET = '#optimizer';

export default function Hero() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('hero'));

  const handleCta = () => {
    trackCtaClick('hero', PRIMARY_TARGET);
  };

  return (
    <section ref={ref} className="pt-10 pb-8">
      <div className="inline-flex items-center gap-2 rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-xs text-amber-200">
        <span className="h-1.5 w-1.5 rounded-full bg-amber-300" />
        Built for Etsy sellers
      </div>
      <h1 className="mt-4 text-3xl font-semibold leading-tight">
        Rewrite your Etsy listing for higher search rank — in under a minute.
      </h1>
      <p className="mt-3 text-sm text-slate-300">
        Paste your current title, tags, and description. Our AI rewrites them in plain US English, tuned for Etsy search and how real shoppers actually click.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 text-[11px] text-slate-300">
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-amber-200">SEO title</div>
          <div className="mt-1 text-slate-400">Front-loaded keywords</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-amber-200">13 tags</div>
          <div className="mt-1 text-slate-400">No duplicates</div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-3">
          <div className="text-amber-200">Description</div>
          <div className="mt-1 text-slate-400">Skimmable, persuasive</div>
        </div>
      </div>

      <a
        href={PRIMARY_TARGET}
        onClick={handleCta}
        className="mt-6 inline-flex w-full items-center justify-center rounded-2xl bg-amber-400 px-6 py-4 text-sm font-semibold text-slate-950 active:scale-[0.99]"
      >
        Optimize my listing — free
      </a>
      <p className="mt-2 text-center text-[11px] text-slate-400">
        No signup. Paste any listing. See the rewrite live.
      </p>
    </section>
  );
}
