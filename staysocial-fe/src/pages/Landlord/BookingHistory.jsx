import React, { useState, useEffect } from 'react';
import { 
  Clock,
  Loader2,
  AlertCircle
} from 'lucide-react';

// Import API functions từ các file có sẵn
import { fetchAllBookings } from '../../services/bookingApi';
import { getApartmentById } from '../../services/apartmentApi';

const BookingHistory = () => {
  const [bookings, setBookings] = useState([]);
  const [apartments, setApartments] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterStatus, setFilterStatus] = useState('all');

  // Load bookings và apartment details từ API
  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        // Lấy danh sách bookings
        const bookingsData = await fetchAllBookings();
        setBookings(bookingsData || []);
        
        // Lấy thông tin apartment cho mỗi booking
        const apartmentPromises = bookingsData.map(async (booking) => {
          try {
            const apartmentData = await getApartmentById(booking.apartmentId);
            return { id: booking.apartmentId, data: apartmentData };
          } catch (err) {
            console.error(`Error loading apartment ${booking.apartmentId}:`, err);
            return { id: booking.apartmentId, data: null };
          }
        });
        
        const apartmentResults = await Promise.all(apartmentPromises);
        const apartmentMap = {};
        apartmentResults.forEach(result => {
          apartmentMap[result.id] = result.data;
        });
        setApartments(apartmentMap);
        
      } catch (err) {
        console.error('Error loading bookings:', err);
        setError('Không thể tải dữ liệu booking. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return parseInt(amount).toLocaleString('vi-VN') + ' VND';
  };

  // Helper function to get status display text
  const getStatusText = (status) => {
    const statusMap = {
      0: 'Chờ xác nhận',
      1: 'Đã xác nhận', 
      2: 'Đang thuê',
      3: 'Đã kết thúc',
      4: 'Đã hủy'
    };
    return statusMap[status] || 'Không xác định';
  };

  // Helper function to get status color
  const getStatusColor = (status) => {
    const colorMap = {
      0: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100',
      1: 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100',
      2: 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100',
      3: 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100',
      4: 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
    };
    return colorMap[status] || 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-100';
  };

  // Get apartment name from apartment data
  const getApartmentName = (apartmentId) => {
    const apartment = apartments[apartmentId];
    if (!apartment) return `Căn hộ #${apartmentId}`;
    return apartment.title || apartment.name || `Căn hộ #${apartmentId}`;
  };

  // Filter bookings based on status
  const filteredBookings = bookings.filter(booking => {
    if (filterStatus === 'all') return true;
    const statusText = getStatusText(booking.status);
    return statusText === filterStatus;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Lịch sử booking</h2>
        <select 
          value={filterStatus} 
          onChange={(e) => setFilterStatus(e.target.value)}
          className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">Tất cả</option>
          <option value="Chờ xác nhận">Chờ xác nhận</option>
          <option value="Đã xác nhận">Đã xác nhận</option>
          <option value="Đang thuê">Đang thuê</option>
          <option value="Đã kết thúc">Đã kết thúc</option>
          <option value="Đã hủy">Đã hủy</option>
        </select>
      </div>
      
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        {filteredBookings.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 dark:text-gray-400">Không có booking nào.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Booking ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Căn hộ
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Thời gian thuê
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Số tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tiền cọc
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tiền thuê/tháng
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Tổng tiền
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Trạng thái
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Ngày tạo
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {filteredBookings.map((booking) => (
                  <tr key={booking.bookingId} className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-white">
                      #{booking.bookingId}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="font-medium text-gray-900 dark:text-white">
                        {getApartmentName(booking.apartmentId)}
                      </div>
                      <div className="text-xs text-gray-500">ID: {booking.apartmentId}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2 text-gray-400" />
                        <div className="text-xs">
                          <div className="font-medium">{formatDate(booking.rentalStartDate)}</div>
                          <div>đến {formatDate(booking.rentalEndDate)}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      <span className="font-medium">{booking.totalMonths}</span> tháng
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(booking.depositAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatCurrency(booking.monthlyRent)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-semibold text-gray-900 dark:text-white">
                      {formatCurrency(booking.totalRentAmount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(booking.status)}`}>
                        {getStatusText(booking.status)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {formatDate(booking.createdAt)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
      
      {filteredBookings.length > 0 && (
        <div className="text-sm text-gray-500 dark:text-gray-400 text-center">
          Hiển thị {filteredBookings.length} booking
          {filterStatus !== 'all' && ` (lọc theo: ${filterStatus})`}
        </div>
      )}
    </div>
  );
};

export default BookingHistory;