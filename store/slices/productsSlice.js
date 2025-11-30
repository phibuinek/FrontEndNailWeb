import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  items: [],
  currentProduct: null,
  loading: false,
  error: null,
  uploading: false,
};

const productsSlice = createSlice({
  name: 'products',
  initialState,
  reducers: {
    fetchProductsRequest: (state) => {
      state.loading = true;
    },
    fetchProductsSuccess: (state, action) => {
      state.loading = false;
      state.items = action.payload;
    },
    fetchProductsFailure: (state, action) => {
      state.loading = false;
      state.error = action.payload;
    },
    fetchProductRequest: (state) => {
      state.loading = true;
      state.currentProduct = null;
    },
    fetchProductSuccess: (state, action) => {
      state.loading = false;
      state.currentProduct = action.payload;
    },
    addProductRequest: (state) => {
      state.loading = true;
    },
    addProductSuccess: (state, action) => {
      state.loading = false;
      state.items.push(action.payload);
    },
    updateProductRequest: (state) => {
      state.loading = true;
    },
    updateProductSuccess: (state, action) => {
      state.loading = false;
      const index = state.items.findIndex(p => p.id === action.payload.id);
      if (index !== -1) {
        state.items[index] = action.payload;
      }
    },
    deleteProductRequest: (state) => {
      state.loading = true;
    },
    deleteProductSuccess: (state, action) => {
      state.loading = false;
      state.items = state.items.filter(p => p.id !== action.payload);
    },
    productOperationFailure: (state, action) => {
        state.loading = false;
        state.error = action.payload;
    }
  },
});

export const {
  fetchProductsRequest, fetchProductsSuccess, fetchProductsFailure,
  fetchProductRequest, fetchProductSuccess,
  addProductRequest, addProductSuccess,
  updateProductRequest, updateProductSuccess,
  deleteProductRequest, deleteProductSuccess,
  productOperationFailure
} = productsSlice.actions;

export default productsSlice.reducer;

