import axios from "axios";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ||
  "https://cafe-reservation-api-gateway-main-entry.onrender.com";

/* =========================
   AXIOS INSTANCE
========================= */
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

/* =========================
   REQUEST INTERCEPTOR
========================= */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

/* =========================
   RESPONSE INTERCEPTOR
========================= */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Auto logout on auth failure
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
    }
    return Promise.reject(error);
  }
);

/* =========================
   AUTH APIs
========================= */
export const register = (data) => api.post("/api/auth/register", data);
export const login = (data) => api.post("/api/auth/login", data);
export const getMe = () => api.get("/api/auth/me");
export const updateProfile = (data) => api.put("/api/auth/profile", data);
export const deleteProfile = () => api.delete("/api/auth/profile");
export const getAdmin = () => api.get("/api/auth/admin");

/* =========================
   RESERVATION APIs
========================= */
export const acquireLock = (data) =>
  api.post("/api/reservations/lock", data);

export const releaseLock = (data) =>
  api.post("/api/reservations/unlock", data);

export const bookReservation = (data) =>
  api.post("/api/reservations/book", data);

// ✅ FIXED
export const cancelReservation = (id) =>
  api.patch(`/api/reservations/${id}/cancel`);

// ✅ FIXED
export const getMyReservations = () =>
  api.get("/api/reservations/my");

export const getAllReservations = () =>
  api.get("/api/reservations/all");

/* =========================
   AVAILABILITY API
========================= */
export const getAvailability = (params) =>
  api.get("/api/availability", { params });

/* =========================
   TABLE APIs (ADMIN)
========================= */
export const createTable = (data) =>
  api.post("/api/tables", data);

export const getTables = () =>
  api.get("/api/tables");

export const updateTable = (id, data) =>
  api.put(`/api/tables/${id}`, data);

export const deleteTable = (id) =>
  api.delete(`/api/tables/${id}`);

/* =========================
   MENU APIs
========================= */
export const getMenus = () =>
  api.get("/api/menus");

// Admin only
export const createMenu = (data) =>
  api.post("/api/menus", data);

export const updateMenu = (id, data) =>
  api.put(`/api/menus/${id}`, data);

export const deleteMenu = (id) =>
  api.delete(`/api/menus/${id}`);
