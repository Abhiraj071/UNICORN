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
