// Install dependencies first:
// npm install lucide-react

import React from 'react';

// Then import in your page:
import HowItWorksSection from '../components/HowItWorksSection';
import HeroSection from '../components/HeroSection';
import FeaturesSection from '../components/FeaturesSection';
import BenefitsSection from '../components/BenefitsSection';
import TrustSignalsSection from '../components/TrustSignalsSection';
import AlertsDemoSection from '../components/AlertsDemoSection';
import TestimonialsSection from '../components/TestimonialsSection';
import PricingSection from '../components/PricingSection';
import FinalCTASection from '../components/FinalCTASection';
import Header from '../components/Header';
import Footer from '../components/Footer';

const BidSenseLandingPage = () => {
  return (
    <div className="min-h-screen" style={{ backgroundColor: 'var(--color-warm-off-white)', fontFamily: 'Inter, sans-serif' }}>

      <Header />

      {/* Logo banner */}
      <div className="max-w-7xl mx-auto px-6 py-8 flex justify-center">
        <img src="/src/assets/bidsense-logo.svg" alt="BidSense" className="h-20 w-auto" />
      </div>

      <HeroSection />
      <FeaturesSection />
      <BenefitsSection />
      <HowItWorksSection />
      <TrustSignalsSection />
      <TestimonialsSection />
      <PricingSection />
      <AlertsDemoSection />
      <FinalCTASection />
      <Footer />
    </div>
  );
};


















export default BidSenseLandingPage;
