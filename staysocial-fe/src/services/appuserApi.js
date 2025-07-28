import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/AppUsers';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

// Request interceptor để thêm token
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor để xử lý response và error
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('AppUser API Success Response:', response.data);
    return response;
  },
  (error) => {
    console.log('AppUser API Error Response:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    // Nếu token hết hạn hoặc không hợp lệ, chuyển về trang login
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    
    return Promise.reject(error);
  }
);

// 1. Lấy thông tin profile của user hiện tại
export const getMyProfile = async () => {
  try {
    console.log('Getting my profile...');
    const res = await axiosInstance.get('/my-profile');
    return res.data;
  } catch (err) {
    console.error('Get my profile error:', err.response?.data);
    throw handleError(err);
  }
};

// 2. Cập nhật thông tin profile của user hiện tại
export const updateMyProfile = async (profileData) => {
  try {
    console.log('Updating my profile:', profileData);
    const res = await axiosInstance.post( BASE_URL, profileData);
    return res.data;
  } catch (err) {
    console.error('Update my profile error:', err.response?.data);
    throw handleError(err);
  }
};

// 3. Lấy thông tin user theo ID (cho admin hoặc public info)
export const getUserById = async (userId) => {
  try {
    console.log('Getting user by ID:', userId);
    const res = await axiosInstance.get(`/${userId}`);
    return res.data;
  } catch (err) {
    console.error('Get user by ID error:', err.response?.data);
    throw handleError(err);
  }
};

// 5. Lấy tất cả users (chỉ dành cho admin)
export const getAllUsers = async () => {
  try {
    console.log('Getting all users...');
    const res = await axiosInstance.get('/');
    return res.data;
  } catch (err) {
    console.error('Get all users error:', err.response?.data);
    throw handleError(err);
  }
};

// 6. Cập nhật user theo ID (cho admin)
export const updateUser = async (userId, userData) => {
  try {
    console.log('Updating user:', userId, userData);
    const res = await axiosInstance.put(`/${userId}`, userData);
    return res.data;
  } catch (err) {
    console.error('Update user error:', err.response?.data);
    throw handleError(err);
  }
};

// 7. Xóa user (chỉ dành cho admin)
export const deleteUser = async (userId) => {
  try {
    console.log('Deleting user:', userId);
    const res = await axiosInstance.delete(`/${userId}`);
    return res.data;
  } catch (err) {
    console.error('Delete user error:', err.response?.data);
    throw handleError(err);
  }
};

// 8. Kiểm tra user có đăng nhập không
export const isAuthenticated = () => {
  const token = localStorage.getItem('token');
  const user = localStorage.getItem('user');
  return !!(token && user);
};

// 9. Lấy thông tin user hiện tại từ localStorage
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
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    return null;
  }
};

// Error handling function
const handleError = (err) => {
  console.log('Full error object:', err);
  console.log('Error response data:', err.response?.data);
  
  if (err.response && err.response.data) {
    const errorData = err.response.data;
    
    // Xử lý error dạng string trực tiếp
    if (typeof errorData === 'string') {
      console.log('String error:', errorData);
      return new Error(errorData);
    }
    
    // Xử lý error có field "message"
    if (errorData.message) {
      console.log('Found message field:', errorData.message);
      return new Error(errorData.message);
    }
    
    // Xử lý error có field "error"
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
      const errorMsg = firstDetail.description || firstDetail.code || 'Validation error';
      console.log('Found Identity error:', errorMsg);
      return new Error(errorMsg);
    }
    
    // ProblemDetails format
    if (errorData.title) {
      console.log('Found ProblemDetails error:', errorData.title);
      return new Error(errorData.title);
    }
    
    // Fallback cho object error
    console.log('Using fallback error handling');
    return new Error(JSON.stringify(errorData));
  }
  
  // Network error
  if (err.code === 'NETWORK_ERROR' || !err.response) {
    return new Error('Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng.');
  }
  
  // HTTP status errors
  if (err.response?.status) {
    switch (err.response.status) {
      case 400:
        return new Error('Dữ liệu không hợp lệ');
      case 401:
        return new Error('Bạn cần đăng nhập để thực hiện thao tác này');
      case 403:
        return new Error('Bạn không có quyền thực hiện thao tác này');
      case 404:
        return new Error('Không tìm thấy thông tin yêu cầu');
      case 500:
        return new Error('Lỗi server. Vui lòng thử lại sau');
      default:
        return new Error(`Lỗi HTTP ${err.response.status}`);
    }
  }
  
  return new Error('Đã có lỗi xảy ra, vui lòng thử lại.');
};