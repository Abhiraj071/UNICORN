import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import Shop from './pages/Shop';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import Login from './pages/Login';
import Account from './pages/Account';
import About from './pages/About';
import Contact from './pages/Contact';
import Wishlist from './pages/Wishlist';
import CompleteProfile from './pages/CompleteProfile';
import AdminDashboard from './pages/AdminDashboard';
import LimitedDropsPage from './pages/LimitedDropsPage';
import FAQ from './pages/FAQ';
import LaunchCountdown from './components/LaunchCountdown';
import { CartProvider } from './context/CartContext';
import { AuthProvider, useAuth } from './context/AuthContext';

const MainContent = () => {
  const { user } = useAuth();
  const location = useLocation();

  // Launch countdown mode state
  const targetLaunchTime = new Date('2026-07-26T19:00:00+05:30').getTime();
  const [bypassedLaunch, setBypassedLaunch] = useState(() => {
    return localStorage.getItem('unicorn_launch_bypassed') === 'true';
  });

  const isBeforeLaunch = Date.now() < targetLaunchTime;
  const isLaunchRoute = location.pathname === '/launch';
  const showLaunchCountdown = isLaunchRoute || (isBeforeLaunch && !bypassedLaunch && location.pathname === '/');

  const handleEnterStore = () => {
    localStorage.setItem('unicorn_launch_bypassed', 'true');
    setBypassedLaunch(true);
  };

  const handleResetLaunch = () => {
    localStorage.removeItem('unicorn_launch_bypassed');
    setBypassedLaunch(false);
  };

  const showNavAndFooter = !showLaunchCountdown && location.pathname !== '/login' && !location.pathname.startsWith('/admin');

  // Display banner if logged in, has no phone saved, and is not on login, account, track-order, or complete-profile pages
  const showCompletionBanner = user && 
    !localStorage.getItem(`unicorn_phone_${user._id}`) && 
    location.pathname !== '/login' && 
    location.pathname !== '/account' && 
    location.pathname !== '/track-order' && 
    location.pathname !== '/complete-profile';

  if (showLaunchCountdown) {
    return <LaunchCountdown onEnterStore={handleEnterStore} />;
  }

  return (
    <>
      {showNavAndFooter && <Navbar showCompletionBanner={showCompletionBanner} />}
      <main className={showCompletionBanner ? 'navbar-with-banner' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/launch" element={<LaunchCountdown onEnterStore={handleEnterStore} />} />
          <Route path="/collections" element={<Home />} />
          <Route path="/collections/:collectionName" element={<Shop />} />
          <Route path="/new-arrivals" element={<Shop />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/login" element={<Login />} />
          <Route path="/account" element={<Account />} />
          <Route path="/track-order" element={<Account />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/faq" element={<FAQ />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="/limited-drops" element={<LimitedDropsPage />} />
          <Route path="/complete-profile" element={<CompleteProfile />} />
          <Route path="/admin" element={<AdminDashboard />} />
        </Routes>
      </main>
      {showNavAndFooter && <Footer />}
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <Router>
          <MainContent />
        </Router>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
