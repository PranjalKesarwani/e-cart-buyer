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
      });
  },
});

export const {fetchUserStart} = buyerSlice.actions;
export default buyerSlice.reducer;
