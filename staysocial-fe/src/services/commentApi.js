import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/Comment';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Gắn token từ localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Xử lý phản hồi
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Comment API Success Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Comment API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
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

// ========== COMMENT API FUNCTIONS ==========

// 1. Tạo bình luận mới
export const createComment = async (data) => {
  try {
    const res = await axiosInstance.post('', data);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 2. Lấy bình luận theo ID
export const getCommentById = async (id) => {
  try {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 3. Lấy danh sách bình luận theo apartmentId (public)
export const getCommentsByApartmentId = async (apartmentId) => {
  try {
    const res = await axiosInstance.get(`/apartment/${apartmentId}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 4. Lấy bình luận của người dùng hiện tại
export const getMyComments = async () => {
  try {
    const res = await axiosInstance.get('/user');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};


// Xoá bình luận
export const deleteComment = async (id) => {
  try {
    const res = await axiosInstance.delete(`/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};
