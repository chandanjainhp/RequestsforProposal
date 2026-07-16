import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { signupSchema } from '../../schemas/authSchema';
import { Link } from 'react-router-dom';

const SignupForm = ({ onSubmit, isLoading }) => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm({
        resolver: zodResolver(signupSchema),
        defaultValues: {
            fullName: '',
            email: '',
            organization: '',
            role: '',
            password: '',
            confirmPassword: '',
            agreeToTerms: false
        }
    });

    const inputClasses = (hasError) => `block w-full px-4 py-3 bg-gray-800 border rounded-xl focus:ring-2 transition-all outline-none text-white placeholder-gray-500 ${hasError ? 'border-red-500/50 focus:ring-red-500/20 focus:border-red-500' : 'border-gray-700 focus:ring-indigo-500/20 focus:border-indigo-500'
        }`;

    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Full Name */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Full Name</label>
                    <input
                        type="text"
                        {...register('fullName')}
                        className={inputClasses(errors.fullName)}
                        placeholder="John Doe"
                    />
                    {errors.fullName && <p className="mt-1 text-xs text-red-400">{errors.fullName.message}</p>}
                </div>

                {/* Email Address */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Work Email</label>
                    <input
                        type="email"
                        {...register('email')}
                        className={inputClasses(errors.email)}
                        placeholder="john@company.com"
                    />
                    {errors.email && <p className="mt-1 text-xs text-red-400">{errors.email.message}</p>}
                </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Organization */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Organization</label>
                    <input
                        type="text"
                        {...register('organization')}
                        className={inputClasses(false)}
                        placeholder="Acme Corp"
                    />
                </div>

                {/* Job Title */}
                <div className="col-span-1">
                    <label className="block text-sm font-semibold text-gray-300 mb-1.5">Job Title</label>
                    <input
                        type="text"
                        {...register('role')}
                        className={inputClasses(false)}
                        placeholder="Procurement Manager"
                    />
                </div>
            </div>

            {/* Password */}
            <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Password</label>
                <div className="relative">
                    <input
                        type={showPassword ? "text" : "password"}
                        {...register('password')}
                        className={inputClasses(errors.password)}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400"
                    >
                        {showPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.403m3.7-1.33a10.05 10.05 0 013.143-.267m3.143.267a10.025 10.025 0 014.132 5.403m-4.132 5.403a9.963 9.963 0 01-3.143.267m-3.143-.267a9.963 9.963 0 01-4.132-5.403M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                    </button>
                </div>
                {errors.password && <p className="mt-1 text-xs text-red-400">{errors.password.message}</p>}
            </div>

            {/* Confirm Password */}
            <div className="relative group">
                <label className="block text-sm font-semibold text-gray-300 mb-1.5">Confirm Password</label>
                <div className="relative">
                    <input
                        type={showConfirmPassword ? "text" : "password"}
                        {...register('confirmPassword')}
                        className={inputClasses(errors.confirmPassword)}
                        placeholder="••••••••"
                    />
                    <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-500 hover:text-indigo-400"
                    >
                        {showConfirmPassword ? (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                        ) : (
                            <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.542-7a10.025 10.025 0 014.132-5.403m3.7-1.33a10.05 10.05 0 013.143-.267m3.143.267a10.025 10.025 0 014.132 5.403m-4.132 5.403a9.963 9.963 0 01-3.143.267m-3.143-.267a9.963 9.963 0 01-4.132-5.403M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                        )}
                    </button>
                </div>
                {errors.confirmPassword && <p className="mt-1 text-xs text-red-400">{errors.confirmPassword.message}</p>}
            </div>

            <div className="flex items-start">
                <input
                    type="checkbox"
                    id="terms"
                    required
                    {...register('agreeToTerms')}
                    className="h-4 w-4 mt-0.5 text-indigo-500 focus:ring-indigo-500 bg-gray-800 border-gray-700 rounded cursor-pointer"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-500">
                    I agree to the <Link to="/terms" className="text-indigo-400 hover:text-indigo-300 font-semibold">Terms of Service</Link> and <Link to="/privacy" className="text-indigo-400 hover:text-indigo-300 font-semibold">Privacy Policy</Link>
                </label>
            </div>

            {/* Action Button */}
            <button
                type="submit"
                disabled={isLoading}
                className={`w-full flex justify-center items-center py-3.5 px-4 rounded-xl text-sm font-bold text-gray-900 bg-white hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-900 focus:ring-white transition-all duration-200 ${isLoading ? 'opacity-80 cursor-not-allowed' : ''}`}
            >
                {isLoading ? (
                    <>
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-gray-900" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Processing Request...
                    </>
                ) : (
                    "Request Access"
                )}
            </button>
        </form>
    );
};

export default SignupForm;
