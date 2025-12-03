import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  user: null,
  role: null,
  token: null,
  refreshToken: null,
  isAuthenticated: false,
  loading: false,
  refreshing: false,
  error: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    loginRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    loginSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
    },
    loginFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    registerRequest: (state) => {
      state.loading = true;
      state.error = null;
    },
    registerSuccess: (state, action) => {
      state.loading = false;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
    },
    registerFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.role = null;
      state.token = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('username');
    },
    checkAuth: (state) => {
       // Action to trigger saga to check local storage
    },
    setAuth: (state, action) => {
        state.isAuthenticated = true;
        state.user = action.payload.username;
        state.role = action.payload.role;
        state.token = action.payload.token;
    },
    refreshTokenRequest: (state) => {
      state.refreshing = true;
    },
    refreshTokenSuccess: (state, action) => {
      state.refreshing = false;
      state.isAuthenticated = true;
      state.user = action.payload.username;
      state.role = action.payload.role;
      state.token = action.payload.access_token;
      state.refreshToken = action.payload.refresh_token;
    },
    refreshTokenFailure: (state) => {
      state.refreshing = false;
    }
  },
});

export const { 
    loginRequest, loginSuccess, loginFailure, 
    registerRequest, registerSuccess, registerFailure,
    logout, checkAuth, setAuth,
    refreshTokenRequest, refreshTokenSuccess, refreshTokenFailure
} = authSlice.actions;

export default authSlice.reducer;

