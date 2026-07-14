import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  FiGrid, 
  FiUsers, 
  FiPlus, 
  FiEdit2, 
  FiTrash2, 
  FiCpu, 
  FiChevronDown,
  FiChevronUp,
  FiTag,
  FiStar,
  FiSettings,
  FiLogOut,
  FiX,
  FiBookOpen,
  FiTrendingUp,
  FiMessageSquare,
  FiFileText,
  FiHelpCircle,
  FiAlertCircle,
  FiSliders,
  FiPackage,
  FiShoppingBag,
  FiBriefcase,
  FiShield,
  FiCalendar,
  FiLayers,
  FiLock,
  FiUpload,
  FiDollarSign,
  FiBell,
  FiDownload,
  FiFilter,
  FiChevronRight,
  FiMoreVertical,
  FiEye,
  FiRefreshCw
} from 'react-icons/fi';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, api } = useAuth();
  
  // Navigation states
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'products', 'orders', 'customers', 'inventory', 'coupons', 'reviews', 'lookbook', 'limited-drops', 'cms', 'faq', 'tickets', 'employees', 'roles', 'settings'
  
  // Data states
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [imageUploading, setImageUploading] = useState(false);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Custom filter, sorting, pagination, and selection states for redesigned dashboard
  const [filterCategory, setFilterCategory] = useState('');
  const [filterStock, setFilterStock] = useState('');
  const [filterBadge, setFilterBadge] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(8);
  const [selectedProductIds, setSelectedProductIds] = useState([]);
  const [activeDropdownId, setActiveDropdownId] = useState(null);
  
  const [lookbooks, setLookbooks] = useState(() => {
    const saved = localStorage.getItem('admin_lookbooks');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('admin_lookbooks', JSON.stringify(lookbooks));
  }, [lookbooks]);

  const [newLookbookTitle, setNewLookbookTitle] = useState('');
  const [newLookbookSeason, setNewLookbookSeason] = useState('Autumn/Winter 2025');
  const [newLookbookImage, setNewLookbookImage] = useState('');

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

  useEffect(() => {
    localStorage.setItem('admin_limited_drops', JSON.stringify(drops));
  }, [drops]);
  const [newDropName, setNewDropName] = useState('');
  const [newDropDate, setNewDropDate] = useState('');
  const [newDropStock, setNewDropStock] = useState('');
  const [newDropPrice, setNewDropPrice] = useState('');
  const [newDropImage, setNewDropImage] = useState('');

  // CMS states
  const [cmsPages, setCmsPages] = useState([
    { _id: 'CMS-01', title: 'Homepage Hero Banner Text', section: 'Header', status: 'Active', updatedBy: 'Abhishek', lastUpdated: '2025-05-28T14:30:00Z', heroTitle: 'ECLECTIC GOTHIC LUXURY', heroSubtitle: 'Curated apparel for the dark soul.' },
    { _id: 'CMS-02', title: 'The Gothic Manifesto (Our Story)', section: 'About Us', status: 'Active', updatedBy: 'Abhishek', lastUpdated: '2025-05-12T10:00:00Z', contentText: 'We believe in silhouettes that whisper tales of ancient shadows and cybernetic neon dreams. Tailored to perfection.' },
    { _id: 'CMS-03', title: 'Size Guide & Silhouette Chart', section: 'Apparel Info', status: 'Draft', updatedBy: 'Abhishek', lastUpdated: '2025-05-18T18:15:00Z', contentText: 'Sizing chart fits chest sizes 34" to 46" across unisex cuts.' }
  ]);
  const [editingCmsId, setEditingCmsId] = useState(null);
  const [cmsEditHeroTitle, setCmsEditHeroTitle] = useState('');
  const [cmsEditHeroSubtitle, setCmsEditHeroSubtitle] = useState('');
  const [cmsEditTextContent, setCmsEditTextContent] = useState('');

  const [faqs, setFaqs] = useState(() => {
    const saved = localStorage.getItem('admin_faqs');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {}
    }
    return [];
  });

  useEffect(() => {
    localStorage.setItem('admin_faqs', JSON.stringify(faqs));
  }, [faqs]);
  const [newFaqQuestion, setNewFaqQuestion] = useState('');
  const [newFaqAnswer, setNewFaqAnswer] = useState('');
  const [newFaqCategory, setNewFaqCategory] = useState('Shipping');

  // Support Tickets states
  const [tickets, setTickets] = useState([
    { _id: 'TK-1024', email: 'vamp@darkmail.com', subject: 'Exchange size request on Obsidian Dress', status: 'Open', priority: 'High', date: '2025-05-29T08:15:00Z', messages: [{ sender: 'customer', text: 'Hi, I received size M but it runs small. Can I swap for L?' }, { sender: 'admin', text: 'Hi, yes we can do that. I have checked stock and reserved size L.' }] },
    { _id: 'TK-1025', email: 'gothboy@shadow.org', subject: 'COD availability in remote locations', status: 'Pending', priority: 'Medium', date: '2025-05-28T12:40:00Z', messages: [{ sender: 'customer', text: 'Is Cash on Delivery supported in North East regions?' }] },
    { _id: 'TK-1026', email: 'helen@cybermail.com', subject: 'Tracking details for order #UCN829', status: 'Resolved', priority: 'Low', date: '2025-05-26T16:00:00Z', messages: [{ sender: 'customer', text: 'My order says shipped but courier website throws error.' }, { sender: 'admin', text: 'I updated courier reference. It is now synced.' }] }
  ]);
  const [activeTicketId, setActiveTicketId] = useState(null);
  const [ticketReplyText, setTicketReplyText] = useState('');

  // Employees states
  const [employees, setEmployees] = useState([
    { _id: 'EMP-01', name: 'Abhishek Roy', email: 'abhishek@unicorn.com', role: 'Super Admin', status: 'Active', lastLogin: '2025-05-30T10:15:00Z' },
    { _id: 'EMP-02', name: 'Erika Vane', email: 'erika@unicorn.com', role: 'Content Editor', status: 'Active', lastLogin: '2025-05-29T14:40:00Z' },
    { _id: 'EMP-03', name: 'Dorian Gray', email: 'dorian@unicorn.com', role: 'Support Agent', status: 'Active', lastLogin: '2025-05-30T09:00:00Z' },
    { _id: 'EMP-04', name: 'Lilith Thorne', email: 'lilith@unicorn.com', role: 'Inventory Specialist', status: 'Suspended', lastLogin: '2025-05-15T11:00:00Z' }
  ]);
  const [newEmpName, setNewEmpName] = useState('');
  const [newEmpEmail, setNewEmpEmail] = useState('');
  const [newEmpRole, setNewEmpRole] = useState('Support Agent');

  // Roles states
  const [rolesList, setRolesList] = useState([
    { roleName: 'Super Admin', manageInventory: true, viewFinancials: true, fulfillOrders: true, manageUsers: true },
    { roleName: 'Content Editor', manageInventory: true, viewFinancials: false, fulfillOrders: false, manageUsers: false },
    { roleName: 'Support Agent', manageInventory: false, viewFinancials: false, fulfillOrders: true, manageUsers: false },
    { roleName: 'Inventory Specialist', manageInventory: true, viewFinancials: false, fulfillOrders: true, manageUsers: false }
  ]);

  // Live ticking timer for Limited Drops countdowns
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);
  
  // Dynamic settings stored in localStorage
  const [storeName, setStoreName] = useState(localStorage.getItem('admin_store_name') || 'UNICORN BOUTIQUE');
  const [contactEmail, setContactEmail] = useState(localStorage.getItem('admin_contact_email') || 'contact@unicorn.com');
  const [maintenanceMode, setMaintenanceMode] = useState(localStorage.getItem('admin_maintenance') === 'true');
  
  // Mock coupons list
  const [coupons, setCoupons] = useState(() => {
    const saved = localStorage.getItem('admin_coupons');
    return saved ? JSON.parse(saved) : [
      { code: 'GOTHIC10', type: 'percentage', value: 10, expiry: '2026-12-31', minOrder: 1500, active: true },
      { code: 'OBSIDIAN500', type: 'flat', value: 500, expiry: '2026-09-30', minOrder: 3000, active: true },
      { code: 'WELCOME10', type: 'percentage', value: 10, expiry: '2026-12-31', minOrder: 0, active: true }
    ];
  });
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponType, setNewCouponType] = useState('percentage');
  const [newCouponValue, setNewCouponValue] = useState('');
  const [newCouponExpiry, setNewCouponExpiry] = useState('');
  const [newCouponMinOrder, setNewCouponMinOrder] = useState('');
  
  // Moderated lists and support data states
  const [reviews, setReviews] = useState([]);
  const [editingFaqId, setEditingFaqId] = useState(null);
  const [editingFaqQuestion, setEditingFaqQuestion] = useState('');
  const [editingFaqAnswer, setEditingFaqAnswer] = useState('');
  const [editingFaqCategory, setEditingFaqCategory] = useState('General');
  
  // Detail & Form Modals
  const [expandedOrderId, setExpandedOrderId] = useState(null);
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [aiGenerating, setAiGenerating] = useState(false);
  
  // Form Fields for Add/Edit
  const [formName, setFormName] = useState('');
  const [formPrice, setFormPrice] = useState('');
  const [formComparePrice, setFormComparePrice] = useState('');
  const [formCategory, setFormCategory] = useState('Oversized T-Shirt');
  const [formCollection, setFormCollection] = useState('Essentials');
  const [formBrand, setFormBrand] = useState('UNICORN');
  const [formBadge, setFormBadge] = useState('');
  const [formStock, setFormStock] = useState('20');
  const [formFeatured, setFormFeatured] = useState(false);
  const [formLimited, setFormLimited] = useState(false);
  const [formFabric, setFormFabric] = useState('100% Premium Heavyweight Cotton');
  const [formGsm, setFormGsm] = useState('240');
  const [formFit, setFormFit] = useState('Oversized Boxy Fit');
  const [formColor, setFormColor] = useState('Obsidian Black');
  const [formGender, setFormGender] = useState('Unisex');
  const [formImage, setFormImage] = useState('/images/ComBack.png');
  const [formGallery, setFormGallery] = useState([]);
  const [uploadTotal, setUploadTotal] = useState(0);
  const [uploadCurrent, setUploadCurrent] = useState(0);
  const [formDescription, setFormDescription] = useState('');
  const [formSizes, setFormSizes] = useState(['S', 'M', 'L', 'XL']);
  const [formFeatures, setFormFeatures] = useState([
    'High-density signature brand embroidery',
    'Pre-shrunk luxury silicone wash finish',
    'Drop shoulder streetwear silhouette'
  ]);
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDesc, setMetaDesc] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');

  const AVAILABLE_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
  const [categories, setCategories] = useState(['Oversized T-Shirt', 'Hoodie', 'Zip Hoodie', 'Sweatshirt', 'Jacket', 'Cap', 'Cargo Pants', 'Accessories']);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [editingCategoryId, setEditingCategoryId] = useState(null);
  const [editingCategoryName, setEditingCategoryName] = useState('');
  const BRANDS = ['UNICORN', 'OBSIDIAN', 'NOIR', 'VINTAGE'];

  // Redirect if not admin
  useEffect(() => {
    if (!authLoading && (!user || !user.isAdmin)) {
      navigate('/');
    }
  }, [user, authLoading, navigate]);

  // Fetch store data
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const [prodRes, ordRes, userRes, catRes, revRes, faqRes, tktRes] = await Promise.all([
          api.get('/products'),
          api.get('/orders'),
          api.get('/auth'),
          api.get('/categories'),
          api.get('/reviews'),
          api.get('/faqs'),
          api.get('/tickets')
        ]);
        setProducts(prodRes.data);
        setOrders(ordRes.data);
        setCategories(catRes.data || []);
        setReviews(revRes.data || []);
        setFaqs(faqRes.data || []);
        setTickets(tktRes.data || []);
        
        // Populate customer block statuses from localStorage simulation
        const populatedUsers = userRes.data.map(u => ({
          ...u,
          blocked: localStorage.getItem(`user_blocked_${u._id}`) === 'true',
          totalSpent: ordRes.data
            .filter(o => o.user?._id === u._id && (o.isPaid || o.paymentMethod !== 'COD'))
            .reduce((sum, o) => sum + o.totalPrice, 0)
        }));
        setUsers(populatedUsers);
      } catch (err) {
        console.error(err);
        setError('Failed to load portal databases.');
      } finally {
        setLoading(false);
      }
    };

    if (user && user.isAdmin) {
      fetchData();
    }
  }, [user, api]);

  // Compute metrics
  const totalSalesVal = orders
    .filter(order => order.isPaid || order.paymentMethod !== 'COD')
    .reduce((sum, order) => sum + order.totalPrice, 0);

  const lowStockProducts = products.filter(p => p.countInStock <= 8).slice(0, 5);

  // Dynamic weekly growth & graph calculations
  const salesData = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toLocaleDateString('en-IN', { day: 'numeric', month: 'short' });
    
    const startOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 0, 0, 0, 0);
    const endOfDay = new Date(d.getFullYear(), d.getMonth(), d.getDate(), 23, 59, 59, 999);
    
    const dayOrders = orders.filter(o => {
      const orderDate = new Date(o.createdAt);
      return orderDate >= startOfDay && orderDate <= endOfDay && (o.isPaid || o.paymentMethod !== 'COD');
    });
    const revenue = dayOrders.reduce((sum, o) => sum + o.totalPrice, 0);
    return { date: dateStr, revenue };
  });

  const maxRevenue = Math.max(...salesData.map(d => d.revenue), 1000);

  const chartPoints = salesData.map((d, i) => {
    const x = 40 + i * 80;
    const y = 140 - (d.revenue / maxRevenue) * 120;
    return { x, y, date: d.date, revenue: d.revenue };
  });

  const linePath = chartPoints.reduce((path, pt, i) => {
    return path + (i === 0 ? `M ${pt.x},${pt.y}` : ` L ${pt.x},${pt.y}`);
  }, '');

  const areaPath = chartPoints.length > 0 
    ? `${linePath} L ${chartPoints[chartPoints.length - 1].x},140 L ${chartPoints[0].x},140 Z`
    : '';

  // Weekly growth calculations (current 7 days vs previous 7 days)
  const last7DaysRevenue = salesData.reduce((sum, d) => sum + d.revenue, 0);
  const prev7DaysOrders = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const d = new Date();
    const startOfPrev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 13, 0, 0, 0, 0);
    const endOfPrev = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 7, 23, 59, 59, 999);
    return orderDate >= startOfPrev && orderDate <= endOfPrev && (o.isPaid || o.paymentMethod !== 'COD');
  });
  const prev7DaysRevenue = prev7DaysOrders.reduce((sum, o) => sum + o.totalPrice, 0);
  
  const revenueGrowth = prev7DaysRevenue > 0 
    ? ((last7DaysRevenue - prev7DaysRevenue) / prev7DaysRevenue * 100).toFixed(1)
    : last7DaysRevenue > 0 ? '100.0' : '0.0';

  const last7DaysOrdersCount = orders.filter(o => {
    const orderDate = new Date(o.createdAt);
    const d = new Date();
    const startOf7 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6, 0, 0, 0, 0);
    return orderDate >= startOf7;
  }).length;
  const prev7DaysOrdersCount = prev7DaysOrders.length;
  const ordersGrowth = prev7DaysOrdersCount > 0 
    ? ((last7DaysOrdersCount - prev7DaysOrdersCount) / prev7DaysOrdersCount * 100).toFixed(1)
    : last7DaysOrdersCount > 0 ? '100.0' : '0.0';

  const customerCount = users.filter(u => !u.isAdmin).length;
  const last7DaysUsersCount = users.filter(u => {
    const userDate = new Date(u.createdAt);
    const d = new Date();
    const startOf7 = new Date(d.getFullYear(), d.getMonth(), d.getDate() - 6, 0, 0, 0, 0);
    return userDate >= startOf7 && !u.isAdmin;
  }).length;
  const prevUsersCount = customerCount - last7DaysUsersCount;
  const customersGrowth = prevUsersCount > 0
    ? ((last7DaysUsersCount / prevUsersCount) * 100).toFixed(1)
    : last7DaysUsersCount > 0 ? '100.0' : '0.0';

  const conversionRate = users.length > 0
    ? ((orders.length / (users.length * 5 + 10)) * 100).toFixed(2)
    : '0.00';

  // Toggle order details expansion
  const toggleOrder = (id) => {
    setExpandedOrderId(expandedOrderId === id ? null : id);
  };

  // Handlers for Order Status Timeline
  const markAsPacked = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/pack`);
      setOrders(orders.map(o => o._id === id ? { ...o, isPacked: true, packedAt: new Date().toISOString() } : o));
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const markAsShipped = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/ship`);
      setOrders(orders.map(o => o._id === id ? { ...o, isShipped: true, shippedAt: new Date().toISOString() } : o));
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const markAsDelivered = async (id) => {
    setActionLoading(true);
    try {
      await api.put(`/orders/${id}/deliver`);
      setOrders(orders.map(o => o._id === id ? { ...o, isDelivered: true, deliveredAt: new Date().toISOString() } : o));
    } catch (err) {
      alert('Failed to update order status');
    } finally {
      setActionLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const files = Array.from(e.target.files);
    if (files.length === 0) return;

    setImageUploading(true);
    setUploadTotal(files.length);
    setUploadCurrent(0);

    const uploadedUrls = [];

    try {
      for (let i = 0; i < files.length; i++) {
        setUploadCurrent(i);
        const file = files[i];
        const formData = new FormData();
        formData.append('image', file);

        const { data } = await api.post('/upload', formData);
        uploadedUrls.push(data.image);
      }

      if (uploadedUrls.length > 0) {
        setFormImage(uploadedUrls[0]);
        setFormGallery((prev) => [...prev, ...uploadedUrls]);
      }
    } catch (err) {
      console.error(err);
      const errMsg = err.response?.data?.message || 'Failed to upload image. Make sure it is an image file under supported formats.';
      alert(errMsg);
    } finally {
      setImageUploading(false);
      setUploadTotal(0);
      setUploadCurrent(0);
      e.target.value = ''; // Reset input to allow selecting the same file again
    }
  };

  // Block/Unblock customer account
  const toggleBlockCustomer = (id, currentBlockedState) => {
    const newState = !currentBlockedState;
    localStorage.setItem(`user_blocked_${id}`, newState.toString());
    setUsers(users.map(u => u._id === id ? { ...u, blocked: newState } : u));
    alert(`User ${newState ? 'blocked' : 'unblocked'} successfully.`);
  };

  // Save Settings
  const handleSaveSettings = (e) => {
    e.preventDefault();
    localStorage.setItem('admin_store_name', storeName);
    localStorage.setItem('admin_contact_email', contactEmail);
    localStorage.setItem('admin_maintenance', maintenanceMode.toString());
    alert('Website configurations updated successfully!');
  };

  // Add Coupon
  const handleAddCoupon = (e) => {
    e.preventDefault();
    if (!newCouponCode || !newCouponValue) return;
    const updated = [
      ...coupons,
      {
        code: newCouponCode.trim().toUpperCase(),
        type: newCouponType,
        value: Number(newCouponValue),
        expiry: newCouponExpiry || '2026-12-31',
        minOrder: Number(newCouponMinOrder || 0),
        active: true
      }
    ];
    setCoupons(updated);
    localStorage.setItem('admin_coupons', JSON.stringify(updated));
    setNewCouponCode('');
    setNewCouponValue('');
    setNewCouponExpiry('');
    setNewCouponMinOrder('');
    alert('Promo code registered.');
  };

  // Delete Coupon
  const handleDeleteCoupon = (code) => {
    if (!window.confirm(`Delete coupon "${code}"?`)) return;
    const updated = coupons.filter(c => c.code !== code);
    setCoupons(updated);
    localStorage.setItem('admin_coupons', JSON.stringify(updated));
    alert('Coupon deleted successfully.');
  };

  // Delete product action
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Delete this product permanently?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/products/${id}`);
      setProducts(products.filter(p => p._id !== id));
      alert('Product deleted.');
    } catch (err) {
      alert('Error deleting product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Duplicate product
  const handleDuplicateProduct = async (prod) => {
    setActionLoading(true);
    try {
      const duplicatePayload = {
        ...prod,
        name: `${prod.name} (Copy)`,
        slug: `${prod.slug}-copy-${Math.random().toString(36).substring(2, 5)}`,
        id: `UNI-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      };
      const { data } = await api.post('/products', duplicatePayload);
      setProducts([data, ...products]);
      alert('Product duplicated successfully!');
    } catch (err) {
      alert('Error duplicating product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Save Product Modal Submit (Create/Edit)
  // Save Product Modal Submit (Create/Edit)
  const handleSaveProduct = async (e) => {
    e.preventDefault();
    const productPayload = {
      name: formName,
      price: Number(formPrice),
      comparePrice: formComparePrice ? Number(formComparePrice) : null,
      category: formCategory,
      collectionName: formCollection,
      brand: formBrand,
      badge: formBadge || null,
      countInStock: Number(formStock),
      featured: formFeatured,
      limited: formLimited,
      fabric: formFabric,
      gsm: formGsm ? Number(formGsm) : null,
      fit: formFit,
      color: formColor,
      gender: formGender,
      sizes: formSizes,
      image: formImage,
      gallery: formGallery.length > 0 ? formGallery : [formImage],
      description: formDescription,
      features: formFeatures.filter(f => f.trim() !== '')
    };

    setActionLoading(true);
    try {
      if (editingProduct) {
        const { data } = await api.put(`/products/${editingProduct._id}`, productPayload);
        setProducts(products.map(p => p._id === editingProduct._id ? data : p));
        alert('Product details updated.');
      } else {
        const { data } = await api.post('/products', productPayload);
        setProducts([data, ...products]);
        alert('Product registered.');
      }
      setShowProductModal(false);
    } catch (err) {
      alert('Error saving product.');
    } finally {
      setActionLoading(false);
    }
  };

  // Category management handlers
  const handleAddCategory = async (e) => {
    e.preventDefault();
    if (!newCategoryName || newCategoryName.trim() === '') return;
    setActionLoading(true);
    try {
      const { data } = await api.post('/categories', { name: newCategoryName });
      setCategories([...categories, data]);
      setNewCategoryName('');
      alert('Category added successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateCategory = async (id) => {
    if (!editingCategoryName || editingCategoryName.trim() === '') return;
    setActionLoading(true);
    try {
      const oldCat = categories.find(c => c._id === id);
      const oldName = oldCat ? oldCat.name : '';
      const { data } = await api.put(`/categories/${id}`, { name: editingCategoryName });
      
      setCategories(categories.map(c => c._id === id ? data : c));
      
      // Cascade local products category name updates
      if (oldName) {
        setProducts(products.map(p => p.category === oldName ? { ...p, category: data.name } : p));
      }
      
      setEditingCategoryId(null);
      setEditingCategoryName('');
      alert('Category updated successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update category.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    const categoryToDelete = categories.find(c => c._id === id);
    if (!categoryToDelete) return;
    
    // Safety check on frontend count as well
    const count = products.filter(p => p.category === categoryToDelete.name).length;
    if (count > 0) {
      alert(`Cannot delete category "${categoryToDelete.name}" because it has ${count} associated products.`);
      return;
    }

    if (!window.confirm(`Are you sure you want to delete category "${categoryToDelete.name}"?`)) return;

    setActionLoading(true);
    try {
      await api.delete(`/categories/${id}`);
      setCategories(categories.filter(c => c._id !== id));
      alert('Category deleted successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete category.');
    } finally {
      setActionLoading(false);
    }
  };

  // Review Moderation Handlers
  const handleApproveReview = async (id) => {
    setActionLoading(true);
    try {
      const { data } = await api.put(`/reviews/${id}/approve`);
      setReviews(reviews.map(r => r._id === id ? data : r));
      alert('Review approved successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to approve review.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteReview = async (id) => {
    if (!window.confirm('Delete this review permanently?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/reviews/${id}`);
      setReviews(reviews.filter(r => r._id !== id));
      alert('Review deleted.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete review.');
    } finally {
      setActionLoading(false);
    }
  };

  // FAQ CRUD Handlers
  const handleAddFaq = async (e) => {
    e.preventDefault();
    if (!newFaqQuestion.trim() || !newFaqAnswer.trim()) return;
    setActionLoading(true);
    try {
      const { data } = await api.post('/faqs', {
        question: newFaqQuestion,
        answer: newFaqAnswer,
        category: newFaqCategory
      });
      setFaqs([...faqs, data]);
      setNewFaqQuestion('');
      setNewFaqAnswer('');
      setNewFaqCategory('General');
      alert('FAQ added successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create FAQ.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleUpdateFaq = async (id) => {
    if (!editingFaqQuestion.trim() || !editingFaqAnswer.trim()) return;
    setActionLoading(true);
    try {
      const { data } = await api.put(`/faqs/${id}`, {
        question: editingFaqQuestion,
        answer: editingFaqAnswer,
        category: editingFaqCategory
      });
      setFaqs(faqs.map(f => f._id === id ? data : f));
      setEditingFaqId(null);
      setEditingFaqQuestion('');
      setEditingFaqAnswer('');
      setEditingFaqCategory('General');
      alert('FAQ updated successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update FAQ.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteFaq = async (id) => {
    if (!window.confirm('Are you sure you want to delete this FAQ?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/faqs/${id}`);
      setFaqs(faqs.filter(f => f._id !== id));
      alert('FAQ deleted successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to delete FAQ.');
    } finally {
      setActionLoading(false);
    }
  };

  // Support Tickets Admin Handlers
  const handleSendAdminReply = async (e, ticketId) => {
    e.preventDefault();
    if (!ticketReplyText.trim()) return;
    setActionLoading(true);
    try {
      const { data } = await api.post(`/tickets/${ticketId}/reply`, {
        message: ticketReplyText
      });
      setTickets(tickets.map(t => t._id === ticketId ? { ...t, replies: data.replies, status: data.status } : t));
      setTicketReplyText('');
      alert('Reply sent.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send reply.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleResolveTicket = async (ticketId) => {
    if (!window.confirm('Mark this support ticket as resolved?')) return;
    setActionLoading(true);
    try {
      const { data } = await api.put(`/tickets/${ticketId}/status`, {
        status: 'Resolved'
      });
      setTickets(tickets.map(t => t._id === ticketId ? data : t));
      alert('Ticket marked as resolved.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to update ticket status.');
    } finally {
      setActionLoading(false);
    }
  };

  // AI Assistant generator
  const triggerAIAssistant = () => {
    if (!formName) {
      alert('Please fill in the Product Name first.');
      return;
    }
    setAiGenerating(true);
    setTimeout(() => {
      const generatedDesc = `Unveil your shadow side with the ${formName} by ${formBrand}. Cut in a distinct ${formFit} from luxury ${formFabric} (${formGsm} GSM weight), this masterpiece features distressed edge detailing and high-density embroidery. A signature staple in our premium Gothic fashion collection.`;
      setFormDescription(generatedDesc);
      
      // Suggest SEO titles
      setMetaTitle(`${formName} | Luxury Gothic Apparel | ${formBrand}`);
      setMetaDesc(`Buy the premium ${formName} online. Custom oversized tailoring, premium heavyweight construction, and dark aesthetic design. Only at ${formBrand}.`);
      setMetaKeywords(`gothic fashion, ${formCategory.toLowerCase()}, ${formBrand.toLowerCase()}, luxury streetwear, oversized fit`);
      
      setAiGenerating(false);
    }, 1000);
  };

  const handleSizeToggle = (sz) => {
    if (formSizes.includes(sz)) {
      setFormSizes(formSizes.filter(s => s !== sz));
    } else {
      setFormSizes([...formSizes, sz]);
    }
  };

  // Open modals
  const openAdd = () => {
    setEditingProduct(null);
    setFormName('');
    setFormPrice('');
    setFormComparePrice('');
    setFormCategory('Oversized T-Shirt');
    setFormCollection('Essentials');
    setFormBrand('UNICORN');
    setFormBadge('');
    setFormStock('20');
    setFormFeatured(false);
    setFormLimited(false);
    setFormFabric('100% Premium Heavyweight Cotton');
    setFormGsm('240');
    setFormFit('Oversized Boxy Fit');
    setFormColor('Obsidian Black');
    setFormGender('Unisex');
    setFormImage('/images/ComBack.png');
    setFormGallery([]);
    setFormDescription('');
    setFormSizes(['S', 'M', 'L', 'XL']);
    setFormFeatures([
      'High-density signature brand embroidery',
      'Pre-shrunk luxury silicone wash finish',
      'Drop shoulder streetwear silhouette'
    ]);
    setMetaTitle('');
    setMetaDesc('');
    setMetaKeywords('');
    setShowProductModal(true);
  };

  const openEdit = (p) => {
    setEditingProduct(p);
    setFormName(p.name || '');
    setFormPrice(p.price || '');
    setFormComparePrice(p.comparePrice || '');
    setFormCategory(p.category || 'Oversized T-Shirt');
    setFormCollection(p.collectionName || 'Essentials');
    setFormBrand(p.brand || 'UNICORN');
    setFormBadge(p.badge || '');
    setFormStock(p.countInStock || '0');
    setFormFeatured(!!p.featured);
    setFormLimited(!!p.limited);
    setFormFabric(p.fabric || '');
    setFormGsm(p.gsm || '');
    setFormFit(p.fit || '');
    setFormColor(p.color || '');
    setFormGender(p.gender || 'Unisex');
    setFormImage(p.image || '/images/ComBack.png');
    setFormGallery(p.gallery || []);
    setFormDescription(p.description || '');
    setFormSizes(p.sizes || []);
    setFormFeatures(p.features || []);
    setMetaTitle(`${p.name} | ${p.brand}`);
    setMetaDesc(p.description ? p.description.substring(0, 150) : '');
    setMetaKeywords(`${p.category ? p.category.toLowerCase() : 'gothic streetwear'}`);
    setShowProductModal(true);
  };

  // Image upload base64 handlers
  const handleDropImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewDropImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleLookbookImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setNewLookbookImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Lookbook handlers
  const handleAddLookbook = (e) => {
    e.preventDefault();
    if (!newLookbookTitle) return;
    const newLB = {
      _id: `LB-${Date.now()}`,
      title: newLookbookTitle,
      season: newLookbookSeason,
      itemsCount: 0,
      status: 'Draft',
      image: newLookbookImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=500'
    };
    setLookbooks([...lookbooks, newLB]);
    setNewLookbookTitle('');
    setNewLookbookImage('');
    alert('Lookbook summoned as Draft!');
  };

  const toggleLookbookStatus = (id) => {
    setLookbooks(lookbooks.map(lb => {
      if (lb._id === id) {
        return { ...lb, status: lb.status === 'Published' ? 'Draft' : 'Published' };
      }
      return lb;
    }));
  };

  const handleDeleteLookbook = (id) => {
    if (window.confirm('Dissolve this lookbook from the archives?')) {
      setLookbooks(lookbooks.filter(lb => lb._id !== id));
    }
  };

  // Limited Drops handlers
  const handleAddDrop = (e) => {
    e.preventDefault();
    if (!newDropName || !newDropDate || !newDropPrice || !newDropStock) return;
    const newDP = {
      _id: `DP-${Date.now()}`,
      name: newDropName,
      launchDate: new Date(newDropDate).toISOString(),
      stock: parseInt(newDropStock),
      price: parseFloat(newDropPrice),
      image: newDropImage || 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=600&auto=format&fit=crop&q=60'
    };
    setDrops([...drops, newDP]);
    setNewDropName('');
    setNewDropDate('');
    setNewDropStock('');
    setNewDropPrice('');
    setNewDropImage('');
    alert('Limited edition drop scheduled!');
  };

  const handleDeleteDrop = (id) => {
    if (window.confirm('Cancel and dissolve this limited drop?')) {
      setDrops(drops.filter(d => d._id !== id));
    }
  };

  // CMS handlers
  const handleEditCms = (page) => {
    setEditingCmsId(page._id);
    setCmsEditHeroTitle(page.heroTitle || '');
    setCmsEditHeroSubtitle(page.heroSubtitle || '');
    setCmsEditTextContent(page.contentText || '');
  };

  const handleSaveCms = (e) => {
    e.preventDefault();
    setCmsPages(cmsPages.map(p => {
      if (p._id === editingCmsId) {
        return {
          ...p,
          heroTitle: cmsEditHeroTitle,
          heroSubtitle: cmsEditHeroSubtitle,
          contentText: cmsEditTextContent,
          lastUpdated: new Date().toISOString(),
          updatedBy: user.name
        };
      }
      return p;
    }));
    setEditingCmsId(null);
    alert('CMS content synchronized!');
  };

  // Employee handlers
  const handleAddEmployee = (e) => {
    e.preventDefault();
    if (!newEmpName || !newEmpEmail) return;
    const newEmp = {
      _id: `EMP-${Date.now()}`,
      name: newEmpName,
      email: newEmpEmail,
      role: newEmpRole,
      status: 'Active',
      lastLogin: new Date().toISOString()
    };
    setEmployees([...employees, newEmp]);
    setNewEmpName('');
    setNewEmpEmail('');
    alert('New employee credentials registered!');
  };

  const toggleEmployeeStatus = (id) => {
    setEmployees(employees.map(emp => {
      if (emp._id === id) {
        return { ...emp, status: emp.status === 'Active' ? 'Suspended' : 'Active' };
      }
      return emp;
    }));
  };

  // Roles permissions handlers
  const handleTogglePermission = (roleName, permissionKey) => {
    setRolesList(rolesList.map(r => {
      if (r.roleName === roleName) {
        return { ...r, [permissionKey]: !r[permissionKey] };
      }
      return r;
    }));
  };

  // Helper for pricing currency format
  const formatPrice = (value) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 2
    }).format(value);
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-IN', {
      day: 'numeric',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter products by search and premium dashboard criteria
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          (p.category || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (p.sku || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !filterCategory || p.category === filterCategory;
    const matchesBadge = !filterBadge || p.badge === filterBadge;
    const matchesStock = !filterStock || 
      (filterStock === 'in-stock' ? p.countInStock > 5 :
       filterStock === 'out-of-stock' ? p.countInStock === 0 :
       filterStock === 'low-stock' ? p.countInStock > 0 && p.countInStock <= 5 : true);
    return matchesSearch && matchesCategory && matchesBadge && matchesStock;
  });

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    if (sortBy === 'price-asc') return a.price - b.price;
    if (sortBy === 'price-desc') return b.price - a.price;
    if (sortBy === 'stock-asc') return a.countInStock - b.countInStock;
    if (sortBy === 'stock-desc') return b.countInStock - a.countInStock;
    if (sortBy === 'name-asc') return a.name.localeCompare(b.name);
    if (sortBy === 'name-desc') return b.name.localeCompare(a.name);
    return new Date(b.createdAt || 0) - new Date(a.createdAt || 0); // default: newest
  });

  // Pagination calculations
  const totalPages = Math.ceil(sortedProducts.length / itemsPerPage) || 1;
  const paginatedProducts = sortedProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  // Checkbox bulk actions
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedProductIds(paginatedProducts.map(p => p._id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectOne = (id) => {
    if (selectedProductIds.includes(id)) {
      setSelectedProductIds(selectedProductIds.filter(item => item !== id));
    } else {
      setSelectedProductIds([...selectedProductIds, id]);
    }
  };

  const handleBulkDelete = async () => {
    if (selectedProductIds.length === 0) return;
    if (!window.confirm(`Are you sure you want to summon the void on these ${selectedProductIds.length} items?`)) return;
    
    setActionLoading(true);
    try {
      await Promise.all(selectedProductIds.map(id => api.delete(`/products/${id}`)));
      setProducts(products.filter(p => !selectedProductIds.includes(p._id)));
      setSelectedProductIds([]);
      alert('Selected items deleted.');
    } catch (err) {
      alert('Error deleting items.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleExportCSV = () => {
    const headers = ['Name', 'SKU', 'Category', 'Collection', 'Price', 'Stock', 'Badge'];
    const rows = products.map(p => [
      `"${p.name.replace(/"/g, '""')}"`,
      p.sku,
      p.category,
      p.collectionName,
      p.price,
      p.countInStock,
      p.badge || 'NONE'
    ]);
    const csvContent = "data:text/csv;charset=utf-8," 
      + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "unicorn_products_collection.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredOrders = orders.filter(o => 
    (o.user?.name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    o._id.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (authLoading || (loading && products.length === 0)) {
    return (
      <div className="admin-gothic-loader-screen">
        <div className="gothic-pentagram-spinner"></div>
        <p className="loading-gothic-text">SUMMONING WORKSPACE DATABASE...</p>
      </div>
    );
  }

  if (!user || !user.isAdmin) {
    return null;
  }

  return (
    <div className="admin-gothic-panel fade-in">
      {/* Main Grid Layout */}
      <div className="gothic-dashboard-container">
        
        {/* Sidebar Nav */}
        <aside className="gothic-sidebar-panel">
          
          {/* Logo Brand Brand */}
          <div className="sidebar-logo-brand-block">
            <svg className="unicorn-head-logo-svg" viewBox="0 0 40 40">
              <path d="M12,30 C12,25 15,20 18,17 C15,18 10,18 7,14 C12,11 16,13 19,16 C18,12 18,7 23,3 C22,8 23,12 25,14 C27,11 31,8 34,10 C31,13 28,14 26,16 C29,19 32,23 32,28 C30,27 28,26 27,24 C26,27 23,29 20,30 C20,34 16,36 12,37 C15,35 15,32 12,30 Z" fill="#D4AF37"/>
            </svg>
            <div className="sidebar-brand-text">
              <span className="brand-primary-name">UNICORN</span>
              <span className="brand-secondary-sub">ADMIN PANEL</span>
            </div>
          </div>

          <div className="sidebar-scrollable-links">
            
            {/* Dashboard active category */}
            <button 
              className={`sidebar-link-btn ${activeTab === 'dashboard' ? 'active' : ''}`}
              onClick={() => setActiveTab('dashboard')}
            >
              <FiGrid size={16} /> Dashboard
            </button>

            {/* MANAGEMENT SECTION */}
            <div className="sidebar-section-divider-header">MANAGEMENT</div>
            
            <button 
              className={`sidebar-link-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              <FiShoppingBag size={16} /> Products
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'categories' ? 'active' : ''}`}
              onClick={() => setActiveTab('categories')}
            >
              <FiLayers size={16} /> Categories
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              <FiPackage size={16} /> Orders
              <span className="sidebar-badge-count-orange">24</span>
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'customers' ? 'active' : ''}`}
              onClick={() => setActiveTab('customers')}
            >
              <FiUsers size={16} /> Customers
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'inventory' ? 'active' : ''}`}
              onClick={() => setActiveTab('inventory')}
            >
              <FiSliders size={16} /> Inventory
            </button>

            {/* MARKETING SECTION */}
            <div className="sidebar-section-divider-header">MARKETING</div>

            <button 
              className={`sidebar-link-btn ${activeTab === 'coupons' ? 'active' : ''}`}
              onClick={() => setActiveTab('coupons')}
            >
              <FiTag size={16} /> Coupons
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'reviews' ? 'active' : ''}`}
              onClick={() => setActiveTab('reviews')}
            >
              <FiStar size={16} /> Reviews
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'lookbook' ? 'active' : ''}`}
              onClick={() => setActiveTab('lookbook')}
            >
              <FiBookOpen size={16} /> Lookbook
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'limited-drops' ? 'active' : ''}`}
              onClick={() => setActiveTab('limited-drops')}
            >
              <FiTrendingUp size={16} /> Limited Drops
            </button>

            {/* CONTENT SECTION */}
            <div className="sidebar-section-divider-header">CONTENT</div>

            <button 
              className={`sidebar-link-btn ${activeTab === 'cms' ? 'active' : ''}`}
              onClick={() => setActiveTab('cms')}
            >
              <FiFileText size={16} /> CMS
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'faq' ? 'active' : ''}`}
              onClick={() => setActiveTab('faq')}
            >
              <FiHelpCircle size={16} /> FAQ
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'tickets' ? 'active' : ''}`}
              onClick={() => setActiveTab('tickets')}
            >
              <FiMessageSquare size={16} /> Support Tickets
            </button>

            {/* SYSTEM SECTION */}
            <div className="sidebar-section-divider-header">SYSTEM</div>

            <button 
              className={`sidebar-link-btn ${activeTab === 'employees' ? 'active' : ''}`}
              onClick={() => setActiveTab('employees')}
            >
              <FiBriefcase size={16} /> Employees
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'roles' ? 'active' : ''}`}
              onClick={() => setActiveTab('roles')}
            >
              <FiShield size={16} /> Roles & Permissions
            </button>

            <button 
              className={`sidebar-link-btn ${activeTab === 'settings' ? 'active' : ''}`}
              onClick={() => setActiveTab('settings')}
            >
              <FiSettings size={16} /> Settings
            </button>
            
          </div>

          {/* Profile User at Bottom */}
          <div 
            className="sidebar-bottom-user-avatar-row" 
            onClick={logout} 
            style={{ cursor: 'pointer' }}
            title="Click to Sign Out"
          >
            <img src="/images/ComBack.png" alt="Admin Profile" className="avatar-bottom-rounded" />
            <div className="avatar-meta-names-box">
              <span className="profile-label-main">{user.name}</span>
              <span className="profile-label-subtitle">Super Administrator</span>
            </div>
            <FiLogOut size={14} className="dropdown-arrow-profile" />
          </div>

          {/* Contact help link */}
          <button className="sidebar-help-support-btn" onClick={() => setActiveTab('faq')}>
            <span className="gold-text-help">Need Help?</span>
            <span className="sub-text-help">Contact Support</span>
          </button>
        </aside>

        {/* Content Body */}
        <main className="gothic-content-view">
          {error && <div className="gothic-error-banner">{error}</div>}
          
          {/* GLOBAL BREADCRUMBS & SAAS HEADER */}
          <header className="dashboard-top-header">
            <div className="header-left-breadcrumbs">
              <div className="breadcrumb-path">
                <span className="breadcrumb-parent">Dashboard</span>
                <FiChevronRight size={10} className="breadcrumb-sep" />
                <span className="breadcrumb-current">{activeTab.toUpperCase()}</span>
              </div>
              <h1 className="header-title-text">{activeTab.replace('-', ' ').toUpperCase()}</h1>
              <p className="header-subtitle-text">
                {activeTab === 'dashboard' && "Track your premium boutique metrics and spline revenues."}
                {activeTab === 'products' && "Manage your premium gothic apparel collection and summon inventory."}
                {activeTab === 'orders' && "Fulfill, track, and dispatch gothic garments."}
                {activeTab === 'customers' && "Index of premium Obsidian card holders and user profiles."}
                {activeTab === 'inventory' && "Manage apparel stock units, colorways, and sizes."}
                {activeTab === 'coupons' && "Summon active promo codes and loyalty vouchers."}
                {activeTab === 'reviews' && "Review customer testimonials and gothic garment reviews."}
                {!['dashboard', 'products', 'orders', 'customers', 'inventory', 'coupons', 'reviews'].includes(activeTab) && `Admin management portal for ${activeTab.replace('-', ' ')}.`}
              </p>
            </div>
            
            <div className="header-right-actions">
              <div className="header-search-bar-wrapper">
                <FiSliders size={14} className="search-decorator-icon" />
                <input 
                  type="text" 
                  placeholder={`Search ${activeTab}...`} 
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="header-search-input"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery('')} className="search-clear-btn">
                    <FiX size={12} />
                  </button>
                )}
              </div>

              <div className="header-utilities">
                <button className="utility-icon-btn notifications-bell" title="Notifications">
                  <FiBell size={14} />
                  <span className="notification-badge-dot"></span>
                </button>
                
                <div className="profile-badge-row" onClick={logout} title="Sign Out">
                  <img src="/images/ComBack.png" alt="Profile" className="profile-badge-thumb" />
                  <span className="profile-badge-name">{user?.name || 'Admin'}</span>
                </div>

                {activeTab === 'products' && (
                  <button className="summon-action-cta-btn" onClick={openAdd}>
                    <FiPlus size={14} /> SUMMON ITEM
                  </button>
                )}
              </div>
            </div>
          </header>
          
          {/* DASHBOARD TAB VIEW */}
          {activeTab === 'dashboard' && (
            <div className="overview-tab-view fade-in">
              
              {/* Header section with Welcome and Calendar */}
              <div className="dashboard-welcome-heading-bar">
                <div className="welcome-text-side">
                  <h2>Welcome back, {user?.name || 'Admin'}! 👋</h2>
                  <p>Here's an overview of your store performance and activities.</p>
                </div>
                <button className="gothic-date-range-picker-btn">
                  <FiCalendar size={14} /> May 24 – May 30, 2025 <FiChevronDown size={12} />
                </button>
              </div>
              
              {/* KPI Cards Grid */}
              <div className="gothic-kpi-grid">
                
                {/* Revenue card */}
                <div className="kpi-card-gold">
                  <div className="kpi-icon-circle-wrapper gold-bg">
                    <FiDollarSign size={20} />
                  </div>
                  <div className="kpi-details-text-side">
                    <span className="kpi-label">Total Revenue</span>
                    <span className="kpi-value">{formatPrice(totalSalesVal)}</span>
                    <div className="kpi-sub-sparkline-row">
                      <span className={Number(revenueGrowth) >= 0 ? 'spark-pct-green' : 'spark-pct-red'} style={{ color: Number(revenueGrowth) >= 0 ? '#10b981' : '#ef4444' }}>
                        {Number(revenueGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(revenueGrowth))}%
                      </span>
                      <span className="spark-desc-text">vs last week</span>
                      <svg className="sparkline-mini-svg" viewBox="0 0 50 15">
                        <path d="M0,10 Q10,2 20,8 T40,5 T50,2" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Orders card */}
                <div className="kpi-card-gold">
                  <div className="kpi-icon-circle-wrapper purple-bg">
                    <FiPackage size={20} />
                  </div>
                  <div className="kpi-details-text-side">
                    <span className="kpi-label">Total Orders</span>
                    <span className="kpi-value">{orders.length}</span>
                    <div className="kpi-sub-sparkline-row">
                      <span className={Number(ordersGrowth) >= 0 ? 'spark-pct-green' : 'spark-pct-red'} style={{ color: Number(ordersGrowth) >= 0 ? '#10b981' : '#ef4444' }}>
                        {Number(ordersGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(ordersGrowth))}%
                      </span>
                      <span className="spark-desc-text">vs last week</span>
                      <svg className="sparkline-mini-svg" viewBox="0 0 50 15">
                        <path d="M0,12 Q10,7 20,11 T40,4 T50,8" fill="none" stroke="#a855f7" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Customers card */}
                <div className="kpi-card-gold">
                  <div className="kpi-icon-circle-wrapper blue-bg">
                    <FiUsers size={20} />
                  </div>
                  <div className="kpi-details-text-side">
                    <span className="kpi-label">Total Customers</span>
                    <span className="kpi-value">{customerCount}</span>
                    <div className="kpi-sub-sparkline-row">
                      <span className={Number(customersGrowth) >= 0 ? 'spark-pct-green' : 'spark-pct-red'} style={{ color: Number(customersGrowth) >= 0 ? '#10b981' : '#ef4444' }}>
                        {Number(customersGrowth) >= 0 ? '↑' : '↓'} {Math.abs(Number(customersGrowth))}%
                      </span>
                      <span className="spark-desc-text">vs last week</span>
                      <svg className="sparkline-mini-svg" viewBox="0 0 50 15">
                        <path d="M0,8 Q10,13 20,5 T40,9 T50,3" fill="none" stroke="#3b82f6" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

                {/* Conversion card */}
                <div className="kpi-card-gold">
                  <div className="kpi-icon-circle-wrapper green-bg">
                    <FiTrendingUp size={20} />
                  </div>
                  <div className="kpi-details-text-side">
                    <span className="kpi-label">Conversion Rate</span>
                    <span className="kpi-value">{conversionRate}%</span>
                    <div className="kpi-sub-sparkline-row">
                      <span className="spark-pct-green">↑ 0.6%</span>
                      <span className="spark-desc-text">vs last week</span>
                      <svg className="sparkline-mini-svg" viewBox="0 0 50 15">
                        <path d="M0,14 Q10,9 20,12 T40,6 T50,3" fill="none" stroke="#10b981" strokeWidth="1.5" />
                      </svg>
                    </div>
                  </div>
                </div>

              </div>

              {/* Chart & Tables row */}
              <div className="overview-graphics-row">
                
                {/* Spline area chart card */}
                <div className="graphics-card line-chart-card">
                  <div className="card-header-with-action">
                    <h3>Revenue Overview</h3>
                    <select className="dropdown-chart-filter-select">
                      <option value="week">This Week</option>
                      <option value="month">This Month</option>
                    </select>
                  </div>
                  
                  {/* Spline line chart */}
                  <div className="chart-canvas-wrapper-relative">
                    <svg className="gothic-svg-chart" viewBox="0 0 540 180">
                      <defs>
                        <linearGradient id="gothicAreaGrad" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0.3" />
                          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0.0" />
                        </linearGradient>
                      </defs>
                      {/* Horizontal Gridlines */}
                      <line x1="30" y1="20" x2="520" y2="20" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="30" y1="50" x2="520" y2="50" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="30" y1="80" x2="520" y2="80" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="30" y1="110" x2="520" y2="110" stroke="#1c1c1c" strokeWidth="1" />
                      <line x1="30" y1="140" x2="520" y2="140" stroke="#2c2c2c" strokeWidth="1" />
                      
                      {/* Area Fill */}
                      {areaPath && <path d={areaPath} fill="url(#gothicAreaGrad)" />}
                      
                      {/* Spline line path */}
                      {linePath && <path d={linePath} fill="none" stroke="#D4AF37" strokeWidth="3.5" />}

                      {/* Line Points */}
                      {chartPoints.map((pt, idx) => (
                        <circle key={idx} cx={pt.x} cy={pt.y} r="4.5" fill="#1A1A1A" stroke="#D4AF37" strokeWidth="2.5" />
                      ))}

                      {/* Tooltip on the last point */}
                      {chartPoints.length > 0 && (() => {
                        const activePt = chartPoints[chartPoints.length - 1];
                        return (
                          <>
                            <rect x={activePt.x - 45} y={activePt.y - 30} width="90" height="24" rx="4" fill="#000" stroke="#D4AF37" strokeWidth="1" />
                            <text x={activePt.x} y={activePt.y - 20} fill="#FFF" fontSize="8" fontWeight="600" textAnchor="middle">{formatPrice(activePt.revenue)}</text>
                            <text x={activePt.x} y={activePt.y - 12} fill="#A3A3A3" fontSize="6" textAnchor="middle">{activePt.date}</text>
                          </>
                        );
                      })()}

                      {/* X Labels */}
                      {chartPoints.map((pt, idx) => (
                        <text key={idx} x={pt.x} y={160} fill="#737373" fontSize="8" textAnchor="middle">{pt.date}</text>
                      ))}

                      {/* Y Labels */}
                      <text x="24" y="23" fill="#737373" fontSize="8" textAnchor="end">{formatPrice(maxRevenue)}</text>
                      <text x="24" y="53" fill="#737373" fontSize="8" textAnchor="end">{formatPrice(maxRevenue * 0.8)}</text>
                      <text x="24" y="83" fill="#737373" fontSize="8" textAnchor="end">{formatPrice(maxRevenue * 0.5)}</text>
                      <text x="24" y="113" fill="#737373" fontSize="8" textAnchor="end">{formatPrice(maxRevenue * 0.2)}</text>
                      <text x="24" y="143" fill="#737373" fontSize="8" textAnchor="end">₹0</text>
                    </svg>
                  </div>
                </div>

                {/* Right col: Quick Actions */}
                <div className="graphics-card quick-actions-card">
                  <h3>Quick Actions</h3>
                  <div className="quick-actions-layout-grid">
                    <button className="action-tile-btn" onClick={openAdd}>
                      <FiPlus className="action-tile-icon" />
                      <span>Add Product</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('orders')}>
                      <FiShoppingBag className="action-tile-icon" />
                      <span>Create Order</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('customers')}>
                      <FiUsers className="action-tile-icon" />
                      <span>Add Customer</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('coupons')}>
                      <FiTag className="action-tile-icon" />
                      <span>Create Coupon</span>
                    </button>
                    <button className="action-tile-btn" onClick={() => setActiveTab('products')}>
                      <FiLayers className="action-tile-icon" />
                      <span>Add Collection</span>
                    </button>
                    <button className="action-tile-btn" onClick={openAdd}>
                      <FiUpload className="action-tile-icon" />
                      <span>Bulk Upload</span>
                    </button>
                  </div>
                </div>

              </div>

              {/* Second row: Recent Orders & Stock */}
              <div className="overview-graphics-row alignment-row">
                
                {/* Left col: Recent Orders table */}
                <div className="overview-recent-orders-card table-section">
                  <div className="card-header-with-action">
                    <h3>Recent Orders</h3>
                    <button className="view-all-orders-text-btn" onClick={() => setActiveTab('orders')}>View All Orders</button>
                  </div>
                  <div className="gothic-table-wrapper">
                    <table className="gothic-dark-table">
                      <thead>
                        <tr>
                          <th>Order ID</th>
                          <th>Customer</th>
                          <th>Amount</th>
                          <th>Status</th>
                          <th>Date</th>
                        </tr>
                      </thead>
                      <tbody>
                        {orders.slice(0, 5).map(o => (
                          <tr key={o._id}>
                            <td className="id-font">#UCN{o._id.substring(18).toUpperCase()}</td>
                            <td>
                              <div className="customer-avatar-name-cell">
                                <img src="/images/ComBack.png" alt="Avatar" className="user-round-thumb" />
                                <span>{o.user?.name || o.shippingAddress?.fullName || 'Guest Customer'}</span>
                              </div>
                            </td>
                            <td className="gold-text">{formatPrice(o.totalPrice)}</td>
                            <td>
                              <span className={`status-badge-styled ${o.isDelivered ? 'delivered' : 'processing'}`}>
                                {o.isDelivered ? 'Delivered' : 'Processing'}
                              </span>
                            </td>
                            <td className="light-gray-text">{formatDate(o.createdAt)}</td>
                          </tr>
                        ))}
                        {/* Fallbacks if database is empty */}
                        {orders.length === 0 && (
                          <tr>
                            <td colSpan="5" style={{ textAlign: 'center', padding: '24px', color: '#737373' }}>
                              No orders registered yet.
                            </td>
                          </tr>
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Right col: Store performance & low stock */}
                <div className="graphics-card-group-column">
                  
                  {/* Store Performance */}
                  <div className="graphics-card inline-sub-card performance-panel">
                    <div className="card-header-with-action">
                      <h3>Store Performance</h3>
                      <button className="three-dots-btn">•••</button>
                    </div>
                    <div className="performance-row-align">
                      <p className="perf-text">
                        You're doing great! 🎉 Your store revenue has {Number(revenueGrowth) >= 0 ? 'increased' : 'decreased'} by{' '}
                        <strong className={Number(revenueGrowth) >= 0 ? 'green-txt' : 'red-txt'}>
                          {Math.abs(Number(revenueGrowth))}%
                        </strong>{' '}
                        compared to last week.
                      </p>
                      <div className="perf-mini-chart-bars">
                        <div className="perf-bar" style={{ height: '30%' }}></div>
                        <div className="perf-bar" style={{ height: '55%' }}></div>
                        <div className="perf-bar" style={{ height: '40%' }}></div>
                        <div className="perf-bar active" style={{ height: '80%' }}></div>
                      </div>
                    </div>
                  </div>

                  {/* Low Stock Items */}
                  <div className="graphics-card inline-sub-card low-stock-panel">
                    <div className="card-header-with-action">
                      <h3>Low Stock Products</h3>
                      <button className="view-all-orders-text-btn" onClick={() => setActiveTab('inventory')}>View All</button>
                    </div>
                    <div className="low-stock-items-stack">
                      {lowStockProducts.map(p => (
                        <div key={p._id} className="low-stock-item-row">
                          <img src={p.image} alt={p.name} className="low-stock-thumb" />
                          <div className="low-stock-meta">
                            <span className="low-stock-name">{p.name}</span>
                            <span className="low-stock-count-val">Stock: {p.countInStock}</span>
                          </div>
                          <span className={`low-stock-badge-tag ${p.countInStock <= 3 ? 'critical' : 'warning'}`}>
                            {p.countInStock <= 3 ? 'Critical' : 'Low Stock'}
                          </span>
                        </div>
                      ))}
                      {lowStockProducts.length === 0 && (
                        <div className="low-stock-empty-msg" style={{ padding: '12px', textAlign: 'center', color: '#737373', fontSize: '12px' }}>
                          All products are well stocked.
                        </div>
                      )}
                    </div>
                  </div>

                </div>

              </div>

            </div>
          )}

          {/* PRODUCTS CATALOG PANEL */}
          {activeTab === 'products' && (
            <div className="products-tab-view fade-in">
              {/* ANALYTICS SECTION */}
              <div className="products-analytics-grid">
                {/* Total Products Card */}
                <div className="analytics-card-item">
                  <div className="card-top-row">
                    <div className="icon-badge-box products-badge">
                      <FiPackage size={18} />
                    </div>
                    <span className="card-trend positive">↑ {products.length > 0 ? 'Healthy' : '0%'}</span>
                  </div>
                  <div className="card-value-box">
                    <span className="card-value-number">{products.length}</span>
                    <span className="card-value-label">Total Apparel Summoned</span>
                  </div>
                  <div className="card-sparkline-preview">
                    <svg viewBox="0 0 100 20" className="spark-svg">
                      <path d="M0,10 Q20,2 40,8 T80,5 T100,2" fill="none" stroke="#D4AF37" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Revenue Card */}
                <div className="analytics-card-item">
                  <div className="card-top-row">
                    <div className="icon-badge-box revenue-badge">
                      <FiDollarSign size={18} />
                    </div>
                    <span className="card-trend positive">↑ {revenueGrowth}%</span>
                  </div>
                  <div className="card-value-box">
                    <span className="card-value-number">{formatPrice(totalSalesVal)}</span>
                    <span className="card-value-label">Revenues In Flow</span>
                  </div>
                  <div className="card-sparkline-preview">
                    <svg viewBox="0 0 100 20" className="spark-svg">
                      <path d="M0,15 Q30,5 60,12 T100,4" fill="none" stroke="#6F5CFF" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Orders Card */}
                <div className="analytics-card-item">
                  <div className="card-top-row">
                    <div className="icon-badge-box orders-badge">
                      <FiShoppingBag size={18} />
                    </div>
                    <span className="card-trend positive">↑ {ordersGrowth}%</span>
                  </div>
                  <div className="card-value-box">
                    <span className="card-value-number">{orders.length}</span>
                    <span className="card-value-label">Orders Fulfilling</span>
                  </div>
                  <div className="card-sparkline-preview">
                    <svg viewBox="0 0 100 20" className="spark-svg">
                      <path d="M0,8 Q20,12 50,5 T100,9" fill="none" stroke="#22C55E" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Out Of Stock Card */}
                <div className="analytics-card-item">
                  <div className="card-top-row">
                    <div className="icon-badge-box stock-badge">
                      <FiAlertCircle size={18} />
                    </div>
                    <span className={`card-trend ${products.filter(p => p.countInStock === 0).length > 0 ? 'negative' : 'positive'}`}>
                      {products.filter(p => p.countInStock === 0).length > 0 ? 'Requires Sync' : 'Complete'}
                    </span>
                  </div>
                  <div className="card-value-box">
                    <span className="card-value-number">{products.filter(p => p.countInStock === 0).length}</span>
                    <span className="card-value-label">Apparel in the Void</span>
                  </div>
                  <div className="card-sparkline-preview">
                    <svg viewBox="0 0 100 20" className="spark-svg">
                      <path d="M0,18 L30,18 L60,18 L100,18" fill="none" stroke="#EF4444" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>

                {/* Categories Card */}
                <div className="analytics-card-item">
                  <div className="card-top-row">
                    <div className="icon-badge-box categories-badge">
                      <FiLayers size={18} />
                    </div>
                    <span className="card-trend positive">Active</span>
                  </div>
                  <div className="card-value-box">
                    <span className="card-value-number">{new Set(products.map(p => p.category)).size}</span>
                    <span className="card-value-label">Active Categories</span>
                  </div>
                  <div className="card-sparkline-preview">
                    <svg viewBox="0 0 100 20" className="spark-svg">
                      <path d="M0,5 Q40,15 70,5 T100,12" fill="none" stroke="#8E929E" strokeWidth="1.5" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* STICKY FILTER TOOLBAR */}
              <div className="products-sticky-toolbar">
                <div className="toolbar-left-filters">
                  <div className="filter-select-wrapper">
                    <FiFilter size={12} className="dropdown-decorator-icon" />
                    <select 
                      value={filterCategory} 
                      onChange={(e) => {
                        setFilterCategory(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="premium-filter-select"
                    >
                      <option value="">All Categories</option>
                      {categories.map(c => <option key={c._id || c} value={c.name || c}>{c.name || c}</option>)}
                    </select>
                  </div>

                  <div className="filter-select-wrapper">
                    <FiSliders size={12} className="dropdown-decorator-icon" />
                    <select 
                      value={filterStock} 
                      onChange={(e) => {
                        setFilterStock(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="premium-filter-select"
                    >
                      <option value="">All Stock Statuses</option>
                      <option value="in-stock">Healthy Stock (&gt; 5)</option>
                      <option value="low-stock">Low Stock (1 - 5)</option>
                      <option value="out-of-stock">Out of Stock (0)</option>
                    </select>
                  </div>

                  <div className="filter-select-wrapper">
                    <FiTag size={12} className="dropdown-decorator-icon" />
                    <select 
                      value={filterBadge} 
                      onChange={(e) => {
                        setFilterBadge(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="premium-filter-select"
                    >
                      <option value="">All Badges</option>
                      <option value="limited">Limited</option>
                      <option value="new">New</option>
                      <option value="best">Best Seller</option>
                      <option value="sale">Sale</option>
                    </select>
                  </div>

                  <div className="filter-select-wrapper">
                    <FiRefreshCw size={12} className="dropdown-decorator-icon" />
                    <select 
                      value={sortBy} 
                      onChange={(e) => {
                        setSortBy(e.target.value);
                        setCurrentPage(1);
                      }}
                      className="premium-filter-select"
                    >
                      <option value="newest">Sort: Newest Summoned</option>
                      <option value="price-asc">Sort: Price (Low to High)</option>
                      <option value="price-desc">Sort: Price (High to Low)</option>
                      <option value="stock-asc">Sort: Stock (Low to High)</option>
                      <option value="stock-desc">Sort: Stock (High to Low)</option>
                      <option value="name-asc">Sort: Alphabetical (A-Z)</option>
                      <option value="name-desc">Sort: Alphabetical (Z-A)</option>
                    </select>
                  </div>

                  {(filterCategory || filterStock || filterBadge || searchQuery || sortBy !== 'newest') && (
                    <button 
                      onClick={() => {
                        setFilterCategory('');
                        setFilterStock('');
                        setFilterBadge('');
                        setSortBy('newest');
                        setSearchQuery('');
                        setCurrentPage(1);
                      }} 
                      className="reset-filters-btn"
                    >
                      Reset Filters
                    </button>
                  )}
                </div>

                <div className="toolbar-right-actions">
                  {selectedProductIds.length > 0 && (
                    <div className="bulk-actions-wrapper">
                      <span className="selected-count-badge">{selectedProductIds.length} Selected</span>
                      <button onClick={handleBulkDelete} className="bulk-delete-action-btn">
                        <FiTrash2 size={12} /> Delete Selected
                      </button>
                    </div>
                  )}

                  <button onClick={handleExportCSV} className="export-data-btn">
                    <FiDownload size={12} /> Export CSV
                  </button>
                </div>
              </div>

              {/* PRODUCTS TABLE */}
              <div className="gothic-table-wrapper premium-saas-table-container">
                <table className="gothic-dark-table">
                  <thead>
                    <tr>
                      <th className="checkbox-col">
                        <input 
                          type="checkbox" 
                          onChange={handleSelectAll}
                          checked={paginatedProducts.length > 0 && selectedProductIds.length === paginatedProducts.length}
                        />
                      </th>
                      <th className="thumb-col">Item</th>
                      <th>Product Details</th>
                      <th>Price & Value</th>
                      <th>Stock Level</th>
                      <th>Summon Badge</th>
                      <th>Attributes</th>
                      <th className="actions-col"></th>
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map(prod => {
                      const originalPrice = prod.comparePrice || prod.price;
                      const hasDiscount = prod.comparePrice && prod.comparePrice > prod.price;
                      const discountPct = hasDiscount 
                        ? Math.round(((prod.comparePrice - prod.price) / prod.comparePrice) * 100)
                        : 0;
                      
                      const stockPct = Math.min((prod.countInStock / 50) * 100, 100);
                      const stockStatusClass = prod.countInStock === 0 ? 'empty' : prod.countInStock <= 5 ? 'critical' : 'healthy';

                      return (
                        <tr key={prod._id} className={selectedProductIds.includes(prod._id) ? 'row-selected' : ''}>
                          <td className="checkbox-col">
                            <input 
                              type="checkbox" 
                              checked={selectedProductIds.includes(prod._id)}
                              onChange={() => handleSelectOne(prod._id)}
                            />
                          </td>
                          <td className="thumb-col">
                            <div className="table-thumbnail-wrapper-zoom">
                              <img src={prod.image} alt={prod.name} className="gothic-table-thumb zoom-img" />
                            </div>
                          </td>
                          <td>
                            <div className="product-details-cell">
                              <span className="table-item-name">{prod.name}</span>
                              <div className="table-item-sku-row">
                                <span className="sku-label">{prod.sku}</span>
                                <span className="bullet">•</span>
                                <span className="category-label">{prod.category}</span>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div className="price-details-cell">
                              <div className="saas-price-line">
                                <span className="gold-text-price font-numeric">{formatPrice(prod.price)}</span>
                                {hasDiscount && (
                                  <span className="discount-badge-pct">-{discountPct}%</span>
                                )}
                              </div>
                              {hasDiscount && (
                                <span className="original-struck-price font-numeric">{formatPrice(prod.comparePrice)}</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="stock-level-cell">
                              <div className="stock-status-meta">
                                <span className={`stock-count-number ${stockStatusClass}`}>
                                  {prod.countInStock} Units
                                </span>
                                <span className={`stock-status-indicator-text ${stockStatusClass}`}>
                                  {prod.countInStock === 0 ? 'Void' : prod.countInStock <= 5 ? 'Low stock' : 'In stock'}
                                </span>
                              </div>
                              <div className="stock-progress-bar-track">
                                <div 
                                  className={`stock-progress-bar-fill ${stockStatusClass}`} 
                                  style={{ width: `${stockPct}%` }}
                                ></div>
                              </div>
                            </div>
                          </td>
                          <td>
                            {prod.badge ? (
                              <span className={`premium-pill-badge badge-${prod.badge.toLowerCase()}`}>
                                {prod.badge.toUpperCase()}
                              </span>
                            ) : (
                              <span className="premium-pill-badge badge-none">ESSENTIAL</span>
                            )}
                          </td>
                          <td>
                            <div className="attributes-cell">
                              <div className="sizes-pills-row">
                                {prod.sizes.map(sz => (
                                  <span key={sz} className="attribute-size-pill">{sz}</span>
                                ))}
                                {prod.sizes.length === 0 && <span className="no-attr-label">N/A</span>}
                              </div>
                              <span className="colorway-label-sub">{prod.color || 'Obsidian Black'}</span>
                            </div>
                          </td>
                          <td className="actions-col">
                            <div className="saas-actions-trigger-box">
                              <button 
                                className="saas-row-dots-menu-btn"
                                onClick={() => setActiveDropdownId(activeDropdownId === prod._id ? null : prod._id)}
                              >
                                <FiMoreVertical size={14} />
                              </button>
                              
                              {activeDropdownId === prod._id && (
                                <>
                                  <div className="saas-dropdown-overlay-click-shield" onClick={() => setActiveDropdownId(null)}></div>
                                  <div className="saas-row-action-dropdown-menu fade-in">
                                    <button onClick={() => { openEdit(prod); setActiveDropdownId(null); }} className="menu-action-item">
                                      <FiEdit2 size={12} /> Edit Details
                                    </button>
                                    <button onClick={() => { handleDuplicateProduct(prod); setActiveDropdownId(null); }} className="menu-action-item">
                                      <FiRefreshCw size={12} /> Duplicate Summon
                                    </button>
                                    <div className="saas-dropdown-divider-line"></div>
                                    <button onClick={() => { handleDeleteProduct(prod._id); setActiveDropdownId(null); }} className="menu-action-item danger">
                                      <FiTrash2 size={12} /> Delete Item
                                    </button>
                                  </div>
                                </>
                              )}
                            </div>
                          </td>
                        </tr>
                      );
                    })}

                    {paginatedProducts.length === 0 && (
                      <tr>
                        <td colSpan="8">
                          <div className="empty-gothic-state">
                            <FiAlertCircle size={40} className="empty-illustration-icon" />
                            <h3>Apparel Archives are Silent</h3>
                            <p>No products match your active search filters. Summon a new item or reset the filter scopes.</p>
                            <button 
                              onClick={() => {
                                setFilterCategory('');
                                setFilterStock('');
                                setFilterBadge('');
                                setSearchQuery('');
                                setCurrentPage(1);
                              }} 
                              className="gothic-cta-btn"
                            >
                              Reset Workspace Scopes
                            </button>
                          </div>
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>

              {/* PAGINATION PANEL */}
              {sortedProducts.length > itemsPerPage && (
                <div className="saas-pagination-toolbar">
                  <span className="pagination-text-stats">
                    Showing <strong>{(currentPage - 1) * itemsPerPage + 1}</strong> to <strong>{Math.min(currentPage * itemsPerPage, sortedProducts.length)}</strong> of <strong>{sortedProducts.length}</strong> apparel items
                  </span>
                  
                  <div className="pagination-buttons-nav">
                    <button 
                      className="pagination-arrow-btn"
                      onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                      disabled={currentPage === 1}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      return (
                        <button
                          key={pageNum}
                          className={`saas-number-btn ${currentPage === pageNum ? 'active' : ''}`}
                          onClick={() => setCurrentPage(pageNum)}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button 
                      className="saas-arrow-btn"
                      onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                      disabled={currentPage === totalPages}
                    >
                      Next
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* ORDERS CATALOG PANEL */}
          {activeTab === 'orders' && (
            <div className="orders-tab-view fade-in">
              <h2 className="section-title">ORDER WORKFLOW</h2>

              <div className="gothic-orders-stack">
                {filteredOrders.slice().reverse().map(order => (
                  <div key={order._id} className={`gothic-order-expansion-card ${expandedOrderId === order._id ? 'expanded' : ''}`}>
                    <div className="order-expansion-header" onClick={() => toggleOrder(order._id)}>
                      <div className="header-order-details">
                        <span className="order-id-label">#{order._id.substring(12).toUpperCase()}</span>
                        <span className="order-customer-name">{order.user?.name || 'Customer'}</span>
                        <span className="order-date-text">{formatDate(order.createdAt)}</span>
                      </div>
                      <div className="header-order-status">
                        <span className="order-price-total">{formatPrice(order.totalPrice)}</span>
                        <span className={`status-marker ${order.isDelivered ? 'delivered' : 'processing'}`}>
                          {order.isDelivered ? 'DELIVERED' : 'PROCESSING'}
                        </span>
                        {expandedOrderId === order._id ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
                      </div>
                    </div>

                    {expandedOrderId === order._id && (
                      <div className="order-expansion-body fade-in">
                        <div className="gothic-divider"></div>
                        
                        {/* Order Timeline Visual */}
                        <div className="order-timeline-stepper">
                          <div className="timeline-node completed">
                            <div className="node-dot">✓</div>
                            <span>Placed</span>
                          </div>
                          <div className={`timeline-line ${order.isPaid || order.paymentMethod !== 'COD' ? 'completed' : ''}`}></div>
                          <div className={`timeline-node ${order.isPaid || order.paymentMethod !== 'COD' ? 'completed' : 'pending'}`}>
                            <div className="node-dot">{order.isPaid || order.paymentMethod !== 'COD' ? '✓' : '•'}</div>
                            <span>Paid</span>
                          </div>
                          <div className={`timeline-line ${order.isPacked ? 'completed' : ''}`}></div>
                          <div className={`timeline-node ${order.isPacked ? 'completed' : 'pending'}`}>
                            <div className="node-dot">{order.isPacked ? '✓' : '•'}</div>
                            <span>Packed</span>
                          </div>
                          <div className={`timeline-line ${order.isShipped ? 'completed' : ''}`}></div>
                          <div className={`timeline-node ${order.isShipped ? 'completed' : 'pending'}`}>
                            <div className="node-dot">{order.isShipped ? '✓' : '•'}</div>
                            <span>Shipped</span>
                          </div>
                          <div className={`timeline-line ${order.isDelivered ? 'completed' : ''}`}></div>
                          <div className={`timeline-node ${order.isDelivered ? 'completed' : 'pending'}`}>
                            <div className="node-dot">{order.isDelivered ? '✓' : '•'}</div>
                            <span>Delivered</span>
                          </div>
                        </div>

                        <div className="expanded-details-layout">
                          <div className="items-list-box">
                            <h4>Customer Items ({order.orderItems.length})</h4>
                            <div className="items-rows-stack">
                              {order.orderItems.map((item, idx) => (
                                <div key={idx} className="item-row">
                                  <img src={item.image} alt={item.name} className="item-thumb" />
                                  <div className="item-meta">
                                    <span className="item-title">{item.name}</span>
                                    <span className="item-quantity">Qty: {item.qty} &nbsp;•&nbsp; {formatPrice(item.price)}</span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>

                          <div className="shipping-actions-box">
                            <h4>Shipping Info</h4>
                            <div className="shipping-address-summary">
                              <p><strong>Address:</strong> {order.shippingAddress.address}</p>
                              <p><strong>City:</strong> {order.shippingAddress.city}</p>
                              <p><strong>Postal Code:</strong> {order.shippingAddress.postalCode}</p>
                              <p><strong>Payment Method:</strong> {order.paymentMethod}</p>
                            </div>

                            {!order.isPacked ? (
                              <button 
                                className="gothic-cta-btn-wide"
                                onClick={() => markAsPacked(order._id)}
                                disabled={actionLoading}
                              >
                                {actionLoading ? 'UPDATING...' : 'MARK AS PACKED'}
                              </button>
                            ) : !order.isShipped ? (
                              <button 
                                className="gothic-cta-btn-wide"
                                onClick={() => markAsShipped(order._id)}
                                disabled={actionLoading}
                              >
                                {actionLoading ? 'UPDATING...' : 'MARK AS SHIPPED'}
                              </button>
                            ) : !order.isDelivered ? (
                              <button 
                                className="gothic-cta-btn-wide"
                                onClick={() => markAsDelivered(order._id)}
                                disabled={actionLoading}
                              >
                                {actionLoading ? 'UPDATING...' : 'MARK AS DELIVERED'}
                              </button>
                            ) : null}

                            <div className="order-status-timestamps" style={{ marginTop: '1rem', display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                              {order.isPacked && order.packedAt && (
                                <div className="delivered-timestamp">
                                  ✓ Package Packed on {formatDate(order.packedAt)}
                                </div>
                              )}
                              {order.isShipped && order.shippedAt && (
                                <div className="delivered-timestamp">
                                  ✓ Package Shipped on {formatDate(order.shippedAt)}
                                </div>
                              )}
                              {order.isDelivered && order.deliveredAt && (
                                <div className="delivered-timestamp">
                                  ✓ Package Delivered on {formatDate(order.deliveredAt)}
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* CATEGORIES ARCHIVE PANEL */}
          {activeTab === 'categories' && (
            <div className="categories-tab-view fade-in">
              <h2 className="section-title">CATEGORIES ARCHIVE</h2>
              
              <div className="categories-split-layout" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Left: Category list table */}
                <div className="gothic-table-wrapper">
                  <table className="gothic-dark-table">
                    <thead>
                      <tr>
                        <th>Category Name</th>
                        <th>Associated Products</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {categories.map((c) => {
                        const count = products.filter(p => p.category === c.name).length;
                        const isEditing = editingCategoryId === c._id;
                        
                        return (
                          <tr key={c._id || c}>
                            <td>
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editingCategoryName} 
                                  onChange={(e) => setEditingCategoryName(e.target.value)} 
                                  className="gothic-input"
                                  style={{ padding: '0.25rem 0.5rem', width: '90%' }}
                                />
                              ) : (
                                <span style={{ fontWeight: '500', color: 'var(--color-gold)' }}>{c.name || c}</span>
                              )}
                            </td>
                            <td>
                              <span className={`gothic-badge ${count > 0 ? 'badge-primary' : 'badge-secondary'}`} style={{
                                display: 'inline-block',
                                padding: '0.2rem 0.6rem',
                                borderRadius: '4px',
                                fontSize: '0.7rem',
                                fontWeight: '600',
                                backgroundColor: count > 0 ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)',
                                color: count > 0 ? 'var(--color-gold)' : 'var(--text-muted)',
                                border: count > 0 ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)'
                              }}>
                                {count} {count === 1 ? 'Product' : 'Products'}
                              </span>
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                {isEditing ? (
                                  <>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => handleUpdateCategory(c._id)}
                                      style={{ backgroundColor: 'var(--color-success)', color: '#000' }}
                                    >
                                      Save
                                    </button>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => { setEditingCategoryId(null); setEditingCategoryName(''); }}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => { setEditingCategoryId(c._id); setEditingCategoryName(c.name); }}
                                      disabled={!c._id}
                                      style={{ opacity: !c._id ? 0.3 : 1 }}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      className="gothic-table-btn danger-hover" 
                                      onClick={() => handleDeleteCategory(c._id)}
                                      disabled={count > 0 || !c._id}
                                      style={{
                                        opacity: (count > 0 || !c._id) ? 0.3 : 1,
                                        cursor: (count > 0 || !c._id) ? 'not-allowed' : 'pointer'
                                      }}
                                      title={count > 0 ? "Cannot delete category containing products" : "Delete category"}
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {categories.length === 0 && (
                        <tr>
                          <td colSpan="3" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No categories found. Summon your first category!
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Right: Summon Category Form */}
                <div className="graphics-card form-box-card">
                  <h3 style={{ borderBottom: '1px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1rem', fontSize: '1rem' }}>Summon New Category</h3>
                  <form onSubmit={handleAddCategory} className="config-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                      <label style={{ fontSize: '0.75rem', fontWeight: '600', color: 'var(--text-muted)' }}>Category Name *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Bomber Jackets" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <button 
                      type="submit" 
                      className="summon-action-cta-btn" 
                      disabled={actionLoading}
                      style={{ width: '100%', marginTop: '0.5rem', display: 'flex', gap: '0.5rem', justifyContent: 'center', alignItems: 'center' }}
                    >
                      <FiPlus size={14} /> SUMMON CATEGORY
                    </button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* CUSTOMERS PANEL */}
          {activeTab === 'customers' && (
            <div className="customers-tab-view fade-in">
              <h2 className="section-title">CUSTOMERS INDEX</h2>

              <div className="gothic-table-wrapper">
                <table className="gothic-dark-table">
                  <thead>
                    <tr>
                      <th>Account ID</th>
                      <th>Customer Name</th>
                      <th>Email Address</th>
                      <th>Total Spending</th>
                      <th>Access Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {users.map(u => (
                      <tr key={u._id}>
                        <td className="id-font">#{u._id.substring(18).toUpperCase()}</td>
                        <td><strong>{u.name}</strong></td>
                        <td>{u.email}</td>
                        <td className="gold-text">{formatPrice(u.totalSpent || 0)}</td>
                        <td>
                          <span className={`status-badge-role ${u.blocked ? 'blocked' : 'active'}`}>
                            {u.blocked ? 'BLOCKED' : 'ACTIVE'}
                          </span>
                        </td>
                        <td>
                          <div className="role-actions-row">
                            <button 
                              className="gothic-table-btn"
                              onClick={() => toggleBlockCustomer(u._id, u.blocked)}
                              disabled={u._id === user._id}
                            >
                              {u.blocked ? 'Unblock Account' : 'Block Customer'}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* INVENTORY PANEL */}
          {activeTab === 'inventory' && (
            <div className="inventory-tab-view fade-in">
              <h2 className="section-title">STORE INVENTORY</h2>
              <div className="gothic-table-wrapper">
                <table className="gothic-dark-table">
                  <thead>
                    <tr>
                      <th>Product</th>
                      <th>Category</th>
                      <th>Stock Quantity</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {products.map(p => (
                      <tr key={p._id}>
                        <td><strong>{p.name}</strong></td>
                        <td>{p.category}</td>
                        <td className="gold-text">{p.countInStock} Units</td>
                        <td>
                          <span className={`low-stock-badge-tag ${p.countInStock <= 3 ? 'critical' : p.countInStock <= 8 ? 'warning' : 'active'}`}>
                            {p.countInStock <= 3 ? 'Critical' : p.countInStock <= 8 ? 'Low Stock' : 'In Stock'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* COUPONS PANEL */}
          {activeTab === 'coupons' && (
            <div className="coupons-tab-view fade-in">
              <h2 className="section-title">PROMOTION COUPONS</h2>
              
              <div className="grid-2-col">
                <div className="graphics-card">
                  <h3>Active Coupons</h3>
                  <div className="bullet-list" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    {coupons.map((c, i) => {
                      const isExpired = c.expiry && new Date() > new Date(c.expiry);
                      return (
                        <div key={i} className="bullet-list-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.5rem 0', borderBottom: '1px dashed rgba(255,255,255,0.05)' }}>
                          <div>
                            <strong>{c.code}</strong> ({c.type === 'percentage' ? `${c.value}% Off` : `₹${c.value} Off`})
                            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                              Min Order: ₹{c.minOrder} • Expiry: {c.expiry || 'N/A'} {isExpired && <span style={{ color: 'red', fontWeight: 'bold' }}>(EXPIRED)</span>}
                            </div>
                          </div>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className="light-gray-text" style={{ fontSize: '0.7rem', color: isExpired ? 'red' : 'green' }}>
                              {isExpired ? 'Expired' : 'Active'}
                            </span>
                            <button 
                              onClick={() => handleDeleteCoupon(c.code)}
                              className="gothic-table-btn danger-hover"
                              style={{ padding: '0.25rem 0.5rem', minWidth: 'auto', marginLeft: '0.5rem' }}
                              title="Delete Coupon"
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="graphics-card">
                  <h3>Register New Coupon</h3>
                  <form onSubmit={handleAddCoupon} className="config-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Code *</label>
                      <input 
                        type="text" 
                        placeholder="Coupon code..." 
                        value={newCouponCode}
                        onChange={(e) => setNewCouponCode(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Type *</label>
                      <select 
                        value={newCouponType} 
                        onChange={(e) => setNewCouponType(e.target.value)}
                        className="gothic-input"
                      >
                        <option value="percentage">Percentage Discount</option>
                        <option value="flat">Flat Cash Discount</option>
                      </select>
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Value *</label>
                      <input 
                        type="number" 
                        placeholder="Discount value..." 
                        value={newCouponValue}
                        onChange={(e) => setNewCouponValue(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Minimum Order Amount (₹) *</label>
                      <input 
                        type="number" 
                        placeholder="e.g. 1500" 
                        value={newCouponMinOrder}
                        onChange={(e) => setNewCouponMinOrder(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Expiry Date *</label>
                      <input 
                        type="date" 
                        value={newCouponExpiry}
                        onChange={(e) => setNewCouponExpiry(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <button type="submit" className="gothic-cta-btn" style={{ marginTop: '0.5rem' }}>SAVE PROMO</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* REVIEWS PANEL */}
          {activeTab === 'reviews' && (
            <div className="reviews-tab-view fade-in">
              <h2 className="section-title">REVIEWS & RATINGS</h2>

              <div className="gothic-table-wrapper">
                <table className="gothic-dark-table">
                  <thead>
                    <tr>
                      <th>Customer</th>
                      <th>Product</th>
                      <th>Rating</th>
                      <th>Comment</th>
                      <th>Status</th>
                      <th>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {reviews.map(r => (
                      <tr key={r._id || r.id}>
                        <td>{r.user?.name || r.customer || 'Anonymous User'}</td>
                        <td>{r.product?.name || r.product || 'Unknown Product'}</td>
                        <td className="gold-text">{'★'.repeat(r.rating)}</td>
                        <td>"{r.comment}"</td>
                        <td>
                          <span className={`status-badge-role ${r.status === 'approved' ? 'active' : 'pending'}`}>
                            {r.status.toUpperCase()}
                          </span>
                        </td>
                        <td>
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            {r.status === 'pending' && (
                              <button 
                                className="gothic-table-btn"
                                onClick={() => handleApproveReview(r._id)}
                                style={{ backgroundColor: 'var(--color-success)', color: '#000' }}
                              >
                                Approve
                              </button>
                            )}
                            <button 
                              className="gothic-table-btn danger-hover"
                              onClick={() => handleDeleteReview(r._id)}
                            >
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* FAQ CRUD PANEL */}
          {activeTab === 'faq' && (
            <div className="faq-admin-view fade-in">
              <h2 className="section-title">FAQ MANAGEMENT</h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '2rem', alignItems: 'start' }}>
                {/* Left: FAQ List */}
                <div className="gothic-table-wrapper">
                  <table className="gothic-dark-table">
                    <thead>
                      <tr>
                        <th>Category</th>
                        <th>Question</th>
                        <th>Answer</th>
                        <th style={{ textAlign: 'right', minWidth: '120px' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {faqs.map(f => {
                        const isEditing = editingFaqId === f._id;
                        return (
                          <tr key={f._id}>
                            <td>
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editingFaqCategory} 
                                  onChange={(e) => setEditingFaqCategory(e.target.value)} 
                                  className="gothic-input"
                                  style={{ padding: '0.25rem', width: '90%' }}
                                />
                              ) : (
                                <span className="light-gray-text">{f.category}</span>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <input 
                                  type="text" 
                                  value={editingFaqQuestion} 
                                  onChange={(e) => setEditingFaqQuestion(e.target.value)} 
                                  className="gothic-input"
                                  style={{ padding: '0.25rem', width: '90%' }}
                                />
                              ) : (
                                <strong>{f.question}</strong>
                              )}
                            </td>
                            <td>
                              {isEditing ? (
                                <textarea 
                                  value={editingFaqAnswer} 
                                  onChange={(e) => setEditingFaqAnswer(e.target.value)} 
                                  className="gothic-input"
                                  style={{ padding: '0.25rem', width: '95%', minHeight: '60px' }}
                                />
                              ) : (
                                <span style={{ fontSize: '0.8rem', opacity: 0.85 }}>{f.answer}</span>
                              )}
                            </td>
                            <td style={{ textAlign: 'right' }}>
                              <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end' }}>
                                {isEditing ? (
                                  <>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => handleUpdateFaq(f._id)}
                                      style={{ backgroundColor: 'var(--color-success)', color: '#000' }}
                                    >
                                      Save
                                    </button>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => setEditingFaqId(null)}
                                    >
                                      Cancel
                                    </button>
                                  </>
                                ) : (
                                  <>
                                    <button 
                                      className="gothic-table-btn" 
                                      onClick={() => {
                                        setEditingFaqId(f._id);
                                        setEditingFaqQuestion(f.question);
                                        setEditingFaqAnswer(f.answer);
                                        setEditingFaqCategory(f.category);
                                      }}
                                    >
                                      Edit
                                    </button>
                                    <button 
                                      className="gothic-table-btn danger-hover" 
                                      onClick={() => handleDeleteFaq(f._id)}
                                    >
                                      <FiTrash2 size={12} />
                                    </button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        );
                      })}
                      {faqs.length === 0 && (
                        <tr>
                          <td colSpan="4" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No FAQ items registered.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>

                {/* Right: Create FAQ Form */}
                <div className="graphics-card">
                  <h3>Summon FAQ Question</h3>
                  <form onSubmit={handleAddFaq} className="config-form-group" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Category *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. Shipping" 
                        value={newFaqCategory}
                        onChange={(e) => setNewFaqCategory(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Question *</label>
                      <input 
                        type="text" 
                        placeholder="e.g. How to return?" 
                        value={newFaqQuestion}
                        onChange={(e) => setNewFaqQuestion(e.target.value)}
                        className="gothic-input" 
                        required 
                      />
                    </div>
                    <div className="form-group-field">
                      <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Answer *</label>
                      <textarea 
                        placeholder="FAQ answer body..." 
                        value={newFaqAnswer}
                        onChange={(e) => setNewFaqAnswer(e.target.value)}
                        className="gothic-input" 
                        style={{ minHeight: '100px', resize: 'vertical' }}
                        required 
                      />
                    </div>
                    <button type="submit" className="summon-action-cta-btn" style={{ width: '100%' }}>SUMMON FAQ</button>
                  </form>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT TICKETS HELPDESK PANEL */}
          {activeTab === 'tickets' && (
            <div className="tickets-admin-view fade-in">
              <h2 className="section-title">TICKET HELPDESK</h2>

              {activeTicketId ? (
                (() => {
                  const ticket = tickets.find(t => t._id === activeTicketId);
                  if (!ticket) return <p>Ticket not found.</p>;
                  return (
                    <div className="ticket-detail-panel fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                      <button 
                        onClick={() => setActiveTicketId(null)}
                        className="gothic-table-btn"
                        style={{ width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        ← BACK TO TICKET LIST
                      </button>

                      <div className="graphics-card" style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                          <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-gold)' }}>{ticket.subject}</h4>
                          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                            <span className={`status-badge-role ${ticket.status === 'Resolved' ? 'active' : (ticket.status === 'In Progress' ? 'pending' : '')}`} style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.6rem',
                              borderRadius: '4px',
                              fontSize: '0.7rem',
                              fontWeight: '600',
                              backgroundColor: ticket.status === 'Resolved' ? 'rgba(40, 167, 69, 0.15)' : (ticket.status === 'In Progress' ? 'rgba(212, 175, 55, 0.15)' : 'rgba(255, 255, 255, 0.05)'),
                              color: ticket.status === 'Resolved' ? 'var(--color-success)' : (ticket.status === 'In Progress' ? 'var(--color-gold)' : 'var(--text-muted)'),
                              border: ticket.status === 'Resolved' ? '1px solid rgba(40, 167, 69, 0.3)' : (ticket.status === 'In Progress' ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid rgba(255, 255, 255, 0.1)')
                            }}>
                              {ticket.status.toUpperCase()}
                            </span>
                            {ticket.status !== 'Resolved' && (
                              <button 
                                onClick={() => handleResolveTicket(ticket._id)}
                                className="gothic-table-btn"
                                style={{ backgroundColor: 'var(--color-success)', color: '#000', padding: '0.25rem 0.5rem', fontSize: '0.7rem' }}
                              >
                                Mark Resolved
                              </button>
                            )}
                          </div>
                        </div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                          Customer: <strong>{ticket.user?.name}</strong> ({ticket.user?.email}) • Opened on {new Date(ticket.createdAt).toLocaleString()} • ID: {ticket._id}
                        </div>
                        <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-gold)', borderRadius: '0 4px 4px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                          {ticket.description}
                        </div>
                      </div>

                      {/* Conversation History replies */}
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                        <h5 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Conversation Dialogue</h5>
                        
                        {ticket.replies && ticket.replies.length > 0 ? (
                          ticket.replies.map((rep) => {
                            const isAdmin = rep.sender === 'Admin';
                            return (
                              <div 
                                key={rep._id} 
                                style={{
                                  display: 'flex',
                                  flexDirection: 'column',
                                  padding: '0.75rem 1rem',
                                  borderRadius: '4px',
                                  maxWidth: '85%',
                                  backgroundColor: isAdmin ? 'rgba(212, 175, 55, 0.05)' : 'rgba(255,255,255,0.02)',
                                  border: isAdmin ? '1px solid rgba(212,175,55,0.15)' : '1px solid rgba(255,255,255,0.04)',
                                  alignSelf: isAdmin ? 'flex-end' : 'flex-start'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                                  <span style={{ color: isAdmin ? 'var(--color-gold)' : 'var(--text-muted)' }}>{rep.sender === 'Admin' ? 'YOU (ADMINISTRATOR)' : 'CUSTOMER'}</span>
                                  <span>{new Date(rep.createdAt).toLocaleString()}</span>
                                </div>
                                <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>{rep.message}</p>
                              </div>
                            );
                          })
                        ) : (
                          <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>No responses posted yet.</p>
                        )}
                      </div>

                      {/* Reply Input Form */}
                      {ticket.status !== 'Resolved' ? (
                        <form onSubmit={(e) => handleSendAdminReply(e, ticket._id)} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'stretch' }}>
                          <input 
                            type="text" 
                            placeholder="Write your support message response..." 
                            value={ticketReplyText}
                            onChange={(e) => setTicketReplyText(e.target.value)}
                            className="gothic-input"
                            style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                            required
                          />
                          <button type="submit" className="summon-action-cta-btn" style={{ padding: '0 1.5rem', fontSize: '0.8rem' }}>POST REPLY</button>
                        </form>
                      ) : (
                        <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                          This support ticket is resolved and closed.
                        </div>
                      )}
                    </div>
                  );
                })()
              ) : (
                <div className="gothic-table-wrapper">
                  <table className="gothic-dark-table">
                    <thead>
                      <tr>
                        <th>Date</th>
                        <th>Customer</th>
                        <th>Subject</th>
                        <th>Status</th>
                        <th style={{ textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {tickets.map(t => (
                        <tr key={t._id}>
                          <td>{new Date(t.createdAt).toLocaleDateString()}</td>
                          <td>
                            <strong>{t.user?.name || 'Unknown User'}</strong>
                            <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{t.user?.email}</div>
                          </td>
                          <td style={{ fontWeight: '500' }}>{t.subject}</td>
                          <td>
                            <span className={`status-badge-role ${t.status === 'Resolved' ? 'active' : (t.status === 'In Progress' ? 'pending' : '')}`} style={{
                              display: 'inline-block',
                              padding: '0.15rem 0.5rem',
                              borderRadius: '4px',
                              fontSize: '0.65rem',
                              fontWeight: '600',
                              backgroundColor: t.status === 'Resolved' ? 'rgba(40, 167, 69, 0.12)' : (t.status === 'In Progress' ? 'rgba(212, 175, 55, 0.12)' : 'rgba(255, 255, 255, 0.05)'),
                              color: t.status === 'Resolved' ? 'var(--color-success)' : (t.status === 'In Progress' ? 'var(--color-gold)' : 'var(--text-muted)'),
                              border: t.status === 'Resolved' ? '1px solid rgba(40, 167, 69, 0.2)' : (t.status === 'In Progress' ? '1px solid rgba(212, 175, 55, 0.2)' : '1px solid rgba(255, 255, 255, 0.08)')
                            }}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ textAlign: 'right' }}>
                            <button 
                              className="gothic-table-btn" 
                              onClick={() => setActiveTicketId(t._id)}
                            >
                              Manage Thread
                            </button>
                          </td>
                        </tr>
                      ))}
                      {tickets.length === 0 && (
                        <tr>
                          <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)' }}>
                            No support tickets summoned.
                          </td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* SETTINGS & BACKEND CONFS */}
          {activeTab === 'settings' && (
            <div className="settings-tab-view fade-in">
              <h2 className="section-title">STORE CONFIGURATIONS</h2>

              <div className="graphics-card settings-box-container">
                <form onSubmit={handleSaveSettings} className="settings-form">
                  <div className="form-group-field">
                    <label>Website Name</label>
                    <input 
                      type="text" 
                      value={storeName}
                      onChange={(e) => setStoreName(e.target.value)}
                      className="gothic-input"
                    />
                  </div>

                  <div className="form-group-field">
                    <label>Support Contact Email</label>
                    <input 
                      type="email" 
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      className="gothic-input"
                    />
                  </div>

                  <div className="form-checkbox-field">
                    <input 
                      type="checkbox" 
                      id="maintenance"
                      checked={maintenanceMode}
                      onChange={(e) => setMaintenanceMode(e.target.checked)}
                    />
                    <label htmlFor="maintenance">Enable Maintenance Mode</label>
                  </div>

                  <button type="submit" className="gothic-cta-btn">SAVE SETTINGS</button>
                </form>
              </div>
            </div>
          )}

          {/* LOOKBOOK PANEL */}
          {activeTab === 'lookbook' && (
            <div className="lookbook-tab-view fade-in">
              <div className="tab-layout-with-form-aside">
                <div className="tab-main-content-column">
                  {lookbooks.length === 0 ? (
                    <div className="empty-gothic-state">
                      <FiLock size={48} className="empty-illustration-icon" style={{ color: 'var(--color-gold)' }} />
                      <h3>No Campaigns Summoned</h3>
                      <p>Use the side panel to summon your first lookbook campaign to the catalog archives.</p>
                    </div>
                  ) : (
                    <div className="lookbooks-grid-layout">
                      {lookbooks.map(lb => (
                        <div key={lb._id} className="lookbook-editorial-card">
                          <div className="editorial-image-wrapper">
                            <img src={lb.image} alt={lb.title} className="editorial-thumb" />
                            <span className={`editorial-status-badge ${lb.status.toLowerCase()}`}>{lb.status.toUpperCase()}</span>
                          </div>
                          <div className="editorial-details-row">
                            <div className="editorial-meta">
                              <h4>{lb.title}</h4>
                              <span>{lb.season} • {lb.itemsCount} garments</span>
                            </div>
                            <div className="editorial-actions-box">
                              <button 
                                className="gothic-table-btn" 
                                onClick={() => toggleLookbookStatus(lb._id)}
                              >
                                {lb.status === 'Published' ? 'Draft' : 'Publish'}
                              </button>
                              <button 
                                className="gothic-table-btn danger-hover" 
                                onClick={() => handleDeleteLookbook(lb._id)}
                              >
                                <FiTrash2 size={12} />
                              </button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tab-sidebar-form-column">
                  <div className="graphics-card form-box-card">
                    <h3>Summon New Lookbook</h3>
                    <form onSubmit={handleAddLookbook} className="config-form-group">
                      <div className="form-group-field">
                        <label>Lookbook Title *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Obsidian Shadows" 
                          value={newLookbookTitle}
                          onChange={(e) => setNewLookbookTitle(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field">
                        <label>Season *</label>
                        <select 
                          value={newLookbookSeason}
                          onChange={(e) => setNewLookbookSeason(e.target.value)}
                          className="gothic-input"
                        >
                          <option value="Autumn/Winter 2025">Autumn/Winter 2025</option>
                          <option value="Spring 2025">Spring 2025</option>
                          <option value="Summer 2025">Summer 2025</option>
                          <option value="Winter 2025">Winter 2025</option>
                        </select>
                      </div>
                      <div className="form-group-field">
                        <label>Editorial Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleLookbookImageUpload}
                          className="gothic-input" 
                        />
                        {newLookbookImage && (
                          <div className="image-preview-wrapper" style={{ marginTop: '0.5rem' }}>
                            <img src={newLookbookImage} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          </div>
                        )}
                      </div>
                      <button type="submit" className="gothic-cta-btn">SUMMON LOOKBOOK</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* LIMITED DROPS PANEL */}
          {activeTab === 'limited-drops' && (
            <div className="limited-drops-tab-view fade-in">
              <div className="tab-layout-with-form-aside">
                <div className="tab-main-content-column">
                  <div className="gothic-table-wrapper">
                    <table className="gothic-dark-table">
                      <thead>
                        <tr>
                          <th>Drop Name</th>
                          <th>Launch Date</th>
                          <th>Price</th>
                          <th>Allocated Stock</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {drops.map(d => {
                          const launchTime = new Date(d.launchDate);
                          const timeDiff = launchTime - currentTime;
                          const isLive = timeDiff <= 0 && d.stock > 0;
                          const isSoldOut = d.stock === 0;
                          const statusText = isSoldOut ? 'Sold Out' : isLive ? 'Live' : 'Scheduled';
                          const statusClass = isSoldOut ? 'blocked' : isLive ? 'active' : 'pending';

                          const formatCountdown = (diffMs) => {
                            const diffSecs = Math.max(0, Math.floor(diffMs / 1000));
                            const days = Math.floor(diffSecs / (3600 * 24));
                            const hours = Math.floor((diffSecs % (3600 * 24)) / 3600);
                            const mins = Math.floor((diffSecs % 3600) / 60);
                            const secs = diffSecs % 60;
                            
                            const parts = [];
                            if (days > 0) parts.push(`${days}d`);
                            parts.push(`${String(hours).padStart(2, '0')}h`);
                            parts.push(`${String(mins).padStart(2, '0')}m`);
                            parts.push(`${String(secs).padStart(2, '0')}s`);
                            return parts.join(' ');
                          };

                          return (
                            <tr key={d._id}>
                              <td className="gold-text" style={{ fontWeight: '700' }}>{d.name}</td>
                              <td>
                                <div>{formatDate(d.launchDate)}</div>
                                {timeDiff > 0 && (
                                  <div className="countdown-ticking-timer font-numeric" style={{ color: 'var(--color-gold)', fontSize: '0.75rem', marginTop: '0.25rem', fontWeight: '600' }}>
                                    Launches in: {formatCountdown(timeDiff)}
                                  </div>
                                )}
                              </td>
                              <td className="gold-text">{formatPrice(d.price)}</td>
                              <td>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
                                  <span>{d.stock} Units</span>
                                  {isLive && (
                                    <div className="drop-stock-progress-wrapper" style={{ width: '120px' }}>
                                      <div className="stock-progress-bar-track" style={{ height: '3px', backgroundColor: 'var(--border-color)', borderRadius: '2px', overflow: 'hidden' }}>
                                        <div className="stock-progress-bar-fill healthy" style={{ width: '65%', height: '100%', backgroundColor: 'var(--color-success)' }}></div>
                                      </div>
                                      <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>65% remaining</span>
                                    </div>
                                  )}
                                </div>
                              </td>
                              <td>
                                <span className={`status-badge-role ${statusClass}`} style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                                  <span className={`pulsing-dot-indicator ${statusClass}`}></span>
                                  {statusText}
                                </span>
                              </td>
                              <td>
                                <button className="gothic-table-btn danger-hover" onClick={() => handleDeleteDrop(d._id)}>
                                  <FiTrash2 size={12} />
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tab-sidebar-form-column">
                  <div className="graphics-card form-box-card">
                    <h3>Schedule New Drop</h3>
                    <form onSubmit={handleAddDrop} className="config-form-group">
                      <div className="form-group-field">
                        <label>Drop Item Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Velvet Trenchcoat" 
                          value={newDropName}
                          onChange={(e) => setNewDropName(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field">
                        <label>Launch Time *</label>
                        <input 
                          type="datetime-local" 
                          value={newDropDate}
                          onChange={(e) => setNewDropDate(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="grid-2-col">
                        <div className="form-group-field">
                          <label>Price (INR) *</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 5999" 
                            value={newDropPrice}
                            onChange={(e) => setNewDropPrice(e.target.value)}
                            className="gothic-input" 
                            required 
                          />
                        </div>
                        <div className="form-group-field">
                          <label>Stock *</label>
                          <input 
                            type="number" 
                            placeholder="e.g. 50" 
                            value={newDropStock}
                            onChange={(e) => setNewDropStock(e.target.value)}
                            className="gothic-input" 
                            required 
                          />
                        </div>
                      </div>
                      <div className="form-group-field">
                        <label>Drop Image</label>
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={handleDropImageUpload}
                          className="gothic-input" 
                        />
                        {newDropImage && (
                          <div className="image-preview-wrapper" style={{ marginTop: '0.5rem' }}>
                            <img src={newDropImage} alt="Preview" style={{ width: '80px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                          </div>
                        )}
                      </div>
                      <button type="submit" className="gothic-cta-btn">SCHEDULE DROP</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* CMS PANEL */}
          {activeTab === 'cms' && (
            <div className="cms-tab-view fade-in">
              <div className="cms-layout-split">
                <div className="cms-main-list-column">
                  <div className="gothic-table-wrapper">
                    <table className="gothic-dark-table">
                      <thead>
                        <tr>
                          <th>Page Title</th>
                          <th>Layout Section</th>
                          <th>Status</th>
                          <th>Last Updated</th>
                          <th>Author</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {cmsPages.map(page => (
                          <tr key={page._id} className={editingCmsId === page._id ? 'row-selected' : ''}>
                            <td className="gold-text" style={{ fontWeight: '700' }}>{page.title}</td>
                            <td>{page.section}</td>
                            <td>
                              <span className={`status-badge-role ${page.status === 'Active' ? 'active' : 'pending'}`}>
                                {page.status}
                              </span>
                            </td>
                            <td>{formatDate(page.lastUpdated)}</td>
                            <td>{page.updatedBy}</td>
                            <td>
                              <button className="gothic-table-btn" onClick={() => handleEditCms(page)}>
                                Edit Content
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {editingCmsId && (
                  <div className="cms-editing-pane-card fade-in">
                    <div className="graphics-card">
                      <div className="card-header-with-action" style={{ marginBottom: '1rem' }}>
                        <h3>Configure Text Assets</h3>
                        <button className="close-gothic-btn" onClick={() => setEditingCmsId(null)}><FiX size={16} /></button>
                      </div>
                      
                      <form onSubmit={handleSaveCms} className="config-form-group">
                        {editingCmsId === 'CMS-01' ? (
                          <>
                            <div className="form-group-field">
                              <label>Hero Title *</label>
                              <input 
                                type="text" 
                                value={cmsEditHeroTitle}
                                onChange={(e) => setCmsEditHeroTitle(e.target.value)}
                                className="gothic-input"
                                required
                              />
                            </div>
                            <div className="form-group-field">
                              <label>Hero Subtitle *</label>
                              <textarea 
                                value={cmsEditHeroSubtitle}
                                onChange={(e) => setCmsEditHeroSubtitle(e.target.value)}
                                className="gothic-textarea"
                                rows="3"
                                required
                              ></textarea>
                            </div>
                          </>
                        ) : (
                          <div className="form-group-field">
                            <label>Content Body Text *</label>
                            <textarea 
                              value={cmsEditTextContent}
                              onChange={(e) => setCmsEditTextContent(e.target.value)}
                              className="gothic-textarea"
                              rows="6"
                              required
                            ></textarea>
                          </div>
                        )}
                        <button type="submit" className="gothic-cta-btn">SYNCHRONIZE PAGE</button>
                      </form>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* FAQ PANEL */}
          {activeTab === 'faq' && (
            <div className="faq-tab-view fade-in">
              <div className="tab-layout-with-form-aside">
                <div className="tab-main-content-column">
                  {faqs.length === 0 ? (
                    <div className="empty-gothic-state">
                      <FiLock size={48} className="empty-illustration-icon" style={{ color: 'var(--color-gold)' }} />
                      <h3>No FAQs Summoned</h3>
                      <p>Register your first Frequently Asked Question using the side panel form.</p>
                    </div>
                  ) : (
                    <div className="faqs-accordion-stack">
                      {faqs.map(faq => (
                        <div key={faq._id} className="faq-accordion-card">
                          <div className="faq-accordion-header">
                            <span className="faq-category-bubble">{faq.category}</span>
                            <h4>{faq.question}</h4>
                            <button className="gothic-table-btn danger-hover" onClick={() => handleDeleteFaq(faq._id)}>
                              <FiTrash2 size={12} />
                            </button>
                          </div>
                          <div className="faq-accordion-body">
                            <p>{faq.answer}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                <div className="tab-sidebar-form-column">
                  <div className="graphics-card form-box-card">
                    <h3>Register FAQ Q&A</h3>
                    <form onSubmit={handleAddFaq} className="config-form-group">
                      <div className="form-group-field">
                        <label>Category *</label>
                        <select 
                          value={newFaqCategory}
                          onChange={(e) => setNewFaqCategory(e.target.value)}
                          className="gothic-input"
                        >
                          <option value="Shipping">Shipping</option>
                          <option value="Care">Garment Care</option>
                          <option value="Returns">Returns & Refunds</option>
                          <option value="General">General Inquiries</option>
                        </select>
                      </div>
                      <div className="form-group-field">
                        <label>Question *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. How long does shipping take?" 
                          value={newFaqQuestion}
                          onChange={(e) => setNewFaqQuestion(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field">
                        <label>Answer *</label>
                        <textarea 
                          placeholder="e.g. Shipping takes 3-5 business days." 
                          value={newFaqAnswer}
                          onChange={(e) => setNewFaqAnswer(e.target.value)}
                          className="gothic-textarea" 
                          rows="4"
                          required 
                        ></textarea>
                      </div>
                      <button type="submit" className="gothic-cta-btn">SAVE FAQ</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SUPPORT TICKETS PANEL */}
          {activeTab === 'tickets' && (
            <div className="tickets-tab-view fade-in">
              <div className="tickets-layout-split">
                <div className="tickets-list-column">
                  <div className="gothic-table-wrapper">
                    <table className="gothic-dark-table">
                      <thead>
                        <tr>
                          <th>ID</th>
                          <th>Subject</th>
                          <th>Priority</th>
                          <th>Status</th>
                          <th>Date</th>
                          <th>Action</th>
                        </tr>
                      </thead>
                      <tbody>
                        {tickets.map(t => (
                          <tr key={t._id} className={activeTicketId === t._id ? 'row-selected' : ''}>
                            <td className="id-font">{t._id}</td>
                            <td>
                              <span className="ticket-subject-lbl" style={{ display: 'block', fontWeight: '700' }}>{t.subject}</span>
                              <span className="ticket-email-lbl" style={{ display: 'block', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{t.email}</span>
                            </td>
                            <td>
                              <span className={`status-badge-role ${t.priority === 'High' ? 'blocked' : t.priority === 'Medium' ? 'pending' : 'active'}`}>
                                {t.priority}
                              </span>
                            </td>
                            <td>
                              <span className={`status-badge-role ${t.status === 'Resolved' ? 'active' : 'pending'}`}>
                                {t.status}
                              </span>
                            </td>
                            <td>{formatDate(t.date)}</td>
                            <td>
                              <button className="gothic-table-btn" onClick={() => setActiveTicketId(t._id)}>
                                Open Chat
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {activeTicketId && (
                  <div className="ticket-chat-pane-card fade-in">
                    <div className="graphics-card chat-card-wrapper">
                      {(() => {
                        const ticketObj = tickets.find(t => t._id === activeTicketId);
                        if (!ticketObj) return null;
                        return (
                          <>
                            <div className="chat-header">
                              <div className="chat-meta">
                                <h3>{ticketObj.subject}</h3>
                                <span>{ticketObj.email}</span>
                              </div>
                              <button className="close-gothic-btn" onClick={() => setActiveTicketId(null)}><FiX size={16} /></button>
                            </div>
                            
                            <div className="chat-messages-container">
                              {ticketObj.messages?.map((msg, i) => (
                                <div key={i} className={`chat-message-bubble ${msg.sender}`}>
                                  <div className="message-content">{msg.text}</div>
                                </div>
                              ))}
                            </div>

                            <form onSubmit={handleSendTicketReply} className="chat-reply-form">
                              <textarea 
                                placeholder="Type response and send..." 
                                value={ticketReplyText}
                                onChange={(e) => setTicketReplyText(e.target.value)}
                                className="gothic-textarea chat-input" 
                                rows="2"
                                required 
                              ></textarea>
                              <button type="submit" className="gothic-cta-btn">SEND REPLY</button>
                            </form>
                          </>
                        );
                      })()}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* EMPLOYEES PANEL */}
          {activeTab === 'employees' && (
            <div className="employees-tab-view fade-in">
              <div className="tab-layout-with-form-aside">
                <div className="tab-main-content-column">
                  <div className="gothic-table-wrapper">
                    <table className="gothic-dark-table">
                      <thead>
                        <tr>
                          <th>Employee</th>
                          <th>Role</th>
                          <th>Status</th>
                          <th>Last Login</th>
                          <th>Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.map(emp => (
                          <tr key={emp._id}>
                            <td>
                              <div className="customer-avatar-name-cell">
                                <img src="/images/ComBack.png" alt="Avatar" className="user-round-thumb" />
                                <div>
                                  <span className="table-item-name" style={{ display: 'block' }}>{emp.name}</span>
                                  <span className="light-gray-text" style={{ display: 'block', fontSize: '0.7rem' }}>{emp.email}</span>
                                </div>
                              </div>
                            </td>
                            <td>{emp.role}</td>
                            <td>
                              <span className={`status-badge-role ${emp.status === 'Active' ? 'active' : 'blocked'}`}>
                                {emp.status}
                              </span>
                            </td>
                            <td>{formatDate(emp.lastLogin)}</td>
                            <td>
                              <button className="gothic-table-btn" onClick={() => toggleEmployeeStatus(emp._id)}>
                                {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                <div className="tab-sidebar-form-column">
                  <div className="graphics-card form-box-card">
                    <h3>Register Team Member</h3>
                    <form onSubmit={handleAddEmployee} className="config-form-group">
                      <div className="form-group-field">
                        <label>Employee Name *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Erika Vane" 
                          value={newEmpName}
                          onChange={(e) => setNewEmpName(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field">
                        <label>Business Email *</label>
                        <input 
                          type="email" 
                          placeholder="name@unicorn.com" 
                          value={newEmpEmail}
                          onChange={(e) => setNewEmpEmail(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field">
                        <label>Access Role *</label>
                        <select 
                          value={newEmpRole}
                          onChange={(e) => setNewEmpRole(e.target.value)}
                          className="gothic-input"
                        >
                          <option value="Content Editor">Content Editor</option>
                          <option value="Support Agent">Support Agent</option>
                          <option value="Inventory Specialist">Inventory Specialist</option>
                        </select>
                      </div>
                      <button type="submit" className="gothic-cta-btn">REGISTER STAFF</button>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ROLES PANEL */}
          {activeTab === 'roles' && (
            <div className="roles-tab-view fade-in">
              <div className="gothic-table-wrapper">
                <table className="gothic-dark-table">
                  <thead>
                    <tr>
                      <th>Role Profile</th>
                      <th>Manage Inventory</th>
                      <th>View Financials</th>
                      <th>Fulfill Orders</th>
                      <th>Manage Users</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rolesList.map(r => (
                      <tr key={r.roleName}>
                        <td className="gold-text" style={{ fontWeight: '700' }}>{r.roleName}</td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={r.manageInventory} 
                            onChange={() => handleTogglePermission(r.roleName, 'manageInventory')}
                            disabled={r.roleName === 'Super Admin'}
                            style={{ accentColor: 'var(--color-gold)', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={r.viewFinancials} 
                            onChange={() => handleTogglePermission(r.roleName, 'viewFinancials')}
                            disabled={r.roleName === 'Super Admin'}
                            style={{ accentColor: 'var(--color-gold)', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={r.fulfillOrders} 
                            onChange={() => handleTogglePermission(r.roleName, 'fulfillOrders')}
                            disabled={r.roleName === 'Super Admin'}
                            style={{ accentColor: 'var(--color-gold)', width: '16px', height: '16px' }}
                          />
                        </td>
                        <td>
                          <input 
                            type="checkbox" 
                            checked={r.manageUsers} 
                            onChange={() => handleTogglePermission(r.roleName, 'manageUsers')}
                            disabled={r.roleName === 'Super Admin'}
                            style={{ accentColor: 'var(--color-gold)', width: '16px', height: '16px' }}
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* MOCK MODULE LOADING FALLBACKS */}
          {!['dashboard', 'products', 'categories', 'orders', 'customers', 'inventory', 'coupons', 'reviews', 'settings', 'lookbook', 'limited-drops', 'cms', 'faq', 'tickets', 'employees', 'roles'].includes(activeTab) && (
            <div className="mock-panel-view fade-in">
              <h2 className="section-title">{activeTab.replace('-', ' ')} MODULE</h2>
              <div className="graphics-card mock-empty-placeholder">
                <FiAlertCircle size={32} className="mock-warn-icon" />
                <h3>Module Under Active Sync</h3>
                <p>The <strong>{activeTab.replace('-', ' ')}</strong> database connection details are fully configured. Operational logs and security gates are listening to storefront sockets.</p>
                <button className="gothic-cta-btn" onClick={() => setActiveTab('dashboard')}>RETURN TO DASHBOARD</button>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* DETAILED GOTHIC PRODUCT DIALOG */}
      {showProductModal && (
        <div className="gothic-modal-wrapper text-right-drawer-open" onClick={(e) => {
          if (e.target.classList && e.target.classList.contains('gothic-modal-wrapper')) {
            setShowProductModal(false);
          }
        }}>
          <div className="gothic-modal-card side-drawer-gothic">
            <div className="modal-header-gothic">
              <h3>{editingProduct ? 'EDIT OBSIDIAN ITEM' : 'SUMMON NEW PRODUCT'}</h3>
              <button className="close-gothic-btn" onClick={() => setShowProductModal(false)}><FiX size={20} /></button>
            </div>

            <form onSubmit={handleSaveProduct} className="gothic-form-scrollable">
              
              <div className="modal-sub-sections">
                
                {/* Information block */}
                <div className="modal-sub-section">
                  <h4>1. Basic Information</h4>
                  <div className="form-group-field">
                    <label>Product Name *</label>
                    <input 
                      type="text" 
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Vintage Gothic Tee"
                      className="gothic-input"
                      required
                    />
                  </div>

                  <div className="grid-2-col">
                    <div className="form-group-field">
                      <label>Category *</label>
                      <select 
                        value={formCategory}
                        onChange={(e) => setFormCategory(e.target.value)}
                        className="gothic-input"
                        required
                      >
                        {categories.map(c => <option key={c._id || c} value={c.name || c}>{c.name || c}</option>)}
                      </select>
                    </div>
                    <div className="form-group-field">
                      <label>Collection Name *</label>
                      <input 
                        type="text" 
                        value={formCollection}
                        onChange={(e) => setFormCollection(e.target.value)}
                        placeholder="e.g. Cyberpunk"
                        className="gothic-input"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid-3-col">
                    <div className="form-group-field">
                      <label>Brand</label>
                      <select 
                        value={formBrand}
                        onChange={(e) => setFormBrand(e.target.value)}
                        className="gothic-input"
                      >
                        {BRANDS.map(b => <option key={b} value={b}>{b}</option>)}
                      </select>
                    </div>
                    <div className="form-group-field">
                      <label>Gender</label>
                      <select value={formGender} onChange={(e) => setFormGender(e.target.value)} className="gothic-input">
                        <option value="Unisex">Unisex</option>
                        <option value="Men">Men</option>
                        <option value="Women">Women</option>
                      </select>
                    </div>
                    <div className="form-group-field">
                      <label>Badge</label>
                      <select value={formBadge} onChange={(e) => setFormBadge(e.target.value)} className="gothic-input">
                        <option value="">None</option>
                        <option value="limited">Limited</option>
                        <option value="new">New</option>
                        <option value="best">Best Seller</option>
                        <option value="sale">Sale</option>
                      </select>
                    </div>
                  </div>
                </div>

                {/* Pricing block */}
                <div className="modal-sub-section">
                  <h4>2. Pricing & Cost</h4>
                  <div className="grid-2-col">
                    <div className="form-group-field">
                      <label>Selling Price (INR) *</label>
                      <input 
                        type="number" 
                        value={formPrice}
                        onChange={(e) => setFormPrice(e.target.value)}
                        placeholder="e.g. 1799"
                        className="gothic-input"
                        required
                      />
                    </div>
                    <div className="form-group-field">
                      <label>Original Price (INR)</label>
                      <input 
                        type="number" 
                        value={formComparePrice}
                        onChange={(e) => setFormComparePrice(e.target.value)}
                        placeholder="e.g. 2499"
                        className="gothic-input"
                      />
                    </div>
                  </div>
                </div>

                {/* Inventory block */}
                <div className="modal-sub-section">
                  <h4>3. Inventory & Stock</h4>
                  <div className="grid-2-col">
                    <div className="form-group-field">
                      <label>Stock Quantity *</label>
                      <input 
                        type="number" 
                        value={formStock}
                        onChange={(e) => setFormStock(e.target.value)}
                        placeholder="e.g. 20"
                        className="gothic-input"
                        required
                      />
                    </div>
                    <div className="form-group-field">
                      <label>Fabric weight / GSM</label>
                      <input 
                        type="number" 
                        value={formGsm}
                        onChange={(e) => setFormGsm(e.target.value)}
                        placeholder="e.g. 240"
                        className="gothic-input"
                      />
                    </div>
                  </div>

                  <div className="grid-3-col">
                    <div className="form-group-field">
                      <label>Fabric</label>
                      <input type="text" value={formFabric} onChange={(e) => setFormFabric(e.target.value)} className="gothic-input" />
                    </div>
                    <div className="form-group-field">
                      <label>Color</label>
                      <input type="text" value={formColor} onChange={(e) => setFormColor(e.target.value)} className="gothic-input" />
                    </div>
                    <div className="form-group-field">
                      <label>Fit</label>
                      <input type="text" value={formFit} onChange={(e) => setFormFit(e.target.value)} className="gothic-input" />
                    </div>
                  </div>
                </div>

                {/* Sizing block */}
                <div className="modal-sub-section">
                  <h4>4. Available Sizes</h4>
                  <div className="sizes-grid-checkboxes">
                    {AVAILABLE_SIZES.map(sz => (
                      <div key={sz} className="gothic-checkbox-wrapper">
                        <input 
                          type="checkbox" 
                          id={`modal-sz-${sz}`} 
                          checked={formSizes.includes(sz)}
                          onChange={() => handleSizeToggle(sz)}
                        />
                        <label htmlFor={`modal-sz-${sz}`}>{sz}</label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* AI copywriter and description */}
                <div className="modal-sub-section">
                  <div className="header-desc-assistant">
                    <h4>5. Description & Media</h4>
                    <button 
                      type="button" 
                      className="gothic-ai-btn"
                      onClick={triggerAIAssistant}
                      disabled={aiGenerating}
                    >
                      <FiCpu size={14} /> {aiGenerating ? 'SUMMONING AI...' : 'AI ASSISTANT'}
                    </button>
                  </div>
                  
                  <div className="form-group-field">
                    <label>Main Image *</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="text" 
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="gothic-input"
                        placeholder="Image URL or upload file"
                        required
                        style={{ flex: 1 }}
                      />
                      <label className="gothic-cta-btn" style={{
                        padding: '0.65rem 1rem',
                        backgroundColor: 'var(--color-gold)',
                        color: '#000',
                        fontSize: '0.75rem',
                        fontWeight: '700',
                        borderRadius: '4px',
                        cursor: imageUploading ? 'not-allowed' : 'pointer',
                        display: 'inline-block',
                        whiteSpace: 'nowrap',
                        margin: 0,
                        opacity: imageUploading ? 0.6 : 1
                      }}>
                        {imageUploading ? `UPLOADING (${uploadCurrent} uploaded, ${uploadTotal - uploadCurrent} left)...` : 'UPLOAD FILE'}
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple
                          onChange={handleImageUpload} 
                          style={{ display: 'none' }} 
                          disabled={imageUploading}
                        />
                      </label>
                    </div>
                    {formGallery && formGallery.length > 0 && (
                      <div className="gallery-preview-wrapper" style={{ marginTop: '0.5rem', display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {formGallery.map((img, idx) => (
                          <div key={idx} style={{ position: 'relative' }}>
                            <img src={img} alt={`Gallery ${idx}`} style={{ width: '60px', height: '60px', objectFit: 'cover', borderRadius: '4px', border: '1px solid var(--border-color)' }} />
                            <button 
                              type="button" 
                              onClick={() => setFormGallery(formGallery.filter((_, i) => i !== idx))}
                              style={{
                                position: 'absolute',
                                top: '-5px',
                                right: '-5px',
                                backgroundColor: 'red',
                                color: 'white',
                                border: 'none',
                                borderRadius: '50%',
                                width: '16px',
                                height: '16px',
                                fontSize: '10px',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center'
                              }}
                            >
                              &times;
                            </button>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="form-group-field">
                    <label>Description *</label>
                    <textarea 
                      value={formDescription}
                      onChange={(e) => setFormDescription(e.target.value)}
                      rows="4"
                      className="gothic-textarea"
                      required
                    ></textarea>
                  </div>
                </div>

                {/* SEO block */}
                <div className="modal-sub-section">
                  <h4>6. SEO Suggestions</h4>
                  <div className="form-group-field">
                    <label>Meta Title</label>
                    <input 
                      type="text" 
                      value={metaTitle}
                      onChange={(e) => setMetaTitle(e.target.value)}
                      className="gothic-input"
                    />
                  </div>
                  <div className="form-group-field">
                    <label>Meta Description</label>
                    <textarea 
                      value={metaDesc}
                      onChange={(e) => setMetaDesc(e.target.value)}
                      rows="2"
                      className="gothic-textarea"
                    ></textarea>
                  </div>
                  <div className="form-group-field">
                    <label>Keywords</label>
                    <input 
                      type="text" 
                      value={metaKeywords}
                      onChange={(e) => setMetaKeywords(e.target.value)}
                      className="gothic-input"
                    />
                  </div>
                </div>

                {/* Visibility Flags */}
                <div className="modal-sub-section">
                  <h4>7. Visibility & Flags</h4>
                  <div className="flags-row-checks">
                    <div className="gothic-checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        id="modalFeatured" 
                        checked={formFeatured} 
                        onChange={(e) => setFormFeatured(e.target.checked)} 
                      />
                      <label htmlFor="modalFeatured">Featured Product</label>
                    </div>
                    <div className="gothic-checkbox-wrapper">
                      <input 
                        type="checkbox" 
                        id="modalLimited" 
                        checked={formLimited} 
                        onChange={(e) => setFormLimited(e.target.checked)} 
                      />
                      <label htmlFor="modalLimited">Limited Edition</label>
                    </div>
                  </div>
                </div>

              </div>

              {/* Action Footer */}
              <div className="modal-actions-row-gothic">
                <button type="button" className="gothic-cancel-btn" onClick={() => setShowProductModal(false)}>CANCEL</button>
                <button type="submit" className="gothic-save-btn" disabled={actionLoading}>
                  {actionLoading ? 'SAVING DATA...' : 'SAVE CHANGES'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Dashboard Footer inside Main panel */}
      <footer className="gothic-panel-footer">
        <span className="footer-left-txt">© 2025 Unicorn. All rights reserved.</span>
        <span className="footer-right-txt">Made with ❤️ by Abhishek</span>
      </footer>

    </div>
  );
};

export default AdminDashboard;
