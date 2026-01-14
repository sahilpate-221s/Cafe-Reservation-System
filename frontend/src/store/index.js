import { configureStore } from '@reduxjs/toolkit';
import reservationReducer from './slices/reservationSlice';
import menuReducer from './slices/menuSlice';
import userReducer from './slices/userSlice';

export const store = configureStore({
  reducer: {
    reservation: reservationReducer,
    menu: menuReducer,
    user: userReducer,
  },
});

export default store;
