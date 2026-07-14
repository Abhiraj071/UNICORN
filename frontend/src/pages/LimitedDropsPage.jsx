import { useState, useEffect } from 'react';
import { FiClock, FiShoppingBag, FiLock, FiCheckCircle } from 'react-icons/fi';
import { useCart } from '../context/CartContext';
import './LimitedDropsPage.css';

const LimitedDropsPage = () => {
  const { addToCart } = useCart();
  const [drops, setDrops] = useState(() => {
    const saved = localStorage.getItem('admin_limited_drops');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        // Fallback
      }
    }
    return [];
  });

  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const handleStorageChange = () => {
      const saved = localStorage.getItem('admin_limited_drops');
      if (saved) {
        try {
          setDrops(JSON.parse(saved));
        } catch (e) {}
      }
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  };

  const getCountdown = (launchDate) => {
    const diffMs = new Date(launchDate) - currentTime;
    if (diffMs <= 0) return null;

    const diffSecs = Math.floor(diffMs / 1000);
    const days = Math.floor(diffSecs / (3600 * 24));
    const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
    const mins = Math.floor((diffSecs % 3600) / 60);
    const secs = diffSecs % 60;

    return {
      days,
      hours: String(hours).padStart(2, '0'),
      minutes: String(mins).padStart(2, '0'),
      seconds: String(secs).padStart(2, '0')
    };
  };

  const handleBuyDropItem = (drop) => {
    try {
      if (!drop || !drop.stock || drop.stock <= 0) return;

      const productObj = {
        _id: drop._id,
        name: drop.name,
        price: drop.price,
        image: drop.image,
        color: 'Obsidian Black',
        fit: 'Limited Release Cut'
      };

      addToCart(productObj, 'M', 1);

      const updatedDrops = drops.map(d => {
        if (d._id === drop._id) {
          const newStock = Math.max(0, d.stock - 1);
          return { ...d, stock: newStock };
        }
        return d;
      });

      setDrops(updatedDrops);
      localStorage.setItem('admin_limited_drops', JSON.stringify(updatedDrops));
      // Trigger storage event to update other windows
      window.dispatchEvent(new Event('storage'));
    } catch (err) {
      alert("Click Error: " + err.message + "\nStack: " + err.stack);
      console.error(err);
    }
  };

  try {
    return (
      <div className="storefront-drops-container">
        <div className="drops-header-banner">
          <span className="gold-sub-heading">UNICORN SYSTEM STATUS: CALIBRATING</span>
          <h1 className="drops-main-title">OBSIDIAN LIMITED DROPS</h1>
          <p className="drops-sub-title">
            Exquisite high-fashion releases summoned for the dark soul. Once a drop reaches zero allocation, it is archived forever into the shadow vault.
          </p>
          <div className="master-clock-display">
            <FiClock className="clock-icon pulsing-glow" />
            <span>SERVER TIME: {currentTime.toLocaleTimeString()}</span>
          </div>
        </div>

        {drops.length === 0 ? (
          <div className="empty-gothic-state">
            <FiLock size={48} className="empty-illustration-icon" style={{ color: 'var(--color-gold)' }} />
            <h3>No Active Releases</h3>
            <p>The shadow vault is currently sealed. Check back later for limited edition luxury summonings.</p>
          </div>
        ) : (
          <div className="drops-grid-container">
            {drops.map(d => {
              const launchTime = new Date(d.launchDate);
              const timeDiff = launchTime - currentTime;
              const isLive = timeDiff <= 0 && d.stock > 0;
              const isSoldOut = d.stock <= 0;
              const countdown = getCountdown(d.launchDate);

              return (
                <div 
                  key={d._id} 
                  className={`drop-release-card ${isSoldOut ? 'sold-out' : isLive ? 'live' : 'scheduled'}`}
                >
                  {isSoldOut && <div className="archived-watermark">VAULTED</div>}
                  
                  <div className="drop-card-image-wrapper">
                    <img src={d.image} alt={d.name} className="drop-card-image" />
                    {isLive ? (
                      <span className="live-pill-tag">
                        <span className="live-pulsing-dot"></span> LIVE RELEASE
                      </span>
                    ) : isSoldOut ? (
                      <span className="soldout-pill-tag">ARCHIVED</span>
                    ) : (
                      <span className="scheduled-pill-tag">
                        <FiLock size={12} /> SECURED LOCK
                      </span>
                    )}
                  </div>

                  <div className="drop-card-content-block">
                    <div className="drop-card-meta-row">
                      <span className="drop-id-font">{d._id}</span>
                      <span className="drop-price-font">{formatPrice(d.price)}</span>
                    </div>
                    
                    <h3 className="drop-card-title">{d.name}</h3>

                    {/* Countdown display for upcoming */}
                    {!isLive && !isSoldOut && countdown && (
                      <div className="countdown-display-block">
                        <span className="release-date-subtext">Summons on {formatDate(d.launchDate)}</span>
                        <div className="countdown-timer-grid">
                          <div className="countdown-time-box">
                            <span className="time-number">{countdown.days}</span>
                            <span className="time-lbl">DAYS</span>
                          </div>
                          <span className="timer-separator">:</span>
                          <div className="countdown-time-box">
                            <span className="time-number">{String(countdown.hours).padStart(2, '0')}</span>
                            <span className="time-lbl">HRS</span>
                          </div>
                          <span className="timer-separator">:</span>
                          <div className="countdown-time-box">
                            <span className="time-number">{String(countdown.minutes).padStart(2, '0')}</span>
                            <span className="time-lbl">MINS</span>
                          </div>
                          <span className="timer-separator">:</span>
                          <div className="countdown-time-box">
                            <span className="time-number">{String(countdown.seconds).padStart(2, '0')}</span>
                            <span className="time-lbl">SECS</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Stock level bar for active releases */}
                    {isLive && (
                      <div className="stock-level-display-block">
                        <div className="stock-level-meta-row">
                          <span className="remaining-count-label">{d.stock} summonings remaining</span>
                          <span className="stock-pulse-percentage">{Math.round((d.stock / 100) * 100)}%</span>
                        </div>
                        <div className="stock-progress-track">
                          <div 
                            className="stock-progress-fill" 
                            style={{ width: `${Math.min(100, (d.stock / 100) * 100)}%` }}
                          ></div>
                        </div>
                      </div>
                    )}

                    {/* Sold Out Details */}
                    {isSoldOut && (
                      <div className="sold-out-details-block">
                        <span className="vault-date-subtext">Summoned on {formatDate(d.launchDate)}</span>
                        <div className="sold-out-banner">
                          <FiCheckCircle size={14} /> ALL PIECES ACQUIRED
                        </div>
                      </div>
                    )}

                    <div className="drop-card-action-box">
                      {isLive ? (
                        <button 
                          className="secure-drop-btn live" 
                          onClick={() => handleBuyDropItem(d)}
                        >
                          <FiShoppingBag size={14} /> SECURE ITEM IN CART
                        </button>
                      ) : isSoldOut ? (
                        <button className="secure-drop-btn vaulted" disabled>
                          SOLDOUT & LOCKED
                        </button>
                      ) : (
                        <button className="secure-drop-btn locked" disabled>
                          <FiLock size={14} /> RELEASE IS LOCKED
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  } catch (err) {
    return (
      <div style={{ color: '#ef4444', padding: '3rem 2rem', background: '#090909', border: '1px solid #1f1f1f', borderRadius: '8px', margin: '4rem auto', maxWidth: '800px', fontFamily: 'monospace', zIndex: 99999, position: 'relative' }}>
        <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', marginBottom: '1rem', color: '#ffffff' }}>UNICORN SYSTEM RUNTIME ERROR</h1>
        <p style={{ fontWeight: 'bold', marginBottom: '1rem' }}>{err.message}</p>
        <pre style={{ overflowX: 'auto', background: '#111111', padding: '1rem', borderRadius: '4px', border: '1px solid #1f1f1f', fontSize: '0.75rem', color: '#9ca3af' }}>{err.stack}</pre>
      </div>
    );
  }
};

export default LimitedDropsPage;
