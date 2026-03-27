import axios from 'axios';
import { API_BASE_URL } from './apiConfig';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Automatically attach the token to every request!
apiClient.interceptors.request.use(
  (config) => {
    // Check localStorage for token (Assumes user is logged in)
    const token = localStorage.getItem('token'); 
    
    // Automatically inject Bearer token into Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Global Error Handling (like expired tokens)
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.error('Unauthorized - Token expired or invalid. Please Log in again.');
      // Optional: Redirect to login or logout user
    }
    return Promise.reject(error);
  }
);

export default apiClient;
