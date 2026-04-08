import axios from 'axios';
import { API_BASE_URL } from './apiConfig';
import storage from './storage';

const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

const RETRYABLE_METHODS = new Set(['get', 'head', 'options']);
const MAX_RETRIES = 2;
let unauthorizedHandler = null;
let isHandlingUnauthorized = false;

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

export function setUnauthorizedHandler(handler) {
  unauthorizedHandler = typeof handler === 'function' ? handler : null;
}

// REQUEST INTERCEPTOR: Add Auth Token automatically from Universal Storage
apiClient.interceptors.request.use(
  async (config) => {
    const token = await storage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    const method = String(config.method || '').toLowerCase();
    const isRetryableMethod = RETRYABLE_METHODS.has(method);
    const isTimeout = error.code === 'ECONNABORTED';
    const isNetwork = error.message === 'Network Error' || error.code === 'ERR_NETWORK';
    const noResponse = !error.response;
    const retryCount = Number(config.__retryCount || 0);

    // Keep backend connection resilient for safe read calls.
    if (isRetryableMethod && (isTimeout || isNetwork || noResponse) && retryCount < MAX_RETRIES) {
      config.__retryCount = retryCount + 1;
      const backoffMs = 500 * config.__retryCount;
      if (__DEV__) {
        console.log(`[apiClient] retry #${config.__retryCount} ${method.toUpperCase()} ${config.url}`);
      }
      await sleep(backoffMs);
      return apiClient(config);
    }

    if (error.response?.status === 401) {
      console.log('Unauthorized - Token expired or invalid.');
      await storage.removeItem('userToken');
      await storage.removeItem('userData');
      if (!isHandlingUnauthorized && unauthorizedHandler) {
        isHandlingUnauthorized = true;
        try {
          unauthorizedHandler();
        } finally {
          setTimeout(() => {
            isHandlingUnauthorized = false;
          }, 300);
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
