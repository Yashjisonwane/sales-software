import axios from 'axios';

// The Backend is on Port 4000
// const API_BASE_URL = 'http://localhost:4000/api/v1'; // Local Development
const API_BASE_URL = 'https://sales-software-production.up.railway.app/api/v1'; 

const apiClient = axios.create({
    baseURL: API_BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor for adding auth token
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('userToken');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default apiClient;
