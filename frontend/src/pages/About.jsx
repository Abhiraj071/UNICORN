import { FiArrowRight, FiShield, FiHeart, FiCpu } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import './About.css';

const About = () => {
  return (
    <div className="about-page fade-in">
      {/* Hero Banner Section */}
      <section 
        className="about-hero"
        style={{ 
          backgroundImage: `linear-gradient(rgba(10, 10, 10, 0.75), rgba(10, 10, 10, 0.95)), url('/images/ComBack.png')` 
        }}
      >
        <div className="container hero-content-box">
          <p className="about-subtitle">OUR STORY</p>
          <h1 className="about-title">DESIGNED IN THE SHADOWS</h1>
          <div className="about-divider"></div>
          <p className="about-lead">
            UNICORN is more than apparel. It is an exploration of darkness, craftsmanship, and individuality. We create armor for the modern misfit.
          </p>
        </div>
      </section>

      {/* Brand Values Grid */}
      <section className="about-values-section">
        <div className="container">
          <div className="section-header-center">
            <h2 className="values-title">THE OBSIDIAN MANIFESTO</h2>
            <p className="values-subtitle">Every piece is built with intention, combining dark gothic aesthetics with premium streetwear engineering.</p>
          </div>

          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon-box">
                <FiCpu className="value-icon" />
              </div>
              <h3 className="value-name">HEAVYWEIGHT ENGINEERING</h3>
              <p className="value-desc">
                We custom mill our cotton starting at 240 GSM for tees, and up to 500 GSM brushed fleece for hoodies. Every garment has weight, substance, and structure designed to hold its shape.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <FiShield className="value-icon" />
              </div>
              <h3 className="value-name">UNCOMPROMISING DETAIL</h3>
              <p className="value-desc">
                From high-density puff prints to custom-crafted embroidery and heavy-duty metal hardware, our designs are built to stand the test of time, washes, and the elements.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon-box">
                <FiHeart className="value-icon" />
              </div>
              <h3 className="value-name">EMBRACING THE OUTCAST</h3>
              <p className="value-desc">
                Our silhouettes feature drop shoulders, oversized relaxed cuts, and deep monochromatic tones. We celebrate those who walk the shadows and speak their truth in silence.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Philosophy Block */}
      <section className="about-philosophy-section">
        <div className="container philosophy-layout">
          <div className="philosophy-image-box">
            <img src="/images/7.png" alt="Gothic Graphic Hoodie Art" className="philosophy-img" />
          </div>
          <div className="philosophy-content">
            <h2 className="philosophy-title">CRAFTED FOR THOSE WHO WANDER</h2>
            <div className="small-divider"></div>
            <p className="philosophy-text">
              We draw inspiration from gothic architecture, mythologies, and industrial aesthetics. Every season, our designs tell a story of rebellion and quiet strength. We reject fast fashion, focusing instead on limited-run drops and core essentials that remain timeless.
            </p>
            <p className="philosophy-text">
              We operate out of our design sanctuary, mapping blueprints for the next generation of streetwear. Welcome to the coven.
            </p>
            <Link to="/shop" className="philosophy-cta-btn">
              EXPLOREBlueprints <FiArrowRight />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;
