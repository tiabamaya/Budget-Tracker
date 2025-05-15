import { useState, useEffect } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, DollarSign } from 'lucide-react';
import '../styles/AuthScreens.css';

export default function Login({ setUser, toggle }) {
    const [isLogin, setIsLogin] = useState(true);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    const toggleView = () => {
        setIsLogin(!isLogin);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("Please enter both email and password");
            return;
        }

        // Fake success login
        const dummyUser = { name: "John Doe", email: email };
        localStorage.setItem("authUser", JSON.stringify(dummyUser));
        setUser(dummyUser);
    };

    useEffect(() => {
        const savedUser = localStorage.getItem("authUser");
        if (savedUser) {
            setUser(JSON.parse(savedUser));
        }
    }, []);


    return (
        <div className="auth-container">
            {/* App Logo */}
            <div className="app-logo">
                <div className="logo-icon">
                    <DollarSign size={28} className="logo-icon-svg" />
                </div>
                <h1 className="app-name">BudgetTracker</h1>
            </div>

            {/* Auth Card */}
            <div className="auth-card">
                {/* Header */}
                <div className="auth-header">
                    <h2 className="auth-title">
                        {isLogin ? 'Welcome back' : 'Create account'}
                    </h2>
                    <p className="auth-subtitle">
                        {isLogin
                            ? 'Enter your credentials to access your account'
                            : 'Enter your details to get started with BudgetTracker'}
                    </p>
                </div>

                {/* Form Fields */}
                <div className="form-fields">
                    {/* Name Field - Only on Register */}
                    {!isLogin && (
                        <div className="form-group">
                            <label className="input-label">Full Name</label>
                            <div className="input-container">
                                <div className="input-icon">
                                    <User size={18} className="icon" />
                                </div>
                                <input
                                    type="text"
                                    placeholder="John Doe"
                                    className="text-input"
                                />
                            </div>
                        </div>
                    )}

                    {/* Email Field */}
                    <div className="form-group">
                        <label className="input-label">Email</label>
                        <div className="input-container">
                            <div className="input-icon">
                                <Mail size={18} className="icon" />
                            </div>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter email"
                                className="text-input"
                            />
                        </div>
                    </div>

                    {/* Password Field */}
                    <div className="form-group">
                        <label className="input-label">Password</label>
                        <div className="input-container">
                            <div className="input-icon">
                                <Lock size={18} className="icon" />
                            </div>
                            <input
                                type={showPassword ? "text" : "password"}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                placeholder="Enter password"
                                className="text-input"
                            />
                            <div
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}

                            >
                                {showPassword ?
                                    <EyeOff size={18} className="icon" /> :
                                    <Eye size={18} className="icon" />
                                }
                            </div>
                        </div>
                    </div>

                    {/* Remember Me & Forgot Password - Only on Login */}
                    {isLogin && (
                        <div className="login-options">
                            <div className="remember-me">
                                <input
                                    id="remember-me"
                                    name="remember-me"
                                    type="checkbox"
                                    className="checkbox"
                                />
                                <label htmlFor="remember-me" className="checkbox-label">
                                    Remember me
                                </label>
                            </div>
                            <div className="forgot-password">
                                <a href="#" className="link">
                                    Forgot password?
                                </a>
                            </div>
                        </div>
                    )}

                    {/* Submit Button */}
                    <button
                        onClick={handleSubmit}
                        className="submit-button"
                    >
                        {isLogin ? 'Sign in' : 'Create account'}
                        <ArrowRight size={18} className="button-icon" />
                    </button>

                    {/* Divider */}
                    <div className="divider">
                        <div className="divider-line"></div>
                        <div className="divider-text">
                            <span className="divider-content">Or continue with</span>
                        </div>
                    </div>

                    {/* Social Login Buttons */}
                    <div className="social-buttons">
                        <button type="button" className="social-button">
                            <svg className="social-icon google" viewBox="0 0 24 24">
                                <path
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                    fill="#4285F4"
                                />
                                <path
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                    fill="#34A853"
                                />
                                <path
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                                    fill="#FBBC05"
                                />
                                <path
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                                    fill="#EA4335"
                                />
                            </svg>
                            Google
                        </button>
                        <button type="button" className="social-button">
                            <svg className="social-icon facebook" fill="#1877F2" viewBox="0 0 24 24">
                                <path
                                    d="M22,12c0-5.52-4.48-10-10-10S2,6.48,2,12c0,4.84,3.44,8.87,8,9.8V15H8v-3h2V9.5C10,7.57,11.57,6,13.5,6H16v3h-2 c-0.55,0-1,0.45-1,1v2h3v3h-3v6.95C18.05,21.45,22,17.19,22,12z"
                                />
                            </svg>
                            Facebook
                        </button>
                    </div>
                </div>

                {/* Toggle Between Login/Register */}
                <div className="auth-toggle">
                    <p className="toggle-text">
                        {isLogin ? "Don't have an account? " : "Already have an account? "}
                        <button
                            onClick={toggleView}
                            className="toggle-button"
                        >
                            {isLogin ? 'Sign up' : 'Sign in'}
                        </button>
                    </p>
                </div>
            </div>

            {/* Terms and Privacy */}
            <p className="terms-text">
                By using our app, you agree to our
                <a href="#" className="terms-link">Terms of Service</a>
                and
                <a href="#" className="terms-link">Privacy Policy</a>
            </p>
        </div>
    );
}