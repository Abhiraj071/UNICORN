import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import HeroSection from '../components/HeroSection';
import CollectionsGrid from '../components/CollectionsGrid';
import Community from '../components/Community';

const Home = () => {
  const location = useLocation();

  useEffect(() => {
    if (location.pathname === '/collections') {
      const element = document.getElementById('collections');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    }
  }, [location.pathname]);

  return (
    <div>
      <HeroSection />
      <CollectionsGrid />
      <Community />
    </div>
  );
};

export default Home;
