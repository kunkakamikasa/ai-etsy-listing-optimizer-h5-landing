// Lightweight GA4 wrapper. Falls back to dataLayer push when gtag is unavailable.
// All custom events also receive a source tag so cross-direction reports are easy to filter.
// GA4 script is injected at runtime only when VITE_GA4_MEASUREMENT_ID env var is provided
// and matches a valid measurement-id pattern. Otherwise no script and no requests are issued.

type GtagFn = (...args: unknown[]) => void;

declare global {
  interface Window {
    gtag?: GtagFn;
    dataLayer?: unknown[];
  }
}

const SOURCE = 'ai-etsy-optimizer-h5';
const GA4_ID_PATTERN = /^G-[A-Z0-9]+$/;

// 6 feedback-loop URL parameters that must be auto-merged into every event payload.
const TRACKED_URL_PARAMS = [
  'platform',
  'published_asset_id',
  'base_video_id',
  'cta_module_id',
  'product_type',
  'hook_type',
] as const;

let cachedUrlParams: Record<string, string> | null = null;
let ga4Initialized = false;

function getMeasurementId(): string | null {
  const raw = (import.meta.env?.VITE_GA4_MEASUREMENT_ID ?? '').toString().trim();
  if (!raw) return null;
  if (!GA4_ID_PATTERN.test(raw)) return null;
  return raw;
}

function readUrlParams(): Record<string, string> {
  if (cachedUrlParams) return cachedUrlParams;
  if (typeof window === 'undefined') {
    cachedUrlParams = {};
    return cachedUrlParams;
  }
  const params = new URLSearchParams(window.location.search);
  const out: Record<string, string> = {};
  TRACKED_URL_PARAMS.forEach((key) => {
    const v = params.get(key);
    if (v != null && v !== '') out[key] = v;
  });
  cachedUrlParams = out;
  return out;
}

export function initAnalytics() {
  if (ga4Initialized) return;
  if (typeof window === 'undefined') return;
  const id = getMeasurementId();
  if (!id) {
    // No valid measurement id → do not inject any tag, do not issue requests.
    ga4Initialized = true;
    return;
  }
  // Inject gtag.js
  const script = document.createElement('script');
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${encodeURIComponent(id)}`;
  document.head.appendChild(script);

  window.dataLayer = window.dataLayer || [];
  // gtag must use the magic `arguments` object to keep arrays referentially correct.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag: GtagFn = function (...args: unknown[]) {
    (window.dataLayer as unknown[]).push(args);
  };
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', id, { send_page_view: false });
  ga4Initialized = true;
}

function pushEvent(name: string, params: Record<string, unknown> = {}) {
  const payload = { source: SOURCE, ...readUrlParams(), ...params };
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

export function trackHeroCtaClick(target: string, meta: Record<string, unknown> = {}) {
  pushEvent('hero_cta_click', { target, ...meta });
}

export function trackStepSelectProductType(productType: string) {
  pushEvent('step_select_product_type', { product_type: productType });
}

export function trackSampleRunView(meta: Record<string, unknown> = {}) {
  pushEvent('sample_run_view', meta);
}

export function trackWaitlistSubmit(email: string, meta: Record<string, unknown> = {}) {
  pushEvent('waitlist_submit', { email, ...meta });
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
