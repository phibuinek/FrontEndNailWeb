'use client';

import { Provider } from 'react-redux';
import { store } from '../store/store';
import TokenRefreshManager from './auth/TokenRefreshManager';

export default function ReduxProvider({ children }) {
  return (
    <Provider store={store}>
      <TokenRefreshManager />
      {children}
    </Provider>
  );
}

