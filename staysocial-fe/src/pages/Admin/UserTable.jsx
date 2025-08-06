import {
  Eye,
  Edit,
  Ban,
  UserCheck,
  User,
  Mail,
  Phone
} from 'lucide-react';
import StatusBadge from './StatusBadge';

const UsersTable = ({ users, onBan, onUnban, loading }) => {
  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Đang tải dữ liệu người dùng...</p>
      </div>
    );
  }

  if (!users || users.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Không có dữ liệu người dùng</p>
      </div>
    );
  }

  const getRoleDisplay = (role) => {
    switch (role?.toLowerCase()) {
      case 'landlord':
        return 'Chủ căn hộ';
      case 'admin':
        return 'Quản trị viên';
      case 'user':
        return 'Người dùng';
      default:
        return role || 'Không xác định';
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Người dùng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Liên hệ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vai trò
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Địa chỉ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {users.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {/* Thông tin người dùng */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.name || user.fullName || 'Chưa có tên'}
                    </div>

                  </div>
                </div>
              </td>

              {/* Thông tin liên hệ */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="space-y-1">
                  <div className="flex items-center text-sm text-gray-900">
                    <Mail className="h-4 w-4 text-gray-400 mr-2" />
                    {user.email || 'Chưa có email'}
                  </div>
                  {user.phoneNumber && (
                    <div className="flex items-center text-sm text-gray-500">
                      <Phone className="h-4 w-4 text-gray-400 mr-2" />
                      {user.phoneNumber}
                    </div>
                  )}
                </div>
              </td>

              {/* Vai trò */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                  {getRoleDisplay(user.role)}
                </span>
              </td>

              {/* Địa chỉ */}
              <td className="px-6 py-4">
                <div className="text-sm text-gray-900 max-w-xs">
                  {user.address || 'Chưa có địa chỉ'}
                </div>
              </td>

              {/* Thao tác */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {/* Xem chi tiết */}
                  <button 
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </button>

                  {/* Chỉnh sửa */}
                  <button 
                    className="text-gray-600 hover:text-gray-900 p-1 rounded hover:bg-gray-50"
                    title="Chỉnh sửa"
                  >
                    <Edit className="h-4 w-4" />
                  </button>

                  {/* Ban/Unban user - không áp dụng cho admin */}
                  {user.role?.toLowerCase() !== 'admin' && (
                    <>
                      {user.status === 'active' ? (
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn chặn người dùng ${user.name}?`)) {
                              onBan(user.id);
                            }
                          }}
                          className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50"
                          title="Chặn người dùng"
                        >
                          <Ban className="h-4 w-4" />
                        </button>
                      ) : (
                        <button
                          onClick={() => {
                            if (window.confirm(`Bạn có chắc chắn muốn bỏ chặn người dùng ${user.name}?`)) {
                              onUnban(user.id);
                            }
                          }}
                          className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50"
                          title="Bỏ chặn người dùng"
                        >
                          <UserCheck className="h-4 w-4" />
                        </button>
                      )}
                    </>
                  )}
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default UsersTable;