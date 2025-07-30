import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api';

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

export const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get('/booking');
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Lấy chi tiết một booking theo id
export const fetchBookingById = async (id) => {
  try {
    const response = await axiosInstance.get(`/booking/${id}`);
    return response.data;
  } catch (error) {
    throw error;
  }
};

// Tạo mới một booking
export const createBooking = async (bookingData) => {
  try {
    const response = await axiosInstance.post('/booking/booking', bookingData);
    return response.data;
  } catch (error) {
    console.error('AppUser API Error Response:', error.response?.data || error.message);
    throw error;
  }
};


// Xoá một booking theo id
export const deleteBooking = async (id) => {
  try {
    const response = await axiosInstance.delete(`/booking/${id}`);
    return response.status === 204;
  } catch (error) {
    throw error;
  }
};
