import React, { useState, useEffect } from "react";

// Mock Pagination component
const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const pages = [];
  for (let i = 1; i <= totalPages; i++) {
    pages.push(i);
  }

  return (
    <div className="flex justify-center items-center space-x-2 mt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
      </button>
      
      {pages.map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            currentPage === page
              ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg'
              : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
          }`}
        >
          {page}
        </button>
      ))}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  );
};

// API service functions
const API_BASE_URL = 'http://localhost:5283/api';

const createAxiosInstance = () => {
  const instance = {
    get: async (url) => {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_BASE_URL}${url}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': token ? `Bearer ${token}` : '',
        },
        credentials: 'include',
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      return { data: await response.json() };
    }
  };
  return instance;
};

const axiosInstance = createAxiosInstance();

// API functions
const fetchAllBookings = async () => {
  try {
    const response = await axiosInstance.get('/booking');
    return response.data;
  } catch (error) {
    console.error('Error fetching bookings:', error);
    throw error;
  }
};

// Helper functions
const ORDER_TYPES = {
  RENT: 0,
  DEPOSIT: 1,
  SERVICE_FEE: 2,
  PENALTY: 3,
};

const getOrderTypeName = (type) => {
  const names = {
    [ORDER_TYPES.RENT]: 'Đã thuê',
    [ORDER_TYPES.DEPOSIT]: 'Đã cọc',
    [ORDER_TYPES.SERVICE_FEE]: 'Phí dịch vụ',
    [ORDER_TYPES.PENALTY]: 'Phí phạt',
  };
  return names[type] || 'Không xác định';
};

const formatCurrency = (amount) => {
  if (!amount && amount !== 0) return '0₫';
  return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
};

const formatDateTime = (dateString) => {
  if (!dateString) return 'N/A';
  try {
    const date = new Date(dateString);
    return date.toLocaleString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch (error) {
    return dateString;
  }
};

// Transform booking data to transaction format
const transformBookingToTransaction = (booking) => {
  // Xác định loại giao dịch dựa trên dữ liệu booking
  let type = 'Đã cọc'; // Default
  let amount = 0;
  let paidAt = booking.createdDate || booking.updatedDate || new Date().toISOString();

  // Nếu booking có order, sử dụng thông tin từ order
  if (booking.orders && booking.orders.length > 0) {
    const latestOrder = booking.orders.sort((a, b) => new Date(b.createdDate) - new Date(a.createdDate))[0];
    type = getOrderTypeName(latestOrder.orderType);
    amount = latestOrder.amount;
    paidAt = latestOrder.createdDate;
  } else {
    // Fallback: sử dụng thông tin từ booking
    if (booking.monthlyRent) {
      type = 'Đã thuê';
      amount = booking.monthlyRent;
    } else if (booking.depositAmount) {
      type = 'Đã cọc';
      amount = booking.depositAmount;
    }
  }

  return {
    id: booking.id,
    type: type,
    apartment: booking.apartmentName || 'N/A',
    address: booking.apartmentAddress || 'N/A',
    amount: amount,
    paidAt: formatDateTime(paidAt),
    rawDate: new Date(paidAt),
    originalBooking: booking,
  };
};

export default function BookingHistory() {
  const [transactions, setTransactions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [type, setType] = useState("Tất cả");
  const [address, setAddress] = useState("Tất cả");
  const [sort, setSort] = useState("desc");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Fetch data from API
  useEffect(() => {
    const loadTransactions = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const bookings = await fetchAllBookings();
        
        // Transform bookings to transaction format
        const transformedTransactions = bookings
          .map(transformBookingToTransaction)
          .filter(transaction => transaction.amount > 0); // Only show transactions with amounts
        
        setTransactions(transformedTransactions);
      } catch (err) {
        console.error('Error loading transactions:', err);
        setError('Không thể tải dữ liệu giao dịch. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    loadTransactions();
  }, []);

  // Get unique values for filters
  const uniqueTypes = ["Tất cả", ...Array.from(new Set(transactions.map(i => i.type)))];
  const uniqueAddresses = ["Tất cả", ...Array.from(new Set(transactions.map(i => i.address)))];

  // Filter and sort transactions
  let filtered = transactions.filter(item =>
    (type === "Tất cả" || item.type === type) &&
    (address === "Tất cả" || item.address === address)
  );

  filtered = filtered.sort((a, b) => {
    return sort === "desc" ? b.rawDate - a.rawDate : a.rawDate - b.rawDate;
  });

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedTransactions = filtered.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const getStatusIcon = (type) => {
    if (type === "Đã thuê") {
      return (
        <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      );
    }
    return (
      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
      </svg>
    );
  };

  const getStatusColor = (type) => {
    switch (type) {
      case "Đã thuê":
        return "bg-green-100 text-green-800";
      case "Đã cọc":
        return "bg-yellow-100 text-yellow-800";
      case "Phí dịch vụ":
        return "bg-blue-100 text-blue-800";
      case "Phí phạt":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-center py-16">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600">Đang tải dữ liệu...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center py-16">
            <svg className="w-16 h-16 text-red-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <h3 className="text-xl font-semibold text-gray-800 mb-2">Lỗi tải dữ liệu</h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <button
              onClick={() => window.location.reload()}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Thử lại
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-6xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center py-8">
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-2">
            Lịch Sử Giao Dịch
          </h1>
          <p className="text-gray-600">Theo dõi các giao dịch cọc và thuê căn hộ</p>
          <p className="text-sm text-gray-500 mt-2">
            Tổng {filtered.length} giao dịch
          </p>
        </div>

        {/* Filters */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
          <div className="flex flex-wrap gap-4 items-center justify-between">
            <div className="flex items-center space-x-2">
              <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
              </svg>
              <span className="text-lg font-semibold text-gray-800">Bộ lọc</span>
            </div>
            
            <div className="flex flex-wrap gap-3">
              <div className="relative">
                <select
                  value={type}
                  onChange={e => {
                    setType(e.target.value);
                    setCurrentPage(1); // Reset to first page when filter changes
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {uniqueTypes.map(t => (
                    <option key={t} value={t}>{t}</option>
                  ))}
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="relative">
                <select
                  value={address}
                  onChange={e => {
                    setAddress(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  {uniqueAddresses.map(a => (
                    <option key={a} value={a}>{a}</option>
                  ))}
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <div className="relative">
                <select
                  value={sort}
                  onChange={e => setSort(e.target.value)}
                  className="appearance-none bg-white border border-gray-300 rounded-xl px-4 py-2 pr-8 text-sm font-medium text-gray-700 hover:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                >
                  <option value="desc">Mới nhất</option>
                  <option value="asc">Cũ nhất</option>
                </select>
                <svg className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Results */}
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
          {filtered.length === 0 ? (
            <div className="text-center py-16">
              <svg className="w-16 h-16 text-gray-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              <h3 className="text-xl font-semibold text-gray-800 mb-2">Không có giao dịch</h3>
              <p className="text-gray-600">Không có lịch sử giao dịch phù hợp với bộ lọc hiện tại.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              {/* Desktop Table View */}
              <div className="hidden md:block">
                <table className="w-full">
                  <thead className="bg-gradient-to-r from-gray-50 to-gray-100">
                    <tr>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Loại giao dịch</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Căn hộ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Địa chỉ</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Số tiền</th>
                      <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Ngày thanh toán</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {paginatedTransactions.map((item, index) => (
                      <tr key={item.id} className="hover:bg-gray-50/50 transition-all duration-200">
                        <td className="px-6 py-4">
                          <div className="flex items-center">
                            <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.type)}`}>
                              {getStatusIcon(item.type)}
                              {item.type}
                            </span>
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm font-medium text-gray-900">{item.apartment}</div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="flex items-center text-sm text-gray-600">
                            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {item.address}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-lg font-bold text-blue-600">
                            {formatCurrency(item.amount)}
                          </div>
                        </td>
                        <td className="px-6 py-4">
                          <div className="text-sm text-gray-900">{item.paidAt}</div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile Card View */}
              <div className="md:hidden space-y-4 p-4">
                {paginatedTransactions.map((item, index) => (
                  <div key={item.id} className="bg-gradient-to-r from-white to-gray-50 rounded-2xl p-4 shadow-md border border-gray-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(item.type)}`}>
                        {getStatusIcon(item.type)}
                        {item.type}
                      </span>
                      <div className="text-lg font-bold text-blue-600">
                        {formatCurrency(item.amount)}
                      </div>
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-semibold text-gray-900">{item.apartment}</h3>
                      <div className="flex items-center text-sm text-gray-600">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.address}
                      </div>
                      <div className="text-sm text-gray-600">
                        <svg className="w-4 h-4 inline mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {item.paidAt}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Pagination */}
        {filtered.length > 0 && totalPages > 1 && (
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={handlePageChange}
          />
        )}
      </div>
    </div>
  );
}