import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/Authentication';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Success Response:', response.data);
    return response;
  },
  (error) => {
    console.log('Error Response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    return Promise.reject(error);
  }
);

export const registerUser = async (data) => {
  try {
    console.log('Sending register data:', data);
    const res = await axiosInstance.post('/register', data);
    return res.data;
  } catch (err) {
    console.error('Register error details:', {
      status: err.response?.status,
      data: err.response?.data,
      message: err.message
    });
    throw handleError(err);
  }
};


export const verifyEmail = async (token) => {
  try {
    console.log('Verifying email with token:', token);
    const res = await axiosInstance.get(`/verify-email?token=${token}`);
    return res.data;
  } catch (err) {
    console.error('Verify email error:', err.response?.data);
    throw handleError(err);
  }
};



export const loginUser = async (data) => {
  try {
    console.log('Sending login data:', { email: data.email, password: '***' });
    const res = await axiosInstance.post('/login', data);
    
    // Lưu token vào localStorage
    if (res.data.token) {
      localStorage.setItem('token', res.data.token);
      localStorage.setItem('user', JSON.stringify({
        email: res.data.email,
        role: res.data.role
      }));
      console.log('Token saved, user logged in');
    }
    
    return res.data;
  } catch (err) {
    console.error('Login error:', err.response?.data);
    throw handleError(err);
  }
};

// 4. Quên mật khẩu
export const forgotPassword = async (email) => {
  try {
    console.log('Sending forgot password for:', email);
    const res = await axiosInstance.post('/forgot-password', { email });
    return res.data;
  } catch (err) {
    console.error('Forgot password error:', err.response?.data);
    throw handleError(err);
  }
};

// 5. Đặt lại mật khẩu
export const resetPassword = async (data) => {
  try {
    console.log('Resetting password with token:', data.token);
    const res = await axiosInstance.post('/reset-password', data);
    return res.data;
  } catch (err) {
    console.error('Reset password error:', err.response?.data);
    throw handleError(err);
  }
};

// 6. Đăng xuất
export const logoutUser = () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  console.log('User logged out');
  return Promise.resolve({ message: 'Đăng xuất thành công' });
};

// 7. Lấy thông tin user hiện tại
export const getCurrentUser = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  
  if (!token || !user) {
    return null;
  }
  
  try {
    return {
      token,
      user: JSON.parse(user)
    };
  } catch (err) {
    console.error('Error parsing user data:', err);
    logoutUser(); // Clear invalid data
    return null;
  }
};

// 8. Kiểm tra token có hợp lệ không
export const isAuthenticated = () => {
  const currentUser = getCurrentUser();
  return !!currentUser;
};

const handleError = (err) => {
  console.log('Full error object:', err);
  console.log('Error response data:', err.response?.data);
  
  if (err.response && err.response.data) {
    const errorData = err.response.data;
    
    if (errorData.error) {
      console.log('Found error field:', errorData.error);
      return new Error(errorData.error);
    }
    
    // ModelState validation errors
    if (errorData.errors) {
      const firstField = Object.keys(errorData.errors)[0];
      const firstError = errorData.errors[firstField][0];
      console.log('Found ModelState error:', firstError);
      return new Error(firstError);
    }
    
    // Identity errors with details
    if (errorData.details && Array.isArray(errorData.details)) {
      const firstDetail = errorData.details[0];
      const errorMsg = firstDetail.description || firstDetail.code || errorData.error;
      console.log('Found Identity error:', errorMsg);
      return new Error(errorMsg);
    }
    
    // ProblemDetails format
    if (errorData.title) {
      console.log('Found ProblemDetails error:', errorData.title);
      return new Error(errorData.title);
    }
    
    // String message
    if (typeof errorData === 'string') {
      return new Error(errorData);
    }
    
    // Fallback
    console.log('Using fallback error handling');
    return new Error(JSON.stringify(errorData));
  }
  
  // Network error
  if (err.code === 'NETWORK_ERROR' || !err.response) {
    return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
  }
  
  return new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
};
