import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { FiHeart, FiShoppingBag, FiChevronRight, FiTrash2 } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './Wishlist.css';

const Wishlist = () => {
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [cartAddingId, setCartAddingId] = useState(null);

  useEffect(() => {
    const fetchWishlistProducts = async () => {
      setLoading(true);
      try {
        const stored = localStorage.getItem('unicorn_wishlist');
        const wishlistIds = stored ? JSON.parse(stored) : [];

        if (wishlistIds.length === 0) {
          setWishlistItems([]);
          setLoading(false);
          return;
        }

        const res = await fetch('/api/products');
        if (!res.ok) {
          throw new Error('Failed to summon products database.');
        }
        const allProducts = await res.json();
        
        // Filter products present in the wishlistIds
        const filtered = allProducts.filter(p => wishlistIds.includes(p._id));
        setWishlistItems(filtered);
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlistProducts();
  }, []);

  const handleRemove = (productId) => {
    const stored = localStorage.getItem('unicorn_wishlist');
    let wishlistIds = stored ? JSON.parse(stored) : [];
    wishlistIds = wishlistIds.filter(id => id !== productId);
    localStorage.setItem('unicorn_wishlist', JSON.stringify(wishlistIds));
    setWishlistItems(prev => prev.filter(p => p._id !== productId));
  };

  const handleAddToCart = (product) => {
    setCartAddingId(product._id);
    const selectedSize = product.sizes && product.sizes.length > 0 ? product.sizes[0] : 'One Size';
    
    setTimeout(() => {
      addToCart(product, selectedSize, 1);
      setCartAddingId(null);
      alert(`${product.name} (Size: ${selectedSize}) has been added to your cart.`);
    }, 600);
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  if (loading) {
    return (
      <div className="wishlist-loading-screen">
        <div className="spinner"></div>
        <p>SUMMONING WISHLIST ITEMS...</p>
      </div>
    );
  }

  return (
    <div className="wishlist-page fade-in">
      <section className="wishlist-header">
        <div className="container">
          <h1 className="wishlist-main-title">YOUR WISHLIST</h1>
          <div className="wishlist-breadcrumbs">
            <Link to="/">Home</Link>
            <FiChevronRight className="breadcrumb-arrow" />
            <span className="current-breadcrumb">Wishlist</span>
          </div>
        </div>
      </section>

      <section className="wishlist-content-section">
        <div className="container">
          {error && <div className="wishlist-error-msg">{error}</div>}

          {wishlistItems.length === 0 ? (
            <div className="wishlist-empty-box">
              <div className="wishlist-empty-icon-wrapper">
                <FiHeart className="empty-heart-icon" />
              </div>
              <h2 className="empty-heading">YOUR WISHLIST IS EMPTY</h2>
              <p className="empty-text">
                Explore our collections and add items to your wishlist to save them for later.
              </p>
              <Link to="/shop" className="return-shop-btn">RETURN TO SHOP</Link>
            </div>
          ) : (
            <div className="wishlist-grid">
              {wishlistItems.map((item) => (
                <div key={item._id} className="wishlist-card">
                  {/* Card Thumbnail */}
                  <div className="wishlist-thumb-box" onClick={() => navigate(`/product/${item._id}`)}>
                    {item.badge && <span className="wishlist-badge">{item.badge}</span>}
                    <img src={item.image} alt={item.name} className="wishlist-img" />
                    
                    {/* Floating Delete button */}
                    <button 
                      className="wishlist-delete-btn" 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemove(item._id);
                      }}
                      title="Remove item"
                    >
                      <FiTrash2 />
                    </button>
                  </div>

                  {/* Card Content details */}
                  <div className="wishlist-card-details">
                    <h3 className="wishlist-card-name" onClick={() => navigate(`/product/${item._id}`)}>
                      {item.name}
                    </h3>
                    <p className="wishlist-card-category">{item.category}</p>
                    <div className="wishlist-card-price-row">
                      <span className="wishlist-price">{formatPrice(item.price)}</span>
                      {item.comparePrice && (
                        <span className="wishlist-compare-price">{formatPrice(item.comparePrice)}</span>
                      )}
                    </div>

                    <button 
                      className="wishlist-add-cart-btn"
                      onClick={() => handleAddToCart(item)}
                      disabled={cartAddingId === item._id}
                    >
                      <FiShoppingBag /> {cartAddingId === item._id ? 'ADDING TO CART...' : 'ADD TO CART'}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Wishlist;
