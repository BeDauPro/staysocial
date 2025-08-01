import { createSlice } from '@reduxjs/toolkit';
import { jwtDecode } from 'jwt-decode';

const loadStateFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    if (token && token !== 'undefined') {
      const decoded = jwtDecode(token);
      
      const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
      
      return {
        token,
        userInfo: {
          username: decoded.email || decoded.sub,
          role: decoded[roleClaim],
          email: decoded.email,
        },
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state:', error);
    localStorage.removeItem('token');
  }
  return {
    token: null,
    userInfo: null,
    isAuthenticated: false,
  };
};

const initialState = loadStateFromStorage();

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      const { token } = action.payload;
      try {
        const decoded = jwtDecode(token);
        const roleClaim = 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role';
        
        state.token = token;
        state.userInfo = {
          username: decoded.email || decoded.sub,
          role: decoded[roleClaim], // ✅ Đúng claim name
          email: decoded.email,
        };
        state.isAuthenticated = true;
        localStorage.setItem('token', token);
        
        // Debug log
        console.log('Login successful, role:', decoded[roleClaim]);
      } catch (error) {
        console.error('JWT decode error:', error);
        state.token = null;
        state.userInfo = null;
        state.isAuthenticated = false;
        localStorage.removeItem('token');
      }
    },
    
    logout(state) {
      state.token = null;
      state.userInfo = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
    
    syncFromStorage(state) {
      const storageState = loadStateFromStorage();
      state.token = storageState.token;
      state.userInfo = storageState.userInfo;
      state.isAuthenticated = storageState.isAuthenticated;
    }
  },
});

export const { login, logout, syncFromStorage } = authSlice.actions;
export default authSlice.reducer;
