import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/Feedback';

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
    console.log('Feedback API Success Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Feedback API Error:', {
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

// ========== FEEDBACK API FUNCTIONS ==========

// 1. Tạo feedback mới
export const createFeedback = async (data) => {
  try {
    const res = await axiosInstance.post('', data);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 2. Lấy feedback theo ID
export const getFeedbackById = async (id) => {
  try {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 3. Lấy danh sách feedback theo apartmentId
export const getFeedbacksByApartmentId = async (apartmentId) => {
  try {
    const res = await axiosInstance.get(`/apartment/${apartmentId}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 4. Lấy điểm đánh giá trung bình theo apartmentId
export const getAverageRatingByApartmentId = async (apartmentId) => {
  try {
    const res = await axiosInstance.get(`/apartment/${apartmentId}/average-rating`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 5. Lấy feedbacks của người dùng hiện tại
export const getMyFeedbacks = async () => {
  try {
    const res = await axiosInstance.get('/user');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};
