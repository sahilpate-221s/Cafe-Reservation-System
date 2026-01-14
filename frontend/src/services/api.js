import axios from 'axios';

const API_BASE_URL = 'http://localhost:4000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add interceptor to include token from localStorage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const register = (data) => api.post('/api/auth/register', data);
export const login = (data) => api.post('/api/auth/login', data);
export const getMe = () => api.get('/api/auth/me');
export const updateProfile = (data) => api.put('/api/auth/profile', data);
export const deleteProfile = () => api.delete('/api/auth/profile');
export const getAdmin = () => api.get('/api/auth/admin');

// Reservation APIs
export const acquireLock = (data) => api.post('/api/reservations/lock', data);
export const releaseLock = (data) => api.post('/api/reservations/unlock', data);
export const bookReservation = (data) => api.post('/api/reservations/book', data);
export const cancelReservation = (id) => api.put(`/api/reservations/cancel/${id}`);
export const getMyReservations = () => api.get('/api/reservations/my');
export const getAllReservations = () => api.get('/api/reservations/all');

// Availability API
export const getAvailability = (params) => api.get('/api/availability/', { params });

// Table APIs (Admin)
export const createTable = (data) => api.post('/api/tables/', data);
export const getTables = () => api.get('/api/tables/');
export const updateTable = (id, data) => api.put(`/api/tables/${id}`, data);
export const deleteTable = (id) => api.delete(`/api/tables/${id}`);

// Menu APIs (Admin for CRUD, User for read)
export const createMenu = (data) => api.post('/api/menus/', data);
export const getMenus = () => api.get('/api/menus/');
export const updateMenu = (id, data) => api.put(`/api/menus/${id}`, data);
export const deleteMenu = (id) => api.delete(`/api/menus/${id}`);
