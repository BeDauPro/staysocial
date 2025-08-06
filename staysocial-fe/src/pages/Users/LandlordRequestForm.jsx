import React, { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, Send, CheckCircle, Clock } from 'lucide-react';
import { useSelector } from 'react-redux';
import { getMyProfile } from '../../services/appuserApi';
import { sendLandlordRequest } from '../../services/landlordRequestApi'; // Import API

const LandlordRequestForm = ({ onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState('');

  // Lấy profile thật từ API
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const profile = await getMyProfile();
        setFormData({
          name: profile.fullName || '',
          email: profile.email || '',
          phone: profile.phoneNumber || ''
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        // Nếu lỗi thì giữ form rỗng
        setFormData({
          name: '',
          email: '',
          phone: ''
        });
      }
    };
    fetchProfile();
  }, []);

// ...existing code...
const handleSubmit = async (e) => {
  e.preventDefault();
  if (!formData.name.trim() || !formData.email.trim() || !formData.phone.trim()) {
    setError('Vui lòng điền đầy đủ thông tin');
    return;
  }
  
  setIsSubmitting(true);
  setError('');

  try {
    // SỬA ĐÚNG KEY THEO BACKEND
    const response = await sendLandlordRequest({
      FullName: formData.name.trim(),
      Email: formData.email.trim(),
      PhoneNumber: formData.phone.trim()
    });
    
    console.log('Landlord request sent successfully:', response);
    setSubmitted(true);
    
    if (onSubmit) {
      onSubmit(formData);
    }
  } catch (error) {
    console.error('Error sending landlord request:', error);
    setError(error.message || 'Có lỗi xảy ra khi gửi yêu cầu. Vui lòng thử lại.');
  } finally {
    setIsSubmitting(false);
  }
};

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    // Clear error when user starts typing
    if (error) {
      setError('');
    }
  };

  const handleTryAgain = () => {
    setSubmitted(false);
    setError('');
  };

  if (submitted) {
    return (
      <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
        <div className="text-center">
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Yêu cầu đã được gửi thành công!
          </h3>
          <p className="text-sm text-gray-500 mb-4">
            Chúng tôi sẽ xem xét và phản hồi sớm nhất có thể qua email của bạn.
          </p>
          <div className="flex items-center justify-center text-yellow-600 mb-4">
            <Clock className="h-5 w-5 mr-2" />
            <span className="text-sm font-medium">Đang chờ xét duyệt</span>
          </div>
          <button
            onClick={handleTryAgain}
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            Gửi yêu cầu khác
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="text-center mb-6">
        <Building className="h-12 w-12 text-blue-600 mx-auto mb-3" />
        <h2 className="text-xl font-bold text-gray-900">Yêu cầu trở thành Landlord</h2>
        <p className="text-sm text-gray-600 mt-2">Vui lòng điền thông tin để gửi yêu cầu</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-lg p-3">
          <p className="text-sm text-red-700">{error}</p>
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
            Họ và tên *
          </label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập họ và tên"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
            Email *
          </label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập email"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <div>
          <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
            Số điện thoại *
          </label>
          <div className="relative">
            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="tel"
              id="phone"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Nhập số điện thoại"
              required
              disabled={isSubmitting}
            />
          </div>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isSubmitting || !formData.name.trim() || !formData.email.trim() || !formData.phone.trim()}
          className="w-full inline-flex items-center justify-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
        >
          {isSubmitting ? (
            <>
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
              Đang gửi...
            </>
          ) : (
            <>
              <Send className="h-5 w-5 mr-2" />
              Gửi yêu cầu
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default LandlordRequestForm;