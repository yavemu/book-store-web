import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { authService } from '@/services/api';
import { 
  LoginDto, 
  LoginResponseDto, 
  RegisterUserDto, 
  RegisterResponseDto, 
  UserProfileResponseDto 
} from '@/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: UserProfileResponseDto | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  isAuthenticated: false,
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Async thunks
export const loginAsync = createAsyncThunk(
  'auth/login',
  async (loginData: LoginDto, { rejectWithValue }) => {
    try {
      const response = await authService.login(loginData);
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Error al iniciar sesión';
      return rejectWithValue(errorMessage);
    }
  }
);

export const registerAsync = createAsyncThunk(
  'auth/register',
  async (registerData: RegisterUserDto, { rejectWithValue }) => {
    try {
      const response = await authService.register(registerData);
      return response;
    } catch (error: unknown) {
      const errorMessage = (error as Error)?.message || 'Error al registrar usuario';
      return rejectWithValue(errorMessage);
    }
  }
);

export const checkAuthAsync = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      if (!authService.isAuthenticated()) {
        throw new Error('No token found');
      }
      const profile = await authService.getProfile();
      return {
        user: profile,
        token: authService.getToken(),
      };
    } catch (error: unknown) {
      // Solo eliminar token si es error 401
      const err = error as { status?: number; message?: string };
      if (err?.status === 401 || err?.message?.includes('401')) {
        authService.logout();
      }
      const errorMessage = err?.message || 'Error al verificar autenticación';
      return rejectWithValue(errorMessage);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    logout: (state) => {
      authService.logout();
      state.isAuthenticated = false;
      state.user = null;
      state.token = null;
      state.error = null;
    },
    // Initialize auth state from localStorage on app start
    initializeAuth: (state) => {
      const token = authService.getToken();
      if (token) {
        state.token = token;
        // Don't set isAuthenticated here, let checkAuth verify the token
      }
    },
  },
  extraReducers: (builder) => {
    // Login
    builder
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginAsync.fulfilled, (state, action: PayloadAction<LoginResponseDto>) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.access_token;
        state.error = null;
      })
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Register
    builder
      .addCase(registerAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerAsync.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
      })
      .addCase(registerAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });

    // Check Auth
    builder
      .addCase(checkAuthAsync.pending, (state) => {
        state.loading = true;
      })
      .addCase(checkAuthAsync.fulfilled, (state, action) => {
        state.loading = false;
        state.isAuthenticated = true;
        state.user = action.payload.user;
        state.token = action.payload.token;
        state.error = null;
      })
      .addCase(checkAuthAsync.rejected, (state, action) => {
        state.loading = false;
        state.isAuthenticated = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      });
  },
});

export const { clearError, logout, initializeAuth } = authSlice.actions;
export default authSlice.reducer;