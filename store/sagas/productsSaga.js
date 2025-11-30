import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchProductsSuccess, fetchProductsFailure,
  fetchProductSuccess,
  addProductSuccess, updateProductSuccess, deleteProductSuccess,
  productOperationFailure
} from '../slices/productsSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:3001';

function* fetchProducts() {
  try {
    const res = yield call(fetch, `${API_URL}/products`);
    const data = yield res.json();
    yield put(fetchProductsSuccess(data));
  } catch (e) {
    yield put(fetchProductsSuccess([])); // Fallback empty
  }
}

function* fetchProduct(action) {
    try {
        const res = yield call(fetch, `${API_URL}/products/${action.payload}`);
        const data = yield res.json();
        yield put(fetchProductSuccess(data));
    } catch (e) {
        yield put(productOperationFailure(e.message));
    }
}

function* addProduct(action) {
    try {
        const token = localStorage.getItem('access_token');
        const res = yield call(fetch, `${API_URL}/products`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(action.payload)
        });
        if (!res.ok) throw new Error('Failed to add product');
        const data = yield res.json();
        yield put(addProductSuccess(data));
    } catch (e) {
        yield put(productOperationFailure(e.message));
    }
}

function* updateProduct(action) {
    try {
        const token = localStorage.getItem('access_token');
        const { id, ...data } = action.payload;
        const res = yield call(fetch, `${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify(data)
        });
        if (!res.ok) throw new Error('Failed to update product');
        const updatedData = yield res.json();
        yield put(updateProductSuccess(updatedData));
    } catch (e) {
        yield put(productOperationFailure(e.message));
    }
}

function* deleteProduct(action) {
    try {
        const token = localStorage.getItem('access_token');
        const res = yield call(fetch, `${API_URL}/products/${action.payload}`, {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!res.ok) throw new Error('Failed to delete product');
        yield put(deleteProductSuccess(action.payload));
    } catch (e) {
        yield put(productOperationFailure(e.message));
    }
}

export default function* productsSaga() {
  yield takeLatest('products/fetchProductsRequest', fetchProducts);
  yield takeLatest('products/fetchProductRequest', fetchProduct);
  yield takeLatest('products/addProductRequest', addProduct);
  yield takeLatest('products/updateProductRequest', updateProduct);
  yield takeLatest('products/deleteProductRequest', deleteProduct);
}

