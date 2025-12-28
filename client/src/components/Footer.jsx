const Footer = () => (
  <footer className="px-6 py-12" style={{ backgroundColor: 'white', borderTop: '1px solid var(--color-soft-gray)' }}>
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div className="flex items-center gap-3 mb-4 md:mb-0">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center font-bold"
            style={{ backgroundColor: 'var(--color-charcoal)', color: 'var(--color-warm-off-white)' }}
          >
            BS
          </div>
          <span className="font-semibold text-charcoal">BidSense</span>
        </div>
        <div className="flex gap-8 text-sm">
          <a href="#privacy" className="link">Privacy</a>
          <a href="#terms" className="link">Terms</a>
          <a href="#support" className="link">Support</a>
          <a href="#contact" className="link">Contact</a>
        </div>
      </div>
      <div className="mt-8 pt-8 border-t border-soft-gray text-center">
        <p className="text-soft-gray text-sm">
          © 2025 BidSense. All rights reserved.
        </p>
      </div>
    </div>
  </footer>
);
export default Footer;