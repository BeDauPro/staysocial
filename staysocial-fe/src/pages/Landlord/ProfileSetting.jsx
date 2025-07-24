import React, { useState } from 'react';
import { Save, Edit2 } from 'lucide-react';

const ProfileSettings = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [profileData, setProfileData] = useState({
    fullName: 'Nguyễn Văn Nam',
    email: 'nguyenvannam@gmail.com',
    phoneNumber: '0123456789',
    address: '123 Đường Lê Lợi, Quận 1, TP.HCM',
    avatar: null
  });

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSave = () => {
    // Xử lý lưu thông tin profile
    console.log('Saving profile:', profileData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset lại dữ liệu nếu cần
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          Thông tin cá nhân
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Quản lý thông tin cá nhân và cài đặt tài khoản của bạn
        </p>
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg">
        {/* Profile Header */}
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                  {profileData.fullName}
                </h3>
                <p className="text-gray-600 dark:text-gray-400">Chủ nhà</p>
              </div>
            </div>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Edit2 className="w-4 h-4" />
              <span>{isEditing ? 'Hủy' : 'Chỉnh sửa'}</span>
            </button>
          </div>
        </div>

        {/* Profile Form */}
        <div className="p-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Họ tên */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Họ và tên
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {profileData.fullName}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Email
              </label>
              {isEditing ? (
                <input
                  type="email"
                  value={profileData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {profileData.email}
                </p>
              )}
            </div>

            {/* Số điện thoại */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Số điện thoại
              </label>
              {isEditing ? (
                <input
                  type="tel"
                  value={profileData.phoneNumber}
                  onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {profileData.phoneNumber}
                </p>
              )}
            </div>

            {/* Địa chỉ */}
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Địa chỉ
              </label>
              {isEditing ? (
                <input
                  type="text"
                  value={profileData.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                />
              ) : (
                <p className="px-3 py-2 bg-gray-50 dark:bg-gray-700 rounded-lg text-gray-900 dark:text-white">
                  {profileData.address}
                </p>
              )}
            </div>
          </div>

          {/* Save Button */}
          {isEditing && (
            <div className="mt-6 flex justify-end space-x-4">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
              >
                Hủy
              </button>
              <button
                onClick={handleSave}
                className="flex items-center space-x-2 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Save className="w-4 h-4" />
                <span>Lưu thay đổi</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;