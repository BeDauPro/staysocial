import React, { useState } from 'react';
import {
  Shield,
  LogOut,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice';
import { logoutUser } from '../../services/authApi';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';

// Header Component
const AdminHeader = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const res = await logoutUser(); // Gọi service logout
      console.log(res.message);
      dispatch(logout()); // Xoá state Redux
      navigate('/'); // Redirect
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Shield className="h-8 w-8 text-blue-600 mr-3" />
              <h1 className="text-xl font-semibold text-gray-900">
                Trang Quản Trị Admin
              </h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">Admin</span>
              <button
                onClick={() => setShowConfirm(true)}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors text-sm"
              >
                <LogOut className="w-4 h-4" />
                <span>Đăng xuất</span>
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Logout Confirmation Modal */}
      {showConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
          <div className="bg-white white:bg-gray-800 rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h3>
            <p className="text-gray-600 white:text-gray-400 mb-6">
              Bạn sẽ cần đăng nhập lại để sử dụng hệ thống.
            </p>
            <div className="flex space-x-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 bg-gray-300 hover:bg-gray-400 text-gray-700 py-2 px-4 rounded-lg"
              >
                Hủy
              </button>
              <button
                onClick={handleLogout}
                className="flex-1 bg-red-600 hover:bg-red-700 text-white py-2 px-4 rounded-lg"
              >
                Xác nhận
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminHeader;