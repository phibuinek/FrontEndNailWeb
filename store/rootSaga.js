import { all } from 'redux-saga/effects';
import authSaga from './sagas/authSaga';
import productsSaga from './sagas/productsSaga';

export default function* rootSaga() {
  yield all([
    authSaga(),
    productsSaga(),
  ]);
}

