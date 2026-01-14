import {
  register as apiRegister,
  login as apiLogin,
  getMe as apiGetMe,
  getAdmin as apiGetAdmin,
  bookReservation as apiBookReservation,
  cancelReservation as apiCancelReservation,
  getMyReservations as apiGetMyReservations,
  getAllReservations as apiGetAllReservations,
  getAvailability as apiGetAvailability,
  createTable as apiCreateTable,
  getTables as apiGetTables,
  createMenu as apiCreateMenu,
  getMenus as apiGetMenus,
  updateMenu as apiUpdateMenu,
  deleteMenu as apiDeleteMenu,
  updateProfile as apiUpdateProfile,
  deleteProfile as apiDeleteProfile,
  updateTable as apiUpdateTable,
  deleteTable as apiDeleteTable,
} from './api.js';

// Auth functions
export const register = async (data) => {
  try {
    const response = await apiRegister(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const login = async (data) => {
  try {
    const response = await apiLogin(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMe = async () => {
  try {
    const response = await apiGetMe();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAdmin = async () => {
  try {
    const response = await apiGetAdmin();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateProfile = async (data) => {
  try {
    const response = await apiUpdateProfile(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteProfile = async () => {
  try {
    const response = await apiDeleteProfile();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Reservation functions
export const bookReservation = async (data) => {
  try {
    const response = await apiBookReservation(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const cancelReservation = async (id) => {
  try {
    const response = await apiCancelReservation(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMyReservations = async () => {
  try {
    const response = await apiGetMyReservations();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getAllReservations = async () => {
  try {
    const response = await apiGetAllReservations();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Availability function
export const getAvailability = async (params) => {
  try {
    const response = await apiGetAvailability(params);
    // Backend returns array directly, axios wraps it in response.data
    return response;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Table functions
export const createTable = async (data) => {
  try {
    const response = await apiCreateTable(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getTables = async () => {
  try {
    const response = await apiGetTables();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateTable = async (id, data) => {
  try {
    const response = await apiUpdateTable(id, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteTable = async (id) => {
  try {
    const response = await apiDeleteTable(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

// Menu functions
export const createMenu = async (data) => {
  try {
    const response = await apiCreateMenu(data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const getMenus = async () => {
  try {
    const response = await apiGetMenus();
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const updateMenu = async (id, data) => {
  try {
    const response = await apiUpdateMenu(id, data);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};

export const deleteMenu = async (id) => {
  try {
    const response = await apiDeleteMenu(id);
    return response.data;
  } catch (error) {
    throw error.response?.data || error.message;
  }
};
