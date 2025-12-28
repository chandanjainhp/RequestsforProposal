import React from 'react';
import { Link } from 'react-router-dom';
import { Check } from 'lucide-react';

const PricingSection = () => (
  <section className="py-20 px-6" style={{ backgroundColor: '#CBCBCB' }}>
    <div className="max-w-7xl mx-auto">
      <div className="text-center mb-16">
        <h2 className="text-4xl font-semibold text-charcoal mb-4">
          Simple, Transparent Pricing
        </h2>
        <p className="text-xl text-charcoal max-w-3xl mx-auto">
          Choose the plan that fits your procurement needs. Start free and scale as you grow.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Free Plan */}
        <div className="card bg-warm-off-white border-2 border-soft-gray">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-charcoal mb-2">Free</h3>
            <div className="text-4xl font-bold text-muted-blue mb-2">$0</div>
            <p className="text-soft-gray">Perfect for getting started</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Up to 3 RFPs per month</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Basic AI scoring</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Email integration</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Vendor comparison</span>
            </li>
          </ul>
          <Link to="/auth/signup" className="w-full">
            <button className="btn-secondary w-full">Get Started Free</button>
          </Link>
        </div>

        {/* Professional Plan */}
        <div className="card bg-warm-off-white border-2 border-muted-blue relative">
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
            <span className="bg-muted-blue text-warm-off-white px-4 py-1 rounded-full text-sm font-semibold">
              Most Popular
            </span>
          </div>
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-charcoal mb-2">Professional</h3>
            <div className="text-4xl font-bold text-muted-blue mb-2">$49</div>
            <p className="text-soft-gray">per month</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Unlimited RFPs</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Advanced AI scoring</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Custom scoring criteria</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Priority support</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Advanced analytics</span>
            </li>
          </ul>
          <Link to="/auth/signup" className="w-full">
            <button className="btn-primary w-full">Start Professional</button>
          </Link>
        </div>

        {/* Enterprise Plan */}
        <div className="card bg-warm-off-white border-2 border-soft-gray">
          <div className="text-center mb-6">
            <h3 className="text-2xl font-semibold text-charcoal mb-2">Enterprise</h3>
            <div className="text-4xl font-bold text-muted-blue mb-2">Custom</div>
            <p className="text-soft-gray">Tailored for large organizations</p>
          </div>
          <ul className="space-y-3 mb-8">
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Everything in Professional</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Custom integrations</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">Dedicated account manager</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">SLA guarantees</span>
            </li>
            <li className="flex items-center">
              <Check className="w-5 h-5 text-muted-blue mr-3" />
              <span className="text-charcoal">On-premise deployment</span>
            </li>
          </ul>
          <button className="btn-tertiary w-full">Contact Sales</button>
        </div>
      </div>
    </div>
  </section>
);

export default PricingSection;