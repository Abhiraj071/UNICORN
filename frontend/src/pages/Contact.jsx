import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FiMail, FiMapPin, FiPhone, FiSend, FiCheckCircle, FiHelpCircle, FiArrowRight } from 'react-icons/fi';
import './Contact.css';

const Contact = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('Order Support');
  const [message, setMessage] = useState('');
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    
    if (!name || !email || !message) {
      setError('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    // Simulate API call
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      setName('');
      setEmail('');
      setMessage('');
    }, 1500);
  };

  return (
    <div className="contact-page fade-in">
      <section className="contact-header">
        <div className="container">
          <p className="contact-subtitle">GET IN TOUCH</p>
          <h1 className="contact-title">CONTACT THE COVEN</h1>
          <div className="contact-divider"></div>
          <p className="contact-desc">
            Have questions about sizing, a recent order drop, or custom inquiries? Send us a transmission.
          </p>
        </div>
      </section>

      <section className="contact-content-section">
        <div className="container">
          <div className="contact-faq-callout">
            <div className="faq-callout-left">
              <div className="faq-callout-icon-box">
                <FiHelpCircle size={24} />
              </div>
              <div className="faq-callout-text">
                <h3>Looking for immediate answers?</h3>
                <p>Before sending a transmission, browse our FAQ page to see if your question is already answered.</p>
              </div>
            </div>
            <Link to="/faq" className="faq-callout-btn">
              View FAQ Portal <FiArrowRight size={16} />
            </Link>
          </div>

          <div className="contact-grid">
            {/* Left: Contact Info Info Info */}
            <div className="contact-info-panel">
              <h2 className="panel-title">DIRECT CHANNELS</h2>
            <p className="panel-subtitle">We reply to all transmissions within 24 hours.</p>

            <div className="info-channels-stack">
              <div className="info-channel-row">
                <div className="channel-icon-box">
                  <FiMail />
                </div>
                <div className="channel-texts">
                  <span className="channel-title">SUPPORT EMAIL</span>
                  <a href="mailto:support@unicorn.clothing" className="channel-link">support@unicorn.clothing</a>
                </div>
              </div>

              <div className="info-channel-row">
                <div className="channel-icon-box">
                  <FiPhone />
                </div>
                <div className="channel-texts">
                  <span className="channel-title">PHONE SUPPORT</span>
                  <a href="tel:+919876543210" className="channel-link">+91 98765 43210</a>
                </div>
              </div>

              <div className="info-channel-row">
                <div className="channel-icon-box">
                  <FiMapPin />
                </div>
                <div className="channel-texts">
                  <span className="channel-title">THE SANCTUARY</span>
                  <span className="channel-value">Obsidian House, 12 Block, Vijay Nagar, Indore, MP - 452010</span>
                </div>
              </div>
            </div>

            {/* Aesthetic Gothic Clock Widget */}
            <div className="sanctuary-hours-box">
              <span className="hours-label">Sanctuary Hours:</span>
              <span className="hours-val">Mon – Sat: 11:00 AM – 8:00 PM IST</span>
              <span className="hours-sub">Inquiries received outside of hours will be queue-processed the next business day.</span>
            </div>
          </div>

          {/* Right: Contact Form */}
          <div className="contact-form-panel">
            {success ? (
              <div className="submit-success-box">
                <FiCheckCircle className="success-icon" />
                <h3 className="success-heading">TRANSMISSION RECEIVED</h3>
                <p className="success-text">
                  Your message has been securely sent. We will review the details and reach back to you shortly.
                </p>
                <button className="reset-form-btn" onClick={() => setSuccess(false)}>
                  SEND ANOTHER MESSAGE
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="contact-form">
                <h2 className="panel-title">SEND TRANSMISSION</h2>
                {error && <div className="form-error-banner">{error}</div>}

                <div className="form-group">
                  <label className="form-label">Full Name *</label>
                  <input 
                    type="text" 
                    value={name} 
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Abhishek Vishwakarma" 
                    className="form-input" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Email Address *</label>
                  <input 
                    type="email" 
                    value={email} 
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="abhishek@example.com" 
                    className="form-input" 
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Subject</label>
                  <select 
                    value={subject} 
                    onChange={(e) => setSubject(e.target.value)}
                    className="form-select"
                  >
                    <option value="Order Support">Order Support & Sizing</option>
                    <option value="Returns & Exchanges">Returns & Exchanges</option>
                    <option value="Collab / Press">Collaborations & Press</option>
                    <option value="General Query">General Query</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message *</label>
                  <textarea 
                    value={message} 
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Write your transmission here..." 
                    className="form-textarea" 
                    rows="6"
                    required
                  ></textarea>
                </div>

                <button type="submit" className="form-submit-btn" disabled={loading}>
                  <FiSend size={14} /> {loading ? 'SENDING TRANSMISSION...' : 'SEND TRANSMISSION'}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  </div>
  );
};

export default Contact;
