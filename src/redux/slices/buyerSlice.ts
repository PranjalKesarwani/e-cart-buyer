// src/features/user/buyerSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import axios from 'axios';
import {API_URL} from '../../config';
import {getBuyerToken} from '../../utils/helper';
import {apiClient} from '../../services/api';
import {Buyer} from '../../types';

interface UserState {
  profile: any | null;
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  error: null,
};

export const fetchBuyer = createAsyncThunk<Buyer>(
  'buyer/fetchBuyer',
  async (_, {rejectWithValue}) => {
    try {
      console.log('called this function thunk api of buyerslice');
      const token = await getBuyerToken();
      const response = await apiClient.get<any>(`/buyer/get-buyer-info`);
      console.log('thunk api wala:', response.data);
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
    fetchUserSuccess: (state, action: PayloadAction<any>) => {
      state.loading = false;
      state.profile = action.payload;
    },
    fetchUserFailure: (state, action: PayloadAction<string>) => {
      state.loading = false;
      state.error = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBuyer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyer.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchBuyer.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {fetchUserStart, fetchUserSuccess, fetchUserFailure} =
  buyerSlice.actions;
export default buyerSlice.reducer;
