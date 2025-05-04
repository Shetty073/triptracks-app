import axios from 'axios';
import { BACKEND_BASE_URI } from '../constants/urls';


// Create an Axios instance
const axiosClient = axios.create({
  baseURL: BACKEND_BASE_URI,
  timeout: 30000, // 30 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  (config) => {
    // Add auth token if needed
    const token = sessionStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    if (import.meta.env.DEV) {
      console.log(import.meta.env);
      
      console.debug('[Request]', config);
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosClient.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.debug('[Response]', response);
    }
    return response;
  },
  (error) => {
    const { response } = error;

    if (response) {
      // Server responded with a status code outside 2xx
      switch (response.status) {
        case 400:
          console.warn('Bad Request:', response.data);
          break;
        case 401:
          console.warn('Unauthorized. Logging out...');
          sessionStorage.removeItem('authToken');

          const { logout } = useAuth();
          logout();

          const navigate = useNavigate();
          navigate('/auth');
          break;
        case 403:
          console.warn('Forbidden');
          break;
        case 404:
          console.warn('Not found');
          break;
        case 500:
          console.error('Server error:', response.data);
          break;
        default:
          console.error(`Error ${response.status}:`, response.data);
      }
    } else if (error.request) {
      // No response from server
      console.error('No response from server');
    } else {
      // Error setting up request
      console.error('Request setup error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
