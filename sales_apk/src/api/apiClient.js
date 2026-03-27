import axios from 'axios';

// Change this to your actual backend URL
const BASE_URL = 'https://api.hinesq.com/v1';

const apiClient = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// REQUEST INTERCEPTOR: Add Auth Token automatically
apiClient.interceptors.request.use(
  async (config) => {
    // const token = await AsyncStorage.getItem('userToken'); // Example
    // if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (error) => Promise.reject(error)
);

// RESPONSE INTERCEPTOR: Global Error Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Logic for Logout or Refresh Token
      console.log('Unauthorized - Logging out...');
    }
    return Promise.reject(error);
  }
);

export default apiClient;
