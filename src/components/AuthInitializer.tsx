'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/hooks/redux';
import { initializeAuth, checkAuthAsync } from '@/store/slices/authSlice';

export function AuthInitializer() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    // Initialize auth state from localStorage
    dispatch(initializeAuth());
    
    // Check if token is valid by calling the API
    dispatch(checkAuthAsync());
  }, [dispatch]);

  return null;
}