import { trackCtaClick } from '../utils/analytics';

const PRIMARY_TARGET = '#optimizer';

export default function StickyBar() {
  const handleClick = () => {
    trackCtaClick('sticky_bar', PRIMARY_TARGET);
  };

  return (
    <div className="fixed inset-x-0 bottom-0 z-40 border-t border-white/10 bg-slate-950/95 backdrop-blur supports-[padding:max(0px)]:pb-[max(env(safe-area-inset-bottom),0.75rem)]">
      <div className="mx-auto flex max-w-[480px] items-center gap-3 px-5 py-3">
        <div className="text-[11px] leading-tight text-slate-300">
          <div className="font-semibold text-slate-100">Free Etsy listing rewrite</div>
          <div>No signup. Paste any listing.</div>
        </div>
        <a
          href={PRIMARY_TARGET}
          onClick={handleClick}
          className="ml-auto rounded-2xl bg-amber-400 px-4 py-2 text-xs font-semibold text-slate-950 active:scale-[0.98]"
        >
          Optimize now
        </a>
      </div>
    </div>
  );
}
