import { useSectionImpression } from '../hooks/useIntersectionObserver';
import { trackSectionImpression } from '../utils/analytics';

const STEPS = [
  { n: 1, title: 'Paste any Etsy listing', body: 'Title, tags, description — drop it all into one box.' },
  { n: 2, title: 'AI restructures it', body: 'Front-loads keywords, fixes tag duplication, sharpens the pitch.' },
  { n: 3, title: 'Copy and update Etsy', body: 'One tap to copy each field. Paste straight into Etsy listing editor.' },
];

export default function StepsFlow() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('steps'));
  return (
    <section ref={ref} className="mt-10">
      <h2 className="text-lg font-semibold">How it works</h2>
      <ol className="mt-4 space-y-3">
        {STEPS.map((step) => (
          <li key={step.n} className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-amber-400 text-sm font-semibold text-slate-950">
              {step.n}
            </div>
            <div>
              <div className="text-sm font-medium text-slate-100">{step.title}</div>
              <div className="mt-1 text-xs text-slate-400">{step.body}</div>
            </div>
          </li>
        ))}
      </ol>
    </section>
  );
}
