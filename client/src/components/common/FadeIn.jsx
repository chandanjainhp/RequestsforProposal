import React from 'react';
import { motion } from 'framer-motion';

const FadeIn = ({ children, delay = 0, duration = 0.5, direction = "up", className = "" }) => {
    const variants = {
        hidden: {
            opacity: 0,
            y: direction === "up" ? 20 : direction === "down" ? -20 : 0,
            x: direction === "left" ? 20 : direction === "right" ? -20 : 0
        },
        visible: {
            opacity: 1,
            y: 0,
            x: 0,
            transition: { duration, delay, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            initial="hidden"
            animate="visible"
            variants={variants}
            className={className}
        >
            {children}
        </motion.div>
    );
};

export default FadeIn;
