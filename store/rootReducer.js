import { combineReducers } from '@reduxjs/toolkit';
import authReducer from './slices/authSlice';
import productsReducer from './slices/productsSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  products: productsReducer,
});

export default rootReducer;

