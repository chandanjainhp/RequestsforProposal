import { useState, useEffect, useRef } from 'react';

/**
 * useScrollReveal Hook
 * 
 * Provides scroll-based animation logic for landing page elements.
 * Adheres to the following rules:
 * - Animates only once (threshold: 0.1)
 * - Highlights active elements (threshold: 0.5)
 * - reduced-motion support
 * 
 * @returns {object} { ref, hasAnimated, isActive }
 */
const useScrollReveal = (threshold = 0.1) => {
    const [hasAnimated, setHasAnimated] = useState(false);
    const [isActive, setIsActive] = useState(false);
    const ref = useRef(null);

    useEffect(() => {
        // Respect reduced motion preference
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        if (prefersReducedMotion) {
            setHasAnimated(true);
            setIsActive(true);
            return;
        }

        const element = ref.current;
        if (!element) return;

        // Observer for initial animation entry
        const entryObserver = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated) {
                    setHasAnimated(true);
                    entryObserver.disconnect(); // Animate only once
                }
            },
            { threshold, rootMargin: '0px 0px -50px 0px' }
        );

        // Observer for active highlight state
        const activeObserver = new IntersectionObserver(
            ([entry]) => {
                setIsActive(entry.isIntersecting);
            },
            { threshold: 0.5 } // Higher threshold for "center stage" highlight
        );

        entryObserver.observe(element);
        activeObserver.observe(element);

        return () => {
            entryObserver.disconnect();
            activeObserver.disconnect();
        };
    }, [threshold, hasAnimated]);

    return { ref, hasAnimated, isActive };
};

export default useScrollReveal;
