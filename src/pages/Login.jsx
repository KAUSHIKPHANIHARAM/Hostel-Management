import React, { useEffect, useState, useContext } from 'react';
import { useForm } from 'react-hook-form';
import { useNavigate, Link } from 'react-router-dom';
import { loginContextObj } from '../contexts/LoginContext';

function Login() {
    const navigate = useNavigate();
    const { register, handleSubmit, formState: { errors }, reset } = useForm();
    const [err, setErr] = useState(null);
    const { loginStatus, loginError, userLogin } = useContext(loginContextObj);
    const [isLoading, setIsLoading] = useState(false);
    const [showForgotPassword, setShowForgotPassword] = useState(false);
    const [resetEmail, setResetEmail] = useState('');
    const [resetEmailSent, setResetEmailSent] = useState(false);

    const handleFormSubmit = async (data) => {
        setIsLoading(true);
        await userLogin(data);
        if (loginError) {
            setErr(loginError);
        }
        setIsLoading(false);
    };

    const handleResetPassword = async (e) => {
        e.preventDefault();
        if (!resetEmail) {
            setErr({ message: "Please enter your email address" });
            return;
        }
        
        setIsLoading(true);
        // Simulate password reset process
        // In a real app, you would call an API endpoint here
        setTimeout(() => {
            setResetEmailSent(true);
            setIsLoading(false);
            setErr(null);
        }, 1500);
    };

    const toggleForgotPassword = () => {
        setShowForgotPassword(!showForgotPassword);
        setErr(null);
        setResetEmailSent(false);
    };

    useEffect(() => {
        if (loginStatus) {
            navigate('/user-profile');
        }
    }, [loginStatus, navigate]);

    return (
        <div className="flex items-center justify-center min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-4 py-8">
            <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md sm:shadow-lg w-full max-w-md border border-gray-100 transition-all duration-300 hover:shadow-lg">
                {!showForgotPassword ? (
                    // Login Form
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Login</h1>
                        {err && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <p className="text-red-600 text-sm">{err.message}</p>
                            </div>
                        )}
                        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4">
                            <div className="transition-all duration-200">
                                <label htmlFor="username" className="block font-medium text-gray-700 mb-1">Username</label>
                                <input
                                    type="text"
                                    id="username"
                                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter your username"
                                    {...register('username', { required: true })}
                                />
                                {errors.username && <p className="text-red-500 text-sm mt-1">Username is required</p>}
                            </div>
                            <div className="transition-all duration-200">
                                <label htmlFor="password" className="block font-medium text-gray-700 mb-1">Password</label>
                                <input
                                    type="password"
                                    id="password"
                                    className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                    placeholder="Enter your password"
                                    {...register('password', { required: true })}
                                />
                                {errors.password && <p className="text-red-500 text-sm mt-1">Password is required</p>}
                            </div>
                            <div className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                                        Remember me
                                    </label>
                                </div>
                                <button 
                                    type="button"
                                    onClick={toggleForgotPassword}
                                    className="text-sm font-medium text-green-600 hover:text-green-800 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                            <button 
                                type="submit" 
                                disabled={isLoading}
                                className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {isLoading ? (
                                    <span className="flex items-center justify-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        Logging in...
                                    </span>
                                ) : 'Login'}
                            </button>
                        </form>
                        <p className="text-center text-sm mt-6">
                            New here? <Link to="/register" className="text-green-600 hover:text-green-800 font-medium transition-colors">Register</Link>
                        </p>
                    </>
                ) : (
                    // Forgot Password Form
                    <>
                        <h1 className="text-2xl sm:text-3xl font-bold text-center mb-6 text-gray-800">Reset Password</h1>
                        {err && (
                            <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded">
                                <p className="text-red-600 text-sm">{err.message}</p>
                            </div>
                        )}
                        {resetEmailSent ? (
                            <div className="text-center">
                                <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded">
                                    <p className="text-green-700">Password reset instructions have been sent to your email.</p>
                                </div>
                                <button
                                    onClick={toggleForgotPassword}
                                    className="mt-4 text-green-600 hover:text-green-800 font-medium transition-colors"
                                >
                                    Return to login
                                </button>
                            </div>
                        ) : (
                            <form onSubmit={handleResetPassword} className="space-y-4">
                                <p className="text-gray-600 text-sm mb-4">
                                    Enter your email address below and we'll send you instructions to reset your password.
                                </p>
                                <div>
                                    <label htmlFor="email" className="block font-medium text-gray-700 mb-1">Email</label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={resetEmail}
                                        onChange={(e) => setResetEmail(e.target.value)}
                                        className="w-full px-3 py-2 sm:py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                                        placeholder="Enter your email address"
                                    />
                                </div>
                                <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-2">
                                    <button
                                        type="submit"
                                        disabled={isLoading}
                                        className="w-full bg-green-600 text-white py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-[1.02] font-medium disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {isLoading ? (
                                            <span className="flex items-center justify-center">
                                                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                                </svg>
                                                Sending...
                                            </span>
                                        ) : 'Send Reset Link'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={toggleForgotPassword}
                                        className="w-full border border-gray-300 text-gray-700 py-2 sm:py-3 rounded-lg hover:bg-gray-50 transition-all font-medium"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}


export default Login;