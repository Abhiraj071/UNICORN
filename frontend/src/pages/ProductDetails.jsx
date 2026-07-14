import { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  FiHeart, 
  FiChevronRight, 
  FiPlus, 
  FiMinus, 
  FiShoppingBag, 
  FiTruck, 
  FiShield, 
  FiRefreshCw,
  FiMaximize2,
  FiChevronLeft,
  FiX
} from 'react-icons/fi';
import './ProductDetails.css';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';

const TABS = [
  'DESCRIPTION',
  'SHIPPING',
  'RETURNS',
  'SIZE GUIDE',
  'MATERIAL & CARE',
  'REVIEWS'
];

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { user, api } = useAuth();
  
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Selection States
  const [activeImage, setActiveImage] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [wishlist, setWishlist] = useState([]);
  const [activeTab, setActiveTab] = useState('DESCRIPTION');
  const [showToast, setShowToast] = useState(false);
  const [buttonState, setButtonState] = useState('idle');
  
  // Recommendations
  const [relatedProducts, setRelatedProducts] = useState([]);

  // Reviews states
  const [reviews, setReviews] = useState([]);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState('');
  const [reviewStatusMsg, setReviewStatusMsg] = useState('');

  // Fetch product detail, related recommendations, and reviews
  useEffect(() => {
    const fetchProductAndRelated = async () => {
      setLoading(true);
      try {
        // Fetch current product
        const res = await fetch(`/api/products/${id}`);
        if (!res.ok) {
          throw new Error('Product not found in the shadows.');
        }
        const data = await res.json();
        setProduct(data);
        setActiveImage(data.image);
        if (data.sizes && data.sizes.length > 0) {
          setSelectedSize(data.sizes[0]);
        } else {
          setSelectedSize('One Size');
        }

        // Fetch reviews
        const revRes = await fetch(`/api/reviews/product/${id}`);
        if (revRes.ok) {
          const revData = await revRes.json();
          setReviews(revData);
        }

        // Fetch all products to filter recommendations
        const allRes = await fetch('/api/products');
        if (allRes.ok) {
          const allData = await allRes.json();
          // Filter out current product, and prioritize same category or collection
          const filtered = allData.filter(p => p._id !== id);
          const matched = filtered.filter(p => p.category === data.category);
          const others = filtered.filter(p => p.category !== data.category);
          // Combine same category first, slice 4 items
          const merged = [...matched, ...others].slice(0, 4);
          setRelatedProducts(merged);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProductAndRelated();
  }, [id]);

  // Handle Review submission
  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!newComment || newComment.trim() === '') return;
    try {
      await api.post('/api/reviews', {
        product: id,
        rating: newRating,
        comment: newComment
      });
      setNewComment('');
      setNewRating(5);
      setReviewStatusMsg('Thank you! Your review has been submitted and is pending moderation.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to submit review.');
    }
  };

  // Adjust quantity
  const handleQuantityChange = (type) => {
    if (type === 'inc') {
      setQuantity(prev => prev + 1);
    } else if (type === 'dec' && quantity > 1) {
      setQuantity(prev => prev - 1);
    }
  };

  // Toggle wishlist state
  const handleWishlistToggle = () => {
    if (wishlist.includes(id)) {
      setWishlist(wishlist.filter(item => item !== id));
    } else {
      setWishlist([...wishlist, id]);
    }
  };

  // Generate delivery dates dynamically (e.g. today + 3 to 6 days)
  const getDeliveryDateRange = () => {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    
    const dateStart = new Date();
    dateStart.setDate(dateStart.getDate() + 3);
    const dateEnd = new Date();
    dateEnd.setDate(dateEnd.getDate() + 6);
    
    return `${dateStart.getDate()} ${months[dateStart.getMonth()]} – ${dateEnd.getDate()} ${months[dateEnd.getMonth()]}`;
  };

  if (loading) {
    return (
      <div className="product-details-loading">
        <div className="spinner"></div>
        <p>SUMMONING PRODUCT DETAILS...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="product-details-error">
        <h2>AN ERROR OCCURRED</h2>
        <p>{error || 'Product details could not be found.'}</p>
        <Link to="/shop" className="back-to-shop-btn">RETURN TO SHOP</Link>
      </div>
    );
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0;

  // Gallery Images - Create a list of 4 thumbnail values (if gallery has < 4, repeat or use related images)
  const galleryImages = [
    product.image,
    ...(product.gallery || []),
    // Extra visual thumbnails to make it look full and rich (gothic style)
    '/images/11.png',
    '/images/12.png',
    '/images/13.png'
  ].slice(0, 5); // display up to 5 thumbnails in side panel

  // Price Formatter
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="product-details-page fade-in">
      {/* Breadcrumb Navigation bar */}
      <section className="details-breadcrumbs-nav">
        <div className="container">
          <div className="breadcrumbs">
            <Link to="/">Home</Link>
            <FiChevronRight className="breadcrumb-divider" />
            <Link to="/shop">Shop</Link>
            <FiChevronRight className="breadcrumb-divider" />
            <span className="breadcrumb-cat">{product.category}</span>
            <FiChevronRight className="breadcrumb-divider" />
            <span className="current-page">{product.name}</span>
          </div>
        </div>
      </section>

      {/* Main product column section */}
      <section className="details-main-section">
        <div className="container main-content-layout">
          
          {/* Left Column: Image Gallery Stack */}
          <div className="gallery-column">
            <div className="thumbnails-stack-left">
              {galleryImages.map((imgUrl, idx) => (
                <div 
                  key={idx}
                  className={`thumbnail-box ${activeImage === imgUrl ? 'active-thumbnail' : ''}`}
                  onClick={() => setActiveImage(imgUrl)}
                >
                  <img src={imgUrl} alt={`${product.name} thumbnail ${idx + 1}`} />
                </div>
              ))}
            </div>
            
            <div className="main-preview-right">
              {/* Expand click triggers visual preview */}
              <button className="expand-view-btn" title="View Fullscreen">
                <FiMaximize2 size={16} />
              </button>
              <img src={activeImage} alt={product.name} className="main-active-image" />
            </div>
          </div>

          {/* Right Column: Information Panel */}
          <div className="info-column">
            
            {/* Badge Indicator */}
            {product.badge && (
              <span className="details-badge">
                {product.badge}
              </span>
            )}

            {/* Product Title Heading */}
            <h1 className="details-product-title">{product.name}</h1>
            
            {/* Tagline */}
            <p className="details-tagline">Wear the darkness. Stand as the guardian.</p>

            {/* Product Specific Specs grid */}
            <div className="specs-highlight-grid">
              <div className="spec-card-box">
                <div className="spec-icon-label">
                  <span className="icon-badge-box">⚙</span>
                  <span className="spec-main-text">{product.gsm ? `${product.gsm} GSM` : 'Heavyweight'}</span>
                </div>
                <span className="spec-sub-text">{product.fabric ? product.fabric.split(' ')[0] : 'Heavyweight'} Fabric</span>
              </div>

              <div className="spec-card-box">
                <div className="spec-icon-label">
                  <span className="icon-badge-box">👕</span>
                  <span className="spec-main-text">{(product.fit || 'Oversized').toUpperCase()} FIT</span>
                </div>
                <span className="spec-sub-text">Relaxed & Comfortable</span>
              </div>

              <div className="spec-card-box">
                <div className="spec-icon-label">
                  <span className="icon-badge-box">✦</span>
                  <span className="spec-main-text">{product.limited ? 'LIMITED EDITION' : 'CORE COLLECTION'}</span>
                </div>
                <span className="spec-sub-text">{product.limited ? 'Few Pieces Left' : 'Essential Item'}</span>
              </div>

              <div className="spec-card-box">
                <div className="spec-icon-label">
                  <span className="icon-badge-box">🛡</span>
                  <span className="spec-main-text">EASY RETURNS</span>
                </div>
                <span className="spec-sub-text">Hassle Free</span>
              </div>
            </div>

            {/* Price display */}
            <div className="details-price-row">
              <span className="details-price">{formatPrice(product.price)}</span>
              {product.comparePrice && (
                <span className="details-compare-price">{formatPrice(product.comparePrice)}</span>
              )}
            </div>

            {/* Stock status indicator */}
            <div className="stock-status-wrapper">
              <span className="status-green-dot"></span>
              <div className="status-texts">
                <span className="status-title">In Stock</span>
                <span className="status-sub">Ready to ship ({product.countInStock || 10} available)</span>
              </div>
            </div>

            {/* Product short description */}
            <p className="details-short-description">
              {product.description} Crafted with focus on streetwear sizing, aesthetics, and maximum build durability.
            </p>

            {/* Size Select Block */}
            <div className="details-size-section">
              <div className="size-section-header">
                <span className="size-label-title">SIZE</span>
                <button className="size-guide-btn">📏 Size Guide</button>
              </div>
              <div className="sizes-btn-row">
                {product.sizes && product.sizes.length > 0 ? (
                  product.sizes.map(size => (
                    <button 
                      key={size}
                      className={`size-select-btn ${selectedSize === size ? 'active-size-select' : ''}`}
                      onClick={() => setSelectedSize(size)}
                    >
                      {size}
                    </button>
                  ))
                ) : (
                  <button className="size-select-btn active-size-select">One Size</button>
                )}
              </div>
            </div>

            {/* Quantity and Wishlist Row */}
            <div className="qty-wishlist-row">
              <div className="quantity-select-box">
                <button className="qty-btn" onClick={() => handleQuantityChange('dec')}>
                  <FiMinus size={14} />
                </button>
                <span className="qty-number-display">{quantity}</span>
                <button className="qty-btn" onClick={() => handleQuantityChange('inc')}>
                  <FiPlus size={14} />
                </button>
              </div>

              <button 
                className={`details-wishlist-btn ${wishlist.includes(id) ? 'wishlisted' : ''}`}
                onClick={handleWishlistToggle}
              >
                <FiHeart className="heart-icon-spec" />
                {wishlist.includes(id) ? 'REMOVE FROM WISHLIST' : 'ADD TO WISHLIST'}
              </button>
            </div>

            {/* Purchase buttons */}
            <div className="purchase-buttons-row">
              <button 
                className={`add-to-cart-btn ${buttonState !== 'idle' ? 'animating' : ''} ${buttonState === 'added' ? 'success' : ''}`}
                onClick={() => {
                  if (buttonState !== 'idle') return;
                  setButtonState('adding');
                  setTimeout(() => {
                    addToCart(product, selectedSize, quantity);
                    setButtonState('added');
                    setShowToast(true);
                    setTimeout(() => setShowToast(false), 4000);
                    setTimeout(() => {
                      setButtonState('idle');
                    }, 2000);
                  }, 600);
                }}
                disabled={buttonState === 'adding'}
              >
                {buttonState === 'idle' && (
                  <>
                    <FiShoppingBag className="btn-icon-pad" /> ADD TO CART
                  </>
                )}
                {buttonState === 'adding' && (
                  <span className="button-loading-text">ADDING...</span>
                )}
                {buttonState === 'added' && (
                  <span className="button-success-text">✓ ADDED!</span>
                )}
              </button>
              <button 
                className="buy-now-btn"
                onClick={() => {
                  addToCart(product, selectedSize, quantity);
                  navigate('/cart');
                }}
              >
                ⚡ BUY IT NOW
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* Tabs description block */}
      <section className="details-tabs-section">
        <div className="container">
          <div className="tabs-header-row">
            {TABS.map(tab => (
              <button 
                key={tab}
                className={`tab-btn-header ${activeTab === tab ? 'tab-btn-active' : ''}`}
                onClick={() => setActiveTab(tab)}
              >
                {tab}
              </button>
            ))}
          </div>

          <div className="tab-body-content">
            {activeTab === 'DESCRIPTION' && (
              <div className="tab-pane desc-tab-pane">
                <p className="tab-pane-paragraph">
                  {product.description} It integrates seamlessly with street styling configurations and offers elevated durability via double needle stitching and shoulder reinforcement.
                </p>

                {/* Service badges and shipping info relocated here */}
                <div className="service-info-footer-box" style={{ marginBottom: '2rem' }}>
                  <div className="service-info-row">
                    <FiTruck className="info-badge-icon" />
                    <p className="info-row-desc">
                      Order now and get it between <strong>{getDeliveryDateRange()}</strong>
                    </p>
                  </div>
                  <div className="service-info-row">
                    <FiTruck className="info-badge-icon" />
                    <p className="info-row-desc">
                      <strong>Free Shipping</strong> on orders above ₹1299
                    </p>
                  </div>
                  <div className="service-info-row">
                    <FiShield className="info-badge-icon" />
                    <p className="info-row-desc">
                      <strong>Secure Payment</strong> 100% safe & encrypted
                    </p>
                  </div>
                  <div className="service-info-row">
                    <FiRefreshCw className="info-badge-icon" />
                    <p className="info-row-desc">
                      <strong>Easy Returns</strong> 14 days return policy
                    </p>
                  </div>
                </div>

                <div className="specs-details-grid-footer">
                  <div className="detail-row">
                    <span className="detail-label-footer">Fabric</span>
                    <span className="detail-value-footer">{product.fabric || '100% Heavyweight Cotton'}</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label-footer">Fit</span>
                    <span className="detail-value-footer">{(product.fit || 'Oversized')} Fit, Dropped Shoulders</span>
                  </div>
                  <div className="detail-row">
                    <span className="detail-label-footer">Feel</span>
                    <span className="detail-value-footer">
                      {product.gsm && product.gsm >= 300 ? 'Soft Yet Heavy, Built to Last' : 'Smooth, Highly Breathable, Premium Touch'}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'SHIPPING' && (
              <div className="tab-pane shipping-tab-pane">
                <p className="tab-pane-paragraph">
                  All streetwear orders are packaged in custom UNICORN protective dust-bags and processed within 24-48 hours. Shipping timelines are as follows:
                </p>
                <ul className="details-bullets-list">
                  <li>Metro Cities: 3 - 4 business days</li>
                  <li>Other Regions: 4 - 6 business days</li>
                  <li>Tracking links will be shared via Email and WhatsApp immediately after dispatch.</li>
                </ul>
              </div>
            )}

            {activeTab === 'RETURNS' && (
              <div className="tab-pane returns-tab-pane">
                <p className="tab-pane-paragraph">
                  We offer a hassle-free 14 days return and exchange window on all items. 
                </p>
                <ul className="details-bullets-list">
                  <li>Items must be returned in their original condition: unworn, unwashed, and with all tags attached.</li>
                  <li>We provide complimentary reverse pickups across all eligible pin codes.</li>
                  <li>Refunds will be processed to the original payment method or as store credit.</li>
                </ul>
              </div>
            )}

            {activeTab === 'SIZE GUIDE' && (
              <div className="tab-pane size-guide-tab-pane">
                <p className="tab-pane-paragraph">
                  Our streetwear garments are designed with a relaxed, dropped-shoulder silhouette. If you prefer a regular fit, we recommend ordering one size down.
                </p>
                <table className="size-guide-chart-table">
                  <thead>
                    <tr>
                      <th>Size</th>
                      <th>Chest (inches)</th>
                      <th>Length (inches)</th>
                      <th>Sleeve (inches)</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td>XS</td>
                      <td>40"</td>
                      <td>26.5"</td>
                      <td>8"</td>
                    </tr>
                    <tr>
                      <td>S</td>
                      <td>42"</td>
                      <td>27.5"</td>
                      <td>8.5"</td>
                    </tr>
                    <tr>
                      <td>M</td>
                      <td>44"</td>
                      <td>28.5"</td>
                      <td>9"</td>
                    </tr>
                    <tr>
                      <td>L</td>
                      <td>46"</td>
                      <td>29.5"</td>
                      <td>9.5"</td>
                    </tr>
                    <tr>
                      <td>XL</td>
                      <td>48"</td>
                      <td>30.5"</td>
                      <td>10"</td>
                    </tr>
                    <tr>
                      <td>XXL</td>
                      <td>50"</td>
                      <td>31.5"</td>
                      <td>10.5"</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}

            {activeTab === 'MATERIAL & CARE' && (
              <div className="tab-pane care-tab-pane">
                <p className="tab-pane-paragraph">
                  Follow care guidelines to preserve the premium prints, fabric structure, and color depths:
                </p>
                <ul className="details-bullets-list">
                  <li>Machine wash cold, inside out, on a gentle cycle.</li>
                  <li>Avoid bleach or optical softeners. Use mild liquid detergents.</li>
                  <li>Tumble dry low or air dry in the shade.</li>
                  <li>Do not iron directly over screen prints or embroidery work. Iron inside out if needed.</li>
                </ul>
              </div>
            )}

            {activeTab === 'REVIEWS' && (
              <div className="tab-pane reviews-tab-pane" style={{ color: 'var(--text-color)' }}>
                <div className="reviews-summary-row" style={{ display: 'flex', gap: '2rem', marginBottom: '2rem', paddingBottom: '1.5rem', borderBottom: '1px solid var(--border-color)', alignItems: 'center', flexWrap: 'wrap' }}>
                  <div className="avg-rating-box" style={{ textAlign: 'center', minWidth: '150px', padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderRadius: '4px', border: '1px solid rgba(255,255,255,0.05)' }}>
                    <div className="avg-rating-val" style={{ fontSize: '3rem', fontWeight: 'bold', color: 'var(--color-gold)' }}>
                      {averageRating > 0 ? averageRating : 'N/A'}
                    </div>
                    <div className="avg-rating-stars" style={{ color: 'var(--color-gold)', fontSize: '1.2rem', margin: '0.25rem 0' }}>
                      {averageRating > 0 ? '★'.repeat(Math.round(averageRating)) + '☆'.repeat(5 - Math.round(averageRating)) : '☆☆☆☆☆'}
                    </div>
                    <div className="avg-rating-count" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                      Based on {reviews.length} {reviews.length === 1 ? 'review' : 'reviews'}
                    </div>
                  </div>
                  
                  <div className="rating-distribution" style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.25rem', minWidth: '200px' }}>
                    {[5, 4, 3, 2, 1].map(stars => {
                      const count = reviews.filter(r => r.rating === stars).length;
                      const percent = reviews.length > 0 ? (count / reviews.length) * 100 : 0;
                      return (
                        <div key={stars} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', fontSize: '0.75rem' }}>
                          <span style={{ minWidth: '20px', color: 'var(--text-muted)' }}>{stars}★</span>
                          <div style={{ flex: 1, height: '6px', backgroundColor: 'rgba(255,255,255,0.05)', borderRadius: '3px', overflow: 'hidden' }}>
                            <div style={{ width: `${percent}%`, height: '100%', backgroundColor: 'var(--color-gold)' }}></div>
                          </div>
                          <span style={{ minWidth: '25px', color: 'var(--text-muted)' }}>{count}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="reviews-split-grid" style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: '2.5rem', alignItems: 'start' }}>
                  {/* Left: Reviews List */}
                  <div className="reviews-list-col" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <h4 style={{ fontSize: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Customer Feedback</h4>
                    {reviews.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.85rem' }}>No reviews yet for this product. Be the first to review!</p>
                    ) : (
                      reviews.map(r => (
                        <div key={r._id} className="review-card" style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.4rem', fontSize: '0.8rem' }}>
                            <span style={{ fontWeight: '600', color: 'var(--color-gold)' }}>{r.user?.name || 'Anonymous User'}</span>
                            <span style={{ color: 'var(--text-muted)' }}>{new Date(r.createdAt).toLocaleDateString()}</span>
                          </div>
                          <div style={{ color: 'var(--color-gold)', fontSize: '0.75rem', marginBottom: '0.5rem' }}>
                            {'★'.repeat(r.rating) + '☆'.repeat(5 - r.rating)}
                          </div>
                          <p style={{ fontSize: '0.85rem', lineHeight: '1.5', fontStyle: 'italic', color: 'rgba(255,255,255,0.9)' }}>"{r.comment}"</p>
                        </div>
                      ))
                    )}
                  </div>

                  {/* Right: Submit Review Form */}
                  <div className="submit-review-col">
                    {user ? (
                      <div className="graphics-card" style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '4px' }}>
                        <h4 style={{ marginBottom: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', textTransform: 'uppercase', fontSize: '0.9rem', letterSpacing: '1px' }}>Write a Review</h4>
                        
                        {reviewStatusMsg ? (
                          <div style={{ padding: '1rem', backgroundColor: 'rgba(40,167,69,0.08)', color: 'var(--color-success)', border: '1px solid rgba(40,167,69,0.3)', borderRadius: '4px', textAlign: 'center', fontSize: '0.85rem', lineHeight: '1.4' }}>
                            {reviewStatusMsg}
                          </div>
                        ) : (
                          <form onSubmit={handleReviewSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                            <div className="form-group-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>RATING *</label>
                              <div className="rating-select-stars" style={{ display: 'flex', gap: '0.5rem', fontSize: '1.5rem', color: 'var(--color-gold)', cursor: 'pointer' }}>
                                {[1, 2, 3, 4, 5].map(stars => (
                                  <span 
                                    key={stars} 
                                    onClick={() => setNewRating(stars)}
                                    title={`${stars} Stars`}
                                  >
                                    {stars <= newRating ? '★' : '☆'}
                                  </span>
                                ))}
                              </div>
                            </div>
                            <div className="form-group-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                              <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: '600' }}>COMMENT *</label>
                              <textarea 
                                placeholder="Share your experience wearing this piece..." 
                                value={newComment}
                                onChange={(e) => setNewComment(e.target.value)}
                                className="gothic-input" 
                                style={{ minHeight: '90px', resize: 'vertical', padding: '0.6rem', fontSize: '0.85rem' }}
                                required 
                              />
                            </div>
                            <button type="submit" className="summon-action-cta-btn" style={{ width: '100%', marginTop: '0.5rem' }}>SUBMIT REVIEW</button>
                          </form>
                        )}
                      </div>
                    ) : (
                      <div className="graphics-card" style={{ padding: '1.5rem', textAlign: 'center', border: '1px dashed var(--border-color)', borderRadius: '4px', backgroundColor: 'rgba(255,255,255,0.01)' }}>
                        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>You must be logged in to write a review.</p>
                        <Link to="/login" className="summon-action-cta-btn" style={{ display: 'inline-block', marginTop: '1rem', padding: '0.5rem 1.5rem', fontSize: '0.8rem', textDecoration: 'none' }}>LOGIN NOW</Link>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Related Products Section */}
      <section className="details-related-section">
        <div className="container">
          <div className="related-section-header">
            <h2 className="related-section-title">YOU MAY ALSO LIKE</h2>
            <div className="carousel-controls-right">
              <span className="view-all-link">View all</span>
              <div className="arrow-controls-btns">
                <button className="carousel-arrow-btn"><FiChevronLeft size={16} /></button>
                <button className="carousel-arrow-btn"><FiChevronRight size={16} /></button>
              </div>
            </div>
          </div>

          <div className="related-products-grid">
            {relatedProducts.map(relProduct => (
              <div 
                key={relProduct._id} 
                className="related-product-card"
                onClick={() => {
                  navigate(`/product/${relProduct._id}`);
                  window.scrollTo(0, 0);
                }}
              >
                <div className="rel-card-image-box">
                  <button className="rel-card-wish-btn" onClick={(e) => e.stopPropagation()}>
                    <FiHeart size={14} />
                  </button>
                  <img src={relProduct.image} alt={relProduct.name} className="rel-card-image" />
                </div>
                <div className="rel-card-info-box">
                  <h4 className="rel-card-title">{relProduct.name}</h4>
                  <span className="rel-card-price">{formatPrice(relProduct.price)}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Toast Notification */}
      {showToast && (
        <div className="cart-toast-notification">
          <img src={product.image} alt={product.name} className="toast-img" />
          <div className="toast-content">
            <span className="toast-title">Summoned to Cart</span>
            <span className="toast-product-name">{product.name}</span>
            <span className="toast-meta">Size: {selectedSize} &nbsp;•&nbsp; Qty: {quantity}</span>
          </div>
          <div className="toast-actions">
            <Link to="/cart" className="toast-view-cart">VIEW CART</Link>
            <button className="toast-close-btn" onClick={() => setShowToast(false)}>
              <FiX size={16} />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductDetails;
