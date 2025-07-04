import React, { useState } from "react";
import { Calendar, Clock, CreditCard, CheckCircle, Home, ArrowLeft, AlertCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

export default function BookingForm() {
  const [selectedDate, setSelectedDate] = useState("");
  const [timeSlot, setTimeSlot] = useState("");
  const [deposit, setDeposit] = useState("");
  const [showSuccess, setShowSuccess] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const navigate = useNavigate();
  const apartmentInfo = {
    name: "Căn hộ Sunrise City View",
    location: "Quận 7, TP. Hồ Chí Minh",
    price: "15,000,000₫/tháng"
  };
  
  const timeSlots = [
    { value: "9:00 - 10:00", label: "9:00 - 10:00 (Sáng)" },
    { value: "13:30 - 14:30", label: "13:30 - 14:30 (Chiều)" },
    { value: "18:00 - 19:00", label: "18:00 - 19:00 (Tối)" }
  ];
  
  const handleSubmit = async () => {
    if (!selectedDate || !timeSlot || !deposit) {
      alert("Vui lòng điền đầy đủ thông tin!");
      return;
    }
    
    if (Number(deposit) < 100000) {
      alert("Số tiền cọc tối thiểu là 100,000₫");
      return;
    }
    
    setIsProcessing(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsProcessing(false);
      setShowSuccess(true);
    }, 2000);
  };
  
  const handleBackToDetail = () => {
    navigate("/apartmentdetail");
  };
  
  if (showSuccess) {
    return (
      <div className="bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl shadow-2xl p-8 max-w-md w-full text-center">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Đặt giữ chỗ thành công!</h2>
          <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left">
            <h3 className="font-semibold text-gray-800 mb-2">Thông tin đặt chỗ:</h3>
            <div className="space-y-2 text-sm text-gray-600">
              <p><span className="font-medium">Ngày:</span> {selectedDate}</p>
              <p><span className="font-medium">Giờ:</span> {timeSlot}</p>
              <p><span className="font-medium">Tiền cọc:</span> {Number(deposit).toLocaleString()}₫</p>
            </div>
          </div>
          <p className="text-gray-600 mb-6">
            Chúng tôi sẽ liên hệ với bạn trong vòng 24h để xác nhận lịch hẹn xem căn hộ.
          </p>
          <button
            onClick={handleBackToDetail}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Quay lại trang căn hộ
          </button>
        </div>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
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
            <h1 className="text-2xl font-bold text-gray-800">Đặt giữ chỗ xem căn hộ</h1>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 py-8">
        {/* Apartment Info */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <Home className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-gray-800">{apartmentInfo.name}</h2>
              <p className="text-gray-600 text-sm">{apartmentInfo.location}</p>
            </div>
          </div>
          <div className="bg-blue-50 rounded-xl p-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-700 font-medium">Giá thuê:</span>
              <span className="text-2xl font-bold text-blue-600">{apartmentInfo.price}</span>
            </div>
          </div>
        </div>

        {/* Booking Form */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
              <Calendar className="w-5 h-5 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thông tin đặt lịch</h2>
          </div>
          
          <div className="space-y-6">
            {/* Date Selection */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Calendar className="w-4 h-4 inline mr-2" />
                Chọn ngày xem căn hộ
              </label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                min={new Date().toISOString().split('T')[0]}
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
            </div>
            
            {/* Time Slot */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <Clock className="w-4 h-4 inline mr-2" />
                Chọn khung giờ
              </label>
              <div className="grid gap-3">
                {timeSlots.map((slot) => (
                  <label key={slot.value} className="flex items-center p-4 border border-gray-300 rounded-xl hover:bg-gray-50 cursor-pointer transition-all">
                    <input
                      type="radio"
                      name="timeSlot"
                      value={slot.value}
                      checked={timeSlot === slot.value}
                      onChange={(e) => setTimeSlot(e.target.value)}
                      className="mr-3 w-4 h-4 text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-medium text-gray-700">{slot.label}</span>
                  </label>
                ))}
              </div>
            </div>
            
            {/* Deposit */}
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3">
                <CreditCard className="w-4 h-4 inline mr-2" />
                Số tiền cọc giữ chỗ (VNĐ)
              </label>
              <input
                type="number"
                value={deposit}
                onChange={(e) => setDeposit(e.target.value)}
                placeholder="Nhập số tiền cọc (tối thiểu 100,000₫)"
                min="100000"
                step="10000"
                className="w-full p-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                required
              />
              <p className="text-sm text-gray-500 mt-2">
                * Tiền cọc sẽ được hoàn trả nếu bạn không thuê căn hộ
              </p>
            </div>
            
            {/* Important Note */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4">
              <div className="flex items-start gap-3">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
                  <ul className="text-sm text-yellow-700 space-y-1">
                    <li>• Vui lòng có mặt đúng giờ đã hẹn</li>
                    <li>• Mang theo CMND/CCCD để xác thực</li>
                    <li>• Tiền cọc sẽ được trừ vào tiền thuê nếu ký hợp đồng</li>
                  </ul>
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isProcessing}
              className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${
                isProcessing 
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
                  <Calendar className="w-5 h-5" />
                  <span>Xác nhận đặt giữ chỗ</span>
                </div>
              )}
            </button>
                      </div>
        </div>
      </div>
    </div>
  );
}