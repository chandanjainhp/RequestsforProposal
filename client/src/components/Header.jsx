

import React from 'react';
import { Link } from 'react-router-dom';
import logo from '../assets/bidsense-logo.svg';

const Header = () => (
  <header style={{ backgroundColor: 'var(--color-warm-off-white)', borderBottom: '1px solid var(--color-soft-gray)' }}>
    <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
      <div className="flex items-center gap-3">
        <img src={logo} alt="BidSense" className="h-10 w-auto" />
      </div>
      <nav className="hidden md:flex items-center gap-8">
        <a href="#features" className="link">Features</a>
        <a href="#pricing" className="link">Pricing</a>
        <a href="#about" className="link">About</a>
        <Link to="/auth/login">
          <button className="btn-tertiary">Sign In</button>
        </Link>
        <Link to="/auth/signup">
          <button className="btn-primary">Get Started</button>
        </Link>
      </nav>
    </div>
  </header>
);

export default Header;  