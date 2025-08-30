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
      if (!state) return initialState;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        // Validate token
        const isValidToken = token && 
          token !== 'undefined' && 
          token !== 'null' && 
          token.trim().length > 0;
        
        // Validate user data
        let user = null;
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          try {
            user = JSON.parse(userStr);
            // Check if user has required fields
            if (!user || !user.id || !user.username || !user.email) {
              user = null;
            }
          } catch {
            user = null;
          }
        }
        
        // If either token or user is invalid, clear everything
        if (isValidToken && user) {
          state.isAuthenticated = true;
          state.token = token;
          state.user = user;
        } else {
          // Clear invalid data
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
      state.loading = false;
    },
    
    loginSuccess: (state, action: PayloadAction<{ token: string; user: any }>) => {
      if (!state) return initialState;
      // Validate incoming data
      const { token, user } = action.payload;
      
      if (!token || token === 'undefined' || token === 'null' || !user || !user.id) {
        console.error('Invalid login data received, not saving');
        return;
      }
      
      state.isAuthenticated = true;
      state.token = token;
      state.user = user;
      state.loading = false;
      
      // Save to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('access_token', token);
        localStorage.setItem('user', JSON.stringify(user));
      }
    },
    
    logout: (state) => {
      if (!state) return initialState;
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
      if (!state) return initialState;
      state.loading = action.payload;
    },
    
    clearInvalidAuth: (state) => {
      if (!state) return initialState;
      state.isAuthenticated = false;
      state.token = null;
      state.user = null;
      
      // Clear localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('access_token');
        localStorage.removeItem('user');
      }
    },
    
    validateAndCleanAuth: (state) => {
      if (!state) return initialState;
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('access_token');
        const userStr = localStorage.getItem('user');
        
        // Check current state vs localStorage consistency
        const hasValidToken = token && token !== 'undefined' && token !== 'null' && token.trim().length > 0;
        let hasValidUser = false;
        
        if (userStr && userStr !== 'undefined' && userStr !== 'null') {
          try {
            const user = JSON.parse(userStr);
            hasValidUser = user && user.id && user.username && user.email;
          } catch {
            hasValidUser = false;
          }
        }
        
        // If data is inconsistent or invalid, clean everything
        if (!hasValidToken || !hasValidUser) {
          state.isAuthenticated = false;
          state.token = null;
          state.user = null;
          localStorage.removeItem('access_token');
          localStorage.removeItem('user');
        }
      }
    }
  }
});

export const { 
  initializeAuth, 
  loginSuccess, 
  logout, 
  setLoading, 
  clearInvalidAuth, 
  validateAndCleanAuth 
} = authSlice.actions;

// Ensure proper reducer export
const authReducer = authSlice.reducer;
export default authReducer;