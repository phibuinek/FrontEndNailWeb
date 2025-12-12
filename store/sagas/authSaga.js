import { call, put, takeLatest } from 'redux-saga/effects';
import { loginSuccess, loginFailure, registerSuccess, registerFailure, setAuth, refreshTokenSuccess, refreshTokenFailure, logout, changePasswordSuccess, changePasswordFailure } from '../slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

function persistAuthToStorage(data) {
  localStorage.setItem('access_token', data.access_token);
  localStorage.setItem('refresh_token', data.refresh_token);
  localStorage.setItem('userRole', data.role);

  if (data.username) {
    localStorage.setItem('username', data.username);
  } else {
    console.warn('Auth response missing username');
  }

  if (data.role === 'admin') {
    localStorage.setItem('isAdmin', 'true');
  } else {
    localStorage.removeItem('isAdmin');
  }
}

function* handleLogin(action) {
  try {
    const res = yield call(fetch, `${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    if (res.ok) {
      const data = yield res.json();
      persistAuthToStorage(data);
      window.dispatchEvent(new Event('auth-change'));
      yield put(loginSuccess(data));
    } else {
      yield put(loginFailure('Invalid credentials'));
    }
  } catch (error) {
    yield put(loginFailure(error.message));
  }
}

function* handleRegister(action) {
  try {
    const res = yield call(fetch, `${API_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    if (res.ok) {
      const data = yield res.json();
      persistAuthToStorage(data);
      window.dispatchEvent(new Event('auth-change'));
      yield put(registerSuccess(data));
    } else {
      const errorData = yield res.json();
      yield put(registerFailure(errorData.message || 'Registration failed'));
    }
  } catch (error) {
    yield put(registerFailure(error.message));
  }
}

function* handleCheckAuth() {
    const token = localStorage.getItem('access_token');
    const username = localStorage.getItem('username');
    const role = localStorage.getItem('userRole');
    
    if (token && username) {
        yield put(setAuth({ token, username, role }));
    }
}

function* handleRefreshToken() {
  try {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      yield put(refreshTokenFailure());
      return;
    }

    const res = yield call(fetch, `${API_URL}/auth/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      // If refresh fails (403, 401, etc.), clear all tokens
      // This could be due to expired refresh token, invalid token, or user not found
      localStorage.removeItem('access_token');
      localStorage.removeItem('refresh_token');
      localStorage.removeItem('userRole');
      localStorage.removeItem('isAdmin');
      localStorage.removeItem('username');
      yield put(refreshTokenFailure());
      return;
    }

    const data = yield res.json();
    persistAuthToStorage(data);
    window.dispatchEvent(new Event('auth-change'));
    yield put(refreshTokenSuccess(data));
  } catch (error) {
    // Silently handle CORS or network errors during refresh
    // Don't log to console to avoid noise
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    yield put(refreshTokenFailure());
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('username');
    localStorage.removeItem('userRole');
    localStorage.removeItem('isAdmin');
    yield put(logout());
    yield put(refreshTokenFailure());
  }
}

function* handleChangePassword(action) {
  try {
    const token = localStorage.getItem('access_token');
    if (!token) {
      yield put(changePasswordFailure('Not authenticated'));
      return;
    }

    const res = yield call(fetch, `${API_URL}/auth/change-password`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(action.payload),
    });

    if (res.ok) {
      yield put(changePasswordSuccess());
    } else {
      const errorData = yield res.json();
      yield put(changePasswordFailure(errorData.message || 'Failed to change password'));
    }
  } catch (error) {
    yield put(changePasswordFailure(error.message || 'Failed to change password'));
  }
}

export default function* authSaga() {
  yield takeLatest('auth/loginRequest', handleLogin);
  yield takeLatest('auth/registerRequest', handleRegister);
  yield takeLatest('auth/checkAuth', handleCheckAuth);
  yield takeLatest('auth/refreshTokenRequest', handleRefreshToken);
  yield takeLatest('auth/changePasswordRequest', handleChangePassword);
}

