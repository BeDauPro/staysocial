import axios from 'axios';

const API_BASE_URL = 'http://localhost:5283/api/orders';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

// Gắn token từ localStorage
axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Xử lý lỗi chung
const handleError = (err) => {
  const data = err.response?.data;

  if (data?.errors) {
    const firstField = Object.keys(data.errors)[0];
    return new Error(data.errors[firstField][0]);
  }
  if (data?.message) return new Error(data.message);
  if (typeof data === 'string') return new Error(data);
  if (data?.title) return new Error(data.title);

  if (err.code === 'NETWORK_ERROR') {
    return new Error('Không thể kết nối đến server. Kiểm tra mạng và thử lại.');
  }
  return new Error('Đã xảy ra lỗi, vui lòng thử lại.');
};

/**
 * Tạo order mới -> Backend trả về paymentUrl VNPay
 * @param {Object} payload - dữ liệu đơn hàng
 * @returns {Promise<{paymentUrl: string}>}
 */
export const createOrder = async (payload) => {
  try {
    const res = await axiosInstance.post('/create', payload, {
      headers: {
        'Content-Type': 'application/json',
      },
    });
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

/**
 * Xác nhận thanh toán
 * @param {number} orderId
 * @param {boolean} success
 * @returns {Promise<any>}
 */
export const confirmPayment = async (orderId, success) => {
  try {
    const res = await axiosInstance.post(`/confirm?orderId=${orderId}&success=${success}`);
    return res.data;
  } catch (error) {
    throw handleError(error);
  }
};

// Các hàm tiện ích khác giữ nguyên
export const handleVnPayReturn = () => {
  const params = new URLSearchParams(window.location.search);
  return {
    orderId: params.get('orderId') ? parseInt(params.get('orderId')) : null,
    success: params.get('success') === 'true',
  };
};

export const getOrderById = async (orderId) => {
  try {
    const res = await axiosInstance.get(`/${orderId}`);
    return res.data;
  } catch (err) {
    throw handleError(err);
  }
};

export const validateOrderData = (orderData) => {
  const requiredFields = ['apartmentName', 'amount', 'orderType'];
  const missing = requiredFields.filter((f) => !orderData[f] && orderData[f] !== 0);

  if (missing.length > 0) {
    throw new Error(`Thiếu thông tin bắt buộc: ${missing.join(', ')}`);
  }
  if (orderData.amount <= 0) {
    throw new Error('Số tiền phải lớn hơn 0');
  }
  if (orderData.forMonth && (orderData.forMonth < 1 || orderData.forMonth > 12)) {
    throw new Error('Tháng phải từ 1 đến 12');
  }

  return {
    apartmentName: orderData.apartmentName,
    amount: Number(orderData.amount),
    orderType: Number(orderData.orderType),
    forYear: orderData.forYear ? Number(orderData.forYear) : undefined,
    forMonth: orderData.forMonth ? Number(orderData.forMonth) : undefined,
    description: orderData.description || `Thanh toán cho căn hộ ${orderData.apartmentName}`,
  };
};

export const ORDER_TYPES = {
  RENT: 0,
  DEPOSIT: 1,
  SERVICE_FEE: 2,
  PENALTY: 3,
};

export const getOrderTypeName = (type) => {
  const names = {
    [ORDER_TYPES.RENT]: 'Tiền thuê',
    [ORDER_TYPES.DEPOSIT]: 'Tiền cọc',
    [ORDER_TYPES.SERVICE_FEE]: 'Phí dịch vụ',
    [ORDER_TYPES.PENALTY]: 'Phí phạt',
  };
  return names[type] || 'Không xác định';
};

export const formatCurrency = (amount) =>
  new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(amount);

export default {
  createOrder,
  confirmPayment,
  handleVnPayReturn,
  getOrderById,
  validateOrderData,
  ORDER_TYPES,
  getOrderTypeName,
  formatCurrency,
};
