import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../../assets/logo-round.jpg';

import ThemeToggle from '../layout/ThemeToggle';
import Button from '../common/Button';

const LandingNavbar = () => {
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);

    useEffect(() => {
        const handleScroll = () => setScrolled(window.scrollY > 20);
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const scrollToSection = (id) => {
        const element = document.getElementById(id);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        } else {
            navigate('/');
            setTimeout(() => {
                const el = document.getElementById(id);
                if (el) el.scrollIntoView({ behavior: 'smooth' });
            }, 100);
        }
    };

    return (
        <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${scrolled ? 'bg-white/90 dark:bg-gray-950/90 backdrop-blur-md shadow-sm py-4' : 'bg-transparent py-6'}`}>
            <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">

                {/* Logo */}
                <div className="flex items-center space-x-3 cursor-pointer" onClick={() => navigate('/')}>
                    <img src={logo} alt="BidSense" className="h-10 w-10 rounded-full" />
                    <span className="text-xl font-bold text-gray-900 dark:text-white tracking-tight">BidSense</span>
                </div>

                <div className="hidden md:flex items-center space-x-8">
                    {['Features', 'Use Cases', 'Pricing'].map((item) => (
                        <button
                            key={item}
                            onClick={() => scrollToSection(item.toLowerCase().replace(' ', '-'))}
                            className="relative text-sm font-medium text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group"
                        >
                            {item}
                            <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                        </button>
                    ))}

                    <div className="h-6 w-px bg-gray-200 dark:bg-gray-700"></div>
                    <ThemeToggle />

                    <button onClick={() => navigate('/login')} className="relative text-sm font-bold text-gray-900 dark:text-white hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors group">
                        Login
                        <span className="absolute left-0 -bottom-1 w-full h-0.5 bg-indigo-600 dark:bg-indigo-400 transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left"></span>
                    </button>

                    <Button
                        variant="primary"
                        onClick={() => navigate('/signup')}
                        className="px-5 py-2.5"
                    >
                        Get Started
                    </Button>
                </div>

                {/* Mobile Menu Icon */}
                <div className="flex items-center space-x-4 md:hidden">
                    <ThemeToggle />
                    <button className="text-gray-900 dark:text-white">
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" /></svg>
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default LandingNavbar;
