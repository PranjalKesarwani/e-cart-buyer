import {createSlice, createAsyncThunk, PayloadAction} from '@reduxjs/toolkit';
import {request} from '../../services/api';

// ✅ Define TypeScript Types
interface AuthState {
  user: any | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

// ✅ Initial State
const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// ✅ AsyncThunk for Login
export const login = createAsyncThunk(
  'auth/login',
  async (
    {email, password}: {email: string; password: string},
    {rejectWithValue},
  ) => {
    try {
      const data = await request('POST', '/auth/login', {email, password});
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

// ✅ AsyncThunk for Checking Authentication
export const checkLoginStatus = createAsyncThunk(
  'auth/checkLogin',
  async (_, {getState, rejectWithValue}) => {
    try {
      const {auth} = getState() as {auth: {token: string | null}};
      if (!auth.token) throw new Error('No token found');

      const data = await request('GET', '/auth/check', null);
      return data;
    } catch (error: any) {
      return rejectWithValue(error);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: state => {
      state.user = null;
      state.token = null;
    },
  },
  extraReducers: builder => {
    builder
      .addCase(login.pending, state => {
        state.loading = true;
      })
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{user: any; token: string}>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        },
      )
      .addCase(
        login.rejected,
        (state, action: PayloadAction<string | unknown>) => {
          state.loading = false;
          state.error = action.payload as string;
        },
      )
      .addCase(
        checkLoginStatus.fulfilled,
        (state, action: PayloadAction<{user: any}>) => {
          state.user = action.payload.user;
        },
      )
      .addCase(checkLoginStatus.rejected, state => {
        state.user = null;
        state.token = null;
      });
  },
});

export const {logout} = authSlice.actions;
export default authSlice.reducer;
