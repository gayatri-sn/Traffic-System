// services/api.js
import axios from 'axios';

const BASE_URL = 'http://localhost:5000';

const api = axios.create({
  baseURL: BASE_URL,
  headers: { 'Content-Type': 'application/json' },
});

// Attach JWT token to every request automatically
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401 globally — token expired or invalid
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const authAPI = {
  login: (credentials) => api.post('/auth/login', credentials),
  signup: (data) => api.post('/auth/signup', data),
  me: () => api.get('/auth/me'),
};

export const violationsAPI = {
  getAll: () => api.get('/violations'),
  create: (data) => api.post('/violations', data),
  updateStatus: (id, status) => api.put(`/violations/${id}`, { status }),
  delete: (id) => api.delete(`/violations/${id}`),
};

export const citizenAPI = {
  lookup: (vehicleNo) => api.get(`/citizen/${vehicleNo}`),
  pay: (id) => api.put(`/citizen/pay/${id}`),
};

export default api;
