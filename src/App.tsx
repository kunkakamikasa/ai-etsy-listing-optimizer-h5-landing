import { useEffect } from 'react';
import Hero from './components/Hero';
import Optimizer from './components/Optimizer';
import StepsFlow from './components/StepsFlow';
import Proof from './components/Proof';
import Faq from './components/Faq';
import Footer from './components/Footer';
import StickyBar from './components/StickyBar';
import { trackPageView } from './utils/analytics';

export default function App() {
  useEffect(() => {
    trackPageView();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100">
      <main className="mx-auto max-w-[480px] px-5 pb-32">
        <Hero />
        <Optimizer />
        <StepsFlow />
        <Proof />
        <Faq />
        <Footer />
      </main>
      <StickyBar />
    </div>
  );
}
