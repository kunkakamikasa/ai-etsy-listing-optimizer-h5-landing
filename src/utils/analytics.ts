// Lightweight GA4 wrapper. Falls back to dataLayer push when gtag is unavailable.
// All custom events also receive a source tag so cross-direction reports are easy to filter.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

const SOURCE = 'ai-etsy-optimizer-h5';

function pushEvent(name: string, params: Record<string, unknown> = {}) {
  const payload = { source: SOURCE, ...params };
  if (typeof window === 'undefined') return;
  if (typeof window.gtag === 'function') {
    window.gtag('event', name, payload);
  } else {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({ event: name, ...payload });
  }
}

export function trackPageView() {
  pushEvent('page_view', {
    page_location: typeof window !== 'undefined' ? window.location.href : '',
    page_path: typeof window !== 'undefined' ? window.location.pathname : '/',
  });
}

export function trackSectionImpression(section: string) {
  pushEvent('section_impression', { section });
}

export function trackCtaClick(placement: string, target: string) {
  pushEvent('cta_click', { placement, target });
}

export function trackOutboundClick(placement: string, url: string) {
  pushEvent('outbound_click', { placement, url });
}

export function trackOptimizeAttempt(stage: 'submit' | 'render', meta: Record<string, unknown> = {}) {
  pushEvent('optimize_attempt', { stage, ...meta });
}

export function trackInteraction(name: string, params: Record<string, unknown> = {}) {
  pushEvent(name, params);
}
