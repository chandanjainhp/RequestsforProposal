
import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
    const baseStyles = "relative overflow-hidden transition-all duration-300 transform active:scale-95 text-sm font-bold rounded-xl flex items-center justify-center group";

    const variants = {
        primary: "bg-gray-900 dark:bg-white text-white dark:text-gray-900 shadow-lg shadow-gray-900/20 dark:shadow-white/10 hover:shadow-gray-900/40 dark:hover:shadow-white/20",
        secondary: "bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 hover:shadow-md",
        outline: "border-2 border-gray-900 dark:border-white text-gray-900 dark:text-white hover:bg-gray-900 hover:text-white dark:hover:bg-white dark:hover:text-gray-900",
        ghost: "bg-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-800"
    };

    return (
        <button
            className={`${baseStyles} ${variants[variant]} ${className}`}
            {...props}
        >
            {/* Shimmer Effect for Primary Buttons */}
            {variant === 'primary' && (
                <div className="absolute inset-0 -translate-x-full group-hover:animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/20 to-transparent z-10" />
            )}

            <span className="relative z-20 flex items-center gap-2">
                {children}
            </span>
        </button>
    );
};

export default Button;
