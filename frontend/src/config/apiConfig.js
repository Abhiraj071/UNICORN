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

export const FALLBACK_IMAGE = 'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500" viewBox="0 0 400 500"><rect width="400" height="500" fill="%230c140e"/><path d="M200 180 L230 230 L280 230 L240 265 L255 315 L200 280 L145 315 L160 265 L120 230 L170 230 Z" fill="%23d4a359" opacity="0.45"/><text x="50%" y="74%" font-family="Cinzel, serif" font-size="16" fill="%238ab897" text-anchor="middle" letter-spacing="4">UNICORN ONYX</text></svg>';

/**
 * Resolves product image URLs (handling local static images, backend uploads, and fallback on error)
 */
export const getImageUrl = (imagePath) => {
  if (!imagePath) return FALLBACK_IMAGE;
  if (typeof imagePath !== 'string') return FALLBACK_IMAGE;
  
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
