import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  FiTrash2,
  FiPlus,
  FiMinus,
  FiLock,
  FiArrowLeft,
  FiChevronLeft,
  FiChevronRight,
  FiTruck,
  FiShield,
  FiRefreshCw,
  FiCompass,
  FiHeart
} from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Cart.css';

const FREE_SHIPPING_THRESHOLD = 1999;
const DISCOUNT_PERCENT = 10; // 10% auto-applied discount matching the mockup

const Cart = () => {
  const navigate = useNavigate();
  const {
    cartItems,
    cartCount,
    cartSubtotal,
    updateQty,
    removeFromCart,
    clearCart
  } = useCart();

  const [recommendations, setRecommendations] = useState([]);

  // Fetch recommendations from API
  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        const res = await fetch('/api/products');
        if (res.ok) {
          const data = await res.json();
          // Filter out products already in cart
          const cartProductIds = cartItems.map(item => item._id);
          const filtered = data.filter(p => !cartProductIds.includes(p._id));
          setRecommendations(filtered.slice(0, 5));
        }
      } catch (err) {
        console.error('Failed to load recommendations:', err);
      }
    };
    fetchRecommendations();
  }, [cartItems]);

  // Formatting helpers
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(price);
  };

  // Calculations
  const shippingCost = cartSubtotal >= FREE_SHIPPING_THRESHOLD || cartSubtotal === 0 ? 0 : 99;
  const discountAmount = (cartSubtotal * DISCOUNT_PERCENT) / 100;
  const grandTotal = cartSubtotal + shippingCost - discountAmount;

  // Free shipping remaining progress
  const amountAway = FREE_SHIPPING_THRESHOLD - cartSubtotal;
  const progressPercent = Math.min((cartSubtotal / FREE_SHIPPING_THRESHOLD) * 100, 100);

  const handleCheckout = () => {
    navigate('/checkout');
  };

  return (
    <div className="cart-page fade-in">
      {/* Header section */}
      <section className="cart-header-section">
        <div className="container">
          <h1 className="cart-main-title">YOUR CART</h1>
          <div className="cart-breadcrumbs">
            <Link to="/">Home</Link>
            <FiChevronRight className="breadcrumb-arrow" />
            <span className="current-breadcrumb">Cart</span>
          </div>
        </div>
      </section>

      {cartItems.length === 0 ? (
        <section className="empty-cart-section">
          <div className="container empty-cart-box">
            <div className="empty-cart-icon">🛒</div>
            <h2>YOUR CART IS EMPTY</h2>
            <p>You haven't summoned any premium streetwear items to your cart yet.</p>
            <Link to="/shop" className="return-shop-btn">
              RETURN TO SHOP
            </Link>
          </div>
        </section>
      ) : (
        <section className="cart-content-section">
          <div className="container cart-layout-grid">

            {/* Left Column: Cart items list */}
            <div className="cart-items-column">

              <div className="cart-items-header">
                <span className="items-count-label">{cartCount} ITEM{cartCount !== 1 ? 'S' : ''}</span>
                <button className="clear-cart-btn" onClick={clearCart}>
                  CLEAR CART <FiTrash2 className="btn-icon" />
                </button>
              </div>

              <div className="cart-items-list">
                {cartItems.map((item) => (
                  <div key={item.cartItemId} className="cart-item-card">
                    <div className="item-thumbnail">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="item-details">
                      <h3 className="item-name" onClick={() => navigate(`/product/${item._id}`)}>
                        {item.name}
                      </h3>
                      <p className="item-meta">
                        {item.color} &nbsp;•&nbsp; {item.fit}
                      </p>
                      <span className="item-size-tag">
                        Size: {item.size}
                      </span>
                    </div>

                    <div className="item-price-qty-delete">
                      <span className="item-price-display">
                        {formatPrice(item.price)}
                      </span>

                      <div className="item-controls-row">
                        <div className="qty-adjust-box">
                          <button
                            className="qty-adjust-btn"
                            onClick={() => updateQty(item.cartItemId, item.qty - 1)}
                            disabled={item.qty <= 1}
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="qty-number">{item.qty}</span>
                          <button
                            className="qty-adjust-btn"
                            onClick={() => updateQty(item.cartItemId, item.qty + 1)}
                          >
                            <FiPlus size={12} />
                          </button>
                        </div>

                        <button
                          className="item-delete-btn"
                          onClick={() => removeFromCart(item.cartItemId)}
                          title="Remove item"
                        >
                          <FiTrash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Free shipping progress bar */}
              <div className="free-shipping-card">
                <div className="shipping-message-row">
                  <FiTruck className="shipping-truck-icon" />
                  <span>
                    {cartSubtotal >= FREE_SHIPPING_THRESHOLD ? (
                      <strong>You qualify for FREE SHIPPING!</strong>
                    ) : (
                      <>
                        You are <strong>{formatPrice(amountAway)}</strong> away from <strong>FREE SHIPPING</strong>
                      </>
                    )}
                  </span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${progressPercent}%` }}
                  ></div>
                </div>
              </div>

            </div>

            {/* Right Column: Order Summary card */}
            <div className="cart-summary-column">

              <div className="order-summary-box">

                <div className="secure-checkout-header">
                  <FiLock className="lock-icon" />
                  <div className="secure-texts">
                    <span className="secure-title">Secure Checkout</span>
                    <span className="secure-sub">100% secure and encrypted</span>
                  </div>
                </div>

                <h2 className="summary-title">ORDER SUMMARY</h2>

                <div className="summary-rows">
                  <div className="summary-row">
                    <span className="row-label">Subtotal ({cartCount} items)</span>
                    <span className="row-value">{formatPrice(cartSubtotal)}</span>
                  </div>

                  <div className="summary-row">
                    <span className="row-label">Shipping</span>
                    <span className="row-value shipping-free">
                      {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
                    </span>
                  </div>

                  <div className="summary-row discount-row">
                    <span className="row-label">Discount</span>
                    <span className="row-value discount-value">-{formatPrice(discountAmount)}</span>
                  </div>

                  <div className="summary-divider"></div>

                  <div className="summary-row total-row">
                    <span className="total-label">Total</span>
                    <div className="total-value-box">
                      <span className="total-price">{formatPrice(grandTotal)}</span>
                      <span className="tax-inclusive">Inclusive of all taxes</span>
                    </div>
                  </div>
                </div>

                <button className="proceed-checkout-btn" onClick={handleCheckout}>
                  <FiLock size={15} /> PROCEED TO CHECKOUT
                </button>

                <Link to="/shop" className="continue-shopping-btn">
                  CONTINUE SHOPPING <FiArrowLeft className="arrow-left-icon" />
                </Link>

                {/* Accepted Payment badges */}
                <div className="payment-support-box">
                  <span className="payment-label">We accept</span>
                  <div className="payment-logos-row">
                    <div className="payment-badge visa">VISA</div>
                    <div className="payment-badge mastercard">Mastercard</div>
                    <div className="payment-badge rupay">RuPay</div>
                    <div className="payment-badge upi">UPI</div>
                    <div className="payment-badge amex">AMEX</div>
                  </div>
                </div>

              </div>

              {/* Need help widget */}
              {/* <div className="support-help-widget">
                <div className="support-header-row">
                  <span className="support-icon">💬</span>
                  <div className="support-texts">
                    <span className="support-title">Need help?</span>
                    <span className="support-sub">Contact our support team</span>
                  </div>
                </div>
                <FiChevronRight className="support-arrow" />
              </div> */}

            </div>

          </div>
        </section>
      )}

      {/* Recommended Products Slider */}
      {recommendations.length > 0 && (
        <section className="cart-recommendations-section">
          <div className="container">

            <div className="rec-section-header">
              <h2 className="rec-section-title">YOU MAY ALSO LIKE</h2>
              <div className="rec-controls">
                <Link to="/shop" className="rec-view-all">View all</Link>
                <div className="rec-arrows">
                  <button className="rec-arrow-btn"><FiChevronLeft size={16} /></button>
                  <button className="rec-arrow-btn"><FiChevronRight size={16} /></button>
                </div>
              </div>
            </div>

            <div className="rec-products-grid">
              {recommendations.map(p => (
                <div
                  key={p._id}
                  className="rec-product-card"
                  onClick={() => {
                    navigate(`/product/${p._id}`);
                    window.scrollTo(0, 0);
                  }}
                >
                  <div className="rec-card-img-box">
                    <button className="rec-card-wish-btn" onClick={(e) => e.stopPropagation()}>
                      <FiHeart size={14} />
                    </button>
                    <img src={p.image} alt={p.name} className="rec-card-img" />
                  </div>
                  <div className="rec-card-info">
                    <h4 className="rec-card-name">{p.name}</h4>
                    <span className="rec-card-price">{formatPrice(p.price)}</span>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </section>
      )}

      {/* Premium features footer banner */}
      {/* <section className="cart-features-banner">
        <div className="container features-banner-grid">
          
          <div className="feature-item-box">
            <FiTruck className="feature-icon" />
            <div className="feature-texts">
              <span className="feature-title">FREE SHIPPING</span>
              <span className="feature-desc">On orders above {formatPrice(FREE_SHIPPING_THRESHOLD)}</span>
            </div>
          </div>

          <div className="feature-item-box">
            <FiRefreshCw className="feature-icon" />
            <div className="feature-texts">
              <span className="feature-title">EASY RETURNS</span>
              <span className="feature-desc">14 days return policy</span>
            </div>
          </div>

          <div className="feature-item-box">
            <FiShield className="feature-icon" />
            <div className="feature-texts">
              <span className="feature-title">SECURE PAYMENT</span>
              <span className="feature-desc">100% safe & secure</span>
            </div>
          </div>

          <div className="feature-item-box">
            <FiCompass className="feature-icon" />
            <div className="feature-texts">
              <span className="feature-title">EXCLUSIVE DROPS</span>
              <span className="feature-desc">Limited pieces, never restocked</span>
            </div>
          </div>

          <div className="feature-item-box">
            <FiCompass className="feature-icon" />
            <div className="feature-texts">
              <span className="feature-title">JOIN THE COMMUNITY</span>
              <span className="feature-desc">Be part of Unicorn Society</span>
            </div>
          </div>

        </div>
      </section> */}

    </div>
  );
};

export default Cart;
