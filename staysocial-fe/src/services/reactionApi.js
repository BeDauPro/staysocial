import axios from 'axios';

const BASE_URL = 'http://localhost:5283/api/reactions'; // chỉnh nếu BE thay đổi

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
    console.log('Reactions API Success:', response.data);
    return response;
  },
  (error) => {
    console.error('Reactions API Error:', {
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

const mapReactionTypeToEnum = (reactionType) => {
  if (!reactionType) return null;
  const t = reactionType.toString().toLowerCase();
  if (t === 'like' || t === '1') return 1;     // Like = 1
  if (t === 'dislike' || t === '2') return 2;  // Dislike = 2
  return null;
};


export const toggleReaction = async (data) => {
  try {
    const payload = {
      apartmentId: data.apartmentId,
      type: mapReactionTypeToEnum(data.reactionType)
    };
    const res = await axiosInstance.post('/toggle', payload);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};


export const getReactionCount = async (apartmentId) => {
  try {
    const res = await axiosInstance.get(`/${apartmentId}/count`);
    const data = res.data || {};
    return {
      likes: data.likes ?? data.likeCount ?? 0,
      dislikes: data.dislikes ?? data.dislikeCount ?? 0,
      userReaction: data.userReaction ?? data.userReactionType ?? null
    };
  } catch (err) {
    throw handleError(err);
  }
};
