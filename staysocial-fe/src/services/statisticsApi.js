import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/statistics';

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
    console.log('Statistics API Success Response:', response.data);
    return response;
  },
  (error) => {
    console.log('Statistics API Error Response:', {
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

const handleError = (err) => {
  console.log('Full error object:', err);
  if (err.response && err.response.data) {
    const errorData = err.response.data;
    if (errorData.errors) {
      const firstField = Object.keys(errorData.errors)[0];
      return new Error(errorData.errors[firstField][0]);
    }
    if (errorData.title) return new Error(errorData.title);
    if (typeof errorData === 'string') return new Error(errorData);
    if (errorData.message) return new Error(errorData.message);
    return new Error(JSON.stringify(errorData));
  }
  if (err.code === 'NETWORK_ERROR' || !err.response) {
    return new Error('Không thể kết nối đến server.');
  }
  return new Error('Đã xảy ra lỗi.');
};

// ========== API FUNCTIONS ==========

// Lấy thống kê dashboard theo năm
export const getDashboardStatistics = async (year = new Date().getFullYear()) => {
  try {
    const response = await axiosInstance.get(`/dashboard?year=${year}`);
    return response.data;
  } catch (error) {
    throw handleError(error);
  }
};