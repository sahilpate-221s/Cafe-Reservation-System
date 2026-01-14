import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  step: 1,
  data: {
    currentMonth: new Date().getMonth(),
    currentYear: new Date().getFullYear(),
    selectedDate: new Date().getDate(),
    selectedTime: '6:30 PM',
    selectedGuests: 2,
    selectedTable: null,
  },
};

const reservationSlice = createSlice({
  name: 'reservation',
  initialState,
  reducers: {
    setReservationStep: (state, action) => {
      state.step = action.payload;
    },
    setReservationData: (state, action) => {
      state.data = { ...state.data, ...action.payload };
    },
    resetReservation: () => {
      return initialState;
    },
  },
});

export const { setReservationStep, setReservationData, resetReservation } = reservationSlice.actions;
export default reservationSlice.reducer;
