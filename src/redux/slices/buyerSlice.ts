// src/features/user/buyerSlice.ts
import {createAsyncThunk, createSlice, PayloadAction} from '@reduxjs/toolkit';
import {apiClient} from '../../services/api';
import {TBuyer, TCart, TWishlist} from '../../types';

const initialState: TBuyer = {
  _id: null,
  name: null,
  success: false,
  profilePic: null,
  createdAt: null,
  activeSessions: [],
  hasSetLocation: false,
  lastSavedformattedAddress: '',
  loading: false,
  error: null,
  cart: [],
  wishlist: [],
  cartItemsCount: 0,
  selectedCart: null,
  selectedShop: null,
};

export const fetchBuyer = createAsyncThunk<TBuyer>(
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

export const getCarts = createAsyncThunk<[] | TCart[]>(
  'buyer/getCarts',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.post<any>(`/buyer/action-cart`, {
        action: 'GET',
      });
      return response.data;
    } catch (error: any) {
      console.log(error);
      return rejectWithValue(
        error.response?.data?.message || 'Something went wrong',
      );
    }
  },
);

export const getWishlists = createAsyncThunk<[] | TWishlist[]>(
  'buyer/getWishlists',
  async (_, {rejectWithValue}) => {
    try {
      const response = await apiClient.post<any>(`/buyer/action-wishlist`, {
        action: 'GET',
      });
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
    setCartItemsCount: (state, action) => {
      state.cartItemsCount = action.payload;
    },
    setSelectedCart: (state, action) => {
      state.selectedCart = action.payload;
    },
    setSelectedShop: (state, action) => {
      state.selectedShop = action.payload;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(fetchBuyer.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchBuyer.fulfilled, (state, action: PayloadAction<any>) => {
        // console.log('------->>>>>>>>>', action.payload.buyerInfo);
        Object.assign(state, action.payload.buyerInfo); // Update state with API response
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
        state.cart = [...action.payload.cart];
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
        state.wishlist = action.payload.paginatedItems;
      })
      .addCase(getWishlists.rejected, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

export const {
  fetchUserStart,
  setSelectedCart,
  setCartItemsCount,
  setSelectedShop,
} = buyerSlice.actions;
export default buyerSlice.reducer;
