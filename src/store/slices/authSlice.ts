import { createSlice, PayloadAction } from '@reduxjs/toolkit';

interface AuthState {
  isAuthenticated: boolean;
  token: string | null;
  user: {
    id: string;
    username: string;
    email: string;
    role: 'ADMIN' | 'USER';
  } | null;
  loading: boolean;
}

const initialState: AuthState = {
  isAuthenticated: false,
  token: null,
  user: null,
  loading: true, // Start with loading true to check localStorage
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    initializeAuth: (state) => {
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        const user = localStorage.getItem('user');
        
        if (token) {
          state.isAuthenticated = true;
          state.token = token;
          state.user = user ? JSON.parse(user) : null;
        }
      }
      state.loading = false;
    },
    
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      state.isAuthenticated = true;
      state.token = action.payload.token;
      state.user = action.payload.user;
      state.loading = false;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', action.payload.token);
        localStorage.setItem('user', JSON.stringify(action.payload.user));
      }
    },
    
    logout: (state) => {
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      state.loading = false;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
    
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    }
  }
});

export const { initializeAuth, loginSuccess, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;