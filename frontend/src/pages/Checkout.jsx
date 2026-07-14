import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiLock,
  FiCheck,
  FiChevronRight,
  FiChevronLeft,
  FiShoppingBag,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiHelpCircle
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import './Checkout.css';

const FREE_SHIPPING_THRESHOLD = 1999;

const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, cartCount, cartSubtotal, clearCart } = useCart();
  const { user, loading: authLoading, api } = useAuth();
  const [orderLoading, setOrderLoading] = useState(false);

  // Form states
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [phone, setPhone] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [selectedState, setSelectedState] = useState('');
  const [pincode, setPincode] = useState('');
  const [saveAddress, setSaveAddress] = useState(true);

  // Method states
  const [shippingMethod, setShippingMethod] = useState('standard'); // 'standard' | 'express'
  const [paymentMethod, setPaymentMethod] = useState('upi'); // 'upi' | 'card' | 'netbanking' | 'cod'

  // Promo code states
  const [promoInput, setPromoInput] = useState('');
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoError, setPromoError] = useState('');

  // Errors state
  const [formErrors, setFormErrors] = useState({});

  // Success state
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [orderNumber, setOrderNumber] = useState('');
  const [purchasedItems, setPurchasedItems] = useState([]);
  const [purchasedSummary, setPurchasedSummary] = useState({});

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/login?redirect=checkout');
    }
  }, [user, authLoading, navigate]);

  // Pre-populate user details
  useEffect(() => {
    if (user) {
      if (!fullName) setFullName(user.name || '');
      if (!email) setEmail(user.email || '');
    }
  }, [user]);

  // Indian States
  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Puducherry'
  ];

  // Helper validation
  const validateForm = () => {
    const errors = {};
    if (!email) {
      errors.email = 'Email address is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      errors.email = 'Please enter a valid email address';
    }

    if (!fullName.trim()) errors.fullName = 'Full Name is required';

    if (!phone.trim()) {
      errors.phone = 'Phone Number is required';
    } else if (!/^\+?([0-9\s-]{8,15})$/.test(phone.trim())) {
      errors.phone = 'Please enter a valid phone number';
    }

    if (!address1.trim()) errors.address1 = 'Address line 1 is required';
    if (!city.trim()) errors.city = 'City is required';
    if (!selectedState) errors.selectedState = 'State is required';

    if (!pincode.trim()) {
      errors.pincode = 'Pincode is required';
    } else if (!/^[1-9][0-9]{5}$/.test(pincode.trim())) {
      errors.pincode = 'Pincode must be a valid 6-digit code';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Coupon application
  const handleApplyPromo = (e) => {
    e.preventDefault();
    setPromoError('');

    const formattedCode = promoInput.trim().toUpperCase();
    if (formattedCode === '') {
      setPromoError('Please enter a promo code');
      return;
    }

    const savedCoupons = localStorage.getItem('admin_coupons');
    const couponsList = savedCoupons ? JSON.parse(savedCoupons) : [
      { code: 'GOTHIC10', type: 'percentage', value: 10, expiry: '2026-12-31', minOrder: 1500, active: true },
      { code: 'OBSIDIAN500', type: 'flat', value: 500, expiry: '2026-09-30', minOrder: 3000, active: true },
      { code: 'WELCOME10', type: 'percentage', value: 10, expiry: '2026-12-31', minOrder: 0, active: true }
    ];

    const coupon = couponsList.find(c => c.code === formattedCode && c.active);

    if (coupon) {
      // Expiration check
      if (coupon.expiry && new Date() > new Date(coupon.expiry)) {
        setPromoError('This promo code has expired');
        return;
      }

      if (cartSubtotal < (coupon.minOrder || 0)) {
        setPromoError(`Minimum order amount of ${formatPrice(coupon.minOrder)} required`);
      } else {
        setAppliedPromo(coupon);
        setPromoInput('');
      }
    } else {
      setPromoError('Invalid promo code');
    }
  };

  const handleRemovePromo = () => {
    setAppliedPromo(null);
  };

  // Calculations
  const isFreeShipping = cartSubtotal >= FREE_SHIPPING_THRESHOLD;
  const standardShippingCost = isFreeShipping ? 0 : 99;
  const shippingCost = shippingMethod === 'standard' ? standardShippingCost : 199;

  const discountAmount = appliedPromo 
    ? (appliedPromo.type === 'percentage' 
        ? (cartSubtotal * (appliedPromo.value / 100)) 
        : appliedPromo.value)
    : 0;
  const grandTotal = cartSubtotal + shippingCost - discountAmount;

  // Formatter helper
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  // Dynamic date helpers
  const getFormattedDate = () => {
    const date = new Date();
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    let hours = date.getHours();
    let minutes = date.getMinutes();
    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? '0' + minutes : minutes;

    return `${date.getDate()} ${months[date.getMonth()]} ${date.getFullYear()} • ${hours}:${minutes} ${ampm}`;
  };

  const getDeliveryDateRange = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 4);
    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 7);

    return `${dateStart.getDate()} ${months[dateStart.getMonth()]} – ${dateEnd.getDate()} ${months[dateEnd.getMonth()]} ${dateEnd.getFullYear()}`;
  };

  // Place Order submission
  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (!validateForm()) {
      // Scroll to the first error
      const firstErrorKey = Object.keys(formErrors)[0];
      const errorElement = document.getElementsByName(firstErrorKey)[0];
      if (errorElement) {
        errorElement.scrollIntoView({ behavior: 'smooth', block: 'center' });
        errorElement.focus();
      }
      return;
    }

    const orderData = {
      orderItems: cartItems.map(item => ({
        name: item.name,
        qty: item.qty,
        image: item.image,
        price: item.price,
        product: item._id, // product ObjectId
      })),
      shippingAddress: {
        address: `${address1}${address2 ? ', ' + address2 : ''}`,
        city: city,
        postalCode: pincode,
        country: 'India',
      },
      paymentMethod: paymentMethod === 'upi' ? 'UPI' : paymentMethod === 'card' ? 'Credit / Debit Card' : paymentMethod === 'netbanking' ? 'Net Banking' : 'Cash on Delivery (COD)',
      totalPrice: grandTotal,
    };

    setOrderLoading(true);
    try {
      const { data } = await api.post('/orders', orderData);
      
      setOrderNumber(data._id);
      setPurchasedItems([...cartItems]);
      setPurchasedSummary({
        orderNumber: data._id,
        orderDate: getFormattedDate(),
        deliveryRange: getDeliveryDateRange(),
        subtotal: cartSubtotal,
        shipping: shippingCost,
        discount: discountAmount,
        total: grandTotal,
        paymentMethod: orderData.paymentMethod,
        shippingMethodText: shippingMethod === 'standard' ? 'Free Shipping' : 'Express Shipping',
        fullName: fullName,
        email: email,
        address1: address1,
        address2: address2,
        city: city,
        selectedState: selectedState,
        pincode: pincode
      });

      // Set order placed state
      setOrderPlaced(true);
      // Clear shopping cart
      clearCart();
      window.scrollTo(0, 0);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to place order. Please try again.');
    } finally {
      setOrderLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div className="checkout-loading-screen" style={{
        minHeight: '80vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'var(--black-900)',
        color: 'var(--white)',
        fontSize: '1.2rem',
        letterSpacing: '1px'
      }}>
        LOADING CHECKOUT...
      </div>
    );
  }

  if (!user) {
    return null;
  }

  // Redirect if cart is empty and order hasn't been placed yet
  if (cartItems.length === 0 && !orderPlaced) {
    return (
      <div className="checkout-empty-redirect">
        <div className="container">
          <h2>YOUR CART IS EMPTY</h2>
          <p>You cannot check out with an empty cart.</p>
          <Link to="/shop" className="back-btn">RETURN TO SHOP</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-page fade-in">
      {/* Success Order Confirmation Screen */}
      {orderPlaced ? (
        <div className="order-success-page">
          
          {/* Top Hero Section */}
          <div 
            className="success-hero-banner"
            style={{ 
              backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.75), rgba(10, 10, 10, 0.95)), url('/images/ComBack.png')` 
            }}
          >
            <div className="container success-hero-content">
              <div className="success-title-row">
                <div className="success-circle-checkmark">
                  <FiCheck size={36} />
                </div>
                <div className="success-title-texts">
                  <h1 className="success-main-heading">ORDER SUCCESSFUL!</h1>
                  <p className="success-hero-subtext">
                    Thank you, <strong>{purchasedSummary.fullName || 'Customer'}</strong>! Your order has been placed successfully.<br />
                    We have sent a confirmation email to <span className="highlight-email">{purchasedSummary.email}</span>
                  </p>
                </div>
              </div>

              {/* Progress Steps Row */}
              <div className="success-progress-stepper">
                <div className="progress-step completed">
                  <span className="step-icon">✓</span>
                  <div className="step-label-box">
                    <span className="step-label-title">Order Confirmed</span>
                    <span className="step-label-desc">We've received your order</span>
                  </div>
                </div>
                <div className="progress-step completed">
                  <span className="step-icon">✓</span>
                  <div className="step-label-box">
                    <span className="step-label-title">Payment Successful</span>
                    <span className="step-label-desc">Secure payment received</span>
                  </div>
                </div>
                <div className="progress-step active">
                  <span className="step-icon">⚙</span>
                  <div className="step-label-box">
                    <span className="step-label-title">Processing</span>
                    <span className="step-label-desc">We are packing your items</span>
                  </div>
                </div>
                <div className="progress-step pending">
                  <span className="step-icon">🚚</span>
                  <div className="step-label-box">
                    <span className="step-label-title">On The Way</span>
                    <span className="step-label-desc">You'll get it soon</span>
                  </div>
                </div>
              </div>

              {/* Header CTAs */}
              <div className="success-header-ctas">
                <a href="#order-summary-box" className="view-details-cta-btn">
                  <FiLock size={14} /> VIEW ORDER DETAILS
                </a>
                <button className="continue-shopping-cta-btn" onClick={() => { navigate('/shop'); window.scrollTo(0, 0); }}>
                  CONTINUE SHOPPING &nbsp;→
                </button>
              </div>
            </div>
          </div>

          {/* Bottom Grid Layout */}
          <div className="container success-layout-grid">
            
            {/* Left Column: Summary and What's Next */}
            <div className="success-left-column">
              
              {/* Order Summary box */}
              <div id="order-summary-box" className="success-section-box">
                <h3 className="success-section-title">ORDER SUMMARY</h3>
                <div className="success-items-list">
                  {purchasedItems.map((item) => (
                    <div key={item.cartItemId} className="success-item-row">
                      <div className="success-item-thumb">
                        <img src={item.image} alt={item.name} />
                      </div>
                      <div className="success-item-info">
                        <h4 className="success-item-name">{item.name}</h4>
                        <span className="success-item-meta">{item.color} &nbsp;•&nbsp; {item.fit}</span>
                        <span className="success-item-size">Size: {item.size} &nbsp;&nbsp; Qty: {item.qty}</span>
                      </div>
                      <span className="success-item-price">
                        {formatPrice(item.price * item.qty)}
                      </span>
                    </div>
                  ))}
                </div>

                <div className="success-summary-footer-row">
                  <div className="footer-payment-method">
                    <span className="footer-label">Payment Method</span>
                    <span className="footer-value">💳 {purchasedSummary.paymentMethod}</span>
                  </div>
                  <div className="footer-total-paid">
                    <span className="footer-label">Total Paid</span>
                    <span className="footer-value-price">{formatPrice(purchasedSummary.total)}</span>
                  </div>
                </div>
              </div>

              {/* What's next box */}
              <div className="success-whats-next-box">
                <div className="whats-next-content">
                  <h3 className="whats-next-title">WHAT'S NEXT?</h3>
                  <p className="whats-next-desc">
                    You will receive an email/SMS with tracking details once your order is shipped.
                  </p>
                  <button className="track-order-cta-btn" onClick={() => alert('Opening tracking window...')}>
                    TRACK ORDER &nbsp;→
                  </button>
                </div>
                {/* SVG Visual Route Trace Map or Dotted mockup */}
                <div className="whats-next-visual-map">
                  <div className="visual-phone-mockup">
                    <div className="phone-screen">
                      <div className="map-path-line"></div>
                      <div className="map-pulsating-dot dot-start"></div>
                      <div className="map-pulsating-dot dot-end"></div>
                      <span className="visual-delivery-truck">🚚</span>
                    </div>
                  </div>
                </div>
              </div>

            </div>

            {/* Right Column: Estimated Delivery & Order Details */}
            <div className="success-right-column">
              


              {/* Order Details Card */}
              <div className="success-order-details-card">
                <h3 className="success-section-title">ORDER DETAILS</h3>
                <div className="details-grid-rows">
                  <div className="details-grid-row">
                    <span className="detail-label">Order ID</span>
                    <span className="detail-value">{purchasedSummary.orderNumber}</span>
                  </div>
                  <div className="details-grid-row">
                    <span className="detail-label">Order Date</span>
                    <span className="detail-value">{purchasedSummary.orderDate?.split(' • ')[0]}</span>
                  </div>
                  <div className="details-grid-row">
                    <span className="detail-label">Payment Method</span>
                    <span className="detail-value">{purchasedSummary.paymentMethod}</span>
                  </div>
                  <div className="details-grid-row">
                    <span className="detail-label">Payment Status</span>
                    <span className="detail-value status-paid-pill">✓ Paid</span>
                  </div>
                  <div className="details-grid-row">
                    <span className="detail-label">Shipping Method</span>
                    <span className="detail-value">{purchasedSummary.shippingMethodText}</span>
                  </div>
                  <div className="details-grid-row address-grid-row">
                    <span className="detail-label">Delivery Address</span>
                    <span className="detail-value address-value">
                      <strong>{purchasedSummary.fullName}</strong><br />
                      {purchasedSummary.address1}<br />
                      {purchasedSummary.address2 && <>{purchasedSummary.address2}<br /></>}
                      {purchasedSummary.city}, {purchasedSummary.selectedState} - {purchasedSummary.pincode}<br />
                      India
                    </span>
                  </div>
                  <div className="details-grid-row total-amount-row">
                    <span className="detail-label">Total Amount</span>
                    <span className="detail-value price-bold">{formatPrice(purchasedSummary.total)}</span>
                  </div>
                </div>

                <div className="details-help-widget">
                  <div className="details-help-header">
                    <span className="help-icon">🎧</span>
                    <div className="help-texts">
                      <span className="help-title">Need help?</span>
                      <span className="help-sub">Contact our support team</span>
                    </div>
                  </div>
                  <FiChevronRight className="help-arrow" />
                </div>
              </div>

            </div>

          </div>


        </div>
      ) : (
        <>
          {/* Breadcrumbs and Page title */}
          <section className="checkout-header-section">
            <div className="container">
              <h1 className="checkout-main-title">CHECKOUT</h1>
              <div className="checkout-breadcrumbs">
                <Link to="/">Home</Link>
                <FiChevronRight className="breadcrumb-arrow" />
                <Link to="/cart">Cart</Link>
                <FiChevronRight className="breadcrumb-arrow" />
                <span className="current-breadcrumb">Checkout</span>
              </div>
            </div>
          </section>

          {/* Benefits sub-header banner */}
          {/* <section className="checkout-benefits-subheader">
            <div className="container benefits-grid-subheader">
              <div className="benefit-item">
                <FiShield className="benefit-icon" />
                <div className="benefit-texts">
                  <span className="benefit-title">100% Secure Checkout</span>
                  <span className="benefit-desc">Your data is protected</span>
                </div>
              </div>
              <div className="benefit-item">
                <FiRefreshCw className="benefit-icon" />
                <div className="benefit-texts">
                  <span className="benefit-title">Easy Returns</span>
                  <span className="benefit-desc">14 days return policy</span>
                </div>
              </div>
              <div className="benefit-item">
                <FiTruck className="benefit-icon" />
                <div className="benefit-texts">
                  <span className="benefit-title">Free Shipping</span>
                  <span className="benefit-desc">On orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                </div>
              </div>
              <div className="benefit-item">
                <FiHelpCircle className="benefit-icon" />
                <div className="benefit-texts">
                  <span className="benefit-title">24/7 Support</span>
                  <span className="benefit-desc">We're here to help</span>
                </div>
              </div>
            </div>
          </section> */}

          {/* Checkout Layout Grid */}
          <section className="checkout-content-section">
            <div className="container checkout-layout-grid">

              {/* Left Column: Form steps */}
              <form className="checkout-form-column" onSubmit={handlePlaceOrder}>

                {/* Step 1: Contact Information */}
                <div className="checkout-step-card">
                  <div className="step-header">
                    <span className="step-number">1</span>
                    <h2 className="step-title">CONTACT INFORMATION</h2>
                    <span className="step-header-link">Already have an account? <Link to="/login">Login</Link></span>
                  </div>

                  <div className="form-group input-relative">
                    <label className="form-label">Email address *</label>
                    <input
                      type="email"
                      name="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="abhishek.vishwakarma@example.com"
                      className={`form-input ${formErrors.email ? 'input-error' : ''} ${email && !formErrors.email ? 'input-valid' : ''}`}
                    />
                    {email && !formErrors.email && (
                      <FiCheck className="input-check-feedback-icon" />
                    )}
                    {formErrors.email && <span className="error-text-msg">{formErrors.email}</span>}
                  </div>
                </div>

                {/* Step 2: Shipping Address */}
                <div className="checkout-step-card">
                  <div className="step-header">
                    <span className="step-number">2</span>
                    <h2 className="step-title">SHIPPING ADDRESS</h2>
                  </div>

                  <div className="form-grid-2-col">
                    <div className="form-group">
                      <label className="form-label">Full Name *</label>
                      <input
                        type="text"
                        name="fullName"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        placeholder="Abhishek Vishwakarma"
                        className={`form-input ${formErrors.fullName ? 'input-error' : ''}`}
                      />
                      {formErrors.fullName && <span className="error-text-msg">{formErrors.fullName}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Phone Number *</label>
                      <input
                        type="tel"
                        name="phone"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        placeholder="+91 98765 43210"
                        className={`form-input ${formErrors.phone ? 'input-error' : ''}`}
                      />
                      {formErrors.phone && <span className="error-text-msg">{formErrors.phone}</span>}
                    </div>
                  </div>

                  <div className="form-grid-2-col">
                    <div className="form-group">
                      <label className="form-label">Address Line 1 *</label>
                      <input
                        type="text"
                        name="address1"
                        value={address1}
                        onChange={(e) => setAddress1(e.target.value)}
                        placeholder="123, Vijay Nagar"
                        className={`form-input ${formErrors.address1 ? 'input-error' : ''}`}
                      />
                      {formErrors.address1 && <span className="error-text-msg">{formErrors.address1}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Address Line 2 (Optional)</label>
                      <input
                        type="text"
                        name="address2"
                        value={address2}
                        onChange={(e) => setAddress2(e.target.value)}
                        placeholder="Near Sayaji Garden"
                        className="form-input"
                      />
                    </div>
                  </div>

                  <div className="form-grid-3-col">
                    <div className="form-group">
                      <label className="form-label">City *</label>
                      <input
                        type="text"
                        name="city"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Indore"
                        className={`form-input ${formErrors.city ? 'input-error' : ''}`}
                      />
                      {formErrors.city && <span className="error-text-msg">{formErrors.city}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">State *</label>
                      <select
                        name="selectedState"
                        value={selectedState}
                        onChange={(e) => setSelectedState(e.target.value)}
                        className={`form-select ${formErrors.selectedState ? 'select-error' : ''}`}
                      >
                        <option value="">Select State</option>
                        {INDIAN_STATES.map((st) => (
                          <option key={st} value={st}>{st}</option>
                        ))}
                      </select>
                      {formErrors.selectedState && <span className="error-text-msg">{formErrors.selectedState}</span>}
                    </div>

                    <div className="form-group">
                      <label className="form-label">Pincode *</label>
                      <input
                        type="text"
                        name="pincode"
                        value={pincode}
                        onChange={(e) => setPincode(e.target.value)}
                        placeholder="452010"
                        maxLength="6"
                        className={`form-input ${formErrors.pincode ? 'input-error' : ''}`}
                      />
                      {formErrors.pincode && <span className="error-text-msg">{formErrors.pincode}</span>}
                    </div>
                  </div>

                  <div className="form-checkbox-group">
                    <input
                      type="checkbox"
                      id="saveAddress"
                      checked={saveAddress}
                      onChange={(e) => setSaveAddress(e.target.checked)}
                      className="form-checkbox"
                    />
                    <label htmlFor="saveAddress" className="checkbox-label">
                      Save this address for future orders
                    </label>
                  </div>
                </div>

                {/* Step 3: Shipping Method */}
                <div className="checkout-step-card">
                  <div className="step-header">
                    <span className="step-number">3</span>
                    <h2 className="step-title">SHIPPING METHOD</h2>
                  </div>

                  <div className="shipping-methods-stack">

                    {/* Standard Method Option */}
                    <div
                      className={`shipping-method-option-card ${shippingMethod === 'standard' ? 'selected-method-card' : ''}`}
                      onClick={() => setShippingMethod('standard')}
                    >
                      <input
                        type="radio"
                        id="ship-standard"
                        name="shippingMethod"
                        checked={shippingMethod === 'standard'}
                        onChange={() => setShippingMethod('standard')}
                        className="method-radio-input"
                      />
                      <label htmlFor="ship-standard" className="method-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="method-header-row">
                          <FiTruck className="method-icon-left" />
                          <div className="method-info">
                            <span className="method-name">Standard Shipping</span>
                            <span className="method-sub">Free shipping on orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
                          </div>
                          <span className="method-price-label">
                            {standardShippingCost === 0 ? 'FREE' : formatPrice(standardShippingCost)}
                          </span>
                        </div>
                        <span className="delivery-timeline">5-7 business days</span>
                      </label>
                    </div>

                    {/* Express Method Option */}
                    <div
                      className={`shipping-method-option-card ${shippingMethod === 'express' ? 'selected-method-card' : ''}`}
                      onClick={() => setShippingMethod('express')}
                    >
                      <input
                        type="radio"
                        id="ship-express"
                        name="shippingMethod"
                        checked={shippingMethod === 'express'}
                        onChange={() => setShippingMethod('express')}
                        className="method-radio-input"
                      />
                      <label htmlFor="ship-express" className="method-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="method-header-row">
                          <span className="method-icon-left">⚡</span>
                          <div className="method-info">
                            <span className="method-name">Express Shipping</span>
                            <span className="method-sub">Get your order faster</span>
                          </div>
                          <span className="method-price-label">{formatPrice(199)}</span>
                        </div>
                        <span className="delivery-timeline">2-3 business days</span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Step 4: Payment Method */}
                <div className="checkout-step-card">
                  <div className="step-header">
                    <span className="step-number">4</span>
                    <h2 className="step-title">PAYMENT METHOD</h2>
                  </div>

                  <div className="payment-options-stack">

                    {/* UPI Option */}
                    <div
                      className={`payment-option-row ${paymentMethod === 'upi' ? 'selected-payment-row' : ''}`}
                      onClick={() => setPaymentMethod('upi')}
                    >
                      <input
                        type="radio"
                        id="pay-upi"
                        name="paymentMethod"
                        checked={paymentMethod === 'upi'}
                        onChange={() => setPaymentMethod('upi')}
                        className="payment-radio-input"
                      />
                      <label htmlFor="pay-upi" className="payment-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="payment-meta-info">
                          <span className="payment-icon-symbol">📱</span>
                          <div className="payment-texts-column">
                            <span className="payment-method-title">UPI Payment</span>
                            <span className="payment-method-desc">Pay securely using any UPI app</span>
                          </div>
                        </div>
                        <div className="payment-brand-logos">
                          <span className="brand-pill gpay">GPay</span>
                          <span className="brand-pill phonepe">PhonePe</span>
                          <span className="brand-pill paytm">Paytm</span>
                          <span className="brand-pill bhim">BHIM</span>
                        </div>
                      </label>
                    </div>

                    {/* Credit / Debit Card Option */}
                    <div
                      className={`payment-option-row ${paymentMethod === 'card' ? 'selected-payment-row' : ''}`}
                      onClick={() => setPaymentMethod('card')}
                    >
                      <input
                        type="radio"
                        id="pay-card"
                        name="paymentMethod"
                        checked={paymentMethod === 'card'}
                        onChange={() => setPaymentMethod('card')}
                        className="payment-radio-input"
                      />
                      <label htmlFor="pay-card" className="payment-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="payment-meta-info">
                          <span className="payment-icon-symbol">💳</span>
                          <div className="payment-texts-column">
                            <span className="payment-method-title">Credit / Debit Card</span>
                            <span className="payment-method-desc">Visa, Mastercard, Rupay & more</span>
                          </div>
                        </div>
                        <div className="payment-brand-logos">
                          <span className="brand-pill visa">VISA</span>
                          <span className="brand-pill mastercard">Mastercard</span>
                          <span className="brand-pill rupay">RuPay</span>
                        </div>
                      </label>
                    </div>

                    {/* Net Banking */}
                    <div
                      className={`payment-option-row ${paymentMethod === 'netbanking' ? 'selected-payment-row' : ''}`}
                      onClick={() => setPaymentMethod('netbanking')}
                    >
                      <input
                        type="radio"
                        id="pay-netbanking"
                        name="paymentMethod"
                        checked={paymentMethod === 'netbanking'}
                        onChange={() => setPaymentMethod('netbanking')}
                        className="payment-radio-input"
                      />
                      <label htmlFor="pay-netbanking" className="payment-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="payment-meta-info">
                          <span className="payment-icon-symbol">🏦</span>
                          <div className="payment-texts-column">
                            <span className="payment-method-title">Net Banking</span>
                            <span className="payment-method-desc">All major banks supported</span>
                          </div>
                        </div>
                        <span className="bank-building-icon">🏛</span>
                      </label>
                    </div>

                    {/* Cash on Delivery */}
                    <div
                      className={`payment-option-row ${paymentMethod === 'cod' ? 'selected-payment-row' : ''}`}
                      onClick={() => setPaymentMethod('cod')}
                    >
                      <input
                        type="radio"
                        id="pay-cod"
                        name="paymentMethod"
                        checked={paymentMethod === 'cod'}
                        onChange={() => setPaymentMethod('cod')}
                        className="payment-radio-input"
                      />
                      <label htmlFor="pay-cod" className="payment-label-container" onClick={(e) => e.stopPropagation()}>
                        <div className="payment-meta-info">
                          <span className="payment-icon-symbol">💵</span>
                          <div className="payment-texts-column">
                            <span className="payment-method-title">Cash on Delivery (COD)</span>
                            <span className="payment-method-desc">Pay when you receive</span>
                          </div>
                        </div>
                        <span className="cod-cash-icon">🤝</span>
                      </label>
                    </div>

                  </div>
                </div>

                {/* Place Order CTA Button */}
                <button type="submit" className="place-order-submit-btn" disabled={orderLoading}>
                  <FiLock size={15} /> {orderLoading ? 'PLACING ORDER...' : <>PLACE ORDER &nbsp;•&nbsp; {formatPrice(grandTotal)}</>}
                </button>

                <p className="checkout-secure-footer-text">
                  🛡 Your order is 100% secure and encrypted
                </p>

              </form>

              {/* Right Column: Order Summary */}
              <div className="checkout-summary-column">
                <div className="summary-sticky-card">

                  <h3 className="summary-sidebar-title">ORDER SUMMARY</h3>

                  {/* Summary items list */}
                  <div className="summary-items-list-box">
                    {cartItems.map((item) => (
                      <div key={item.cartItemId} className="summary-item-card-row">
                        <div className="summary-item-thumbnail-box">
                          <img src={item.image} alt={item.name} />
                          <span className="item-qty-badge-overlay">{item.qty}</span>
                        </div>
                        <div className="summary-item-details-box">
                          <h4 className="summary-item-name">{item.name}</h4>
                          <span className="summary-item-meta">{item.color} &nbsp;•&nbsp; {item.fit}</span>
                          <span className="summary-item-size">Size: {item.size}</span>
                        </div>
                        <span className="summary-item-price-display">
                          {formatPrice(item.price * item.qty)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Promo coupon input block */}
                  <form className="promo-coupon-input-row" onSubmit={handleApplyPromo}>
                    <input
                      type="text"
                      value={promoInput}
                      onChange={(e) => setPromoInput(e.target.value)}
                      placeholder="Apply promo code"
                      className="promo-input-field"
                      disabled={!!appliedPromo}
                    />
                    <button
                      type="submit"
                      className="promo-apply-submit-btn"
                      disabled={!!appliedPromo}
                    >
                      APPLY
                    </button>
                  </form>
                  {promoError && <span className="promo-error-msg">{promoError}</span>}
                  {appliedPromo && (
                    <div className="applied-promo-tag-row">
                      <span className="promo-tag-text">Code <strong>{appliedPromo.code}</strong> applied</span>
                      <button type="button" className="remove-promo-tag-btn" onClick={handleRemovePromo}>
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Summary details listing */}
                  <div className="summary-pricing-rows-box">
                    <div className="pricing-row-item">
                      <span className="price-label">Subtotal ({cartCount} items)</span>
                      <span className="price-val">{formatPrice(cartSubtotal)}</span>
                    </div>

                    <div className="pricing-row-item">
                      <span className="price-label">Shipping</span>
                      <span className="price-val shipping-free-value">
                        {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                      </span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="pricing-row-item discount-row-item">
                        <span className="price-label">Discount ({appliedPromo.code})</span>
                        <span className="price-val discount-value-green">-{formatPrice(discountAmount)}</span>
                      </div>
                    )}

                    <div className="pricing-divider"></div>

                    <div className="pricing-row-item total-row-item">
                      <span className="total-title-label">Total</span>
                      <div className="total-price-box">
                        <span className="total-grand-price">{formatPrice(grandTotal)}</span>
                        <span className="taxes-inclusive-text">Inclusive of all taxes</span>
                      </div>
                    </div>
                  </div>

                  {/* Reassurance widgets */}
                  <div className="checkout-reassurance-box">
                    <div className="reassurance-row">
                      <FiShield className="reassurance-icon" />
                      <div className="reassurance-texts">
                        <span className="reassurance-title">Secure Checkout</span>
                        <span className="reassurance-desc">100% secure and encrypted</span>
                      </div>
                    </div>
                    <div className="reassurance-row">
                      <FiRefreshCw className="reassurance-icon" />
                      <div className="reassurance-texts">
                        <span className="reassurance-title">Easy Returns</span>
                        <span className="reassurance-desc">14 days return policy</span>
                      </div>
                    </div>
                    <div className="reassurance-row">
                      <FiCheck className="reassurance-icon-check" />
                      <div className="reassurance-texts">
                        <span className="reassurance-title">Satisfaction Guaranteed</span>
                        <span className="reassurance-desc">We ensure premium quality</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </section>


        </>
      )}

    </div>
  );
};

export default Checkout;
