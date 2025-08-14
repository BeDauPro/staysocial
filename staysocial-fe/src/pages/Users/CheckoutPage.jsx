import React, { useState, useEffect } from "react";
import {
  CreditCard,
  ArrowLeft,
  Calendar,
  Home,
  Receipt
} from "lucide-react";
import { useNavigate, useParams } from "react-router-dom";
import { getApartmentById } from "../../services/apartmentApi";
import { createOrder, ORDER_TYPES } from "../../services/orderApi";

export default function CheckoutPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [apartment, setApartment] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [loading, setLoading] = useState(true);

  // Lấy thông tin căn hộ
  useEffect(() => {
    const fetchApartment = async () => {
      try {
        const data = await getApartmentById(id);
        if (!data) throw new Error("Không tìm thấy căn hộ");
        setApartment(data);
      } catch (err) {
        console.error("Lỗi khi lấy căn hộ:", err);
        alert("Không thể tải thông tin căn hộ. Vui lòng thử lại.");
        navigate("/");
      } finally {
        setLoading(false);
      }
    };
    fetchApartment();
  }, [id, navigate]);

  // Thanh toán
  const handlePayment = async () => {
    if (!apartment) return;

    setIsProcessing(true);

    // ...existing code...
    const payload = {
      apartmentId: apartment.apartmentId, // Thêm dòng này
      apartmentName: apartment.name,
      amount: Number(apartment.price),
      orderType: ORDER_TYPES.RENT,
      description: `Thanh toán thuê căn hộ ${apartment.name}`,
    };
    // ...existing code...

    try {
      const res = await createOrder(payload);
      if (res?.paymentUrl) {
        window.location.href = res.paymentUrl; // Chuyển sang VNPay
      } else {
        alert("Không nhận được link thanh toán từ server.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      alert("Không thể tạo đơn hàng. Vui lòng thử lại.");
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen text-gray-500">
        Đang tải dữ liệu...
      </div>
    );
  }

  if (!apartment) return null;

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 py-4 flex items-center gap-4">
          <button
            onClick={() => navigate(`/apartmentdetail/${id}`)}
            className="flex items-center gap-2 text-gray-600 hover:text-gray-800 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Quay lại</span>
          </button>
          <div className="h-6 w-px bg-gray-300"></div>
          <h1 className="text-2xl font-bold text-gray-800">Thanh toán đơn hàng</h1>
        </div>
      </div>

      {/* Nội dung */}
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Thông tin đơn hàng */}
        <div className="bg-white rounded-2xl shadow-lg overflow-hidden mb-6">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 flex items-center gap-3 text-white">
            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
              <Receipt className="w-5 h-5" />
            </div>
            <h2 className="text-xl font-bold">Thông tin đơn hàng</h2>
          </div>

          <div className="p-6 grid md:grid-cols-2 gap-6">
            {/* Cột trái */}
            <div className="space-y-4">
              <InfoRow label="Mã căn hộ" value={apartment.apartmentId} icon={<span>#</span>} bg="bg-blue-100" text="text-blue-600" />
              <InfoRow label="Tên căn hộ" value={apartment.name} icon={<Home className="w-4 h-4" />} bg="bg-green-100" text="text-green-600" />
            </div>

            {/* Cột phải */}
            <div className="space-y-4">
              <InfoRow label="Ngày đăng" value={new Date(apartment.createdAt).toLocaleDateString("vi-VN")} icon={<Calendar className="w-4 h-4" />} bg="bg-yellow-100" text="text-yellow-600" />
              <InfoRow label="Giá thuê" value={`${apartment.price.toLocaleString("vi-VN")}₫`} icon={<CreditCard className="w-4 h-4" />} bg="bg-purple-100" text="text-purple-600" bold />
            </div>
          </div>
        </div>

        {/* Thanh toán */}
        <div className="bg-white rounded-2xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
              <CreditCard className="w-5 h-5 text-blue-600" />
            </div>
            <h2 className="text-xl font-bold text-gray-800">Thanh toán</h2>
          </div>

          <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 mb-6 flex justify-between items-center">
            <div>
              <p className="text-gray-600 mb-1">Tổng cần thanh toán</p>
              <p className="text-3xl font-bold text-blue-600">
                {apartment.price.toLocaleString("vi-VN")}₫
              </p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Phương thức</p>
              <p className="font-semibold text-gray-800">VNPay</p>
            </div>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 mb-6">
            <h4 className="font-semibold text-yellow-800 mb-1">Lưu ý quan trọng</h4>
            <p className="text-sm text-yellow-700">
              Sau khi thanh toán thành công, hợp đồng thuê sẽ được gửi qua email trong vòng 24h.
            </p>
          </div>

          <button
            onClick={handlePayment}
            disabled={isProcessing}
            className={`w-full py-4 rounded-xl font-semibold text-white transition-all duration-200 ${isProcessing
                ? "bg-gray-400 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 transform hover:scale-105 shadow-lg hover:shadow-xl"
              }`}
          >
            {isProcessing ? "Đang xử lý..." : "Thanh toán với VNPay"}
          </button>

          <p className="mt-4 text-center text-xs text-gray-500">
            Bằng cách thanh toán, bạn đồng ý với{" "}
            <a href="#" className="text-blue-600 hover:underline">Điều khoản dịch vụ</a> và{" "}
            <a href="#" className="text-blue-600 hover:underline">Chính sách bảo mật</a>
          </p>
        </div>
      </div>
    </div>
  );
}

// Component con hiển thị 1 hàng thông tin
function InfoRow({ label, value, icon, bg, text, bold }) {
  return (
    <div className="flex items-center gap-3">
      <div className={`w-8 h-8 ${bg} rounded-lg flex items-center justify-center ${text}`}>
        {icon}
      </div>
      <div>
        <p className="text-sm text-gray-600">{label}</p>
        <p className={`font-${bold ? "bold" : "semibold"} text-gray-800`}>{value}</p>
      </div>
    </div>
  );
}
