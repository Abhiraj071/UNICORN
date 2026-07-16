import { useState, useEffect } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { 
  FiHeart, 
  FiGrid, 
  FiList, 
  FiChevronRight,
  FiSliders,
  FiX
} from 'react-icons/fi';
import './Shop.css';

const SIZES_LIST = ['XS', 'S', 'M', 'L', 'XL', 'XXL', '28', '30', '32', '34', '36'];

const Shop = () => {
  const { collectionName } = useParams();
  const [searchParams] = useSearchParams();
  const categoryParam = searchParams.get('category');
  const collectionParam = searchParams.get('collection');
  const badgeParam = searchParams.get('badge');

  // Helper to resolve collection parameter or route parameter to initial states
  const getInitialFilters = () => {
    let initialCategory = 'All Products';
    let initialLimitedOnly = false;
    let initialNewOnly = false;
    let initialBestOnly = false;
    let initialSaleOnly = false;
    let initialCollectionFilter = null;

    if (categoryParam) {
      initialCategory = categoryParam;
    }
    if (collectionParam) {
      if (collectionParam.toLowerCase() === 'limited') {
        initialLimitedOnly = true;
      } else {
        initialCollectionFilter = collectionParam;
      }
    }
    if (badgeParam === 'new') {
      initialNewOnly = true;
    }

    if (collectionName) {
      const col = collectionName.toLowerCase();
      if (col === 'oversized') {
        initialCategory = 'Oversized T-Shirt';
      } else if (col === 't-shirts') {
        initialCategory = 'Oversized T-Shirt';
      } else if (col === 'hoodies') {
        initialCategory = 'Hoodie';
      } else if (col === 'accessories') {
        initialCategory = 'Accessories';
      } else if (col === 'cap') {
        initialCategory = 'Cap';
      } else if (col === 'jacket') {
        initialCategory = 'Jacket';
      } else if (col === 'limited') {
        initialLimitedOnly = true;
      } else if (col === 'new') {
        initialNewOnly = true;
      } else if (col === 'best') {
        initialBestOnly = true;
      } else if (col === 'sale') {
        initialSaleOnly = true;
      } else if (col === 'urban') {
        initialCollectionFilter = 'Street Utility';
      } else if (col === 'gothic') {
        initialCollectionFilter = 'Vintage Gothic';
      } else if (col === 'streetwear') {
        initialCategory = 'All Products';
      }
    }

    return {
      category: initialCategory,
      limitedOnly: initialLimitedOnly,
      newOnly: initialNewOnly,
      bestOnly: initialBestOnly,
      saleOnly: initialSaleOnly,
      collectionFilter: initialCollectionFilter
    };
  };

  const initialFilters = getInitialFilters();

  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and view states
  const [selectedCategory, setSelectedCategory] = useState(initialFilters.category);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [maxPrice, setMaxPrice] = useState(10000);
  const [appliedMaxPrice, setAppliedMaxPrice] = useState(10000); // price is applied on click
  const [sliderMax, setSliderMax] = useState(10000);
  const [sortBy, setSortBy] = useState('Featured');
  const [viewMode, setViewMode] = useState('grid'); // grid or list
  const [wishlist, setWishlist] = useState([]);
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  // URL/Param filter states
  const [limitedOnly, setLimitedOnly] = useState(initialFilters.limitedOnly);
  const [newOnly, setNewOnly] = useState(initialFilters.newOnly);
  const [bestOnly, setBestOnly] = useState(initialFilters.bestOnly);
  const [saleOnly, setSaleOnly] = useState(initialFilters.saleOnly);
  const [collectionFilter, setCollectionFilter] = useState(initialFilters.collectionFilter);

  // Load wishlist from localStorage on mount
  useEffect(() => {
    const storedWishlist = localStorage.getItem('unicorn_wishlist');
    if (storedWishlist) {
      setWishlist(JSON.parse(storedWishlist));
    }
  }, []);

  // Sync route and query params to states when they change
  useEffect(() => {
    const filters = getInitialFilters();
    setSelectedCategory(filters.category);
    setLimitedOnly(filters.limitedOnly);
    setNewOnly(filters.newOnly);
    setBestOnly(filters.bestOnly);
    setSaleOnly(filters.saleOnly);
    setCollectionFilter(filters.collectionFilter);
  }, [collectionName, categoryParam, collectionParam, badgeParam]);

  // Fetch products and categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [prodRes, catRes] = await Promise.all([
          fetch('/api/products'),
          fetch('/api/categories')
        ]);
        if (!prodRes.ok || !catRes.ok) {
          throw new Error('Failed to fetch database information');
        }
        const prodData = await prodRes.json();
        const catData = await catRes.json();

        setProducts(prodData);
        setCategories(catData);

        if (prodData.length > 0) {
          const highestPrice = Math.max(...prodData.map(p => p.price));
          const roundedMax = Math.max(10000, Math.ceil(highestPrice / 1000) * 1000);
          setSliderMax(roundedMax);
          setMaxPrice(roundedMax);
          setAppliedMaxPrice(roundedMax);
        }
      } catch (err) {
        console.error(err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute category counts dynamically based on fetched products
  const categoryCounts = products.reduce((acc, product) => {
    const cat = product.category;
    acc[cat] = (acc[cat] || 0) + 1;
    return acc;
  }, {});

  // Compute size counts dynamically based on fetched products
  const sizeCounts = SIZES_LIST.reduce((acc, size) => {
    acc[size] = products.filter(p => p.sizes && p.sizes.includes(size)).length;
    return acc;
  }, {});

  // Handle size selection toggle
  const toggleSize = (size) => {
    if (selectedSizes.includes(size)) {
      setSelectedSizes(selectedSizes.filter(s => s !== size));
    } else {
      setSelectedSizes([...selectedSizes, size]);
    }
  };

  // Toggle wishlist state and write to localStorage
  const toggleWishlist = (productId) => {
    let updated;
    if (wishlist.includes(productId)) {
      updated = wishlist.filter(id => id !== productId);
    } else {
      updated = [...wishlist, productId];
    }
    setWishlist(updated);
    localStorage.setItem('unicorn_wishlist', JSON.stringify(updated));
  };

  // Clear all filters
  const clearAllFilters = () => {
    setSelectedCategory('All Products');
    setSelectedSizes([]);
    setMaxPrice(sliderMax);
    setAppliedMaxPrice(sliderMax);
    setSortBy('Featured');
    setLimitedOnly(false);
    setNewOnly(false);
    setBestOnly(false);
    setSaleOnly(false);
    setCollectionFilter(null);
  };

  // Apply filters
  const applyFilters = () => {
    setAppliedMaxPrice(maxPrice);
  };

  // Filtered and sorted products logic
  const filteredProducts = products.filter(product => {
    // 1. Category Filter
    if (selectedCategory !== 'All Products') {
      if (selectedCategory === 'Hoodie') {
        if (product.category !== 'Hoodie' && product.category !== 'Zip Hoodie') {
          return false;
        }
      } else if (product.category !== selectedCategory) {
        return false;
      }
    }
    // 2. Limited Filter
    if (limitedOnly && !product.limited) {
      return false;
    }
    // 3. New Filter
    if (newOnly && product.badge !== 'NEW') {
      return false;
    }
    // 4. Best Seller Filter
    if (bestOnly && product.badge !== 'BEST SELLER') {
      return false;
    }
    // 5. Sale Filter (comparePrice > price)
    if (saleOnly && (!product.comparePrice || product.comparePrice <= product.price)) {
      return false;
    }
    // 6. Custom Collection Name Filter
    if (collectionFilter) {
      if (product.collectionName?.toLowerCase() !== collectionFilter.toLowerCase()) {
        return false;
      }
    }
    // 7. Sizes Filter
    if (selectedSizes.length > 0) {
      const hasSize = product.sizes && product.sizes.some(size => selectedSizes.includes(size));
      if (!hasSize) return false;
    }
    // 8. Price Filter
    if (product.price > appliedMaxPrice) {
      return false;
    }
    return true;
  });

  // Sort logic
  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'Price: Low to High') {
      return a.price - b.price;
    } else if (sortBy === 'Price: High to Low') {
      return b.price - a.price;
    } else if (sortBy === 'Newest') {
      // Sort by createdAt or newest badge first
      return new Date(b.createdAt || 0) - new Date(a.createdAt || 0);
    }
    // Featured (Default)
    return a.name.localeCompare(b.name);
  });

  // Formatter for prices
  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="shop-page-wrapper fade-in">
      {/* Top Banner Section */}
      <section className="shop-banner">
        <div className="shop-banner-overlay"></div>
        <div className="container banner-content-container">
          <div className="banner-left">
            <h1 className="banner-title">SHOP ALL</h1>
            <div className="breadcrumbs">
              <Link to="/">Home</Link>
              <FiChevronRight className="breadcrumb-divider" />
              <span className="current-page">Shop</span>
            </div>
          </div>
          <div className="banner-right">
            <p className="banner-pitch-title">Premium streetwear.</p>
            <p className="banner-pitch-desc">Designed in darkness, made for the misfits.</p>
          </div>
        </div>
      </section>

      {/* Main Shop Content Section */}
      <section className="shop-main-section">
        <div className="container shop-layout-container">
          
          {/* Sidebar Filters */}
          <aside className="shop-sidebar">
            <div className="sidebar-header">
              <h3 className="sidebar-title">
                <FiSliders className="sidebar-icon" /> FILTERS
              </h3>
              <button className="clear-filters-btn" onClick={clearAllFilters}>
                CLEAR ALL
              </button>
            </div>

            {/* Categories Filter Group */}
            <div className="filter-group">
              <h4 className="filter-group-title">CATEGORIES</h4>
              <ul className="filter-list">
                <li 
                  className={selectedCategory === 'All Products' ? 'active-filter' : ''}
                  onClick={() => setSelectedCategory('All Products')}
                >
                  <span className="filter-name">All Products</span>
                  <span className="filter-count">{products.length}</span>
                </li>
                {categories.map(cat => {
                  const name = cat.name;
                  const count = categoryCounts[name] || 0;
                  return (
                    <li 
                      key={cat._id}
                      className={selectedCategory === name ? 'active-filter' : ''}
                      onClick={() => setSelectedCategory(name)}
                    >
                      <span className="filter-name">{name}</span>
                      <span className="filter-count">{count}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            {/* Sizes Filter Group */}
            <div className="filter-group">
              <h4 className="filter-group-title">SIZE</h4>
              <div className="size-checkboxes-list">
                {SIZES_LIST.map(size => {
                  const isChecked = selectedSizes.includes(size);
                  return (
                    <label key={size} className="size-checkbox-label">
                      <div className="checkbox-input-wrapper">
                        <input 
                          type="checkbox" 
                          checked={isChecked}
                          onChange={() => toggleSize(size)}
                        />
                        <span className="custom-checkbox"></span>
                        <span className="size-name">{size}</span>
                      </div>
                      <span className="size-count">{sizeCounts[size] || 0}</span>
                    </label>
                  );
                })}
              </div>
            </div>

            {/* Price Filter Group */}
            <div className="filter-group">
              <h4 className="filter-group-title">PRICE</h4>
              <div className="price-slider-wrapper">
                <div className="price-labels">
                  <span>₹499</span>
                  <span>{formatPrice(maxPrice)}</span>
                </div>
                <input 
                  type="range" 
                  min="499" 
                  max={sliderMax} 
                  step="100"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="price-range-slider"
                />
                <button className="apply-filters-btn" onClick={applyFilters}>
                  APPLY FILTERS
                </button>
              </div>
            </div>
          </aside>

          {/* Mobile Filter Drawer Overlay */}
          {mobileFiltersOpen && (
            <div className="mobile-filter-overlay" onClick={() => setMobileFiltersOpen(false)} />
          )}
          <aside className={`mobile-filter-drawer ${mobileFiltersOpen ? 'open' : ''}`}>
            <div className="mobile-filter-drawer-header">
              <h3 className="sidebar-title"><FiSliders className="sidebar-icon" /> FILTERS</h3>
              <button className="mobile-drawer-close-btn" onClick={() => setMobileFiltersOpen(false)}><FiX size={22} /></button>
            </div>
            <div className="mobile-filter-drawer-body">
              <div className="filter-group">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--divider-color)', paddingBottom: '0.5rem', marginBottom: '0.5rem' }}>
                  <h4 className="filter-group-title" style={{ border: 'none', paddingBottom: 0, marginBottom: 0 }}>CATEGORIES</h4>
                  <button className="clear-filters-btn" onClick={clearAllFilters}>CLEAR ALL</button>
                </div>
                <ul className="filter-list">
                  <li className={selectedCategory === 'All Products' ? 'active-filter' : ''} onClick={() => setSelectedCategory('All Products')}>
                    <span className="filter-name">All Products</span>
                    <span className="filter-count">{products.length}</span>
                  </li>
                  {categories.map(cat => (
                    <li key={cat._id} className={selectedCategory === cat.name ? 'active-filter' : ''} onClick={() => setSelectedCategory(cat.name)}>
                      <span className="filter-name">{cat.name}</span>
                      <span className="filter-count">{categoryCounts[cat.name] || 0}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="filter-group">
                <h4 className="filter-group-title">SIZE</h4>
                <div className="size-checkboxes-list">
                  {SIZES_LIST.map(size => (
                    <label key={size} className="size-checkbox-label">
                      <div className="checkbox-input-wrapper">
                        <input type="checkbox" checked={selectedSizes.includes(size)} onChange={() => toggleSize(size)} />
                        <span className="custom-checkbox"></span>
                        <span className="size-name">{size}</span>
                      </div>
                      <span className="size-count">{sizeCounts[size] || 0}</span>
                    </label>
                  ))}
                </div>
              </div>
              <div className="filter-group">
                <h4 className="filter-group-title">PRICE</h4>
                <div className="price-slider-wrapper">
                  <div className="price-labels">
                    <span>₹499</span>
                    <span>{formatPrice(maxPrice)}</span>
                  </div>
                  <input type="range" min="499" max={sliderMax} step="100" value={maxPrice} onChange={(e) => setMaxPrice(Number(e.target.value))} className="price-range-slider" />
                </div>
              </div>
              <button className="apply-filters-btn" onClick={() => { applyFilters(); setMobileFiltersOpen(false); }}>APPLY FILTERS</button>
            </div>
          </aside>

          {/* Product Listing Area */}
          <div className="shop-content-area">
            
            {/* Top Toolbar */}
            <div className="shop-toolbar">
              <div className="toolbar-left">
                <button className="mobile-filter-toggle-btn" onClick={() => setMobileFiltersOpen(true)}>
                  <FiSliders size={16} /> FILTERS
                </button>
                <span className="products-count-status">{sortedProducts.length} PRODUCTS</span>
              </div>
              <div className="toolbar-controls-right">
                <div className="sort-by-wrapper">
                  <span className="sort-label">SORT BY:</span>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="sort-dropdown"
                  >
                    <option value="Featured">Featured</option>
                    <option value="Price: Low to High">Price: Low to High</option>
                    <option value="Price: High to Low">Price: High to Low</option>
                    <option value="Newest">Newest</option>
                  </select>
                </div>
                <div className="layout-toggle-btns">
                  <button 
                    className={`layout-btn ${viewMode === 'grid' ? 'active-layout' : ''}`}
                    onClick={() => setViewMode('grid')}
                    title="Grid View"
                  >
                    <FiGrid size={18} />
                  </button>
                  <button 
                    className={`layout-btn ${viewMode === 'list' ? 'active-layout' : ''}`}
                    onClick={() => setViewMode('list')}
                    title="List View"
                  >
                    <FiList size={18} />
                  </button>
                </div>
              </div>
            </div>

            {/* Error or Loading States */}
            {loading && (
              <div className="shop-loading-spinner">
                <div className="spinner"></div>
                <p>SUMMONING COLLECTION...</p>
              </div>
            )}

            {error && (
              <div className="shop-error-message">
                <p>Failed to summon products: {error}</p>
              </div>
            )}

            {/* Products Grid/List */}
            {!loading && !error && (
              <>
                {sortedProducts.length === 0 ? (
                  <div className="no-products-found">
                    <h3>NO PRODUCTS IN THE SHADOWS</h3>
                    <p>Try clearing your filters or selecting other options.</p>
                  </div>
                ) : (
                  <div className={`products-container-${viewMode}`}>
                    {sortedProducts.map((product) => {
                      const isFavorite = wishlist.includes(product._id);
                      return (
                        <Link to={`/product/${product._id}`} key={product._id} className="product-card">
                          <div className="card-image-container">
                            {/* Product Badges */}
                            {product.badge && (
                              <span className={`product-badge badge-${product.badge.toLowerCase().replace(' ', '-')}`}>
                                {product.badge}
                              </span>
                            )}
                            
                            {/* Wishlist Heart Icon */}
                            <button 
                              className={`heart-btn ${isFavorite ? 'favorite-active' : ''}`}
                              onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                toggleWishlist(product._id);
                              }}
                              aria-label="Add to wishlist"
                            >
                              <FiHeart className="heart-icon" />
                            </button>

                            {/* Product Image */}
                            <img 
                              src={product.image} 
                              alt={product.name} 
                              className="product-image"
                            />
                          </div>

                          {/* Product Details Info */}
                          <div className="product-card-info">
                            <h3 className="product-name">{product.name}</h3>
                            {product.fit && <p className="product-fit">{product.fit}</p>}
                            <p className="product-price">{formatPrice(product.price)}</p>
                          </div>
                        </Link>
                      );
                    })}
                  </div>
                )}
              </>
            )}

          </div>

        </div>
      </section>
    </div>
  );
};

export default Shop;
