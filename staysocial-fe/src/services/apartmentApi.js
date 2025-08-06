import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/Apartments';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Request: Gắn token từ localStorage
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
    console.log('Apartment API Success Response:', response.data);
    return response;
  },
  (error) => {
    console.error('Apartment API Error:', {
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

// ========== API FUNCTIONS ==========

// 1. Lấy tất cả căn hộ đã duyệt (User)
export const getApprovedApartments = async () => {
  try {
    const res = await axiosInstance.get('/approved');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};
export const getApartmentPhotos = async (apartmentId) => {
  try {
    const res = await axiosInstance.get(`/photos/apartment/${apartmentId}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 2. Lấy tất cả căn hộ cho Admin
export const getAllApartmentsForAdmin = async () => {
  try {
    const res = await axiosInstance.get('/admin/all');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 3. Duyệt căn hộ (Admin)
export const approveApartment = async (id) => {
  try {
    const res = await axiosInstance.put(`/approve/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 4. Ẩn căn hộ (Admin)
export const hideApartment = async (id) => {
  try {
    const res = await axiosInstance.put(`/hiden/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 5. Lấy căn hộ theo ID (Public)
export const getApartmentById = async (id) => {
  try {
    const res = await axiosInstance.get(`/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 6. Lấy căn hộ của người cho thuê hiện tại
export const getMyApartments = async () => {
  try {
    const res = await axiosInstance.get('/my-apartments');
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 7. Tạo căn hộ mới (Landlord)
export const createApartment = async (data) => {
  try {
    const res = await axiosInstance.post('', data); 
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};


// 8. Cập nhật căn hộ (Landlord/Admin)
export const updateApartment = async (id, formData) => {
  try {
    const res = await axiosInstance.put(`/${id}`, formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    });
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

// 9. Xoá căn hộ (Landlord/Admin)
export const deleteApartment = async (id) => {
  try {
    const res = await axiosInstance.delete(`/${id}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};
