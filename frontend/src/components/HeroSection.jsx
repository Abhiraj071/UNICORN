import { Link } from 'react-router-dom';
import { FiArrowRight, FiArrowDown } from 'react-icons/fi';
import './HeroSection.css';

const HeroSection = () => {
  return (
    <section className="hero">
      <div className="hero-bg">
        <img src="/images/hero_bg.png" alt="Gothic Cathedral Background" className="hero-bg-img" />
        <div className="hero-overlay"></div>
      </div>

      <div className="hero-content container">
        <div className="hero-text fade-in">
          <div className="cross-icon">
            <svg viewBox="0 0 100 100" width="30" height="30" className="gothic-cross-svg">
              <path d="M50 2 L54 7 L52 12 L52 30 L72 30 L72 36 L54 36 L52 85 L50 88 L48 85 L46 36 L28 36 L28 30 L48 30 L48 12 L46 7 Z" fill="currentColor" />
            </svg>
          </div>
          <p className="subtitle">CRAFTED IN DARKNESS</p>
          <h1 className="title">

            WORN WITH<br />CONFIDENCE

          </h1>
          <div className="divider"></div>
          <p className="description">
            Premium gothic apparel designed<br />
            for those who embrace the shadows<br />
            and stand apart.
          </p>
          <Link to="/collections" className="btn-explore">
            EXPLORE COLLECTIONS <FiArrowRight className="arrow-icon" />
          </Link>
        </div>
      </div>

      <div className="scroll-indicator fade-in">
        <div className="scroll-line"></div>
        <div className="scroll-content">
          <span className="scroll-text">SCROLL</span>
          <span className="scroll-arrow">↓</span>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
