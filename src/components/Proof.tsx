import { useSectionImpression } from '../hooks/useIntersectionObserver';
import { trackSectionImpression } from '../utils/analytics';

const QUOTES = [
  {
    name: 'Maya · jewelry shop',
    body: 'Rewrote three best-sellers in one evening. Click rate jumped within a week.',
  },
  {
    name: 'Dan · print-on-demand',
    body: 'Way faster than tweaking tags by hand. The 13-tag suggestions actually match what people search.',
  },
  {
    name: 'Lia · home decor',
    body: 'My titles used to start with my brand. Now keywords go first and impressions are up.',
  },
];

export default function Proof() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('proof'));
  return (
    <section ref={ref} className="mt-10">
      <h2 className="text-lg font-semibold">Sellers using it</h2>
      <div className="mt-4 space-y-3">
        {QUOTES.map((q) => (
          <blockquote key={q.name} className="rounded-2xl border border-white/10 bg-white/5 p-4 text-sm text-slate-200">
            <p>“{q.body}”</p>
            <footer className="mt-2 text-[11px] text-slate-400">{q.name}</footer>
          </blockquote>
        ))}
      </div>
    </section>
  );
}
