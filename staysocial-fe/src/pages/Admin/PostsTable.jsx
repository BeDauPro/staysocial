import {
  Eye,
  Edit,
  Check,
  X,
  Trash2,
  MapPin,
  Calendar,
  DollarSign,
  User
} from 'lucide-react';
import StatusBadge from './StatusBadge';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const PostsTable = ({ posts, onApprove, onReject, onDelete, loading }) => {
  const navigate = useNavigate();

  if (loading) {
    return (
      <div className="p-8 text-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        <p className="mt-2 text-gray-500">Đang tải dữ liệu...</p>
      </div>
    );
  }

  if (!posts || posts.length === 0) {
    return (
      <div className="p-8 text-center">
        <p className="text-gray-500">Không có dữ liệu căn hộ</p>
      </div>
    );
  }

  const formatPrice = (price) => {
    if (!price) return 'Chưa có giá';
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      });
    } catch {
      return 'N/A';
    }
  };

  const getStatusText = (status) => {
    const statusMap = {
      0: 'Chờ duyệt',      // Pending
      1: 'Đã duyệt',       // Approved  
      2: 'Đã ẩn'           // Hidden
    };
    return statusMap[status] || 'Không xác định';
  };

  const getStatusColor = (status) => {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800',    // Pending
      1: 'bg-green-100 text-green-800',      // Approved
      2: 'bg-gray-100 text-gray-800'         // Hidden
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800';
  };

  const handleApprove = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn duyệt bài đăng này không?')) {
      try {
        await onApprove(postId);
      } catch (error) {
        console.error('Lỗi khi duyệt bài:', error);
        alert('Có lỗi xảy ra khi duyệt bài đăng');
      }
    }
  };

  const handleReject = async (postId, currentStatus) => {
    const confirmText = currentStatus === 'approved' 
      ? 'Bạn có chắc chắn muốn ẩn bài đăng này không?' 
      : 'Bạn có chắc chắn muốn từ chối bài đăng này không?';
    
    if (window.confirm(confirmText)) {
      try {
        await onReject(postId);
      } catch (error) {
        console.error('Lỗi khi từ chối/ẩn bài:', error);
        alert('Có lỗi xảy ra khi từ chối/ẩn bài đăng');
      }
    }
  };

  const handleDelete = async (postId) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa căn hộ này không? Thao tác này không thể hoàn tác.')) {
      try {
        await onDelete(postId);
      } catch (error) {
        console.error('Lỗi khi xóa bài:', error);
        alert('Có lỗi xảy ra khi xóa bài đăng');
      }
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Căn hộ
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Chủ sở hữu
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Vị trí
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Giá thuê
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Trạng thái
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Ngày đăng
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Thao tác
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {posts.map((post) => (
            <tr key={post.apartmentId || post.id} className="hover:bg-gray-50">
              {/* Thông tin căn hộ */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="ml-4">
                    <div className="text-sm font-medium text-gray-900">
                      {post.name || post.title || 'Không có tiêu đề'}
                    </div>
                    <div className="text-xs text-gray-500">
                      ID: {post.apartmentId || post.id}
                    </div>
                  </div>
                </div>
              </td>

              {/* Thông tin chủ sở hữu */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <User className="h-4 w-4 text-gray-400 mr-2" />
                  <div>
                    <div className="text-sm font-medium text-gray-900">
                      {post.ownerName || post.author || 'N/A'}
                    </div>
                    <div className="text-sm text-gray-500">
                      {post.ownerEmail || ''}
                    </div>
                    {post.ownerPhone && (
                      <div className="text-sm text-gray-500">
                        {post.ownerPhone}
                      </div>
                    )}
                  </div>
                </div>
              </td>

              {/* Vị trí */}
              <td className="px-6 py-4">
                <div className="flex items-start">
                  <MapPin className="h-4 w-4 text-gray-400 mr-1 mt-0.5 flex-shrink-0" />
                  <div className="text-sm text-gray-900 max-w-xs">
                    {post.address || post.location || 'Chưa có địa chỉ'}
                  </div>
                </div>
              </td>

              {/* Giá thuê */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <DollarSign className="h-4 w-4 text-green-500 mr-1" />
                  <div className="text-sm font-medium text-gray-900">
                    {formatPrice(post.price)}
                  </div>
                </div>
                {post.priceUnit && (
                  <div className="text-xs text-gray-500">
                    /{post.priceUnit}
                  </div>
                )}
              </td>

              {/* Trạng thái */}
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(post.status)}`}>
                  {getStatusText(post.status)}
                </span>
              </td>

              {/* Ngày đăng */}
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-400 mr-1" />
                  <div className="text-sm text-gray-500">
                    {formatDate(post.createdAt || post.datePosted)}
                  </div>
                </div>
              </td>

              {/* Thao tác */}
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                <div className="flex space-x-2">
                  {/* Xem chi tiết */}
                  <Link
                    to={`/apartmentdetail/${post.apartmentId || post.id}`}
                    className="text-blue-600 hover:text-blue-900 p-1 rounded hover:bg-blue-50 transition-colors"
                    title="Xem chi tiết"
                  >
                    <Eye className="h-4 w-4" />
                  </Link>

                  {/* Duyệt bài - chỉ hiện khi status là 0 (Pending) hoặc 2 (Hidden) */}
                  {(post.status === 0 || post.status === 2) && (
                    <button
                      onClick={() => handleApprove(post.apartmentId || post.id)}
                      className="text-green-600 hover:text-green-900 p-1 rounded hover:bg-green-50 transition-colors"
                      title="Duyệt bài"
                    >
                      <Check className="h-4 w-4" />
                    </button>
                  )}

                  {/* Ẩn bài - chỉ hiện khi status là 0 (Pending) hoặc 1 (Approved) */}
                  {(post.status === 0 || post.status === 1) && (
                    <button
                      onClick={() => handleReject(post.apartmentId || post.id, post.status)}
                      className="text-orange-600 hover:text-orange-900 p-1 rounded hover:bg-orange-50 transition-colors"
                      title={post.status === 1 ? 'Ẩn bài' : 'Từ chối bài'}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  )}

                  {/* Xóa */}
                  <button
                    onClick={() => handleDelete(post.apartmentId || post.id)}
                    className="text-red-600 hover:text-red-900 p-1 rounded hover:bg-red-50 transition-colors"
                    title="Xóa"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default PostsTable;