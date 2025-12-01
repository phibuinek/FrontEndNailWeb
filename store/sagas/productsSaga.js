import { call, put, takeLatest } from 'redux-saga/effects';
import {
  fetchProductsSuccess, fetchProductsFailure,
  fetchProductSuccess,
  addProductSuccess, updateProductSuccess, deleteProductSuccess,
  productOperationFailure
} from '../slices/productsSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendnailweb.onrender.com';

function* fetchProducts() {
  try {
    const res = yield call(fetch, `${API_URL}/products`);
    
    // Check if response is JSON
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
        const text = yield res.text();
        throw new Error(`Invalid response from server: ${text.substring(0, 100)}`);
    }

    if (!res.ok) {
        throw new Error(`Failed to fetch products: ${res.status} ${res.statusText}`);
    }
    
    const data = yield res.json();
    
    if (Array.isArray(data)) {
        yield put(fetchProductsSuccess(data));
    } else {
        // If backend returns wrapped object like { data: [...] }
        if (data.data && Array.isArray(data.data)) {
             yield put(fetchProductsSuccess(data.data));
        } else {
             console.warn("API returned non-array product data:", data);
             yield put(fetchProductsSuccess([])); 
        }
    }
  } catch (e) {
    console.error("Product fetch error:", e);
    yield put(fetchProductsFailure(e.message));
    // Ensure items is empty on error to prevent UI crash
    yield put(fetchProductsSuccess([]));
  }
}

function* fetchProduct(action) {
    try {
        const res = yield call(fetch, `${API_URL}/products/${action.payload}`);
        if (!res.ok) {
             const errorText = yield res.text();
             throw new Error(`Product not found: ${res.status} - ${errorText}`);
        }
        const data = yield res.json();
        yield put(fetchProductSuccess(data));
    } catch (e) {
        console.error("Fetch product failed", e);
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

