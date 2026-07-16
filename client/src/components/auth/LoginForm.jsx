import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { loginSchema } from '../../schemas/authSchema';
import { Link } from 'react-router-dom';

const LoginForm = ({ onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: ''
        }
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            {/* Email Field */}
            <div>
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">
                    Email Address
                </label>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 transition-colors ${errors.email ? 'text-red-400' : 'text-gray-500 group-focus-within:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                        </svg>
                    </div>
                    <input
                        type="email"
                        {...register('email')}
                        className={`block w-full pl-10 pr-3 py-3 bg-gray-800 border rounded-xl focus:ring-2 transition-all outline-none text-white placeholder-gray-500 ${errors.email
                            ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-gray-700 focus:ring-indigo-500/20 focus:border-indigo-500'
                            }`}
                        placeholder="name@company.com"
                    />
                </div>
                {errors.email && <p className="mt-1 text-xs text-red-400 font-medium">{errors.email.message}</p>}
            </div>

            {/* Password Field */}
            <div>
                <div className="flex justify-between items-center mb-1.5">
                    <label className="block text-sm font-semibold text-gray-300">
                        Password
                    </label>
                    <Link to="/forgot-password" className="text-xs font-semibold text-indigo-400 hover:text-indigo-300 transition-colors">
                        Forgot password?
                    </Link>
                </div>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <svg className={`h-5 w-5 transition-colors ${errors.password ? 'text-red-400' : 'text-gray-500 group-focus-within:text-indigo-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                        </svg>
                    </div>
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register('password')}
                        className={`block w-full pl-10 pr-10 py-3 bg-gray-800 border rounded-xl focus:ring-2 transition-all outline-none text-white placeholder-gray-500 ${errors.password
                            ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500'
                            : 'border-gray-700 focus:ring-indigo-500/20 focus:border-indigo-500'
                            }`}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.403m3.7-1.33a10.05 10.05 0 013.143-.267m3.143.267a10.025 10.025 0 014.132 5.403m-4.132 5.403a9.963 9.963 0 01-3.143.267m-3.143-.267a9.963 9.963 0 01-4.132-5.403M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                        )}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400 font-medium">{errors.password.message}</p>}
            </div>

            {/* Remember Me */}
            <div className="flex items-center">
                <input
                    id="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-indigo-500 focus:ring-indigo-500 bg-gray-800 border-gray-700 rounded cursor-pointer"
                />
                <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-400 cursor-pointer">
                    Remember me
                </label>
            </div>

            {/* Actions */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Signing in...
                    </>
                ) : (
                    "Sign In"
                )}
            </button>
        </form>
    );
};

export default LoginForm;
