import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

interface DecodedToken {
  user_id: string;
  user_name: string;
  exp: number;
  iat: number;
  type: string,
  sub: string,
  nbf: number,
  jti: string,
  fresh: boolean,
  csrf: string,
}

interface AuthState {
  token: string | null;
  decoded: DecodedToken | null;
  authLoaded: boolean;
}

const storedToken = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
let decoded: DecodedToken | null = null;

if (storedToken) {
  try {
    decoded = jwtDecode(storedToken);
  } catch (e) {
    decoded = null;
    localStorage.removeItem('token');
  }
}

const initialState: AuthState = {
  token: storedToken,
  decoded: decoded,
  authLoaded: true,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setToken: (state, action: PayloadAction<string>) => {
      localStorage.setItem('token', action.payload);
      state.token = action.payload;
      try {
        state.decoded = jwtDecode(action.payload);
      } catch (err) {
        console.error('Invalid JWT token');
        state.decoded = null;
      }
    },
    clearToken: (state) => {
      state.token = null;
      state.decoded = null;
      localStorage.removeItem('token');
    },
  },
});

export const { setToken, clearToken } = authSlice.actions;
export default authSlice.reducer;

export const selectIsAuthenticated = (state: { auth: AuthState }) =>
  state.auth.authLoaded && !!state.auth.token;

// import { selectIsAuthenticated } from 'authSlice';
// const isAuthenticated = useSelector(selectIsAuthenticated);
