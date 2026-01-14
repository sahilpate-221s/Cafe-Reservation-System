import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getMenus } from '../../services/apiService';

// Async thunk for fetching menus
export const fetchMenus = createAsyncThunk(
  'menu/fetchMenus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await getMenus();
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || error.message);
    }
  }
);

const menuSlice = createSlice({
  name: 'menu',
  initialState: {
    items: [],
    categories: [],
    loading: false,
    error: null,
    lastFetched: null,
  },
  reducers: {
    clearMenuError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMenus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchMenus.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload;
        // Extract unique categories
        state.categories = [...new Set(action.payload.map(item => item.category))];
        state.lastFetched = Date.now();
      })
      .addCase(fetchMenus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const { clearMenuError } = menuSlice.actions;
export default menuSlice.reducer;
