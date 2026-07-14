import { Link } from 'react-router-dom';
import { FiMail, FiArrowRight } from 'react-icons/fi';
import './Footer.css';

const Footer = () => {
  const handleSubscribe = (e) => {
    e.preventDefault();
    alert('Thank you for subscribing to our newsletter!');
  };

  return (
    <footer className="footer">
      <div className="container footer-container">

        {/* Left column: Brand Info */}
        <div className="footer-col brand-col">
          <Link to="/" className="footer-logo">
            UNIC<span className="logo-o-wrapper">
              <svg viewBox="0 0 100 100" className="logo-o-svg">
                <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="9" fill="none" />
                <path d="M50 22 L53 47 L78 50 L53 53 L50 78 L47 53 L22 50 L47 47 Z" fill="currentColor" />
              </svg>
            </span>RN
          </Link>
          <div className="footer-cross-divider">
            <svg viewBox="0 0 100 100" width="12" height="12" className="footer-cross-svg">
              <path d="M50 2 L54 7 L52 12 L52 30 L72 30 L72 36 L54 36 L52 85 L50 88 L48 85 L46 36 L28 36 L28 30 L48 30 L48 12 L46 7 Z" fill="currentColor" />
            </svg>
          </div>
          <p className="footer-desc">
            Clothing for the bold.<br />
            Designed in darkness,<br />
            made for the misfits.
          </p>
        </div>

        {/* Shop Column */}
        <div className="footer-col">
          <h4>Shop</h4>
          <ul>
            <li><Link to="/shop">All Products</Link></li>
            <li><Link to="/collections/t-shirts">T-Shirts</Link></li>
            <li><Link to="/collections/hoodies">Hoodies</Link></li>
            <li><Link to="/collections/oversized">Oversized</Link></li>
            <li><Link to="/collections/accessories">Accessories</Link></li>
            <li><Link to="/collections/new">New Arrivals</Link></li>
            <li><Link to="/collections/limited">Limited Drops</Link></li>
            <li><Link to="/collections/best">Best Sellers</Link></li>
            <li><Link to="/collections/sale">Sale</Link></li>
          </ul>
        </div>

        {/* Collections Column */}
        <div className="footer-col">
          <h4>Collections</h4>
          <ul>
            <li><Link to="/collections/oversized">Oversized T-Shirts</Link></li>
            <li><Link to="/collections/urban">Urban Noir</Link></li>
            <li><Link to="/collections/gothic">Gothic Edition</Link></li>
            <li><Link to="/collections/streetwear">Streetwear</Link></li>
            <li><Link to="/collections/new">New Arrivals</Link></li>
            <li><Link to="/collections/limited">Limited Drops</Link></li>
            <li><Link to="/collections/best">Best Sellers</Link></li>
          </ul>
        </div>

        {/* Customer Care Column */}
        <div className="footer-col">
          <h4>Customer Care</h4>
          <ul>
            <li><Link to="/shipping">Shipping & Delivery</Link></li>
            <li><Link to="/returns">Returns & Exchanges</Link></li>
            <li><Link to="/size-guide">Size Guide</Link></li>
            <li><Link to="/track-order">Track Your Order</Link></li>
            <li><Link to="/faq">FAQ</Link></li>
            <li><Link to="/contact">Contact Us</Link></li>
          </ul>
        </div>

        {/* About Column */}
        <div className="footer-col">
          <h4>About</h4>
          <ul>
            <li><Link to="/about">Our Story</Link></li>
            <li><Link to="/quality">Quality</Link></li>
            <li><Link to="/sustainability">Sustainability</Link></li>
            <li><Link to="/reviews">Reviews</Link></li>
            <li><Link to="/careers">Careers</Link></li>
            <li><Link to="/press">Press</Link></li>
          </ul>
        </div>

        {/* Legal Column */}
        <div className="footer-col">
          <h4>Legal</h4>
          <ul>
            <li><Link to="/terms">Terms & Conditions</Link></li>
            <li><Link to="/privacy">Privacy Policy</Link></li>
            <li><Link to="/refund">Refund Policy</Link></li>
            <li><Link to="/shipping-policy">Shipping Policy</Link></li>
            <li><Link to="/cookies">Cookies Policy</Link></li>
          </ul>
        </div>

      </div>


    </footer>
  );
};

export default Footer;
