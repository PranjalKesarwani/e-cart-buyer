// src/app/store.ts
import {configureStore} from '@reduxjs/toolkit';
import authReducer from '../redux/slices/authSlice';
import buyerReducer from '../redux/slices/buyerSlice';
// import { APP_ENV } from '@env';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    buyer: buyerReducer,
  },
  middleware: getDefaultMiddleware =>
    getDefaultMiddleware({serializableCheck: false}), // Allow non-serializable data if needed
  devTools: process.env.APP_ENV !== 'production', // Enable Redux DevTools only in development
});

// ✅ RootState & AppDispatch Types
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
