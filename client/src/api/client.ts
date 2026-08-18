import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || 'https://nexcampus-backend.onrender.com/api';

export const api = axios.create({
  baseURL,
  withCredentials: true,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach Authorization Bearer token from localStorage fallback
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Cold-start retry interceptor & 401 handler
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config;
    
    if (!config || !config.retryCount) {
      config.retryCount = 0;
    }
    
    if (config.retryCount < 2 && (error.code === 'ERR_NETWORK' || error.response?.status === 503 || error.code === 'ECONNABORTED')) {
      config.retryCount += 1;
      await new Promise((resolve) => setTimeout(resolve, 2000));
      return api(config);
    }

    if (error.response?.status === 401 && !window.location.pathname.startsWith('/login')) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }

    return Promise.reject(error);
  }
);
