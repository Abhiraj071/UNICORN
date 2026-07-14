import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  FiSearch as Search, 
  FiHeart as Heart, 
  FiUser as User, 
  FiShoppingBag as Bag, 
  FiMenu as Menu, 
  FiX as X,
  FiChevronRight as ChevronRight,
  FiPackage as Package,
  FiLogIn as LogIn,
  FiLogOut as LogOut
} from 'react-icons/fi';
import './Navbar.css';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';

const Navbar = ({ showCompletionBanner }) => {
  const { cartCount, animateCart } = useCart();
  const { user, logout } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [bannerDismissed, setBannerDismissed] = useState(
    sessionStorage.getItem('unicorn_profile_banner_dismissed') === 'true'
  );

  const handleDismissBanner = () => {
    sessionStorage.setItem('unicorn_profile_banner_dismissed', 'true');
    setBannerDismissed(true);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <>
      <header className={`navbar ${scrolled ? 'scrolled' : ''}`}>
        <div className="navbar-container">
          
          {/* Left Side: Desktop (Search + Links) | Mobile (Hamburger) */}
          <div className="nav-left">
            <button className="icon-btn mobile-menu-btn" onClick={() => setMobileMenuOpen(true)}>
              <Menu size={24} />
            </button>
            <div className="desktop-left-content">
              <button className="icon-btn search-btn">
                <Search size={20} />
              </button>
              <nav className="desktop-nav">
                <Link to="/shop">Shop</Link>
                <Link to="/collections">Collections</Link>
                <Link to="/limited-drops" style={{ color: '#d4af37', fontWeight: '600' }}>Limited Drops</Link>
              </nav>
            </div>
          </div>

          {/* Center: Logo */}
          <div className="nav-center">
            <Link to="/" className="logo">
              UNIC<span className="logo-o-wrapper">
                <svg viewBox="0 0 100 100" className="logo-o-svg">
                  <circle cx="50" cy="50" r="38" stroke="currentColor" strokeWidth="9" fill="none" />
                  <path d="M50 22 L53 47 L78 50 L53 53 L50 78 L47 53 L22 50 L47 47 Z" fill="currentColor" />
                </svg>
              </span>RN
            </Link>
          </div>

          {/* Right Side: Desktop (Links + Icons) | Mobile (Icons) */}
          <div className="nav-right">
            <nav className="desktop-nav">
              <Link to="/about">About</Link>
              <Link to="/contact">Contact</Link>
              {user && user.isAdmin && (
                <Link to="/admin" className="admin-portal-nav-link" style={{ color: '#d4a359', fontWeight: '600' }}>Admin Panel</Link>
              )}
            </nav>
            <div className="nav-divider desktop-only"></div>
            <div className="nav-icons">
              <Link to="/wishlist" className="icon-link">
                <Heart size={20} />
              </Link>
              <Link to={user ? "/account" : "/login"} className="icon-link" title={user ? `Account (${user.name})` : "Login / Register"}>
                <User size={20} style={user ? { color: '#d4a359' } : {}} />
              </Link>
              <Link to="/cart" className={`icon-link cart-icon ${animateCart ? 'bounce-animate' : ''}`}>
                <Bag size={20} />
                {cartCount > 0 && <span className="cart-badge">{cartCount}</span>}
              </Link>
            </div>
          </div>
        </div>
        {showCompletionBanner && !bannerDismissed && (
          <div className="profile-completion-banner">
            <div className="completion-banner-content">
              <span>Complete your profile: add your phone number and shipping details.</span>
              <Link to="/complete-profile" className="completion-link">
                Complete Details <ChevronRight size={14} />
              </Link>
            </div>
            <button className="banner-close-btn" onClick={handleDismissBanner} aria-label="Dismiss banner">
              <X size={14} />
            </button>
          </div>
        )}
      </header>

      {/* Mobile Menu Overlay */}
      <div className={`mobile-menu ${mobileMenuOpen ? 'open' : ''}`}>
        <div className="mobile-menu-header">
          <div className="spacer"></div>
          <Link to="/" className="logo" onClick={() => setMobileMenuOpen(false)}>UNICORN</Link>
          <button className="icon-btn close-btn" onClick={() => setMobileMenuOpen(false)}>
            <X size={28} />
          </button>
        </div>
        
        <nav className="mobile-nav-links">
          <Link to="/shop" onClick={() => setMobileMenuOpen(false)}>
            SHOP <ChevronRight size={20} />
          </Link>
          <Link to="/collections" onClick={() => setMobileMenuOpen(false)}>
            COLLECTIONS <ChevronRight size={20} />
          </Link>
          <Link to="/limited-drops" onClick={() => setMobileMenuOpen(false)} style={{ color: '#d4af37' }}>
            LIMITED DROPS <ChevronRight size={20} />
          </Link>
          <Link to="/about" onClick={() => setMobileMenuOpen(false)}>
            ABOUT <ChevronRight size={20} />
          </Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)}>
            CONTACT <ChevronRight size={20} />
          </Link>
        </nav>
        
        <div className="mobile-nav-bottom">
          <Link to="/wishlist" onClick={() => setMobileMenuOpen(false)}>
            <Heart size={20}/> WISHLIST
          </Link>
          {user ? (
            <>
              {user.isAdmin && (
                <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#d4a359' }}>
                  <User size={20}/> ADMIN PANEL
                </Link>
              )}
              <Link to="/account" onClick={() => setMobileMenuOpen(false)}>
                <User size={20}/> ACCOUNT ({user.name})
              </Link>
              <a href="#" onClick={(e) => { e.preventDefault(); logout(); setMobileMenuOpen(false); }} className="mobile-logout-link">
                <LogOut size={20}/> LOGOUT
              </a>
            </>
          ) : (
            <>
              <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                <LogIn size={20}/> LOGIN / REGISTER
              </Link>
            </>
          )}
          <Link to="/track-order" onClick={() => setMobileMenuOpen(false)}>
            <Package size={20}/> TRACK ORDER
          </Link>
        </div>
      </div>
    </>
  );
};

export default Navbar;
