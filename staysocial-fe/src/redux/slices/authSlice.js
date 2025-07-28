import { createSlice } from '@reduxjs/toolkit';

// Hàm load state từ localStorage
const loadStateFromStorage = () => {
  try {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    
    console.log('Loading auth state from localStorage:');
    console.log('Token exists:', !!token);
    console.log('User exists:', !!user);
    
    if (token && user && token !== 'undefined' && user !== 'undefined') {
      const userData = JSON.parse(user);
      console.log('Parsed user data:', userData);
      
      return {
        user: userData,
        role: userData.role,
        isAuthenticated: true,
      };
    }
  } catch (error) {
    console.error('Error loading auth state from localStorage:', error);
    // Xóa dữ liệu lỗi
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  }
  
  return {
    user: null,
    role: null,
    isAuthenticated: false,
  };
};

// Load initial state từ localStorage
const initialState = loadStateFromStorage();

console.log('Auth slice initial state:', initialState);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    login(state, action) {
      console.log('Redux login action:', action.payload);
      
      state.user = action.payload.user;
      state.role = action.payload.role;
      state.isAuthenticated = true;
      
      // Đảm bảo localStorage được sync
      if (action.payload.token) {
        localStorage.setItem('token', action.payload.token);
      }
      localStorage.setItem('user', JSON.stringify(action.payload.user));
      
      console.log('Redux state after login:', {
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      });
    },
    
    logout(state) {
      console.log('Redux logout action');
      
      state.user = null;
      state.role = null;
      state.isAuthenticated = false;
      
      // Xóa localStorage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      
      console.log('Redux state after logout:', {
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated
      });
    },
    
    // Action để sync state từ localStorage (dùng khi cần)
    syncFromStorage(state) {
      const storageState = loadStateFromStorage();
      state.user = storageState.user;
      state.role = storageState.role;
      state.isAuthenticated = storageState.isAuthenticated;
      
      console.log('Synced state from storage:', storageState);
    }
  },
});

export const { login, logout, syncFromStorage } = authSlice.actions;
export default authSlice.reducer;