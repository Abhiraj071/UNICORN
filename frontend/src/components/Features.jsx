import { FiCheckCircle, FiBox, FiLock, FiHeadphones } from 'react-icons/fi';
import './Features.css';

const Features = () => {
  return (
    <section className="features">
      <div className="container features-container">
        
        <div className="feature-item">
          <div className="feature-icon">
            <FiCheckCircle size={24} />
          </div>
          <div className="feature-text">
            <h4>Premium Quality</h4>
            <p>Finest fabrics for maximum comfort</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FiBox size={24} />
          </div>
          <div className="feature-text">
            <h4>Worldwide Shipping</h4>
            <p>Fast & secure delivery across the globe</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FiLock size={24} />
          </div>
          <div className="feature-text">
            <h4>Secure Payment</h4>
            <p>100% secure checkout and easy returns</p>
          </div>
        </div>

        <div className="feature-item">
          <div className="feature-icon">
            <FiHeadphones size={24} />
          </div>
          <div className="feature-text">
            <h4>24/7 Support</h4>
            <p>We are always here to help you</p>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Features;
