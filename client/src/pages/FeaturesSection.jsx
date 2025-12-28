const FeaturesSection = () => (
  <section id="features" className="px-6 py-20" style={{ backgroundColor: 'white' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-charcoal mb-4">Core Capabilities</h2>
        <p className="text-xl text-charcoal max-w-2xl mx-auto">
          Everything you need to streamline your procurement process
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <div className="card text-center">
          <FileText size={48} className="text-muted-blue mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-charcoal mb-3">AI Proposal Parsing</h3>
          <p className="text-charcoal leading-relaxed">
            Automatically extracts pricing, delivery, and warranty details from vendor emails
            and attachments in seconds.
          </p>
        </div>

        <div className="card text-center">
          <BarChart3 size={48} className="text-muted-blue mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-charcoal mb-3">Intelligent Scoring</h3>
          <p className="text-charcoal leading-relaxed">
            Weighted scoring system for price, delivery, warranty, and completeness.
            Fully transparent and configurable.
          </p>
        </div>

        <div className="card text-center">
          <Mail size={48} className="text-muted-blue mx-auto mb-6" />
          <h3 className="text-xl font-semibold text-charcoal mb-3">Email-Native Workflow</h3>
          <p className="text-charcoal leading-relaxed">
            Vendors simply reply via email. BidSense handles matching, parsing,
            and scoring automatically.
          </p>
        </div>
      </div>
    </div>
  </section>
);
export default FeaturesSection;