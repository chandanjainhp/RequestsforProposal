
const FinalCTASection = () => (
  <section className="px-6 py-20 bg-charcoal">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-4xl font-semibold text-warm-off-white mb-6">
        Ready to Transform Your Procurement Process?
      </h2>
      <p className="text-soft-gray text-xl mb-8">
        Join 500+ procurement teams already using BidSense to make smarter decisions.
      </p>
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <button className="btn-primary" style={{ backgroundColor: '#FFFFE3', color: '#4A4A4A' }}>
          Start Free Trial
        </button>
        <button className="btn-secondary" style={{ borderColor: '#FFFFE3', color: '#FFFFE3' }}>
          Schedule Demo
        </button>
      </div>
      <p className="text-soft-gray text-sm mt-6">
        14-day free trial • No credit card required • Setup takes 2 minutes
      </p>
    </div>
  </section>
);

export default FinalCTASection;