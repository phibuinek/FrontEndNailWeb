'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshTokenRequest } from '@/store/slices/authSlice';

export default function TokenRefreshManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refresh = () => {
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        dispatch(refreshTokenRequest());
      }
    };

    // Initial refresh to ensure tokens are up to date after reload
    refresh();

    const interval = setInterval(refresh, 15 * 60 * 1000); // refresh every 15 minutes
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}




