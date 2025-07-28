import React, { useState } from 'react';
import {
  LogOut,
} from 'lucide-react';
import { logout } from '../../redux/slices/authSlice'
import { logoutUser } from '../../services/authApi'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'

const Logout = () => {
  const [showConfirm, setShowConfirm] = useState(false);
  const dispatch = useDispatch()
  const navigate = useNavigate()

    const handleLogout = async () => {
        try {
            const res = await logoutUser() // Gọi service logout
            console.log(res.message)
            dispatch(logout()) // Xoá state Redux
            navigate('/') // Redirect
        } catch (error) {
            console.error('Logout error:', error)
        }
    }
  return (
    <div className="flex items-center justify-center min-h-96">
      <div className="text-center">
        <LogOut className="w-16 h-16 mx-auto text-gray-400 mb-4" />
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">Đăng xuất</h3>
        <p className="text-gray-500 dark:text-gray-400 mb-4">Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?</p>
        <button
          onClick={() => setShowConfirm(true)}
          className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg transition-colors"
        >
          Đăng xuất
        </button>

        {showConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h3 className="text-lg font-semibold mb-4">Xác nhận đăng xuất</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">Bạn sẽ cần đăng nhập lại để sử dụng hệ thống.</p>
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
      </div>
    </div>
  );
};
export default Logout;