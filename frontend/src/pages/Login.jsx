import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiUser, 
  FiPhone, 
  FiLock, 
  FiArrowRight, 
  FiAlertCircle,
  FiArrowLeft
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { user, loading: authLoading, sendOtp, verifyOtp, error: authError } = useAuth();

  // Navigation Steps: 'phone' | 'otp'
  const [step, setStep] = useState('phone');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [testingOtp, setTestingOtp] = useState('');

  // UI state
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // Check if it's a new user who needs to complete their profile details
      const isNewUser = !user.email || !user.name || user.name.startsWith('User-');
      if (isNewUser) {
        navigate(`/complete-profile?redirect=${encodeURIComponent(redirect)}`);
      } else {
        navigate(redirect);
      }
    }
  }, [user, authLoading, navigate, redirect]);

  if (authLoading) {
    return (
      <div className="auth-loading-screen" style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--black-900)',
        color: 'var(--white)',
        fontSize: '1.2rem',
        letterSpacing: '1px'
      }}>
        SUMMONING SESSION...
      </div>
    );
  }

  // Phase 1: Request OTP
  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!phone) {
      setValidationError('Please enter your phone number.');
      return;
    }

    // Basic 10-digit check
    const cleanPhone = phone.trim().replace(/[\s-]/g, '');
    if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
      setValidationError('Please enter a valid 10-digit phone number.');
      return;
    }

    setLoading(true);
    try {
      const res = await sendOtp(phone.trim());
      // Capture simulated OTP for demonstration / testing ease
      if (res && res.otp) {
        setTestingOtp(res.otp);
        // Autofill for user convenience in testing
        setOtp(res.otp);
      }
      setStep('otp');
    } catch (err) {
      // Error is stored globally in authError
    } finally {
      setLoading(false);
    }
  };

  // Phase 2: Verify OTP
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!otp || otp.length !== 6) {
      setValidationError('Please enter the 6-digit OTP code.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(phone.trim(), otp.trim());
      if (data.isNewUser) {
        navigate(`/complete-profile?redirect=${encodeURIComponent(redirect)}`);
      } else {
        navigate(redirect);
      }
    } catch (err) {
      // Error is stored globally in authError
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleBackToPhone = () => {
    setStep('phone');
    setOtp('');
    setTestingOtp('');
    setValidationError('');
  };

  return (
    <div className="auth-page-container">
      <div className="auth-card-wrapper">
        
        {/* Floating Brand Emblem */}
        <div className="auth-brand-emblem-outer">
          <div className="auth-brand-emblem-inner">
            <svg viewBox="0 0 100 100" className="auth-brand-svg">
              <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="8" fill="none" />
              <path d="M50 22 L53 47 L78 50 L53 53 L50 78 L47 53 L22 50 L47 47 Z" fill="currentColor" />
            </svg>
          </div>
        </div>

        {step === 'phone' ? (
          /* Step 1: Input Phone Number */
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">WELCOME TO UNICORN</h1>
              <p className="auth-subtitle">Enter phone number to login or register</p>
            </div>

            {/* Error Message banner */}
            {(validationError || authError) && (
              <div className="auth-error-banner">
                <FiAlertCircle size={16} />
                <span>{validationError || authError}</span>
              </div>
            )}

            <form onSubmit={handleSendOtpSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Phone Number *</label>
                <div className="input-with-icon-wrapper">
                  <FiPhone className="input-icon-prefix" />
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="Enter your 10-digit number"
                    className="auth-input-field"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'REQUESTING OTP...' : 'CONTINUE'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>

            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            {/* Social Google Logins as alternate option */}
            <div className="social-buttons-grid" style={{ gridTemplateColumns: '1fr' }}>
              <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
                <span className="social-logo-g" style={{ marginRight: '8px' }}>G</span> Sign in with Google
              </button>
            </div>
          </div>
        ) : (
          /* Step 2: Input OTP Verification */
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={handleBackToPhone}>
                <FiArrowLeft size={20} />
              </button>
              <h1 className="auth-title">VERIFY OTP</h1>
              <p className="auth-subtitle">Enter the 6-digit code sent to {phone}</p>
            </div>

            {/* Error Message banner */}
            {(validationError || authError) && (
              <div className="auth-error-banner">
                <FiAlertCircle size={16} />
                <span>{validationError || authError}</span>
              </div>
            )}

            <form onSubmit={handleVerifyOtpSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Verification Code (OTP) *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type="text"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value)}
                    placeholder="Enter 6-digit OTP"
                    maxLength={6}
                    className="auth-input-field"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'VERIFYING...' : 'VERIFY & SIGN IN'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>

            {/* Test Helper displaying generated OTP code */}
            {testingOtp && (
              <div className="auth-test-otp-helper" style={{
                marginTop: '1.25rem',
                padding: '0.85rem',
                background: 'rgba(212, 163, 89, 0.06)',
                border: '1px dashed rgba(212, 163, 89, 0.3)',
                borderRadius: '8px',
                color: 'var(--white)',
                fontSize: '0.8rem',
                textAlign: 'center'
              }}>
                <span style={{ color: '#d4a359', fontWeight: 600 }}>Test OTP Code: </span>
                <strong style={{ letterSpacing: '2px', fontSize: '0.9rem' }}>{testingOtp}</strong>
                <p style={{ margin: '4px 0 0 0', fontSize: '0.7rem', color: 'var(--gray-500)' }}>
                  (Autofilled for your testing convenience)
                </p>
              </div>
            )}
            
            <div className="auth-footer" style={{ marginTop: '1.5rem' }}>
              <span className="footer-prompt">Didn't receive code?</span>
              <button type="button" className="footer-toggle-btn" onClick={handleSendOtpSubmit} disabled={loading}>
                Resend OTP
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
