import { useSectionImpression } from '../hooks/useIntersectionObserver';
import { trackSectionImpression } from '../utils/analytics';

const FAQS = [
  {
    q: 'Is this affiliated with Etsy?',
    a: 'No. We are an independent tool. We follow Etsy seller policy and only rewrite the text you paste.',
  },
  {
    q: 'Do you store my listing?',
    a: 'No. The optimizer runs in your browser. Nothing is sent to a server in this MVP.',
  },
  {
    q: 'Will this work for handmade and print-on-demand?',
    a: 'Yes. Both styles. We focus on keyword placement and shopper-friendly description, which both formats need.',
  },
  {
    q: 'How is this different from generic AI writers?',
    a: 'It is shaped around Etsy: 140-char title limit, 13 tags, and how Etsy search ranks listings.',
  },
];

export default function Faq() {
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('faq'));
  return (
    <section ref={ref} className="mt-10">
      <h2 className="text-lg font-semibold">Common questions</h2>
      <div className="mt-4 space-y-3">
        {FAQS.map((item) => (
          <details key={item.q} className="group rounded-2xl border border-white/10 bg-white/5 p-4">
            <summary className="cursor-pointer list-none text-sm font-medium text-slate-100">
              {item.q}
            </summary>
            <p className="mt-2 text-xs text-slate-300">{item.a}</p>
          </details>
        ))}
      </div>
    </section>
  );
}
