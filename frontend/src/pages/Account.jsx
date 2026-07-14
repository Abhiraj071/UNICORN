import { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import { 
  FiUser, 
  FiShoppingBag, 
  FiLogOut, 
  FiCheckCircle, 
  FiChevronDown, 
  FiChevronUp,
  FiChevronRight,
  FiMapPin,
  FiPlus,
  FiTrash2,
  FiEdit3,
  FiLock,
  FiCreditCard,
  FiTruck,
  FiAlertCircle,
  FiCheck
} from 'react-icons/fi';
import { useAuth } from '../context/AuthContext';
import './Account.css';

const Account = () => {
  const navigate = useNavigate();
  const { user, loading: authLoading, logout, updateProfile, api } = useAuth();
  
  const [searchParams] = useSearchParams();
  const location = useLocation();
  const tabParam = searchParams.get('tab');
  const editParam = searchParams.get('edit');

  // Tab State: 'personal' | 'orders' | 'track' | 'addresses' | 'payments'
  const [activeTab, setActiveTab] = useState(
    location.pathname === '/track-order' ? 'track' : (editParam === 'profile' ? 'personal' : (tabParam || 'personal'))
  );

  // Orders State
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [ordersError, setOrdersError] = useState(null);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Support Tickets State
  const [tickets, setTickets] = useState([]);
  const [ticketsLoading, setTicketsLoading] = useState(true);
  const [selectedTicketId, setSelectedTicketId] = useState(null);
  const [newTicketSubject, setNewTicketSubject] = useState('');
  const [newTicketDescription, setNewTicketDescription] = useState('');
  const [ticketReplyText, setTicketReplyText] = useState('');
  const [showNewTicketForm, setShowNewTicketForm] = useState(false);

  const toggleOrderDetails = (orderId) => {
    setExpandedOrder(expandedOrder === orderId ? null : orderId);
  };

  // Address Book State
  const [addresses, setAddresses] = useState([]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [editingAddressId, setEditingAddressId] = useState(null);
  
  // Address Form Fields
  const [addrLabel, setAddrLabel] = useState('Home'); // 'Home' | 'Office' | 'Other'
  const [addrName, setAddrName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPincode, setAddrPincode] = useState('');
  const [addrIsDefault, setAddrIsDefault] = useState(false);

  // Payment Methods State
  const [payments, setPayments] = useState([]);
  const [showPaymentForm, setShowPaymentForm] = useState(false);
  const [cardName, setCardName] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardType, setCardType] = useState('Visa');

  // Track Order Tab State
  const [trackInputId, setTrackInputId] = useState('');
  const [trackedOrder, setTrackedOrder] = useState(null);
  const [trackError, setTrackError] = useState('');

  // Personal Information State
  const [profileName, setProfileName] = useState('');
  const [profileEmail, setProfileEmail] = useState('');
  const [profilePhone, setProfilePhone] = useState(''); // Simulated phone number edit
  const [profilePassword, setProfilePassword] = useState('');
  const [profileConfirmPassword, setProfileConfirmPassword] = useState('');
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileSuccessMsg, setProfileSuccessMsg] = useState('');
  const [profileErrorMsg, setProfileErrorMsg] = useState('');
  const [isEditingProfile, setIsEditingProfile] = useState(false);

  useEffect(() => {
    if (location.pathname === '/track-order') {
      setActiveTab('track');
    } else if (tabParam && ['personal', 'orders', 'track', 'addresses', 'payments'].includes(tabParam)) {
      setActiveTab(tabParam);
    }

    if (editParam === 'profile') {
      setActiveTab('personal');
      setIsEditingProfile(true);
    }
  }, [location.pathname, tabParam, editParam]);

  const INDIAN_STATES = [
    'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
    'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
    'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya',
    'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim',
    'Tamil Nadu', 'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand',
    'West Bengal', 'Delhi', 'Puducherry'
  ];

  // Redirect if not logged in
  useEffect(() => {
    if (!authLoading && !user) {
      navigate(`/login?redirect=${location.pathname}${location.search}`);
    }
  }, [user, authLoading, navigate, location]);

  // Sync profile details on user load
  useEffect(() => {
    if (user) {
      setProfileName(user.name || '');
      setProfileEmail(user.email || '');
      setProfilePhone(localStorage.getItem(`unicorn_phone_${user._id}`) || '');
    }
  }, [user]);

  // Fetch orders and load saved data
  useEffect(() => {
    const fetchUserData = async () => {
      if (!user) return;
      
      // Fetch orders
      try {
        const { data } = await api.get('/orders/myorders');
        setOrders(data);
        
        // Auto-select first order for Tracking search tab if it exists
        if (data.length > 0) {
          setTrackInputId(data[0]._id.toUpperCase());
        }
      } catch (err) {
        console.error(err);
        setOrdersError('Failed to load your order history.');
      } finally {
        setOrdersLoading(false);
      }

      // Initialize Addresses
      const userAddrKey = `unicorn_addresses_${user._id}`;
      const storedAddresses = localStorage.getItem(userAddrKey);
      if (storedAddresses) {
        setAddresses(JSON.parse(storedAddresses));
      } else {
        const defaultAddr = [
          {
            id: 'default-1',
            label: 'Home',
            fullName: user.name || 'Logout Tester',
            phone: localStorage.getItem(`unicorn_phone_${user._id}`) || '+91 98765 43210',
            addressLine1: '123, Vijay Nagar',
            addressLine2: 'Near Sayaji Garden',
            city: 'Indore',
            state: 'Madhya Pradesh',
            pincode: '452010',
            isDefault: true
          }
        ];
        localStorage.setItem(userAddrKey, JSON.stringify(defaultAddr));
        setAddresses(defaultAddr);
      }

      // Initialize Payment Methods
      const userPayKey = `unicorn_payments_${user._id}`;
      const storedPayments = localStorage.getItem(userPayKey);
      if (storedPayments) {
        setPayments(JSON.parse(storedPayments));
      } else {
        const defaultPayments = [
          {
            id: 'payment-1',
            cardName: user.name || 'Logout Tester',
            cardNumber: '•••• •••• •••• 4242',
            cardExpiry: '12/28',
            cardType: 'Visa',
            isDefault: true
          }
        ];
        localStorage.setItem(userPayKey, JSON.stringify(defaultPayments));
        setPayments(defaultPayments);
      }

      // Fetch tickets
      try {
        const { data } = await api.get('/api/tickets/my');
        setTickets(data);
      } catch (err) {
        console.error('Failed to load tickets', err);
      } finally {
        setTicketsLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

  // Logout Handler
  const handleLogout = async () => {
    if (window.confirm('Are you sure you want to log out?')) {
      await logout();
      navigate('/');
    }
  };

  // Profile Update Handler
  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileSuccessMsg('');
    setProfileErrorMsg('');

    if (profilePassword && profilePassword !== profileConfirmPassword) {
      setProfileErrorMsg('Passwords do not match.');
      return;
    }

    setProfileLoading(true);
    try {
      const updateData = { name: profileName, email: profileEmail };
      if (profilePassword) {
        updateData.password = profilePassword;
      }
      await updateProfile(updateData);
      
      // Save simulated phone
      localStorage.setItem(`unicorn_phone_${user._id}`, profilePhone);

      setProfileSuccessMsg('Personal information updated successfully.');
      setProfilePassword('');
      setProfileConfirmPassword('');
      setIsEditingProfile(false);
    } catch (err) {
      setProfileErrorMsg(err.message || 'Failed to update profile.');
    } finally {
      setProfileLoading(false);
    }
  };

  // Address Save Handler
  const saveAddress = (e) => {
    e.preventDefault();
    if (!addrName || !addrPhone || !addrLine1 || !addrCity || !addrState || !addrPincode) {
      alert('Please fill in all required fields.');
      return;
    }

    const userAddrKey = `unicorn_addresses_${user._id}`;
    let updatedAddresses = [...addresses];

    if (addrIsDefault) {
      updatedAddresses = updatedAddresses.map(addr => ({ ...addr, isDefault: false }));
    }

    const addressData = {
      id: editingAddressId || Date.now().toString(),
      label: addrLabel,
      fullName: addrName,
      phone: addrPhone,
      addressLine1: addrLine1,
      addressLine2: addrLine2,
      city: addrCity,
      state: addrState,
      pincode: addrPincode,
      isDefault: addrIsDefault || addresses.length === 0
    };

    if (editingAddressId) {
      updatedAddresses = updatedAddresses.map(addr => addr.id === editingAddressId ? addressData : addr);
    } else {
      updatedAddresses.push(addressData);
    }

    setAddresses(updatedAddresses);
    localStorage.setItem(userAddrKey, JSON.stringify(updatedAddresses));
    resetAddressForm();
  };

  // Address Actions
  const deleteAddress = (id) => {
    if (window.confirm('Are you sure you want to delete this address?')) {
      const userAddrKey = `unicorn_addresses_${user._id}`;
      const filtered = addresses.filter(addr => addr.id !== id);
      if (addresses.find(addr => addr.id === id)?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      setAddresses(filtered);
      localStorage.setItem(userAddrKey, JSON.stringify(filtered));
    }
  };

  const setAddressAsDefault = (id) => {
    const userAddrKey = `unicorn_addresses_${user._id}`;
    const updated = addresses.map(addr => ({ ...addr, isDefault: addr.id === id }));
    setAddresses(updated);
    localStorage.setItem(userAddrKey, JSON.stringify(updated));
  };

  const startEditAddress = (addr) => {
    setEditingAddressId(addr.id);
    setAddrLabel(addr.label);
    setAddrName(addr.fullName);
    setAddrPhone(addr.phone);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPincode(addr.pincode);
    setAddrIsDefault(addr.isDefault);
    setShowAddressForm(true);
  };

  const resetAddressForm = () => {
    setEditingAddressId(null);
    setAddrLabel('Home');
    setAddrName('');
    setAddrPhone('');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPincode('');
    setAddrIsDefault(false);
    setShowAddressForm(false);
  };

  // Payment Actions
  const savePayment = (e) => {
    e.preventDefault();
    if (!cardName || !cardNumber || !cardExpiry || !cardCvv) {
      alert('Please fill in all card details.');
      return;
    }

    const userPayKey = `unicorn_payments_${user._id}`;
    
    // Mask Card Number (only keep last 4 digits)
    const rawNumber = cardNumber.replace(/\s+/g, '');
    if (rawNumber.length < 12) {
      alert('Please enter a valid card number.');
      return;
    }
    const maskedNumber = `•••• •••• •••• ${rawNumber.substring(rawNumber.length - 4)}`;

    const newCard = {
      id: Date.now().toString(),
      cardName,
      cardNumber: maskedNumber,
      cardExpiry,
      cardType,
      isDefault: payments.length === 0
    };

    const updated = [...payments, newCard];
    setPayments(updated);
    localStorage.setItem(userPayKey, JSON.stringify(updated));
    
    // Reset Form
    setCardName('');
    setCardNumber('');
    setCardExpiry('');
    setCardCvv('');
    setShowPaymentForm(false);
  };

  const deletePayment = (id) => {
    if (window.confirm('Are you sure you want to delete this payment method?')) {
      const userPayKey = `unicorn_payments_${user._id}`;
      const filtered = payments.filter(pay => pay.id !== id);
      if (payments.find(p => p.id === id)?.isDefault && filtered.length > 0) {
        filtered[0].isDefault = true;
      }
      setPayments(filtered);
      localStorage.setItem(userPayKey, JSON.stringify(filtered));
    }
  };

  const setPaymentAsDefault = (id) => {
    const userPayKey = `unicorn_payments_${user._id}`;
    const updated = payments.map(p => ({ ...p, isDefault: p.id === id }));
    setPayments(updated);
    localStorage.setItem(userPayKey, JSON.stringify(updated));
  };

  // Order Tracking Timeline search
  const handleTrackSearch = (e) => {
    e.preventDefault();
    setTrackError('');
    setTrackedOrder(null);

    if (!trackInputId) {
      setTrackError('Please enter an Order ID.');
      return;
    }

    const cleanInput = trackInputId.trim().toLowerCase();
    const found = orders.find(o => 
      o._id.toLowerCase() === cleanInput || 
      o._id.substring(12).toLowerCase() === cleanInput
    );

    if (found) {
      setTrackedOrder(found);
    } else {
      setTrackError('Order not found. Please verify the Order ID.');
    }
  };

  // Custom Timeline Steps Calculator
  const getTimelineSteps = (order) => {
    if (!order) return [];

    // Steps: Placed -> Processing -> Shipped -> Delivered
    return [
      { 
        label: 'Order Placed', 
        desc: 'We have received your order.', 
        status: 'completed', 
        date: formatDate(order.createdAt) 
      },
      { 
        label: 'Processing', 
        desc: 'Item is being quality-checked and packaged.', 
        status: order.isPacked ? 'completed' : 'active', 
        date: order.isPacked ? formatDate(order.packedAt) : 'In Progress' 
      },
      { 
        label: 'Shipped', 
        desc: 'Your package is on its way to your destination.', 
        status: order.isShipped ? 'completed' : (order.isPacked ? 'active' : 'upcoming'), 
        date: order.isShipped ? formatDate(order.shippedAt) : '' 
      },
      { 
        label: 'Delivered', 
        desc: 'Package delivered and signed successfully.', 
        status: order.isDelivered ? 'completed' : (order.isShipped ? 'active' : 'upcoming'), 
        date: order.isDelivered ? formatDate(order.deliveredAt) : '' 
      },
    ];
  };

  // Support Tickets Handlers
  const handleCreateTicket = async (e) => {
    e.preventDefault();
    if (!newTicketSubject.trim() || !newTicketDescription.trim()) return;
    try {
      const { data } = await api.post('/api/tickets', {
        subject: newTicketSubject,
        description: newTicketDescription
      });
      setTickets([data, ...tickets]);
      setNewTicketSubject('');
      setNewTicketDescription('');
      setShowNewTicketForm(false);
      setSelectedTicketId(data._id);
      alert('Support ticket opened successfully.');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to open ticket.');
    }
  };

  const handleSendTicketReply = async (e, ticketId) => {
    e.preventDefault();
    if (!ticketReplyText.trim()) return;
    try {
      const { data } = await api.post(`/api/tickets/${ticketId}/reply`, {
        message: ticketReplyText
      });
      setTickets(tickets.map(t => t._id === ticketId ? data : t));
      setTicketReplyText('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to send reply.');
    }
  };

  // Formatting Helpers
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR' }).format(price);
  };

  if (authLoading) {
    return (
      <div className="account-loading-screen">
        <div className="loader">LOADING ACCOUNT DETAILS...</div>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  return (
    <div className="account-page-container fade-in">
      
      {/* Header breadcrumb banner */}
      <section className="account-header-section">
        <div className="container">
          <h1 className="account-main-title">MY ACCOUNT</h1>
          <div className="account-breadcrumbs">
            <Link to="/">Home</Link>
            <FiChevronRight className="breadcrumb-arrow" />
            <span className="current-breadcrumb">Account</span>
          </div>
        </div>
      </section>

      <section className="account-content-section container">
        <div className="account-dashboard-layout">
          
          {/* Sidebar Panel */}
          <div className="account-sidebar-panel">

            {/* Sidebar Tabs */}
            <div className="account-nav-tabs">
              <button 
                className={`nav-tab-btn ${activeTab === 'personal' ? 'active' : ''}`}
                onClick={() => setActiveTab('personal')}
              >
                <FiUser size={16} /> Personal Info
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
                onClick={() => setActiveTab('orders')}
              >
                <FiShoppingBag size={16} /> My Orders ({orders.length})
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'track' ? 'active' : ''}`}
                onClick={() => setActiveTab('track')}
              >
                <FiTruck size={16} /> Track Order
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'addresses' ? 'active' : ''}`}
                onClick={() => setActiveTab('addresses')}
              >
                <FiMapPin size={16} /> Address Book ({addresses.length})
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'payments' ? 'active' : ''}`}
                onClick={() => setActiveTab('payments')}
              >
                <FiCreditCard size={16} /> Payment Methods ({payments.length})
              </button>
              <button 
                className={`nav-tab-btn ${activeTab === 'tickets' ? 'active' : ''}`}
                onClick={() => setActiveTab('tickets')}
              >
                <FiAlertCircle size={16} /> Support Tickets
              </button>
              {user && user.isAdmin && (
                <button 
                  className="nav-tab-btn"
                  onClick={() => navigate('/admin')}
                  style={{ color: '#d4a359', borderLeft: '3px solid #d4a359' }}
                >
                  <FiLock size={16} /> Admin Panel
                </button>
              )}
              
              <div className="tab-divider-line"></div>
              
              <button className="nav-tab-btn tab-logout-btn" onClick={handleLogout}>
                <FiLogOut size={16} /> Log Out
              </button>
            </div>

          </div>

          {/* Tab Content Panels */}
          <div className="account-view-panel">

            {/* TAB: SUPPORT TICKETS */}
            {activeTab === 'tickets' && (
              <div className="tickets-tab-view fade-in" style={{ color: 'var(--text-color)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>
                  <h3 className="tab-view-heading" style={{ margin: 0 }}>SUPPORT TICKETS</h3>
                  {!selectedTicketId && !showNewTicketForm && (
                    <button 
                      onClick={() => setShowNewTicketForm(true)} 
                      className="summon-action-cta-btn" 
                      style={{ padding: '0.5rem 1rem', fontSize: '0.8rem', display: 'flex', gap: '0.35rem', alignItems: 'center' }}
                    >
                      <FiPlus size={14} /> OPEN NEW TICKET
                    </button>
                  )}
                </div>

                {/* 1. Open New Ticket Form */}
                {showNewTicketForm && (
                  <div className="graphics-card fade-in" style={{ padding: '1.5rem', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid var(--border-color)', borderRadius: '4px' }}>
                    <h4 style={{ marginBottom: '1.25rem', color: 'var(--color-gold)', letterSpacing: '1px', fontSize: '1rem' }}>Summon New Ticket</h4>
                    <form onSubmit={handleCreateTicket} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                      <div className="form-group-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>SUBJECT / PROBLEM TITLE *</label>
                        <input 
                          type="text" 
                          placeholder="e.g. Size exchange request for Order #12345" 
                          value={newTicketSubject}
                          onChange={(e) => setNewTicketSubject(e.target.value)}
                          className="gothic-input" 
                          required 
                        />
                      </div>
                      <div className="form-group-field" style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontWeight: 600 }}>DETAILED DESCRIPTION *</label>
                        <textarea 
                          placeholder="Please provide details about the problem..." 
                          value={newTicketDescription}
                          onChange={(e) => setNewTicketDescription(e.target.value)}
                          className="gothic-input" 
                          style={{ minHeight: '120px', resize: 'vertical' }}
                          required 
                        />
                      </div>
                      <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                        <button type="submit" className="summon-action-cta-btn" style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem' }}>SUBMIT TICKET</button>
                        <button 
                          type="button" 
                          onClick={() => { setShowNewTicketForm(false); setNewTicketSubject(''); setNewTicketDescription(''); }} 
                          className="gothic-table-btn"
                          style={{ padding: '0.5rem 1.25rem' }}
                        >
                          CANCEL
                        </button>
                      </div>
                    </form>
                  </div>
                )}

                {/* 2. Detailed Ticket View with Chat Dialogue Thread */}
                {selectedTicketId && (
                  (() => {
                    const ticket = tickets.find(t => t._id === selectedTicketId);
                    if (!ticket) return <p>Ticket not found.</p>;
                    return (
                      <div className="ticket-detail-panel fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <button 
                          onClick={() => setSelectedTicketId(null)}
                          className="gothic-table-btn"
                          style={{ display: 'inline-flex', gap: '0.35rem', alignItems: 'center', width: 'fit-content', padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                        >
                          ← BACK TO TICKET LIST
                        </button>

                        <div className="graphics-card" style={{ padding: '1.25rem', backgroundColor: 'rgba(255,255,255,0.01)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px' }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '0.75rem' }}>
                            <h4 style={{ margin: 0, fontSize: '1.1rem', color: 'var(--color-gold)' }}>{ticket.subject}</h4>
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
                          </div>
                          <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '1.25rem' }}>
                            Opened on {formatDate(ticket.createdAt)} • Ticket ID: {ticket._id}
                          </div>
                          
                          <div style={{ padding: '1rem', backgroundColor: 'rgba(255,255,255,0.02)', borderLeft: '3px solid var(--color-gold)', borderRadius: '0 4px 4px 0', fontSize: '0.9rem', lineHeight: '1.5' }}>
                            {ticket.description}
                          </div>
                        </div>

                        {/* Dialogue Thread replies history */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginTop: '0.5rem' }}>
                          <h5 style={{ borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Dialogue History</h5>
                          
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
                                    alignSelf: isAdmin ? 'flex-start' : 'flex-end'
                                  }}
                                >
                                  <div style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.35rem', fontWeight: 600 }}>
                                    <span style={{ color: isAdmin ? 'var(--color-gold)' : 'var(--text-muted)' }}>{rep.sender === 'Admin' ? 'ADMINISTRATOR SUPPORT' : 'YOU'}</span>
                                    <span>{new Date(rep.createdAt).toLocaleString()}</span>
                                  </div>
                                  <p style={{ fontSize: '0.85rem', lineHeight: '1.4', margin: 0 }}>{rep.message}</p>
                                </div>
                              );
                            })
                          ) : (
                            <p style={{ color: 'var(--text-muted)', fontStyle: 'italic', fontSize: '0.8rem' }}>No responses yet. Support guardians will resolve this ticket shortly.</p>
                          )}
                        </div>

                        {/* Send Reply Box */}
                        {ticket.status !== 'Resolved' ? (
                          <form onSubmit={(e) => handleSendTicketReply(e, ticket._id)} style={{ display: 'flex', gap: '0.75rem', marginTop: '1rem', alignItems: 'stretch' }}>
                            <input 
                              type="text" 
                              placeholder="Write your message here..." 
                              value={ticketReplyText}
                              onChange={(e) => setTicketReplyText(e.target.value)}
                              className="gothic-input"
                              style={{ flex: 1, padding: '0.6rem 0.8rem', fontSize: '0.85rem' }}
                              required
                            />
                            <button type="submit" className="summon-action-cta-btn" style={{ padding: '0 1.5rem', fontSize: '0.8rem', minHeight: '100%' }}>SEND</button>
                          </form>
                        ) : (
                          <div style={{ padding: '1rem', textAlign: 'center', backgroundColor: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '4px', marginTop: '1rem', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                            This support ticket has been marked resolved. If you have additional questions, please open a new ticket.
                          </div>
                        )}
                      </div>
                    );
                  })()
                )}

                {/* 3. Ticket List View */}
                {!showNewTicketForm && !selectedTicketId && (
                  <div className="tickets-list-wrapper">
                    {ticketsLoading ? (
                      <p>Loading your helpdesk ticket records...</p>
                    ) : tickets.length === 0 ? (
                      <div className="empty-gothic-state" style={{ textAlign: 'center', padding: '3rem 1.5rem', border: '1px dashed var(--border-color)', borderRadius: '4px' }}>
                        <p style={{ color: 'var(--text-muted)' }}>You have no open support tickets. If you need assistance with an order, size, or return, summon a ticket!</p>
                        <button 
                          onClick={() => setShowNewTicketForm(true)} 
                          className="summon-action-cta-btn" 
                          style={{ padding: '0.5rem 1.5rem', fontSize: '0.8rem', marginTop: '1rem' }}
                        >
                          OPEN FIRST TICKET
                        </button>
                      </div>
                    ) : (
                      <div className="gothic-table-wrapper">
                        <table className="gothic-dark-table">
                          <thead>
                            <tr>
                              <th>Date</th>
                              <th>Subject</th>
                              <th>Status</th>
                              <th style={{ textAlign: 'right' }}>Actions</th>
                            </tr>
                          </thead>
                          <tbody>
                            {tickets.map((t) => (
                              <tr key={t._id}>
                                <td>{formatDate(t.createdAt)}</td>
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
                                    onClick={() => setSelectedTicketId(t._id)}
                                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.75rem' }}
                                  >
                                    View Thread
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="settings-tab-view fade-in">
                <h3 className="tab-view-heading">PERSONAL INFORMATION</h3>

                {profileSuccessMsg && (
                  <div className="profile-feedback-message success">
                    <FiCheckCircle /> <span>{profileSuccessMsg}</span>
                  </div>
                )}

                {profileErrorMsg && (
                  <div className="profile-feedback-message error">
                    <FiAlertCircle /> <span>{profileErrorMsg}</span>
                  </div>
                )}

                {!isEditingProfile ? (
                  <div className="profile-details-view fade-in" style={{ maxWidth: '550px' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginBottom: '2.5rem' }}>
                      <div className="info-display-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Full Name</span>
                        <span style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 500 }}>{user.name}</span>
                      </div>
                      <div className="info-display-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Email Address</span>
                        <span style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 500 }}>{user.email}</span>
                      </div>
                      <div className="info-display-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Phone Number</span>
                        <span style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 500 }}>{profilePhone || 'Not provided'}</span>
                      </div>
                      <div className="info-display-row" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '0.85rem' }}>
                        <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>Password</span>
                        <span style={{ fontSize: '0.95rem', color: 'var(--white)', fontWeight: 500 }}>••••••••</span>
                      </div>
                    </div>
                    <button className="add-address-trigger-btn" onClick={() => setIsEditingProfile(true)}>
                      <FiEdit3 size={14} style={{ marginRight: '0.35rem' }} /> EDIT DETAILS
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleProfileUpdate} className="profile-edit-form">
                    <div className="address-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Full Name *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="Your full name"
                          value={profileName}
                          onChange={(e) => setProfileName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Email Address *</label>
                        <input
                          type="email"
                          className="auth-input-field"
                          placeholder="Your email address"
                          value={profileEmail}
                          onChange={(e) => setProfileEmail(e.target.value)}
                          required
                          disabled
                        />
                        <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                          Email address cannot be changed directly.
                        </span>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Phone Number</label>
                        <input
                          type="tel"
                          className="auth-input-field"
                          placeholder="e.g. +91 98765 43210"
                          value={profilePhone}
                          onChange={(e) => setProfilePhone(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="settings-password-section-divider">
                      <FiLock /> Change Password (Leave blank to keep unchanged)
                    </div>

                    <div className="address-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">New Password</label>
                        <input
                          type="password"
                          className="auth-input-field"
                          placeholder="New password"
                          value={profilePassword}
                          onChange={(e) => setProfilePassword(e.target.value)}
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Confirm New Password</label>
                        <input
                          type="password"
                          className="auth-input-field"
                          placeholder="Confirm new password"
                          value={profileConfirmPassword}
                          onChange={(e) => setProfileConfirmPassword(e.target.value)}
                        />
                      </div>
                    </div>

                    <div className="address-form-actions" style={{ marginTop: '2rem' }}>
                      <button type="submit" className="auth-submit-btn-gold" disabled={profileLoading}>
                        {profileLoading ? 'SAVING CHANGES...' : 'SAVE CHANGES'}
                      </button>
                      <button type="button" className="auth-submit-btn-outline" onClick={() => { setIsEditingProfile(false); setProfilePassword(''); setProfileConfirmPassword(''); }}>
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB: MY ORDERS */}
            {activeTab === 'orders' && (
              <div className="orders-tab-view fade-in">
                <h3 className="tab-view-heading">MY ORDERS</h3>
                
                {ordersLoading ? (
                  <div className="orders-loading-placeholder"><p>Loading your orders...</p></div>
                ) : ordersError ? (
                  <div className="orders-error-placeholder"><p>{ordersError}</p></div>
                ) : orders.length === 0 ? (
                  <div className="orders-empty-placeholder">
                    <h4>NO ORDERS PLACED YET</h4>
                    <p>Start shopping to place your first order.</p>
                    <Link to="/shop" className="explore-btn">START SHOPPING</Link>
                  </div>
                ) : (
                  <div className="orders-list-stack">
                    {orders.map((order) => (
                      <div key={order._id} className={`order-item-card ${expandedOrder === order._id ? 'expanded' : ''}`}>
                        
                        <div className="order-summary-row" onClick={() => toggleOrderDetails(order._id)}>
                          <div className="order-summary-main">
                            <span className="order-id-code">#{order._id.substring(12).toUpperCase()}</span>
                            <span className="order-date-text">{formatDate(order.createdAt)}</span>
                          </div>
                          
                          <div className="order-summary-status-price">
                            <span className="order-total-price-display">{formatPrice(order.totalPrice)}</span>
                            <span className="order-status-pill success">
                              <FiCheckCircle size={12} /> Paid
                            </span>
                          </div>

                          <button className="order-expand-toggle-btn">
                            {expandedOrder === order._id ? <FiChevronUp size={20} /> : <FiChevronDown size={20} />}
                          </button>
                        </div>

                        {expandedOrder === order._id && (
                          <div className="order-details-expanded-view fade-in">
                            <div className="details-divider"></div>
                            
                            <div className="purchased-items-list">
                              {order.orderItems.map((item, idx) => (
                                <div key={idx} className="purchased-item-row">
                                  <div className="item-thumb-box">
                                    <img src={item.image} alt={item.name} />
                                  </div>
                                  <div className="item-meta-box">
                                    <h4 className="item-name-heading">{item.name}</h4>
                                    <span className="item-meta-text">Qty: {item.qty} &nbsp;•&nbsp; Price: {formatPrice(item.price)}</span>
                                  </div>
                                  <span className="item-subtotal-price">{formatPrice(item.price * item.qty)}</span>
                                </div>
                              ))}
                            </div>

                            <div className="shipping-address-summary-box" style={{ display: 'flex', justifyContent: 'space-between', gap: '2rem', flexWrap: 'wrap' }}>
                              <div>
                                <span className="address-section-title">Delivery Address</span>
                                <span className="address-text-paragraph">
                                  Address: {order.shippingAddress.address}<br />
                                  City: {order.shippingAddress.city} - {order.shippingAddress.postalCode}<br />
                                  Country: {order.shippingAddress.country}
                                </span>
                              </div>
                              <div style={{ display: 'flex', alignItems: 'flex-end' }}>
                                <button className="add-address-trigger-btn" onClick={() => { setActiveTab('track'); setTrackInputId(order._id.toUpperCase()); setTrackedOrder(order); }} style={{ height: '34px', fontSize: '0.7rem' }}>
                                  <FiTruck size={12} /> TRACK SHIPMENT
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB: TRACK ORDER */}
            {activeTab === 'track' && (
              <div className="track-tab-view fade-in">
                <h3 className="tab-view-heading">TRACK SHIPMENT</h3>

                <form onSubmit={handleTrackSearch} className="track-search-form" style={{ marginBottom: '2.5rem', display: 'flex', gap: '1rem', maxWidth: '600px' }}>
                  <div className="form-group-custom" style={{ flexGrow: 1 }}>
                    <input
                      type="text"
                      className="auth-input-field"
                      placeholder="Enter 24-char Order ID (e.g. 64B...)"
                      value={trackInputId}
                      onChange={(e) => setTrackInputId(e.target.value)}
                    />
                  </div>
                  <button type="submit" className="add-address-trigger-btn" style={{ height: '38px', borderRadius: '8px' }}>
                    TRACK NOW
                  </button>
                </form>

                {trackError && (
                  <div className="profile-feedback-message error" style={{ maxWidth: '600px' }}>
                    <FiAlertCircle /> <span>{trackError}</span>
                  </div>
                )}

                {trackedOrder ? (
                  <div className="order-tracking-card fade-in">
                    <div className="tracking-summary-header" style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border-light)', paddingBottom: '1.25rem', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
                      <div>
                        <span className="tracking-meta-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>TRACKING ORDER</span>
                        <h4 className="tracking-order-id" style={{ margin: '0.25rem 0 0 0', color: 'var(--white)', fontSize: '1.2rem', fontFamily: 'monospace' }}>#{trackedOrder._id.toUpperCase()}</h4>
                      </div>
                      <div style={{ textAlign: 'right' }}>
                        <span className="tracking-meta-label" style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>SHIPPING SERVICE</span>
                        <h4 className="tracking-service" style={{ margin: '0.25rem 0 0 0', color: 'var(--white)', fontSize: '0.95rem', fontWeight: '500' }}>Unicorn Express Cargo</h4>
                      </div>
                    </div>

                    {/* Timeline Progress */}
                    <div className="tracking-timeline-grid" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', position: 'relative', paddingLeft: '2.5rem' }}>
                      
                      {/* Vertical line connector */}
                      <div className="timeline-connector-line" style={{
                        position: 'absolute',
                        left: '11px',
                        top: '12px',
                        bottom: '12px',
                        width: '2px',
                        background: 'linear-gradient(180deg, #d4a359 0%, rgba(212,163,89,0.15) 100%)',
                        zIndex: 1
                      }}></div>

                      {getTimelineSteps(trackedOrder).map((step, idx) => (
                        <div key={idx} className={`timeline-step-row ${step.status}`} style={{ display: 'flex', gap: '1.5rem', position: 'relative', zIndex: 2 }}>
                          
                          {/* Indicator Dot */}
                          <div className={`timeline-node-dot ${step.status}`} style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            backgroundColor: step.status === 'completed' ? '#d4a359' : (step.status === 'active' ? '#0d0d0d' : '#222'),
                            border: step.status === 'active' ? '2px solid #d4a359' : (step.status === 'completed' ? 'none' : '1px solid var(--border-light)'),
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: step.status === 'completed' ? '#0d0d0d' : '#d4a359',
                            fontSize: '0.75rem',
                            fontWeight: 'bold',
                            position: 'absolute',
                            left: '-40px',
                            top: '2px',
                            boxShadow: step.status === 'active' ? '0 0 10px rgba(212,163,89,0.4)' : 'none'
                          }}>
                            {step.status === 'completed' ? <FiCheck size={14} /> : (step.status === 'active' ? '•' : '')}
                          </div>

                          <div className="timeline-step-content" style={{ display: 'flex', justifyContent: 'space-between', width: '100%', flexWrap: 'wrap', gap: '0.5rem' }}>
                            <div style={{ lineHeight: '1.4' }}>
                              <h4 className="step-title" style={{ margin: 0, fontSize: '0.95rem', fontWeight: '600', color: step.status !== 'upcoming' ? 'var(--white)' : 'var(--text-muted)' }}>{step.label}</h4>
                              <p className="step-desc" style={{ margin: '0.15rem 0 0 0', fontSize: '0.8rem', color: 'var(--gray-500)' }}>{step.desc}</p>
                            </div>
                            <div className="step-date-box" style={{ textAlign: 'right', minWidth: '80px' }}>
                              <span className="step-date" style={{ fontSize: '0.8rem', fontWeight: '500', color: step.status === 'completed' ? 'var(--gold-primary)' : 'var(--text-muted)' }}>{step.date}</span>
                            </div>
                          </div>

                        </div>
                      ))}

                    </div>

                  </div>
                ) : (
                  <div className="orders-empty-placeholder" style={{ padding: '3rem 2rem' }}>
                    <FiTruck size={36} style={{ color: 'var(--text-muted)', marginBottom: '1rem' }} />
                    <h4>READY TO TRACK STATUS</h4>
                    {orders.length > 0 ? (
                      <p>Select an order from "My Orders" or enter an Order ID above to see shipment logs.</p>
                    ) : (
                      <p>Once you place an order, you can track its delivery status here.</p>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* TAB: ADDRESS BOOK */}
            {activeTab === 'addresses' && (
              <div className="addresses-tab-view fade-in">
                <div className="addresses-view-header">
                  <h3 className="tab-view-heading">ADDRESS BOOK</h3>
                  {!showAddressForm && (
                    <button className="add-address-trigger-btn" onClick={() => setShowAddressForm(true)}>
                      <FiPlus /> ADD NEW ADDRESS
                    </button>
                  )}
                </div>

                {showAddressForm && (
                  <form onSubmit={saveAddress} className="address-edit-form-card fade-in">
                    <h4 className="address-form-title">{editingAddressId ? 'EDIT ADDRESS' : 'ADD NEW ADDRESS'}</h4>
                    
                    <div className="address-form-grid">
                      <div className="form-group-custom">
                        <label className="form-label-custom">Address Label *</label>
                        <select 
                          className="auth-input-field" 
                          value={addrLabel} 
                          onChange={(e) => setAddrLabel(e.target.value)}
                        >
                          <option value="Home">Home</option>
                          <option value="Office">Office</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Recipient Full Name *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="e.g. Abhishek Vishwakarma"
                          value={addrName}
                          onChange={(e) => setAddrName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Phone Number *</label>
                        <input
                          type="tel"
                          className="auth-input-field"
                          placeholder="e.g. +91 98765 43210"
                          value={addrPhone}
                          onChange={(e) => setAddrPhone(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Address Line 1 *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="House No, Building, Street"
                          value={addrLine1}
                          onChange={(e) => setAddrLine1(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Address Line 2 (Optional)</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="Locality, Landmark, Area"
                          value={addrLine2}
                          onChange={(e) => setAddrLine2(e.target.value)}
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">City *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="City"
                          value={addrCity}
                          onChange={(e) => setAddrCity(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">State *</label>
                        <select
                          className="auth-input-field"
                          value={addrState}
                          onChange={(e) => setAddrState(e.target.value)}
                          required
                        >
                          <option value="">Select State</option>
                          {INDIAN_STATES.map((state) => (
                            <option key={state} value={state}>{state}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Pincode *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="6-digit Pincode"
                          maxLength="6"
                          value={addrPincode}
                          onChange={(e) => setAddrPincode(e.target.value)}
                          required
                        />
                      </div>
                    </div>

                    <div className="form-meta-row" style={{ marginTop: '1rem' }}>
                      <label className="checkbox-container-custom">
                        <input
                          type="checkbox"
                          checked={addrIsDefault}
                          onChange={(e) => setAddrIsDefault(e.target.checked)}
                          className="checkbox-input-custom"
                          disabled={addresses.length === 0}
                        />
                        <span className="checkbox-label-text">Set as default shipping address</span>
                      </label>
                    </div>

                    <div className="address-form-actions">
                      <button type="submit" className="auth-submit-btn-gold">
                        SAVE ADDRESS
                      </button>
                      <button type="button" className="auth-submit-btn-outline" onClick={resetAddressForm}>
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                <div className="addresses-list-stack">
                  {addresses.length === 0 ? (
                    <div className="orders-empty-placeholder">
                      <p>No saved addresses found. Add one to speed up checkout.</p>
                    </div>
                  ) : (
                    addresses.map((addr) => (
                      <div key={addr.id} className={`address-item-card ${addr.isDefault ? 'default' : ''}`}>
                        <div className="address-card-header">
                          <span className="address-label-badge">{addr.label}</span>
                          {addr.isDefault && <span className="default-badge">✓ DEFAULT</span>}
                        </div>

                        <h4 className="address-recipient">{addr.fullName}</h4>
                        <p className="address-lines">
                          {addr.addressLine1}<br />
                          {addr.addressLine2 && <>{addr.addressLine2}<br /></>}
                          {addr.city}, {addr.state} - {addr.pincode}
                        </p>
                        <p className="address-phone">Phone: {addr.phone}</p>

                        <div className="address-card-actions">
                          <button className="address-action-btn edit" onClick={() => startEditAddress(addr)}>
                            <FiEdit3 size={14} /> Edit
                          </button>
                          {!addr.isDefault && (
                            <button className="address-action-btn default-set" onClick={() => setAddressAsDefault(addr.id)}>
                              Set Default
                            </button>
                          )}
                          <button className="address-action-btn delete" onClick={() => deleteAddress(addr.id)}>
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB: PAYMENT METHODS */}
            {activeTab === 'payments' && (
              <div className="payments-tab-view fade-in">
                <div className="addresses-view-header">
                  <h3 className="tab-view-heading">PAYMENT METHODS</h3>
                  {!showPaymentForm && (
                    <button className="add-address-trigger-btn" onClick={() => setShowPaymentForm(true)}>
                      <FiPlus /> ADD NEW CARD
                    </button>
                  )}
                </div>

                {/* Add Payment Form */}
                {showPaymentForm && (
                  <form onSubmit={savePayment} className="address-edit-form-card fade-in" style={{ maxWidth: '500px' }}>
                    <h4 className="address-form-title">ADD NEW CARD</h4>
                    
                    <div className="address-form-grid" style={{ gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                      <div className="form-group-custom">
                        <label className="form-label-custom">Card Type</label>
                        <select 
                          className="auth-input-field" 
                          value={cardType} 
                          onChange={(e) => setCardType(e.target.value)}
                        >
                          <option value="Visa">Visa</option>
                          <option value="Mastercard">Mastercard</option>
                          <option value="Amex">American Express</option>
                          <option value="Rupay">Rupay</option>
                        </select>
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Cardholder Name *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="e.g. Abhishek Vishwakarma"
                          value={cardName}
                          onChange={(e) => setCardName(e.target.value)}
                          required
                        />
                      </div>

                      <div className="form-group-custom">
                        <label className="form-label-custom">Card Number *</label>
                        <input
                          type="text"
                          className="auth-input-field"
                          placeholder="16-digit card number"
                          maxLength="19"
                          value={cardNumber}
                          onChange={(e) => {
                            // Format space every 4 digits
                            const val = e.target.value.replace(/\D/g, '');
                            const matches = val.match(/\d{4,16}/g);
                            const match = matches && matches[0] || '';
                            const parts = [];
                            for (let i = 0, len = match.length; i < len; i += 4) {
                              parts.push(match.substring(i, i + 4));
                            }
                            if (parts.length > 0) {
                              setCardNumber(parts.join(' '));
                            } else {
                              setCardNumber(val);
                            }
                          }}
                          required
                        />
                      </div>

                      <div className="address-form-grid" style={{ gridTemplateColumns: '1fr 1fr', gap: '1rem', width: '100%' }}>
                        <div className="form-group-custom">
                          <label className="form-label-custom">Expiry Date (MM/YY) *</label>
                          <input
                            type="text"
                            className="auth-input-field"
                            placeholder="MM/YY"
                            maxLength="5"
                            value={cardExpiry}
                            onChange={(e) => {
                              let val = e.target.value.replace(/\D/g, '');
                              if (val.length >= 2) {
                                val = `${val.substring(0, 2)}/${val.substring(2, 4)}`;
                              }
                              setCardExpiry(val);
                            }}
                            required
                          />
                        </div>

                        <div className="form-group-custom">
                          <label className="form-label-custom">CVV *</label>
                          <input
                            type="password"
                            className="auth-input-field"
                            placeholder="CVV"
                            maxLength="3"
                            value={cardCvv}
                            onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                            required
                          />
                        </div>
                      </div>
                    </div>

                    <div className="address-form-actions" style={{ marginTop: '1.75rem' }}>
                      <button type="submit" className="auth-submit-btn-gold">
                        SAVE CARD
                      </button>
                      <button type="button" className="auth-submit-btn-outline" onClick={() => setShowPaymentForm(false)}>
                        CANCEL
                      </button>
                    </div>
                  </form>
                )}

                {/* Cards List Grid */}
                <div className="addresses-list-stack">
                  {payments.length === 0 ? (
                    <div className="orders-empty-placeholder">
                      <p>No saved payment methods. Add a card to speed up checkout transactions.</p>
                    </div>
                  ) : (
                    payments.map((pay) => (
                      <div key={pay.id} className={`address-item-card ${pay.isDefault ? 'default' : ''}`} style={{
                        background: 'linear-gradient(135deg, #1c1913 0%, #0d0d0d 100%)',
                        borderColor: pay.isDefault ? 'rgba(212, 163, 89, 0.3)' : 'var(--border-light)'
                      }}>
                        <div className="address-card-header">
                          <span className="address-label-badge" style={{ backgroundColor: '#222', borderColor: '#333' }}>
                            <FiCreditCard size={12} style={{ marginRight: '0.25rem', verticalAlign: 'middle' }} />
                            {pay.cardType}
                          </span>
                          {pay.isDefault && <span className="default-badge">✓ DEFAULT</span>}
                        </div>

                        <h4 className="address-recipient" style={{ fontFamily: 'monospace', letterSpacing: '1px', fontSize: '1.1rem', margin: '0.5rem 0' }}>
                          {pay.cardNumber}
                        </h4>

                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--gray-400)', margin: '0.5rem 0 1.25rem 0' }}>
                          <div>
                            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>CARDHOLDER</span>
                            <span>{pay.cardName}</span>
                          </div>
                          <div style={{ textAlign: 'right' }}>
                            <span style={{ fontSize: '0.65rem', display: 'block', color: 'var(--text-muted)' }}>EXPIRES</span>
                            <span>{pay.cardExpiry}</span>
                          </div>
                        </div>

                        <div className="address-card-actions" style={{ borderTop: '1px solid rgba(255,255,255,0.03)' }}>
                          {!pay.isDefault && (
                            <button className="address-action-btn default-set" onClick={() => setPaymentAsDefault(pay.id)}>
                              Set Default
                            </button>
                          )}
                          <button className="address-action-btn delete" onClick={() => deletePayment(pay.id)}>
                            <FiTrash2 size={14} /> Delete
                          </button>
                        </div>
                      </div>
                    ))
                  )}
                </div>

              </div>
            )}

          </div>

        </div>
      </section>

    </div>
  );
};

export default Account;
