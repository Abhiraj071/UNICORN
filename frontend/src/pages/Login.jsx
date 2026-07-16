import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiUser, 
  FiMail,
  FiLock, 
  FiArrowRight, 
  FiAlertCircle,
  FiArrowLeft,
  FiEye,
  FiEyeOff,
  FiCheckCircle
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
    forgotPasswordSendOtp,
    forgotPasswordReset,
    verifyRegisterOtp,
    error: authError 
  } = useAuth();

  // Active Main Tab: 'login' | 'register'
  const [activeTab, setActiveTab] = useState('login');

  // Input fields for Login
  const [emailOrPhone, setEmailOrPhone] = useState('');
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

  // Forgot Password Steps: null | 'enter_identity' | 'enter_otp' | 'reset_password'
  const [forgotStep, setForgotStep] = useState(null);
  const [forgotPhoneOrEmail, setForgotPhoneOrEmail] = useState('');
  const [forgotOtp, setForgotOtp] = useState('');
  const [forgotNewPassword, setForgotNewPassword] = useState('');
  const [forgotConfirmPassword, setForgotConfirmPassword] = useState('');
  const [forgotTestingOtp, setForgotTestingOtp] = useState('');
  const [forgotShowPassword, setForgotShowPassword] = useState(false);
  const [forgotShowConfirmPassword, setForgotShowConfirmPassword] = useState(false);

  // Registration Verification Wizard states
  const [isRegisterVerifying, setIsRegisterVerifying] = useState(false);
  const [regVerifyEmail, setRegVerifyEmail] = useState('');
  const [regVerifyOtp, setRegVerifyOtp] = useState('');
  const [regTestingOtp, setRegTestingOtp] = useState('');

  // UI state
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');

  // Redirect if user is already logged in
  useEffect(() => {
    if (!authLoading && user) {
      // Check phone from DB first, then fall back to localStorage (for existing completed profiles)
      const hasPhone = user.phone || localStorage.getItem(`unicorn_phone_${user._id}`);
      const isNewUser = !user.email || !hasPhone || !user.name || user.name.startsWith('User-');
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

  // 1. Password Login Submit
  const handlePasswordLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!emailOrPhone || !loginPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    setLoading(true);
    try {
      await login(emailOrPhone.trim(), loginPassword);
      navigate(redirect);
    } catch (err) {
      if (err.unverified) {
        setRegVerifyEmail(err.email);
        if (err.otp) {
          setRegTestingOtp(err.otp);
          setRegVerifyOtp(err.otp);
        }
        setIsRegisterVerifying(true);
        setSuccessMessage('Please verify your email address first.');
      }
    } finally {
      setLoading(false);
    }
  };

  // 2. Password Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

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
      const res = await register(regName.trim(), regEmail.trim(), regPassword);
      setRegVerifyEmail(regEmail.trim());
      if (res && res.otp) {
        setRegTestingOtp(res.otp);
        setRegVerifyOtp(res.otp);
      }
      setIsRegisterVerifying(true);
      setSuccessMessage('Registration initiated! Verification code sent to your email.');
    } catch (err) {
      // Error handled by AuthContext
    } finally {
      setLoading(false);
    }
  };

  // 2.1. Register Verify OTP Submit
  const handleRegisterVerifySubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!regVerifyOtp || regVerifyOtp.trim().length !== 6) {
      setValidationError('Please enter the 6-digit verification code.');
      return;
    }

    setLoading(true);
    try {
      await verifyRegisterOtp(regVerifyEmail, regVerifyOtp.trim());
      setIsRegisterVerifying(false);
      setSuccessMessage('Email verified successfully! Logging in.');
      navigate(redirect);
    } catch (err) {
      setValidationError(err.message || 'Verification failed. Please check the code.');
    } finally {
      setLoading(false);
    }
  };

  const cancelRegisterVerify = () => {
    setIsRegisterVerifying(false);
    setRegVerifyEmail('');
    setRegVerifyOtp('');
    setRegTestingOtp('');
    setValidationError('');
    setSuccessMessage('');
  };

  // 3. Forgot Password Send OTP
  const handleForgotSendOtp = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!forgotPhoneOrEmail) {
      setValidationError('Please enter your registered email or phone.');
      return;
    }

    setLoading(true);
    try {
      const res = await forgotPasswordSendOtp(forgotPhoneOrEmail.trim());
      if (res && res.otp) {
        setForgotTestingOtp(res.otp);
        setForgotOtp(res.otp); // autofill for convenient developer testing
      }
      setForgotStep('enter_otp');
      setSuccessMessage('Verification code generated successfully.');
    } catch (err) {
      setValidationError(err.message || 'Error sending verification code.');
    } finally {
      setLoading(false);
    }
  };

  // 4. Forgot Password Verify OTP Step
  const handleForgotVerifyOtp = (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!forgotOtp || forgotOtp.trim().length !== 6) {
      setValidationError('Please enter the 6-digit verification code.');
      return;
    }

    // Move to next step (reset password input)
    setForgotStep('reset_password');
  };

  // 5. Forgot Password Reset & Save
  const handleForgotResetSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    setSuccessMessage('');

    if (!forgotNewPassword || !forgotConfirmPassword) {
      setValidationError('Please fill in all fields.');
      return;
    }

    if (forgotNewPassword !== forgotConfirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    setLoading(true);
    try {
      await forgotPasswordReset(
        forgotPhoneOrEmail.trim(),
        forgotOtp.trim(),
        forgotNewPassword
      );
      setForgotStep(null);
      setSuccessMessage('Password reset successfully! You can now log in.');
      setActiveTab('login');
      // Reset forgot password states
      setForgotPhoneOrEmail('');
      setForgotOtp('');
      setForgotNewPassword('');
      setForgotConfirmPassword('');
      setForgotTestingOtp('');
    } catch (err) {
      setValidationError(err.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const switchTab = (tab) => {
    setActiveTab(tab);
    setValidationError('');
    setSuccessMessage('');
  };

  const cancelForgotFlow = () => {
    setForgotStep(null);
    setForgotPhoneOrEmail('');
    setForgotOtp('');
    setForgotNewPassword('');
    setForgotConfirmPassword('');
    setForgotTestingOtp('');
    setValidationError('');
    setSuccessMessage('');
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

        {/* Tab Navigation Menu (Hidden during Forgot Password/Verification wizards) */}
        {forgotStep === null && !isRegisterVerifying && (
          <div className="auth-tab-menu" style={{
            display: 'flex',
            justifyContent: 'space-around',
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            marginBottom: '1.25rem',
            paddingBottom: '0.25rem'
          }}>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'login' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'login' ? '#d4a359' : 'var(--gray-500)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderBottom: activeTab === 'login' ? '2px solid #d4a359' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchTab('login')}
            >
              LOGIN
            </button>
            <button 
              type="button" 
              className={`auth-tab-btn ${activeTab === 'register' ? 'active' : ''}`}
              style={{
                background: 'none',
                border: 'none',
                color: activeTab === 'register' ? '#d4a359' : 'var(--gray-500)',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                padding: '0.5rem',
                borderBottom: activeTab === 'register' ? '2px solid #d4a359' : '2px solid transparent',
                transition: 'all 0.3s ease'
              }}
              onClick={() => switchTab('register')}
            >
              SIGN UP
            </button>
          </div>
        )}

        {/* Errors & Success Messages display */}
        {validationError && (
          <div className="auth-error-banner" style={{ margin: '0.5rem 0' }}>
            <FiAlertCircle size={16} />
            <span>{validationError}</span>
          </div>
        )}
        {authError && !validationError && (
          <div className="auth-error-banner" style={{ margin: '0.5rem 0' }}>
            <FiAlertCircle size={16} />
            <span>{authError}</span>
          </div>
        )}
        {successMessage && (
          <div className="auth-error-banner" style={{ margin: '0.5rem 0', backgroundColor: 'rgba(46, 204, 113, 0.08)', borderColor: 'rgba(46, 204, 113, 0.2)', color: '#2ecc71' }}>
            <FiCheckCircle size={16} />
            <span>{successMessage}</span>
          </div>
        )}

        {/* --- STANDARD PASSWORD LOGIN --- */}
        {forgotStep === null && !isRegisterVerifying && activeTab === 'login' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">PASSWORD LOGIN</h1>
              <p className="auth-subtitle">Login with your registered credentials</p>
            </div>

            <form onSubmit={handlePasswordLoginSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Email or Phone Number *</label>
                <div className="input-with-icon-wrapper">
                  <FiMail className="input-icon-prefix" />
                  <input
                    type="text"
                    value={emailOrPhone}
                    onChange={(e) => setEmailOrPhone(e.target.value)}
                    placeholder="Enter email address or phone"
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

              <div style={{ textAlign: 'right', marginTop: '-0.25rem', marginBottom: '0.5rem' }}>
                <button 
                  type="button" 
                  onClick={() => setForgotStep('enter_identity')}
                  style={{
                    background: 'none',
                    border: 'none',
                    color: '#d4a359',
                    fontSize: '0.8rem',
                    cursor: 'pointer',
                    textDecoration: 'underline'
                  }}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* --- STANDARD SIGN UP --- */}
        {forgotStep === null && !isRegisterVerifying && activeTab === 'register' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">CREATE ACCOUNT</h1>
              <p className="auth-subtitle">Create a secure password-based profile</p>
            </div>

            <form onSubmit={handleRegisterSubmit} className="auth-form" style={{ maxHeight: '42vh' }}>
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
                    placeholder="Enter your email address"
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
                    placeholder="Create a strong password"
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
                    placeholder="Confirm your password"
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

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* --- REGISTRATION VERIFY OTP SCREEN --- */}
        {isRegisterVerifying && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={cancelRegisterVerify}>
                <FiArrowLeft size={20} />
              </button>
              <h1 className="auth-title" style={{ fontSize: '1.2rem' }}>VERIFY YOUR EMAIL</h1>
              <p className="auth-subtitle">Type the 6-digit verification code sent to <strong>{regVerifyEmail}</strong></p>
            </div>

            <form onSubmit={handleRegisterVerifySubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Verification Code *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type="text"
                    value={regVerifyOtp}
                    onChange={(e) => setRegVerifyOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="auth-input-field"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'VERIFYING...' : 'VERIFY EMAIL'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>


          </div>
        )}

        {/* --- FORGOT PASSWORD STEP 1: IDENTITY INPUT --- */}
        {forgotStep === 'enter_identity' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={cancelForgotFlow}>
                <FiArrowLeft size={20} />
              </button>
              <h1 className="auth-title" style={{ fontSize: '1.3rem' }}>RESET PASSWORD</h1>
              <p className="auth-subtitle">Verify your identity via registered email or phone</p>
            </div>

            <form onSubmit={handleForgotSendOtp} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Email or Phone Number *</label>
                <div className="input-with-icon-wrapper">
                  <FiMail className="input-icon-prefix" />
                  <input
                    type="text"
                    value={forgotPhoneOrEmail}
                    onChange={(e) => setForgotPhoneOrEmail(e.target.value)}
                    placeholder="e.g. email@domain.com or phone number"
                    className="auth-input-field"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'SENDING OTP...' : 'SEND RESET CODE'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* --- FORGOT PASSWORD STEP 2: CODE VERIFICATION --- */}
        {forgotStep === 'enter_otp' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={() => setForgotStep('enter_identity')}>
                <FiArrowLeft size={20} />
              </button>
              <h1 className="auth-title" style={{ fontSize: '1.3rem' }}>ENTER OTP CODE</h1>
              <p className="auth-subtitle">Type the 6-digit verification code sent to your device</p>
            </div>

            <form onSubmit={handleForgotVerifyOtp} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Verification Code *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type="text"
                    value={forgotOtp}
                    onChange={(e) => setForgotOtp(e.target.value)}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    className="auth-input-field"
                    required
                    autoFocus
                  />
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                CONTINUE <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>


          </div>
        )}

        {/* --- FORGOT PASSWORD STEP 3: RESET TO NEW PASSWORD --- */}
        {forgotStep === 'reset_password' && (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <button type="button" className="password-toggle-btn" style={{ left: '0', right: 'auto', top: '5px' }} onClick={() => setForgotStep('enter_otp')}>
                <FiArrowLeft size={20} />
              </button>
              <h1 className="auth-title" style={{ fontSize: '1.3rem' }}>NEW PASSWORD</h1>
              <p className="auth-subtitle">Define a new secure password for your account</p>
            </div>

            <form onSubmit={handleForgotResetSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">New Password *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type={forgotShowPassword ? 'text' : 'password'}
                    value={forgotNewPassword}
                    onChange={(e) => setForgotNewPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="auth-input-field"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setForgotShowPassword(!forgotShowPassword)}
                  >
                    {forgotShowPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <div className="form-group-custom">
                <label className="form-label-custom">Confirm New Password *</label>
                <div className="input-with-icon-wrapper">
                  <FiLock className="input-icon-prefix" />
                  <input
                    type={forgotShowConfirmPassword ? 'text' : 'password'}
                    value={forgotConfirmPassword}
                    onChange={(e) => setForgotConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="auth-input-field"
                    required
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    onClick={() => setForgotShowConfirmPassword(!forgotShowConfirmPassword)}
                  >
                    {forgotShowConfirmPassword ? <FiEyeOff size={18} /> : <FiEye size={18} />}
                  </button>
                </div>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'RESETTING...' : 'RESET PASSWORD'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>
          </div>
        )}

        {/* --- DYNAMIC BOTTOM GOOGLE OAUTH LOGIN PANEL --- */}
        {forgotStep === null && !isRegisterVerifying && (
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
