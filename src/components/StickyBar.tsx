import { useEffect, useState } from 'react';
import { trackCtaClick } from '../utils/analytics';

export default function StickyBar() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const heroSentinel = document.getElementById('optimizer');
    if (!heroSentinel) return;

    // Reveal sticky bar only once the user has scrolled past the hero CTA region
    // so the in-card primary CTA never collides with the sticky variant.
    const obs = new IntersectionObserver(
      (entries) => {
        const e = entries[0];
        // when optimizer top is at or above viewport top, the hero is past
        setShow(e.boundingClientRect.top < 24);
      },
      { threshold: [0, 1] }
    );
    obs.observe(heroSentinel);

    const onScroll = () => {
      const r = heroSentinel.getBoundingClientRect();
      setShow(r.top < 24);
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();

    return () => {
      obs.disconnect();
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-30 transition-transform duration-300 ${
        show ? 'translate-y-0' : 'translate-y-full'
      }`}
    >
      <div className="mx-auto max-w-md border-t border-white/10 bg-night/95 px-4 py-3 shadow-card backdrop-blur">
        <div className="flex items-center justify-between gap-3">
          <div className="text-xs text-white/70">
            <span className="block text-[11px] uppercase tracking-wider text-white/40">Free Etsy listing rewrite</span>
            <span className="text-sm text-white">No login. One listing in 60 seconds.</span>
          </div>
          <a
            href="#optimizer"
            onClick={() => trackCtaClick('sticky_bar', 'optimizer')}
            className="rounded-2xl bg-saffron px-4 py-3 text-sm font-semibold text-night"
          >
            Rewrite now
          </a>
        </div>
      </div>
    </div>
  );
}
