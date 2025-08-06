import axios from 'axios';
import { API_BASE_URL } from '../config';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user && user.token) {
      config.headers['Authorization'] = 'Bearer ' + user.token;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const originalRequest = error.config;

    // This is the crucial check. We only want to auto-logout if the error is 401 (Unauthorized)
    // AND it did NOT come from an authentication-related page.
    if (error.response && error.response.status === 401) {
      const publicUrls = [
        '/users/login',
        '/users/register',
        '/account-recovery/forgot-username',
        '/account-recovery/verify-otp-username',
        '/account-recovery/forgot-password',
        '/account-recovery/reset-password',
      ];

      // If the URL is NOT one of our public auth URLs, it means a token is expired/invalid on a protected route.
      // In this case, we log the user out.
      if (!publicUrls.includes(originalRequest.url)) {
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(new Error('Session expired, please log in again.'));
      }
    }
    
    // For login failures and other errors, we let the component's `catch` block handle it.
    return Promise.reject(error);
  }
);

export default api; 