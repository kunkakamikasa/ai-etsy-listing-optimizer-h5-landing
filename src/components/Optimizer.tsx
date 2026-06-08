import { useMemo, useState } from 'react';
import { useSectionImpression } from '../hooks/useIntersectionObserver';
import {
  trackCtaClick,
  trackOptimizeAttempt,
  trackSectionImpression,
} from '../utils/analytics';

const STOPWORDS = new Set([
  'the','a','an','and','or','but','if','then','for','to','of','in','on','at','by','with',
  'is','are','was','were','be','been','being','as','it','this','that','these','those','from',
  'you','your','our','we','us','i','my','me','so','very','really','just','more','most',
]);

interface OptimizedListing {
  title: string;
  tags: string[];
  description: string;
}

function optimizeLocally(input: string): OptimizedListing {
  const trimmed = input.trim();
  if (!trimmed) {
    return {
      title: '',
      tags: [],
      description: '',
    };
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
  const titleTail = ['Personalized Gift', 'Handmade', 'Custom Design'].join(' | ');
  const title = `${titleLead} | ${titleTail}`.slice(0, 140);

  const tagPool = [...new Set([
    ...keyTerms,
    `${keyTerms[0] ?? 'custom'} gift`,
    `${keyTerms[0] ?? 'unique'} idea`,
    'personalized gift',
    'handmade gift',
    'custom design',
    'gift for her',
    'gift for him',
    'unique gift',
    'best seller',
    'trending',
    'new arrival',
    'made in usa',
  ])].filter(Boolean);
  const tags = tagPool.slice(0, 13);

  const description = [
    `Looking for a ${keyTerms[0] ?? 'unique'} that actually feels personal? This listing is rewritten to match how Etsy shoppers search and click.`,
    '',
    'Why buyers love it:',
    `• Designed around ${keyTerms.slice(0, 3).join(', ') || 'your idea'}`,
    '• Carefully made with attention to detail',
    '• Ships fast, packaged ready to gift',
    '',
    'Need a custom version? Send us a message — we usually reply within a few hours.',
  ].join('\n');

  return { title, tags, description };
}

function capitalize(word: string) {
  return word.charAt(0).toUpperCase() + word.slice(1);
}

const SAMPLE = `Custom name necklace gold plated handmade jewelry for women. Birthday gift, anniversary present, dainty minimalist style. Made in our small studio.`;

export default function Optimizer() {
  const [input, setInput] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const ref = useSectionImpression<HTMLElement>(() => trackSectionImpression('optimizer'));

  const result = useMemo(() => (submitted ? optimizeLocally(input) : null), [submitted, input]);

  const handleSubmit = () => {
    if (!input.trim()) return;
    setSubmitted(true);
    trackOptimizeAttempt('submit', { length: input.length });
    setTimeout(() => trackOptimizeAttempt('render'), 0);
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

  return (
    <section ref={ref} id="optimizer" className="mt-2 rounded-3xl border border-white/10 bg-white/5 p-5">
      <h2 className="text-lg font-semibold">Paste your current Etsy listing</h2>
      <p className="mt-1 text-xs text-slate-400">
        Title, tags, and description are fine in one box. We'll structure the rewrite.
      </p>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Paste your title, tags, description here..."
        className="mt-3 h-40 w-full resize-none rounded-2xl border border-white/10 bg-slate-950/80 p-3 text-sm text-slate-100 placeholder:text-slate-500 focus:border-amber-300/40 focus:outline-none"
      />
      <div className="mt-3 flex items-center gap-2">
        <button
          type="button"
          onClick={handleSubmit}
          className="flex-1 rounded-2xl bg-amber-400 px-4 py-3 text-sm font-semibold text-slate-950 active:scale-[0.99] disabled:opacity-50"
          disabled={!input.trim()}
        >
          Rewrite for Etsy search
        </button>
        <button
          type="button"
          onClick={handleSample}
          className="rounded-2xl border border-white/10 px-3 py-3 text-xs text-slate-200"
        >
          Try sample
        </button>
      </div>

      {result && (
        <div className="mt-5 space-y-4">
          <ResultBlock label="Optimized title" value={result.title} onCopy={() => handleCopy(result.title, 'title')} />
          <ResultBlock
            label={`Optimized tags (${result.tags.length}/13)`}
            value={result.tags.join(', ')}
            onCopy={() => handleCopy(result.tags.join(', '), 'tags')}
          />
          <ResultBlock
            label="Optimized description"
            value={result.description}
            onCopy={() => handleCopy(result.description, 'description')}
            multiline
          />
        </div>
      )}
    </section>
  );
}

interface ResultBlockProps {
  label: string;
  value: string;
  onCopy: () => void;
  multiline?: boolean;
}

function ResultBlock({ label, value, onCopy, multiline }: ResultBlockProps) {
  return (
    <div className="rounded-2xl border border-white/10 bg-slate-950/70 p-3">
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
