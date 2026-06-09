import { useEffect, useMemo, useState } from 'react';
import { useSectionImpression } from '../hooks/useIntersectionObserver';
import {
  trackCtaClick,
  trackOptimizeAttempt,
  trackSampleRunView,
  trackSectionImpression,
  trackStepSelectProductType,
  trackWaitlistSubmit,
} from '../utils/analytics';

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','for','to','of','in','on','at','by','with',
  'is','are','was','were','be','been','being','as','it','this','that','these','those','from',
  'you','your','our','we','us','i','my','me','so','very','really','just','more','most',
]);

const PRODUCT_TYPES = [
  { id: 'jewelry', label: 'Jewelry' },
  { id: 'printables', label: 'Printables' },
  { id: 'home_decor', label: 'Home decor' },
  { id: 'craft_supplies', label: 'Craft supplies' },
  { id: 'other', label: 'Other' },
] as const;

type ProductTypeId = typeof PRODUCT_TYPES[number]['id'];

interface OptimizedListing {
  title: string;
  tags: string[];
  description: string;
  product_type: ProductTypeId;
}

function optimizeLocally(input: string, productType: ProductTypeId): OptimizedListing {
  const trimmed = input.trim();
  if (!trimmed) {
    return { title: '', tags: [], description: '', product_type: productType };
  }

  const words = trimmed
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w.length > 2 && !STOPWORDS.has(w));

  const freq = new Map<string, number>();
  words.forEach((w) => freq.set(w, (freq.get(w) ?? 0) + 1));
  const ranked = [...freq.entries()].sort((a, b) => b[1] - a[1]).map(([w]) => w);

  const keyTerms = ranked.slice(0, 6);
  const titleLead = keyTerms.slice(0, 3).map(capitalize).join(' ');

  const productTail: Record<ProductTypeId, string> = {
    jewelry: 'Personalized Gift | Handmade Jewelry | Custom Design',
    printables: 'Printable Wall Art | Digital Download | Instant Print',
    home_decor: 'Home Decor | Handmade Accent | Cozy Living',
    craft_supplies: 'Craft Supply | DIY Kit | Maker Friendly',
    other: 'Personalized Gift | Handmade | Custom Design',
  };

  const title = `${titleLead} | ${productTail[productType]}`.slice(0, 140);

  const tagPool = [...new Set([
    ...keyTerms,
    `${keyTerms[0] ?? 'custom'} ${productType.replace('_', ' ')}`,
    `${keyTerms[0] ?? 'unique'} idea`,
    'personalized gift',
    'handmade gift',
    'custom design',
    'gift for her',
    'gift for him',
    'unique gift',
    'made in usa',
  ])].filter(Boolean);
  const tags = tagPool.slice(0, 13);

  const description = [
    `Looking for a ${keyTerms[0] ?? 'unique'} ${productType.replace('_', ' ')} that actually feels personal? This rewrite is structured to match how Etsy shoppers search and click.`,
    '',
    'Why buyers love it:',
    `• Designed around ${keyTerms.slice(0, 3).join(', ') || 'your idea'}`,
    '• Carefully made with attention to detail',
    '• Ships fast, packaged ready to gift',
    '',
    'Need a custom version? Send us a message — we usually reply within a few hours.',
  ].join('\n');

  return { title, tags, description, product_type: productType };
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const SAMPLE = `Custom name necklace gold plated handmade jewelry for women. Birthday gift, anniversary present, dainty minimalist style. Made in our small studio.`;

export default function Optimizer() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [productType, setProductType] = useState<ProductTypeId>('jewelry');
  const [waitlistEmail, setWaitlistEmail] = useState('');
  const [waitlistError, setWaitlistError] = useState<string | null>(null);
  const [waitlistDone, setWaitlistDone] = useState(false);

  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('optimizer'));

  const result = useMemo(
    () => (submitted ? optimizeLocally(input, productType) : null),
    [submitted, input, productType],
  );

  useEffect(() => {
    if (result && result.title) {
      trackSampleRunView({ product_type: productType });
    }
  }, [result, productType]);

  // Consume any prefill the hero stored when scrolling here.
  useEffect(() => {
    if (typeof window === 'undefined') return;
    try {
      const prefill = sessionStorage.getItem('hero_prefill');
      if (prefill && !input) {
        setInput(prefill);
        sessionStorage.removeItem('hero_prefill');
      }
    } catch (_e) {
      // sessionStorage may be blocked; ignore.
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    trackOptimizeAttempt('submit', { length: input.length, product_type: productType });
    setTimeout(() => trackOptimizeAttempt('render', { product_type: productType }), 0);
  };

  const handleSample = () => {
    setInput(SAMPLE);
    trackCtaClick('optimizer_sample', 'sample_listing');
  };

  const handleCopy = (text: string, kind: string) => {
    if (!text) return;
    if (typeof navigator !== 'undefined' && navigator.clipboard) {
      navigator.clipboard.writeText(text).catch(() => {});
    }
    trackCtaClick('optimizer_copy', kind);
  };

  const handleProductType = (id: ProductTypeId) => {
    setProductType(id);
    trackStepSelectProductType(id);
  };

  const handleWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    const email = waitlistEmail.trim();
    const ok = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!ok) {
      setWaitlistError('Please enter a valid email.');
      return;
    }
    setWaitlistError(null);
    setWaitlistDone(true);
    // intentional: no backend in MVP
    // eslint-disable-next-line no-console
    console.log('[waitlist_submit]', { email, product_type: productType });
    trackWaitlistSubmit(email, { product_type: productType });
  };

  return (
    <section ref={ref} id="optimizer" className="mt-2 rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold">Step 1 · Paste your current Etsy listing</h2>
      <p className="mt-1 text-xs text-slate-400">
        Title, tags, and description are fine in one box. We will structure the rewrite.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your title, tags, description here..."
        className="mt-3 h-36 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none"
      />

      <div className="mt-5">
        <h3 className="text-sm font-semibold">Step 2 · Choose product type</h3>
        <p className="mt-1 text-[11px] text-slate-400">
          Picks the keyword pattern we use for your rewrite.
        </p>
        <div className="mt-2 flex flex-wrap gap-2">
          {PRODUCT_TYPES.map((p) => {
            const active = p.id === productType;
            return (
              <button
                key={p.id}
                type="button"
                onClick={() => handleProductType(p.id)}
                className={
                  'rounded-full border px-3 py-1.5 text-xs ' +
                  (active
                    ? 'border-amber-300 bg-amber-300/15 text-amber-100'
                    : 'border-white/10 bg-white/5 text-slate-200')
                }
              >
                {p.label}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-5 space-y-3">
        <h3 className="text-sm font-semibold">Step 3 · Pick a path</h3>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 active:scale-[0.99] disabled:opacity-50"
          disabled={!input.trim()}
        >
          Rewrite one listing
        </button>
        <button
          type="button"
          onClick={handleSubmit}
          className="w-full rounded-2xl border border-amber-300/40 bg-white/5 px-4 py-3 text-sm font-semibold text-amber-100 active:scale-[0.99] disabled:opacity-50"
          disabled={!input.trim()}
        >
          Run a listing check
        </button>
        <button
          type="button"
          onClick={handleSample}
          className="w-full rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-xs text-slate-200"
        >
          Try sample listing
        </button>
      </div>

      {result && (
        <div className="mt-5 space-y-4">
          <ResultBlock
            label="Optimized title"
            slot="proof-title"
            value={result.title}
            onCopy={() => handleCopy(result.title, 'title')}
          />
          <ResultBlock
            label={`Optimized tags (${result.tags.length}/13)`}
            slot="proof-tags"
            value={result.tags.join(', ')}
            onCopy={() => handleCopy(result.tags.join(', '), 'tags')}
          />
          <div data-visual-slot="proof-photos" className="overflow-hidden rounded-2xl border border-white/10 bg-white/5">
            <img
              src="/before_after_listing_proof_1536x864_v1.png"
              alt="Before and after Etsy-style listing cards — messy listing rewritten into a clearer one"
              width={1536}
              height={864}
              loading="lazy"
              decoding="async"
              className="block h-auto w-full"
            />
          </div>
          <ResultBlock
            label="Optimized description"
            slot="proof-description"
            value={result.description}
            onCopy={() => handleCopy(result.description, 'description')}
            multiline
          />
          <p className="text-[11px] text-slate-400">
            Individual results vary. Review and edit before publishing on Etsy.
          </p>
        </div>
      )}

      <div className="mt-8 rounded-2xl border border-white/10 bg-slate-950/60 p-4">
        <h3 className="text-sm font-semibold">Or join the early-access waitlist</h3>
        <p className="mt-1 text-[11px] text-slate-400">
          Drop your email. We will notify you when the full optimizer is live.
        </p>
        {waitlistDone ? (
          <p className="mt-3 rounded-xl border border-emerald-300/30 bg-emerald-400/10 px-3 py-2 text-xs text-emerald-100">
            You&apos;re on the list.
          </p>
        ) : (
          <form onSubmit={handleWaitlist} className="mt-3 space-y-2" noValidate>
            <input
              type="email"
              value={waitlistEmail}
              onChange={(e) => setWaitlistEmail(e.target.value)}
              placeholder="you@example.com"
              className="w-full rounded-2xl border border-white/10 bg-slate-950/80 px-3 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none"
            />
            {waitlistError && (
              <p className="text-[11px] text-rose-300">{waitlistError}</p>
            )}
            <button
              type="submit"
              className="w-full rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 active:scale-[0.99]"
            >
              Join waitlist
            </button>
          </form>
        )}
      </div>
    </section>
  );
}

interface ResultBlockProps {
  label: string;
  slot: string;
  value: string;
  onCopy: () => void;
  multiline?: boolean;
}

function ResultBlock({ label, slot, value, onCopy, multiline }: ResultBlockProps) {
  return (
    <div data-visual-slot={slot} className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
      <div className="flex items-center justify-between">
        <div className="text-[11px] uppercase tracking-wide text-amber-200">{label}</div>
        <button
          type="button"
          onClick={onCopy}
          className="rounded-lg border border-white/10 px-2 py-1 text-[11px] text-slate-200 active:scale-95"
        >
          Copy
        </button>
      </div>
      <div
        className={`mt-2 text-sm text-slate-100 ${multiline ? 'whitespace-pre-wrap' : ''}`}
      >
        {value || <span className="text-slate-500">—</span>}
      </div>
    </div>
  );
}
