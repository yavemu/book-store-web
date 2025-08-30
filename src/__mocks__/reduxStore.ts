import { configureStore } from '@reduxjs/toolkit';

// Mock Redux store for testing
export const createMockStore = (initialState = {}) => {
  const mockAuthSlice = {
    name: 'auth',
    reducer: (state = { isAuthenticated: false, token: null, user: null, loading: false }, action: any) => {
      switch (action.type) {
        case 'auth/loginSuccess':
          return {
            ...state,
            isAuthenticated: true,
            token: action.payload.token,
            user: action.payload.user,
            loading: false,
          };
        case 'auth/logout':
          return {
            ...state,
            isAuthenticated: false,
            token: null,
            user: null,
            loading: false,
          };
        case 'auth/setLoading':
          return {
            ...state,
            loading: action.payload,
          };
        default:
          return state;
      }
    },
  };

  return configureStore({
    reducer: {
      auth: mockAuthSlice.reducer,
    },
    preloadedState: initialState,
  });
};

export const mockUser = {
  id: 'user-1',
  username: 'testuser',
  email: 'test@example.com',
  role: 'USER' as const,
};

export const mockAuthState = {
  isAuthenticated: true,
  token: 'mock-jwt-token',
  user: mockUser,
  loading: false,
};

// Mock hooks
export const mockUseAppSelector = jest.fn();
export const mockUseAppDispatch = jest.fn();

export const setupReduxMocks = (authState = mockAuthState) => {
  mockUseAppSelector.mockImplementation((selector: any) => {
    return selector({ auth: authState });
  });
  
  mockUseAppDispatch.mockReturnValue(jest.fn());
};