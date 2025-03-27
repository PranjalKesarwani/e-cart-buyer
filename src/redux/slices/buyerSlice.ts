// src/features/user/buyerSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '../../config';
import {getBuyerToken} from '../../utils/helper';
import {apiClient} from '../../services/api';
import {Buyer} from '../../types';

const initialState: Buyer = {
  _id: null,
  name: null,
  success: false,
  profilePic: null,
  createdAt: null,
  activeSessions: [],
  loading: false,
  error: null,
  cart: [],
  wishlist: [],
};

export const fetchBuyer = createAsyncThunk<Buyer>(
  'buyer/fetchBuyer',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.get<any>(`/buyer/get-buyer-info`);

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const getCarts = createAsyncThunk<Buyer>(
  'buyer/getCarts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.post<any>(`/buyer/action-cart`);

      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const getWishlists = createAsyncThunk<Buyer>(
  'buyer/getWishlists',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.post<any>(`/buyer/action-wishlist`);
      ``;
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

// export const getUserCart = createAsyncThunk<any>

const buyerSlice = createSlice({
  name: 'buyer',
  initialState,
  reducers: {
    fetchUserStart: state => {
      state.loading = true;
      state.error = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBuyer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyer.fulfilled, (state, action: PayloadAction<any>) => {
        Object.assign(state, action.payload); // Update state with API response
        state.loading = false;
        state.success = true;
      })
      .addCase(fetchBuyer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getCarts.pending, state => {
        state.loading = true;
      })
      .addCase(getCarts.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.cart = action.payload;
      })
      .addCase(getCarts.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      })
      .addCase(getWishlists.pending, state => {
        state.loading = true;
      })
      .addCase(getWishlists.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.wishlist = action.payload;
      })
      .addCase(getWishlists.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {fetchUserStart} = buyerSlice.actions;
export default buyerSlice.reducer;
