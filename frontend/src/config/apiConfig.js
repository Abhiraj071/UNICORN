// Centralized API configuration for Development & Production (MilesWeb -> Render)
export const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

/**
 * Returns full API URL for any endpoint.
 * Handles both relative '/api/products' and '/products'.
 */
export const getApiUrl = (endpoint) => {
  if (!endpoint) return API_BASE_URL;
  if (endpoint.startsWith('http://') || endpoint.startsWith('https://')) return endpoint;
  
  // Clean '/api' prefix from endpoint if API_BASE_URL already contains '/api'
  let cleanEndpoint = endpoint;
  const baseHasApi = API_BASE_URL.endsWith('/api') || API_BASE_URL.includes('/api/');
  
  if (baseHasApi && cleanEndpoint.startsWith('/api/')) {
    cleanEndpoint = cleanEndpoint.replace(/^\/api/, '');
  }
  
  const cleanBase = API_BASE_URL.replace(/\/$/, '');
  const path = cleanEndpoint.startsWith('/') ? cleanEndpoint : `/${cleanEndpoint}`;
  
  return `${cleanBase}${path}`;
};

/**
 * Resolves product image URLs (handling local static images, backend uploads, and fallback on error)
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return '/images/1.png';
  if (typeof imagePath !== 'string') return '/images/1.png';
  
  // Base64 Data URLs and external HTTP/HTTPS URLs pass through directly
  if (imagePath.startsWith('data:') || imagePath.startsWith('http://') || imagePath.startsWith('https://')) {
    return imagePath;
  }
  
  const defaultBackend = 'https://unicorn-ln99.onrender.com';
  let backendHost = defaultBackend;
  if (API_BASE_URL && API_BASE_URL.startsWith('http')) {
    backendHost = API_BASE_URL.replace(/\/api\/?$/, '');
  }

  if (imagePath.includes('/uploads/')) {
    const uploadSubpath = imagePath.substring(imagePath.indexOf('/uploads/'));
    return `${backendHost}/api${uploadSubpath}`;
  }
  
  if (imagePath.startsWith('uploads/')) {
    return `${backendHost}/api/${imagePath}`;
  }

  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`;
  }
  return imagePath;
};
