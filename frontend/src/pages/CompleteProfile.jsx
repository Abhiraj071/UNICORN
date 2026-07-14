import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { FiPhone, FiMapPin } from 'react-icons/fi';
import './CompleteProfile.css';

const CompleteProfile = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();

  // Form States
  const [phone, setPhone] = useState('');
  const [dob, setDob] = useState('');
  const [gender, setGender] = useState('');
  const [fullName, setFullName] = useState('');
  const [addressLine1, setAddressLine1] = useState('');
  const [addressLine2, setAddressLine2] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [pincode, setPincode] = useState('');

  // UI States
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showModal, setShowModal] = useState(false);

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Puducherry'
  ];

  // Redirect if logged out
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=complete-profile');
    } else if (user) {
      setFullName(user.name || '');
      // If phone is already saved, prefill or redirect
      const savedPhone = localStorage.getItem(`unicorn_phone_${user._id}`);
      if (savedPhone) {
        setPhone(savedPhone);
      }
      const savedDob = localStorage.getItem(`unicorn_dob_${user._id}`);
      if (savedDob) {
        setDob(savedDob);
      }
      const savedGender = localStorage.getItem(`unicorn_gender_${user._id}`);
      if (savedGender) {
        setGender(savedGender);
      }
    }
  }, [user, authLoading, navigate]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setErrorMsg('');

    if (!phone || !fullName || !addressLine1 || !city || !selectedState || !pincode || !dob || !gender) {
      setErrorMsg('Please fill in all required fields marked with *');
      return;
    }

    if (!/^\+?([0-9\s-]{8,15})$/.test(phone.trim())) {
      setErrorMsg('Please enter a valid phone number.');
      return;
    }

    if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      setErrorMsg('Please enter a valid 6-digit pincode.');
      return;
    }

    setLoading(true);

    setTimeout(() => {
      try {
        // Save simulated phone, DOB, and gender
        localStorage.setItem(`unicorn_phone_${user._id}`, phone.trim());
        localStorage.setItem(`unicorn_dob_${user._id}`, dob);
        localStorage.setItem(`unicorn_gender_${user._id}`, gender);

        // Save default shipping address
        const userAddrKey = `unicorn_addresses_${user._id}`;
        const addressData = {
          id: 'default-1',
          label: 'Default Shipping',
          fullName: fullName.trim(),
          phone: phone.trim(),
          addressLine1: addressLine1.trim(),
          addressLine2: addressLine2.trim(),
          city: city.trim(),
          state: selectedState,
          pincode: pincode.trim(),
          isDefault: true
        };

        // Write address array to local storage
        localStorage.setItem(userAddrKey, JSON.stringify([addressData]));

        setLoading(false);
        setShowModal(true);
      } catch (err) {
        setLoading(false);
        setErrorMsg('Failed to save details. Please try again.');
      }
    }, 1200);
  };



  if (authLoading) {
    return (
      <div className="profile-completion-loading">
        <div className="spinner"></div>
        <p>SUMMONING PROFILE STAGE...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="profile-completion-page fade-in">
      <section className="profile-completion-header">
        <div className="container">
          <p className="completion-subtitle-glow">PROFILE BLUEPRINT</p>
          <h1 className="completion-main-title">COMPLETE YOUR DETAILS</h1>
          <div className="completion-divider"></div>
          <p className="completion-lead-text">
            Provide your communication and delivery channels to complete your profile, enable fast checkout, and receive shipping updates.
          </p>
        </div>
      </section>

      <section className="profile-completion-content">
        <div className="container completion-layout-grid">
            <form onSubmit={handleSubmit} className="completion-form-box">
              <h2 className="completion-form-title">REQUIRED Blueprints</h2>
              {errorMsg && <div className="completion-error-banner">{errorMsg}</div>}

              <div className="form-sections-stack">
                {/* Section 1: Personal & Contact */}
                <div className="form-step-subcard">
                  <h3 className="subcard-title">
                    <FiPhone className="subcard-icon" /> 1. PERSONAL DETAILS & CONTACT
                  </h3>
                  <div className="form-grid-2x2">
                    <div className="form-group-custom">
                      <label className="form-label-custom">Phone Number *</label>
                      <input 
                        type="tel"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="e.g. +91 98765 43210"
                        className="auth-input-field-custom"
                        required
                      />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Date of Birth *</label>
                      <input 
                        type="date"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        className="auth-input-field-custom"
                        required
                      />
                    </div>
                  </div>
                  <div className="form-group-custom">
                    <label className="form-label-custom">Gender *</label>
                    <select 
                      value={gender}
                      onChange={(e) => setGender(e.target.value)}
                      className="form-select-custom"
                      required
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                      <option value="Prefer not to say">Prefer not to say</option>
                    </select>
                  </div>
                </div>

                {/* Section 2: Address */}
                <div className="form-step-subcard">
                  <h3 className="subcard-title">
                    <FiMapPin className="subcard-icon" /> 2. DEFAULT SHIPPING ADDRESS
                  </h3>

                  <div className="form-group-custom">
                    <label className="form-label-custom">Receiver Full Name *</label>
                    <input 
                      type="text"
                      value={fullName}
                      onChange={(e) => setFullName(e.target.value)}
                      placeholder="e.g. Abhishek Vishwakarma"
                      className="auth-input-field-custom"
                      required
                    />
                  </div>

                  <div className="form-grid-2x2">
                    <div className="form-group-custom">
                      <label className="form-label-custom">Address Line 1 *</label>
                      <input 
                        type="text"
                        value={addressLine1}
                        onChange={(e) => setAddressLine1(e.target.value)}
                        placeholder="House / Flat No, Street Address"
                        className="auth-input-field-custom"
                        required
                      />
                    </div>
                    <div className="form-group-custom">
                      <label className="form-label-custom">Address Line 2 (Optional)</label>
                      <input 
                        type="text"
                        value={addressLine2}
                        onChange={(e) => setAddressLine2(e.target.value)}
                        placeholder="Landmark, Locality"
                        className="auth-input-field-custom"
                      />
                    </div>
                  </div>

                  <div className="form-grid-3-col-custom">
                    <div className="form-group-custom">
                      <label className="form-label-custom">City *</label>
                      <input 
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. Indore"
                        className="auth-input-field-custom"
                        required
                      />
                    </div>
                    
                    <div className="form-group-custom">
                      <label className="form-label-custom">State *</label>
                      <select 
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className="form-select-custom"
                        required
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map(st => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                    </div>

                    <div className="form-group-custom">
                      <label className="form-label-custom">Pincode *</label>
                      <input 
                        type="text"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="e.g. 452010"
                        maxLength="6"
                        className="auth-input-field-custom"
                        required
                      />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="completion-submit-btn" disabled={loading}>
                {loading ? 'SAVING PROFILE...' : 'SAVE AND COMPLETE PROFILE'}
              </button>
            </form>
        </div>
      </section>

      {showModal && (
        <div className="custom-modal-overlay">
          <div className="custom-modal-box fade-in">
            <div className="success-circle-icon">✓</div>
            <h3>Profile Completed</h3>
            <div className="custom-modal-body">
              <p>Your profile details have been successfully saved. You are now a fully verified Unicorn Member!</p>
            </div>
            <div className="custom-modal-footer">
              <button type="button" className="modal-cta-btn" onClick={() => {
                setShowModal(false);
                navigate('/shop');
              }}>
                CONTINUE TO SHOP
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CompleteProfile;
