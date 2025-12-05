'use client';

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { refreshTokenRequest } from '@/store/slices/authSlice';

export default function TokenRefreshManager() {
  const dispatch = useDispatch();

  useEffect(() => {
    const refresh = () => {
      const refreshToken = localStorage.getItem('refresh_token');
      const accessToken = localStorage.getItem('access_token');
      
      // Only refresh if both tokens exist
      // If refresh token exists but access token doesn't, it means refresh failed before
      // and we should not keep trying
      if (refreshToken && accessToken) {
        dispatch(refreshTokenRequest());
      }
    };

    // Initial refresh to ensure tokens are up to date after reload
    // Only if both tokens exist
    const refreshToken = localStorage.getItem('refresh_token');
    const accessToken = localStorage.getItem('access_token');
    if (refreshToken && accessToken) {
      refresh();
    }

    const interval = setInterval(refresh, 15 * 60 * 1000); // refresh every 15 minutes
    return () => clearInterval(interval);
  }, [dispatch]);

  return null;
}





