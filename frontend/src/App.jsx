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
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { useAuth } from './context/AuthContext';

const MainContent = () => {
  const { user } = useAuth();
  const location = useLocation();
  const showNavAndFooter = location.pathname !== '/login' && !location.pathname.startsWith('/admin');

  // Display banner if logged in, has no phone saved, and is not on login, account, track-order, or complete-profile pages
  const showCompletionBanner = user && 
    !localStorage.getItem(`unicorn_phone_${user._id}`) && 
    location.pathname !== '/login' && 
    location.pathname !== '/account' && 
    location.pathname !== '/track-order' && 
    location.pathname !== '/complete-profile';

  return (
    <>
      {showNavAndFooter && <Navbar showCompletionBanner={showCompletionBanner} />}
      <main className={showCompletionBanner ? 'navbar-with-banner' : ''}>
        <Routes>
          <Route path="/" element={<Home />} />
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
