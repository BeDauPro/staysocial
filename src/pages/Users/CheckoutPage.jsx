import React from "react";

const orders = [
  {
    id: "ORD001",
    apartment: "Căn hộ Sunrise City View",
    amount: 10000000,
    status: "Chưa thanh toán",
    createdAt: "2025-07-02",
  },
  {
    id: "ORD002",
    apartment: "Vinhomes Central Park",
    amount: 12000000,
    status: "Đã thanh toán",
    createdAt: "2025-06-25",
  },
];

export default function CheckoutPage() {
  const unpaidOrders = orders.filter((o) => o.status === "Chưa thanh toán");
  const total = unpaidOrders.reduce((sum, o) => sum + o.amount, 0);

  const handlePay = () => {
    // 👉 Giả lập redirect sang VNPay
    alert("Chuyển hướng đến cổng thanh toán VNPay...");
    window.location.href = `https://sandbox.vnpayment.vn/paymentv2/vpcpay.html?amount=${total}`;
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-4">💳 Thanh toán đơn hàng</h1>

      {/* Bảng đơn hàng */}
      <div className="overflow-x-auto mb-6">
        <table className="min-w-full border text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="p-2 border">Mã đơn</th>
              <th className="p-2 border">Căn hộ</th>
              <th className="p-2 border">Số tiền</th>
              <th className="p-2 border">Ngày đặt</th>
              <th className="p-2 border">Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className="text-center">
                <td className="p-2 border">{order.id}</td>
                <td className="p-2 border">{order.apartment}</td>
                <td className="p-2 border text-green-600 font-semibold">
                  {order.amount.toLocaleString()}₫
                </td>
                <td className="p-2 border">{order.createdAt}</td>
                <td className="p-2 border">
                  <span
                    className={`px-2 py-1 rounded-full text-xs ${
                      order.status === "Đã thanh toán"
                        ? "bg-green-100 text-green-600"
                        : "bg-yellow-100 text-yellow-600"
                    }`}
                  >
                    {order.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Tổng tiền và nút thanh toán */}
      <div className="flex justify-between items-center border-t pt-4">
        <div className="text-lg font-semibold">
          Tổng cần thanh toán:{" "}
          <span className="text-blue-600">
            {total.toLocaleString()}₫
          </span>
        </div>

        {total > 0 ? (
          <button
            onClick={handlePay}
            className="bg-blue-600 text-white px-5 py-2 rounded hover:bg-blue-700 transition"
          >
            Thanh toán với VNPay
          </button>
        ) : (
          <div className="text-sm text-gray-500">Không có đơn hàng cần thanh toán.</div>
        )}
      </div>
    </div>
  );
}
