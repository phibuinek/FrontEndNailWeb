import { call, put, takeLatest } from 'redux-saga/effects';
import { loginSuccess, loginFailure, registerSuccess, registerFailure, setAuth } from '../slices/authSlice';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://backendnailweb.onrender.com';

function* handleLogin(action) {
  try {
    const res = yield call(fetch, `${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(action.payload),
    });

    if (res.ok) {
      const data = yield res.json();
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('userRole', data.role);
      
      if (data.username) {
        localStorage.setItem('username', data.username);
      } else {
        console.warn('Login success but username is missing in response');
      }

      if (data.role === 'admin') {
         localStorage.setItem('isAdmin', 'true');
      } else {
         // Ensure isAdmin is cleared if not admin, to prevent leftover state from previous user
         localStorage.removeItem('isAdmin');
      }
      
      // Dispatch custom event for non-React components if needed (like Navbar used to)
      window.dispatchEvent(new Event('auth-change'));
      
      yield put(loginSuccess(data));
      
      // Redirect logic could be here or in component
      if (action.payload.router) {
          if (data.role === 'admin') {
              action.payload.router.push('/admin/dashboard');
          } else {
              action.payload.router.push('/');
          }
      }
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
      localStorage.setItem('access_token', data.access_token);
      localStorage.setItem('userRole', data.role);
      
      if (data.username) {
          localStorage.setItem('username', data.username);
      } else {
          console.warn('Register success but username is missing in response');
      }
      
      window.dispatchEvent(new Event('auth-change'));
      
      yield put(registerSuccess(data));
       if (action.payload.router) {
           action.payload.router.push('/');
       }
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

export default function* authSaga() {
  yield takeLatest('auth/loginRequest', handleLogin);
  yield takeLatest('auth/registerRequest', handleRegister);
  yield takeLatest('auth/checkAuth', handleCheckAuth);
}

