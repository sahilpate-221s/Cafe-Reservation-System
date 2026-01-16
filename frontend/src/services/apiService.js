import * as api from "./api.js";

/* =========================
   ERROR NORMALIZER
========================= */
const handleError = (error) => {
  if (error?.response?.data?.message) {
    throw new Error(error.response.data.message);
  }
  if (typeof error?.response?.data === "string") {
    throw new Error(error.response.data);
  }
  throw new Error(error.message || "Something went wrong");
};

/* =========================
   AUTH
========================= */
export const register = async (data) => {
  try {
    const res = await api.register(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const login = async (data) => {
  try {
    const res = await api.login(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMe = async () => {
  try {
    const res = await api.getMe();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getAdmin = async () => {
  try {
    const res = await api.getAdmin();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateProfile = async (data) => {
  try {
    const res = await api.updateProfile(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteProfile = async () => {
  try {
    const res = await api.deleteProfile();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

/* =========================
   RESERVATIONS
========================= */
export const bookReservation = async (data) => {
  try {
    const res = await api.bookReservation(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const cancelReservation = async (id) => {
  try {
    const res = await api.cancelReservation(id);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMyReservations = async () => {
  try {
    const res = await api.getMyReservations();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getAllReservations = async () => {
  try {
    const res = await api.getAllReservations();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

/* =========================
   AVAILABILITY (FIXED)
========================= */
export const getAvailability = async (params) => {
  try {
    const res = await api.getAvailability(params);
    return res.data; // ✅ FIXED
  } catch (err) {
    handleError(err);
  }
};

/* =========================
   TABLES
========================= */
export const createTable = async (data) => {
  try {
    const res = await api.createTable(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getTables = async () => {
  try {
    const res = await api.getTables();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateTable = async (id, data) => {
  try {
    const res = await api.updateTable(id, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteTable = async (id) => {
  try {
    const res = await api.deleteTable(id);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

/* =========================
   MENU
========================= */
export const createMenu = async (data) => {
  try {
    const res = await api.createMenu(data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const getMenus = async () => {
  try {
    const res = await api.getMenus();
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const updateMenu = async (id, data) => {
  try {
    const res = await api.updateMenu(id, data);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};

export const deleteMenu = async (id) => {
  try {
    const res = await api.deleteMenu(id);
    return res.data;
  } catch (err) {
    handleError(err);
  }
};
