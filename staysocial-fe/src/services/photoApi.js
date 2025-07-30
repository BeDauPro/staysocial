import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api'; 

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
// --- API FUNCTIONS ---

export const getAllPhotos = async () => {
  const res = await axiosInstance.get('/photos');
  return res.data;
};

export const getPhotoById = async (id) => {
  const res = await axiosInstance.get(`/photos/${id}`);
  return res.data;
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.post('/photos', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};
export const uploadPhotoForApartment = async (file, apartmentId) => {
  const formData = new FormData();
  formData.append("file", file);
  if (apartmentId) {
    formData.append("apartmentId", apartmentId);
  }

  const res = await axiosInstance.post('/photos', formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const updatePhoto = async (id, file) => {
  const formData = new FormData();
  formData.append("file", file);

  const res = await axiosInstance.put(`/photos/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return res.data;
};

export const deletePhoto = async (id) => {
  const res = await axiosInstance.delete(`/photos/${id}`);
  return res.data;
};
