import { getApartmentById } from '../../services/apartmentApi'; // Import apartment API
import { createBooking } from '../../services/bookingApi'; // Import booking API
import React, { useState, useEffect } from "react";
import { Calendar, Clock, CreditCard, CheckCircle, Home, ArrowLeft, AlertCircle, Calculator } from "lucide-react";

export default function BookingForm({ apartmentId = 1 }) { // Default apartmentId for demo
  const [startMonth, setStartMonth] = useState("");
  const [endMonth, setEndMonth] = useState("");
  const [calculationData, setCalculationData] = useState({
    totalMonths: 0,
    totalRentAmount: 0,
    depositAmount: 0
  });
  const [apartmentInfo, setApartmentInfo] = useState(null);
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [bookingResult, setBookingResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load apartment data on component mount
  useEffect(() => {
    const loadApartmentData = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getApartmentById(apartmentId);
        setApartmentInfo(data);
      } catch (err) {
        console.error('Error loading apartment:', err);
        setError(err.message || 'Không thể tải thông tin căn hộ. Vui lòng thử lại.');
        setApartmentInfo(null); // No fallback data - purely from API
      } finally {
        setLoading(false);
      }
    };

    loadApartmentData();
  }, [apartmentId]);

  const generateMonthOptions = () => {
    const options = [];
    const currentDate = new Date();

    for (let i = 0; i < 24; i++) { // 24 tháng
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth() + i, 1);
      const value = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = `Tháng ${date.getMonth() + 1}/${date.getFullYear()}`;
      options.push({ value, label });
    }

    return options;
  };

  const monthOptions = generateMonthOptions();

  // Calculate costs when months change
  useEffect(() => {
    if (startMonth && endMonth && apartmentInfo) {
      const start = new Date(startMonth + "-01");
      const end = new Date(endMonth + "-01");

      if (end >= start) {
        const months = ((end.getFullYear() - start.getFullYear()) * 12) + (end.getMonth() - start.getMonth()) + 1;
        const monthlyPrice = apartmentInfo.monthlyPrice || apartmentInfo.price || 0;
        const totalRent = months * monthlyPrice;
        const deposit = Math.round(totalRent * 0.3);

        console.log('Calculation:', { months, monthlyPrice, totalRent, deposit });

        setCalculationData({
          totalMonths: months,
          totalRentAmount: totalRent,
          depositAmount: deposit
        });
      } else {
        setCalculationData({
          totalMonths: 0,
          totalRentAmount: 0,
          depositAmount: 0
        });
      }
    } else {
      setCalculationData({
        totalMonths: 0,
        totalRentAmount: 0,
        depositAmount: 0
      });
    }
  }, [startMonth, endMonth, apartmentInfo]);

  const handleSubmit = async () => {
  if (!startMonth || !endMonth) {
    alert("Vui lòng chọn thời gian thuê!");
    return;
  }

  if (calculationData.totalMonths < 1) {
    alert("Thời gian thuê tối thiểu là 1 tháng!");
    return;
  }

  if (!apartmentInfo) {
    alert("Không thể tải thông tin căn hộ!");
    return;
  }

  const currentUser = JSON.parse(localStorage.getItem('user'));
  const userId = currentUser?.userId;

  if (!userId) {
    alert("Không tìm thấy thông tin người dùng!");
    return;
  }


  setIsProcessing(true);

  try {
    const bookingData = {
      apartmentId: apartmentInfo.id,
      userId: userId,
      rentalStartDate: startMonth,  
      rentalEndDate: endMonth
    };

    console.log('Sending booking data:', bookingData);
    const result = await createBooking(bookingData);
    console.log('Booking result:', result);

    setBookingResult(result);
    setShowSuccess(true);
  } catch (err) {
    console.error('Error creating booking:', err);
    const errorMessage = err.message || 'Có lỗi xảy ra khi đặt thuê. Vui lòng thử lại!';
    alert(errorMessage);
  } finally {
    setIsProcessing(false);
  }
};


  const handleBackToDetail = () => {
    // navigate("/apartmentdetail");
    console.log("Quay lại trang chi tiết căn hộ");
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + '₫';
  };

  // Loading state
  if (loading) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Đang tải thông tin căn hộ...</p>
        </div>
      </div>
    );
  }

  // Error state - show error if can't load apartment data
  if (error && !apartmentInfo) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center max-w-md">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-gray-800 mb-2">Không thể tải dữ liệu</h2>
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  // Don't render form if no apartment data
  if (!apartmentInfo) {
    return (
      <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen flex items-center justify-center">
        <div className="bg-white rounded-2xl shadow-lg p-8 text-center">
          <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-4" />
          <p className="text-gray-600">Không tìm thấy thông tin căn hộ</p>
        </div>
      </div>
    );
  }

  if (showSuccess && bookingResult) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 min-h-screen flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-lg w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt thuê thành công!</h2>
          <div className="bg-gray-50 rounded-xl p-6 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-4">Thông tin đặt thuê:</h3>
            <div className="space-y-3 text-sm text-gray-600">
              <div className="flex justify-between">
                <span>Mã booking:</span>
                <span className="font-medium">#{bookingResult.id || 'N/A'}</span>
              </div>
              <div className="flex justify-between">
                <span>Thời gian thuê:</span>
                <span className="font-medium">{monthOptions.find(opt => opt.value === startMonth)?.label} - {monthOptions.find(opt => opt.value === endMonth)?.label}</span>
              </div>
              <div className="flex justify-between">
                <span>Số tháng:</span>
                <span className="font-medium">{calculationData.totalMonths} tháng</span>
              </div>
              <div className="flex justify-between">
                <span>Tiền thuê/tháng:</span>
                <span className="font-medium">{formatCurrency(apartmentInfo.monthlyPrice)}</span>
              </div>
              <div className="border-t pt-2 mt-2">
                <div className="flex justify-between">
                  <span>Tổng tiền thuê:</span>
                  <span className="font-bold text-blue-600">{formatCurrency(calculationData.totalRentAmount)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tiền cọc 30%:</span>
                  <span className="font-bold text-orange-600">{formatCurrency(calculationData.depositAmount)}</span>
                </div>
              </div>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4 mb-6 text-left">
            <h4 className="font-semibold text-blue-800 mb-2">Bước tiếp theo:</h4>
            <ol className="text-sm text-blue-700 space-y-1">
              <li>1. Thanh toán tiền cọc trong 24h</li>
              <li>2. Chủ nhà xác nhận booking</li>
              <li>3. Thanh toán tiền thuê từng tháng</li>
            </ol>
          </div>
          <button
            onClick={handleBackToDetail}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Tiến hành thanh toán cọc
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 min-h-screen">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-2xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDetail}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">Đặt thuê căn hộ</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Error Alert */}
        {error && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-5 h-5 text-yellow-600" />
              <span className="text-yellow-800 text-sm">{error}</span>
            </div>
          </div>
        )}

        {/* Apartment Info - Only show if we have real data */}
        {apartmentInfo && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Home className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-800">{apartmentInfo.name || apartmentInfo.title}</h2>
                <p className="text-gray-600 text-sm">{apartmentInfo.location || apartmentInfo.address}</p>
              </div>
            </div>
            <div className="bg-blue-50 rounded-xl p-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-700 font-medium">Giá thuê:</span>
                <span className="text-2xl font-bold text-blue-600">{formatCurrency(apartmentInfo.monthlyPrice || apartmentInfo.price)}/tháng</span>
              </div>
            </div>
          </div>
        )}

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Chọn thời gian thuê</h2>
          </div>

          <div className="space-y-6">
            {/* Start Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Thuê từ tháng
              </label>
              <select
                value={startMonth}
                onChange={(e) => setStartMonth(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              >
                <option value="">Chọn tháng bắt đầu</option>
                {monthOptions.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* End Month */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Đến tháng
              </label>
              <select
                value={endMonth}
                onChange={(e) => setEndMonth(e.target.value)}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
                disabled={!startMonth}
              >
                <option value="">Chọn tháng kết thúc</option>
                {monthOptions
                  .filter(option => !startMonth || option.value >= startMonth)
                  .map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
              </select>
            </div>
          </div>
        </div>

        {/* Cost Calculation */}
        {calculationData.totalMonths > 0 && (
          <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Calculator className="w-5 h-5 text-purple-600" />
              </div>
              <h2 className="text-xl font-bold text-gray-800">Chi tiết chi phí</h2>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Số tháng thuê:</span>
                    <div className="font-bold text-lg text-gray-800">{calculationData.totalMonths} tháng</div>
                  </div>
                  <div>
                    <span className="text-gray-600">Giá/tháng:</span>
                    <div className="font-bold text-lg text-blue-600">{formatCurrency(apartmentInfo?.monthlyPrice || apartmentInfo?.price || 0)}</div>
                  </div>
                </div>
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">Tổng tiền thuê:</span>
                  <span className="text-xl font-bold text-blue-600">{formatCurrency(calculationData.totalRentAmount)}</span>
                </div>
                <div className="flex justify-between items-center mb-3">
                  <span className="text-gray-700 font-medium">Tiền cọc (30%):</span>
                  <span className="text-xl font-bold text-orange-600">{formatCurrency(calculationData.depositAmount)}</span>
                </div>
                <div className="bg-yellow-50 rounded-lg p-3 mt-4">
                  <p className="text-sm text-yellow-800">
                    <strong>Lưu ý:</strong> Bạn cần thanh toán tiền cọc trước, sau đó thanh toán tiền thuê từng tháng.
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Important Notes */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-blue-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-blue-800 mb-2">Quy trình thuê nhà</h4>
                <ol className="text-sm text-blue-700 space-y-1 list-decimal list-inside">
                  <li>Đặt booking và thanh toán tiền cọc (trong 24h)</li>
                  <li>Chủ nhà xác nhận booking</li>
                  <li>Thanh toán tiền thuê từng tháng vào đầu tháng</li>
                  <li>Nhận phòng và bắt đầu thời gian thuê</li>
                </ol>
              </div>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <AlertCircle className="w-5 h-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-semibold text-amber-800 mb-1">Điều khoản quan trọng</h4>
                <ul className="text-sm text-amber-700 space-y-1">
                  <li>• Tiền cọc sẽ được hoàn trả khi kết thúc hợp đồng</li>
                  <li>• Thanh toán tiền thuê trước ngày 5 hàng tháng</li>
                  <li>• Có thể hủy booking trong 24h đầu</li>
                  <li>• Mang theo CMND/CCCD khi ký hợp đồng</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={isProcessing || calculationData.totalMonths === 0 || !apartmentInfo}
          className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${isProcessing || calculationData.totalMonths === 0 || !apartmentInfo
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-700 hover:to-blue-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
            }`}
        >
          {isProcessing ? (
            <div className="flex items-center justify-center gap-2">
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Đang xử lý...</span>
            </div>
          ) : (
            <div className="flex items-center justify-center gap-2">
              <CreditCard className="w-5 h-5" />
              <span>Xác nhận đặt thuê {calculationData.totalMonths > 0 ? `(${calculationData.totalMonths} tháng)` : ''}</span>
            </div>
          )}
        </button>
      </div>
    </div>
  );
}