import { useState, useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { 
  FiUser, 
  FiMail, 
  FiPhone, 
  FiLock, 
  FiEye, 
  FiEyeOff, 
  FiArrowRight, 
  FiAlertCircle 
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Login.css';

const Login = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const redirect = searchParams.get('redirect') || '/';

  const { user, loading: authLoading, login, register, error: authError } = useAuth();

  // Toggle state between Login and Signup
  const [isLogin, setIsLogin] = useState(true);

  // Form Field States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(true);

  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirmPassword, setRegConfirmPassword] = useState('');
  const [agreeTerms, setAgreeTerms] = useState(false);

  // Password Visibility States
  const [showPassword, setShowPassword] = useState(false);
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  // Local Validation Error States
  const [validationError, setValidationError] = useState('');
  const [loading, setLoading] = useState(false);

  // Redirect if already logged in
  useEffect(() => {
    if (!authLoading && user) {
      navigate(redirect);
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
        LOADING...
      </div>
    );
  }

  // Handle Login Submit
  const handleLoginSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');
    
    if (!email || !password) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      await login(email, password);
      navigate(redirect);
    } catch (err) {
      // AuthContext sets authError, which we display
    } finally {
      setLoading(false);
    }
  };

  // Handle Register Submit
  const handleRegisterSubmit = async (e) => {
    e.preventDefault();
    setValidationError('');

    if (!regName || !regEmail || !regPassword || !regConfirmPassword) {
      setValidationError('Please fill in all required fields.');
      return;
    }

    if (regPassword !== regConfirmPassword) {
      setValidationError('Passwords do not match.');
      return;
    }

    if (!agreeTerms) {
      setValidationError('You must agree to the Terms & Conditions and Privacy Policy.');
      return;
    }

    setLoading(true);
    try {
      await register(regName, regEmail, regPassword);
      navigate(redirect);
    } catch (err) {
      // AuthContext sets authError, which we display
    } finally {
      setLoading(false);
    }
  };

  // Social Login Handler (e.g. Google OAuth redirect)
  const handleGoogleLogin = () => {
    window.location.href = '/api/auth/google';
  };

  const handleMockSocialLogin = (platform) => {
    alert(`${platform} integration is coming soon! Please use email login or Google OAuth.`);
  };

  const toggleView = () => {
    setIsLogin(!isLogin);
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

        {/* Render LOGIN view */}
        {isLogin ? (
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">WELCOME BACK</h1>
              <p className="auth-subtitle">Login to continue to Unicorn</p>
            </div>

            {/* Social Logins */}
            <div className="social-buttons-grid">
              <button type="button" className="social-btn google-btn" onClick={handleGoogleLogin}>
                <span className="social-logo-g">G</span> Google
              </button>
              <button type="button" className="social-btn github-btn" onClick={() => handleMockSocialLogin('GitHub')}>
                <span className="social-logo-git">git</span> GitHub
              </button>
              <button type="button" className="social-btn apple-btn" onClick={() => handleMockSocialLogin('Apple')}>
                <span className="social-logo-apple"></span> Apple
              </button>
            </div>

            <div className="auth-divider">
              <span className="divider-line"></span>
              <span className="divider-text">OR</span>
              <span className="divider-line"></span>
            </div>

            {/* Error Message banner */}
            {(validationError || authError) && (
              <div className="auth-error-banner">
                <FiAlertCircle size={16} />
                <span>{validationError || authError}</span>
              </div>
            )}

            {/* Login Form */}
            <form onSubmit={handleLoginSubmit} className="auth-form">
              <div className="form-group-custom">
                <label className="form-label-custom">Email or Phone *</label>
                <div className="input-with-icon-wrapper">
                  <FiUser className="input-icon-prefix" />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
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
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
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

              <div className="form-meta-row">
                <label className="checkbox-container-custom">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="checkbox-input-custom"
                  />
                  <span className="checkbox-label-text">Remember me</span>
                </label>
                <button
                  type="button"
                  className="forgot-password-link"
                  onClick={() => alert('Password reset link has been sent to your email (mocked).')}
                >
                  Forgot Password?
                </button>
              </div>

              <button type="submit" className="auth-submit-btn-gold" disabled={loading}>
                {loading ? 'LOGGING IN...' : 'LOGIN'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>

            <div className="auth-footer">
              <span className="footer-prompt">Don't have an account?</span>
              <button type="button" className="footer-toggle-btn" onClick={toggleView}>
                Register
              </button>
            </div>
          </div>
        ) : (
          /* Render REGISTER / CREATE ACCOUNT view */
          <div className="auth-panel fade-in">
            <div className="auth-header">
              <h1 className="auth-title">CREATE ACCOUNT</h1>
              <p className="auth-subtitle">Join Unicorn and explore the darkness</p>
            </div>

            {/* Error Message banner */}
            {(validationError || authError) && (
              <div className="auth-error-banner">
                <FiAlertCircle size={16} />
                <span>{validationError || authError}</span>
              </div>
            )}

            {/* Registration Form */}
            <form onSubmit={handleRegisterSubmit} className="auth-form">
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
                <label className="form-label-custom">Phone Number (Optional)</label>
                <div className="input-with-icon-wrapper">
                  <FiPhone className="input-icon-prefix" />
                  <input
                    type="tel"
                    value={regPhone}
                    onChange={(e) => setRegPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    className="auth-input-field"
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
                    I agree to the <a href="/terms" onClick={(e) => e.stopPropagation()}>Terms & Conditions</a> and <a href="/privacy" onClick={(e) => e.stopPropagation()}>Privacy Policy</a>
                  </span>
                </label>
              </div>

              <button type="submit" className="auth-submit-btn-outline" disabled={loading}>
                {loading ? 'CREATING ACCOUNT...' : 'CREATE ACCOUNT'} <FiArrowRight className="btn-arrow-icon" />
              </button>
            </form>

            <div className="auth-footer">
              <span className="footer-prompt">Already have an account?</span>
              <button type="button" className="footer-toggle-btn" onClick={toggleView}>
                Login
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default Login;
