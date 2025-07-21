import React, { useState } from "react";
import { CreditCard, CheckCircle, ArrowLeft, Calendar, Home, Receipt } from "lucide-react";
import { useNavigate } from "react-router-dom";

const order = {
  id: "ORD001",
  apartment: "Căn hộ Sunrise City View",
  amount: 15000000,
  status: "Chưa thanh toán",
  createdAt: "2025-07-02",
};

export default function CheckoutPage() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const navigate = useNavigate();
  const handlePayment = async () => {
    setIsProcessing(true);
    // Simulate payment processing
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
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Thanh toán thành công!</h2>
          <p className="text-gray-600 mb-6">
            Cảm ơn bạn đã thanh toán. Hợp đồng thuê sẽ được gửi qua email trong vòng 24h.
          </p>
          <button
            onClick={handleBackToDetail}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition-colors"
          >
            Quay lại trang chủ
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex items-center gap-4">
            <button
              onClick={handleBackToDetail}
              className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Quay lại</span>
            </button>
            <div className="h-6 w-px bg-gray-300"></div>
            <h1 className="text-2xl font-bold text-gray-800">Thanh toán đơn hàng</h1>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Order Information Card */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6">
            <div className="flex items-center gap-3 text-white">
              <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                <Receipt className="w-5 h-5" />
              </div>
              <h2 className="text-xl font-bold">Thông tin đơn hàng</h2>
            </div>
          </div>

          <div className="p-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 text-sm font-semibold">#</span>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Mã đơn</p>
                    <p className="font-semibold text-gray-800">{order.id}</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                    <Home className="w-4 h-4 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Căn hộ</p>
                    <p className="font-semibold text-gray-800">{order.apartment}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center">
                    <Calendar className="w-4 h-4 text-yellow-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Ngày đặt</p>
                    <p className="font-semibold text-gray-800">{order.createdAt}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <CreditCard className="w-4 h-4 text-purple-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Số tiền</p>
                    <p className="font-bold text-2xl text-green-600">{order.amount.toLocaleString()}₫</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Section */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thanh toán</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
            <div className="flex justify-between items-center">
              <div>
                <p className="text-gray-600 mb-1">Tổng cần thanh toán</p>
                <p className="text-3xl font-bold text-blue-600">{order.amount.toLocaleString()}₫</p>
              </div>
              <div className="text-right">
                <p className="text-sm text-gray-600">Phương thức</p>
                <p className="font-semibold text-gray-800">VNPay</p>
              </div>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <div className="flex items-start gap-3">
              <div className="w-5 h-5 bg-yellow-400 rounded-full flex items-center justify-center mt-0.5">
                <span className="text-white text-xs">!</span>
              </div>
              <div>
                <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
                <p className="text-sm text-yellow-700">
                  Sau khi thanh toán thành công, hợp đồng thuê sẽ được gửi qua email trong vòng 24h.
                  Vui lòng kiểm tra hộp thư để ký xác nhận.
                </p>
              </div>
            </div>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${isProcessing
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl'
              }`}
          >
            {isProcessing ? (
              <div className="flex items-center justify-center gap-2">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Đang xử lý thanh toán...</span>
              </div>
            ) : (
              <div className="flex items-center justify-center gap-2">
                <CreditCard className="w-5 h-5" />
                <span>Thanh toán với VNPay</span>
              </div>
            )}
          </button>

          <div className="mt-4 text-center">
            <p className="text-xs text-gray-500">
              Bằng cách thanh toán, bạn đồng ý với{' '}
              <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a>
              {' '}và{' '}
              <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}