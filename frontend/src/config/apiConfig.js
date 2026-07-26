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
  if (imagePath.startsWith('http://') || imagePath.startsWith('https://')) return imagePath;
  
  if (imagePath.startsWith('/uploads/') || imagePath.startsWith('uploads/')) {
    const cleanPath = imagePath.startsWith('/') ? imagePath : `/${imagePath}`;
    const backendBase = API_BASE_URL.replace(/\/api\/?$/, '');
    return `${backendBase}/api${cleanPath}`;
  }
  
  if (!imagePath.startsWith('/')) {
    return `/${imagePath}`;
  }
  return imagePath;
};
