import { useState } from 'react';
import { Mail, Lock, User, Eye, EyeOff, ArrowRight, DollarSign, CheckCircle } from 'lucide-react';
import '../styles/SignUp.css';

export default function SignUp({ setUser, toggle }) {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [step, setStep] = useState(1); // 1 = account details, 2 = personal details, 3 = success

    const handleSubmit = () => {
        // TODO: Validate form fields before account creation
        const dummyUser = { name: "New User", email: "newuser@example.com" };

        // Fake validation success:
        localStorage.setItem("authUser", JSON.stringify(dummyUser));
        setUser(dummyUser);
        setStep(3);  // Show success screen
    };


    // Password strength indicator component
    const PasswordStrength = ({ password }) => {
        // Basic password strength calculation
        const getStrength = (pass) => {
            if (!pass) return 0;
            let score = 0;
            if (pass.length > 6) score += 1;
            if (pass.length > 10) score += 1;
            if (/[A-Z]/.test(pass)) score += 1;
            if (/[0-9]/.test(pass)) score += 1;
            if (/[^A-Za-z0-9]/.test(pass)) score += 1;
            return score;
        };

        const strength = getStrength(password);

        return (
            <div className="password-strength">
                <div className="password-strength-label">
                    Password strength
                    <span className="password-strength-text">
                        {strength === 0 && 'Too weak'}
                        {strength === 1 && 'Weak'}
                        {strength === 2 && 'Fair'}
                        {strength === 3 && 'Good'}
                        {strength >= 4 && 'Strong'}
                    </span>
                </div>
                <div className="password-strength-meter">
                    <div className="password-strength-progress"></div>
                </div>
            </div>
        );
    };

    return (
        <div className="signup-container">
            {/* App Logo */}
            <div className="logo-container">
                <div className="logo-icon">
                    <DollarSign size={24} />
                </div>
                <h1 className="logo-text">BudgetTracker</h1>
            </div>

            {/* Auth Card */}
            <div className="auth-card">
                {step < 3 && (
                    <div className="progress-container">
                        <div className="progress-step">
                            <div className={`step-number ${step >= 1 ? 'active' : ''}`}>
                                {step > 1 ? <CheckCircle size={16} /> : '1'}
                            </div>
                            <div className={`step-label ${step >= 1 ? 'active' : ''}`}>Account</div>
                        </div>

                        <div className={`progress-line ${step > 1 ? 'active' : ''}`}></div>

                        <div className="progress-step">
                            <div className={`step-number ${step >= 2 ? 'active' : ''}`}>
                                {step > 2 ? <CheckCircle size={16} /> : '2'}
                            </div>
                            <div className={`step-label ${step >= 2 ? 'active' : ''}`}>Details</div>
                        </div>
                    </div>
                )}

                {/* Step 1: Account Details */}
                {step === 1 && (
                    <>
                        <div className="form-header">
                            <h2 className="form-title">Create your account</h2>
                            <p className="form-subtitle">Start tracking your budget in just a few steps</p>
                        </div>

                        <form className="form-container">
                            {/* Email Field */}
                            <div className="form-group">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <div className="input-icon">
                                        <Mail size={18} />
                                    </div>
                                    <input type="email" className="form-input" placeholder="Enter your email" />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="form-group">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <div className="input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="Create a password"
                                    />
                                    <button
                                        type="button"
                                        className="input-icon-button"
                                        onClick={() => setShowPassword(!showPassword)}>
                                        {showPassword ?
                                            <EyeOff size={18} /> :
                                            <Eye size={18} />
                                        }
                                    </button>
                                </div>

                                <PasswordStrength password="" />

                                <p className="form-hint">
                                    Password must be at least 8 characters and include uppercase, lowercase, numbers, and special characters.
                                </p>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="form-group">
                                <label className="form-label">Confirm Password</label>
                                <div className="input-group">
                                    <div className="input-icon">
                                        <Lock size={18} />
                                    </div>
                                    <input
                                        type={showConfirmPassword ? "text" : "password"}
                                        className="form-input"
                                        placeholder="Confirm your password"
                                    />
                                    <button
                                        type="button"
                                        className="input-icon-button"
                                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                        {showConfirmPassword ?
                                            <EyeOff size={18} /> :
                                            <Eye size={18} />
                                        }
                                    </button>
                                </div>
                            </div>

                            {/* Continue Button */}
                            <button
                                type="button"
                                onClick={() => setStep(2)}
                                className="btn btn-primary"
                            >
                                Continue
                                <ArrowRight size={18} />
                            </button>

                            {/* Divider */}
                            <div className="divider">
                                <div className="divider-line"></div>
                                <div className="divider-text">Or sign up with</div>
                                <div className="divider-line"></div>
                            </div>

                            {/* Social Login Buttons */}
                            <div className="social-buttons">
                                <button type="button" className="btn btn-social btn-google">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm5.36 14.36c-1.43 1.43-3.34 2.14-5.36 2.14-1.63 0-3.26-.61-4.5-1.85L15.1 9.05c1.28 2.38 1.07 5.3-.89 7.31z" />
                                    </svg>
                                    Google
                                </button>
                                <button type="button" className="btn btn-social btn-facebook">
                                    <svg width="18" height="18" viewBox="0 0 24 24">
                                        <path d="M20 12a8 8 0 10-9.25 7.903v-5.59H8.719V12h2.031v-1.762c0-2.005 1.194-3.113 3.022-3.113.875 0 1.79.156 1.79.156V9.25h-1.008c-.994 0-1.304.617-1.304 1.25V12h2.219l-.355 2.313H13.25v5.59A8.002 8.002 0 0020 12z" />
                                    </svg>
                                    Facebook
                                </button>
                            </div>
                        </form>

                        {/* Already have account */}
                        <div className="auth-footer">
                            <p className="auth-redirect">
                                Already have an account?
                                <a href="#" className="auth-link">Sign in</a>
                            </p>
                        </div>
                    </>
                )}

                {/* Step 2: Personal Details */}
                {step === 2 && (
                    <>
                        <div className="form-header">
                            <h2 className="form-title">Personal Details</h2>
                            <p className="form-subtitle">Tell us a bit about yourself</p>
                        </div>

                        <form className="form-container">
                            {/* Full Name Field */}
                            <div className="form-group">
                                <label className="form-label">Full Name</label>
                                <div className="input-group">
                                    <div className="input-icon">
                                        <User size={18} />
                                    </div>
                                    <input type="text" className="form-input" placeholder="Enter your full name" />
                                </div>
                            </div>

                            {/* Currency Selection */}
                            <div className="form-group">
                                <label className="form-label">Preferred Currency</label>
                                <select className="form-select">
                                    <option>USD - US Dollar</option>
                                    <option>EUR - Euro</option>
                                    <option>GBP - British Pound</option>
                                    <option>JPY - Japanese Yen</option>
                                    <option>CAD - Canadian Dollar</option>
                                    <option>AUD - Australian Dollar</option>
                                </select>
                            </div>

                            {/* Terms and Privacy */}
                            <div className="form-group checkbox-group">
                                <div className="checkbox-input">
                                    <input type="checkbox" id="terms" />
                                </div>
                                <div className="checkbox-label">
                                    <label htmlFor="terms">
                                        I agree to the Terms of Service and Privacy Policy
                                    </label>
                                </div>
                            </div>

                            {/* Newsletter Subscription */}
                            <div className="form-group checkbox-group">
                                <div className="checkbox-input">
                                    <input type="checkbox" id="newsletter" />
                                </div>
                                <div className="checkbox-label">
                                    <label htmlFor="newsletter">
                                        Email me about tips, product updates, and offers
                                    </label>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="button-group">
                                <button
                                    type="button"
                                    onClick={() => setStep(1)}
                                    className="btn btn-secondary"
                                >
                                    Back
                                </button>
                                <button type="button" className="btn btn-primary" onClick={handleSubmit}>
                                    Create Account
                                    <ArrowRight size={18} />
                                </button>
                            </div>
                        </form>
                    </>
                )}

                {/* Step 3: Success */}
                {step === 3 && (
                    <div className="success-container">
                        <div className="success-icon">
                            <CheckCircle size={64} />
                        </div>
                        <h2 className="success-title">Account Created!</h2>
                        <p className="success-message">
                            Your account has been successfully created. You can now start tracking your budget.
                        </p>
                        <button
                            type="button"
                            onClick={() => window.location.reload()}
                            className="btn btn-primary"
                        >
                            Go to Dashboard
                        </button>

                    </div>
                )}
            </div>

            {/* Terms and Privacy */}
            {step < 3 && (
                <div className="terms-footer">
                    By signing up, you agree to our
                    <a href="#" className="terms-link">Terms of Service</a>
                    and
                    <a href="#" className="terms-link">Privacy Policy</a>
                </div>
            )}
        </div>
    );
}

