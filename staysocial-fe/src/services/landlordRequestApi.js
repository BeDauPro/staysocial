import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/landlordrequest'; // chỉnh nếu BE thay đổi

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request: Gắn token từ localStorage (nếu dùng JWT)
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

// Response logging
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('LandlordRequest API Success:', response.data);
    return response;
  },
  (error) => {
    console.error('LandlordRequest API Error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message,
    });
    return Promise.reject(error);
  }
);

// Error handler
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

//
// ========== LANDLORD REQUEST API FUNCTIONS ==========
//

// 1. Gửi yêu cầu trở thành Landlord (User)
export const sendLandlordRequest = async (data) => {
  try {
    const res = await axiosInstance.post('/', data);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 2. Lấy danh sách tất cả yêu cầu (Admin)
export const getAllLandlordRequests = async () => {
  try {
    const res = await axiosInstance.get('/');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 3. Duyệt yêu cầu (Admin)
export const approveLandlordRequest = async (id) => {
  try {
    const res = await axiosInstance.post(`/${id}/approve`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 4. Từ chối yêu cầu (Admin)
export const rejectLandlordRequest = async (id, reason) => {
  try {
    const res = await axiosInstance.post(`/${id}/reject`, JSON.stringify(reason), {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};
