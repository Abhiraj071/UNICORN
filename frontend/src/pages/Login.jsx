import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiUser, 
  FiMail,
  FiPhone, 
  FiLock, 
  FiArrowRight, 
  FiAlertCircle,
  FiArrowLeft,
  FiEye,
  FiEyeOff
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { 
    user, 
    loading: authLoading, 
    login, 
    register, 
    sendOtp, 
    verifyOtp, 
    error: authError 
  } = useAuth();

  // Active Main Tab: 'otp' | 'password_login' | 'password_register'
  const [activeTab, setActiveTab] = useState('otp');

  // OTP Step: 'input' | 'verify'
  const [otpStep, setOtpStep] = useState('input');
  
  // Input fields
  const [phoneOrEmail, setPhoneOrEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [testingOtp, setTestingOtp] = useState('');

  // Password Login Fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  // Register Fields
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreeTerms, setAgreeTerms] = useState(false);

  // UI state
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      const isNewUser = !user.email || !user.phone || !user.name || user.name.startsWith('User-');
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

  // 1. Submit Phone/Email for OTP
  const handleSendOtpSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!phoneOrEmail) {
      setValidationError('Please enter a phone number or email address.');
      return;
    }

    const input = phoneOrEmail.trim();
    const isEmail = input.includes('@');

    if (isEmail) {
      if (!/\S+@\S+\.\S+/.test(input)) {
        setValidationError('Please enter a valid email address.');
        return;
      }
    } else {
      const cleanPhone = input.replace(/[\s-]/g, '');
      if (!/^\+?[0-9]{10,15}$/.test(cleanPhone)) {
        setValidationError('Please enter a valid phone number (at least 10 digits).');
        return;
      }
    }

    setLoading(true);
    try {
      const res = await sendOtp(input);
      if (res && res.otp) {
        setTestingOtp(res.otp);
        setOtp(res.otp); // autofill for testing convenience
      }
      setOtpStep('verify');
    } catch (err) {
      // Global error handled in authError
    } finally {
      setLoading(false);
    }
  };

  // 2. Verify OTP
  const handleVerifyOtpSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!otp || otp.length !== 6) {
      setValidationError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      const data = await verifyOtp(phoneOrEmail.trim(), otp.trim());
      if (data.isNewUser) {
        navigate(`/complete-profile?redirect=${encodeURIComponent(redirect)}`);
      } else {
        navigate(redirect);
      }
    } catch (err) {
      // Global error handled in authError
    } finally {
      setLoading(false);
    }
  };

  // 3. Password Login Submit
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!loginEmail || !loginPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(loginEmail.trim(), loginPassword);
      navigate(redirect);
    } catch (err) {
      // Global error handled in authError
    } finally {
      setLoading(false);
    }
  };

  // 4. Password Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (!/\S+@\S+\.\S+/.test(regEmail.trim())) {
      setValidationError('Please enter a valid email address.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setValidationError('You must agree to the Terms & Conditions.');
      return;
    }

    setLoading(true);
    try {
      await register(regName.trim(), regEmail.trim(), regPassword);
      navigate(redirect);
    } catch (err) {
      // Global error handled in authError
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleBackToPhone = () => {
    setOtpStep('input');
    setOtp('');
    setTestingOtp('');
    setValidationError('');
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setOtpStep('input');
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

        {/* Tab Navigation Menu (Hidden on OTP verify step) */}
        {!(activeTab === 'otp' && otpStep === 'verify') && (
          <div className="auth-tab-menu" style={{
            display: 'flex',
            justifyContent: 'space-around',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '1.25rem',
            paddingBottom: '0.25rem'
          }}>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'otp' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'otp' ? '#d4a359' : 'var(--gray-500)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderBottom: activeTab === 'otp' ? '2px solid #d4a359' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchTab('otp')}
            >
              OTP LOGIN
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'password_login' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'password_login' ? '#d4a359' : 'var(--gray-500)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderBottom: activeTab === 'password_login' ? '2px solid #d4a359' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchTab('password_login')}
            >
              PASSWORD
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'password_register' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'password_register' ? '#d4a359' : 'var(--gray-500)',
                fontWeight: 600,
                fontSize: '0.8rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderBottom: activeTab === 'password_register' ? '2px solid #d4a359' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchTab('password_register')}
            >
              REGISTER
            </button>
          </div>
        )}

        {/* Errors display */}
        {(validationError || authError) && (
          <div className="auth-error-banner" style={{ margin: '0.5rem 0' }}>
            <FiAlertCircle size={16} />
            <span>{validationError || authError}</span>
          </div>
        )}

        {/* 1. OTP LOGIN FLOW */}
        {activeTab === 'otp' && (
          otpStep === 'input' ? (
            <div className="auth-panel fade-in">
              <div className="auth-header">
                <h1 className="auth-title">OTP SIGN IN</h1>
                <p className="auth-subtitle">Enter phone or email address to receive code</p>
              </div>

              <form onSubmit={handleSendOtpSubmit} className="auth-form">
                <div className="form-group-custom">
                  <label className="form-label-custom">Phone Number or Email *</label>
                  <div className="input-with-icon-wrapper">
                    <FiUser className="input-icon-prefix" />
                    <input
                      type="text"
                      value={phoneOrEmail}
                      onChange={(e) => setPhoneOrEmail(e.target.value)}
                      placeholder="e.g. +919876543210 or email@domain.com"
                      className="auth-input-field"
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                  {loading ? 'REQUESTING CODE...' : 'CONTINUE'} <FiArrowRight className="btn-arrow-icon" />
                </button>
              </form>
            </div>
          ) : (
            <div className="auth-panel fade-in">
              <div className="auth-header">
                <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={handleBackToPhone}>
                  <FiArrowLeft size={20} />
                </button>
                <h1 className="auth-title">VERIFY CODE</h1>
                <p className="auth-subtitle">Enter the 6-digit verification code sent to {phoneOrEmail}</p>
              </div>

              <form onSubmit={handleVerifyOtpSubmit} className="auth-form">
                <div className="form-group-custom">
                  <label className="form-label-custom">Verification Code (OTP) *</label>
                  <div className="input-with-icon-wrapper">
                    <FiLock className="input-icon-prefix" />
                    <input
                      type="text"
                      value={otp}
                      onChange={(e) => setOtp(e.target.value)}
                      placeholder="Enter 6-digit code"
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
            </div>
          )
        )}

        {/* 2. PASSWORD LOGIN FLOW */}
        {activeTab === 'password_login' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">PASSWORD LOGIN</h1>
              <p className="auth-subtitle">Login with your email and password</p>
            </div>

            <form onSubmit={handlePasswordLoginSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Email Address *</label>
                <div className="input-with-icon-wrapper">
                  <FiMail className="input-icon-prefix" />
                  <input
                    type="email"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Password *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="auth-input-field"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* 3. PASSWORD REGISTER FLOW */}
        {activeTab === 'password_register' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">CREATE ACCOUNT</h1>
              <p className="auth-subtitle">Create a password-based profile</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="auth-form" style={{ maxHeight: '45vh' }}>
              <div className="form-group-custom">
                <label className="form-label-custom">Full Name *</label>
                <div className="input-with-icon-wrapper">
                  <FiUser className="input-icon-prefix" />
                  <input
                    type="text"
                    value={regName}
                    onChange={(e) => setRegName(e.target.value)}
                    placeholder="Enter your full name"
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Email Address *</label>
                <div className="input-with-icon-wrapper">
                  <FiMail className="input-icon-prefix" />
                  <input
                    type="email"
                    value={regEmail}
                    onChange={(e) => setRegEmail(e.target.value)}
                    placeholder="Enter your email"
                    className="auth-input-field"
                    required
                  />
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Password *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type={showRegPassword ? 'text' : 'password'}
                    value={regPassword}
                    onChange={(e) => setRegPassword(e.target.value)}
                    placeholder="Create a password"
                    className="auth-input-field"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowRegPassword(!showRegPassword)}
                  >
                    {showRegPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Confirm Password *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type={showConfirmPassword ? 'text' : 'password'}
                    value={regConfirmPassword}
                    onChange={(e) => setRegConfirmPassword(e.target.value)}
                    placeholder="Confirm password"
                    className="auth-input-field"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  >
                    {showConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-meta-row">
                <label className="checkbox-container-custom">
                  <input
                    type="checkbox"
                    checked={agreeTerms}
                    onChange={(e) => setAgreeTerms(e.target.checked)}
                    className="checkbox-input-custom"
                    required
                  />
                  <span className="checkbox-label-text terms-label-text">
                    I agree to the <a href="/terms" onClick={(e) => e.stopPropagation()}>Terms & Conditions</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="auth-submit-btn-outline" disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* Unified Bottom Google OAuth Login Section */}
        {!(activeTab === 'otp' && otpStep === 'verify') && (
          <>
            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            <div className="social-buttons-grid" style={{ gridTemplateColumns: '1fr' }}>
              <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
                <span className="social-logo-g" style={{ marginRight: '8px' }}>G</span> Sign in with Google
              </button>
            </div>
          </>
        )}

      </div>
    </div>
  );
};

export default Login;
