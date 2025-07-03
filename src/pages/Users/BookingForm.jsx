import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

export default function BookingForm() {
  const [date, setDate] = useState(new Date());
  const [timeSlot, setTimeSlot] = useState("");
  const [deposit, setDeposit] = useState("");
  const [history, setHistory] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!timeSlot || !deposit) return alert("Vui lòng nhập đầy đủ!");

    const newBooking = {
      date: date.toLocaleDateString(),
      timeSlot,
      deposit: Number(deposit),
    };

    setHistory([newBooking, ...history]);
    setTimeSlot("");
    setDeposit("");
  };

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <h2 className="text-2xl font-bold">🗓️ Đặt giữ chỗ</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Ngày */}
        <div>
          <label className="block text-sm font-medium mb-1">Chọn ngày</label>
          <DatePicker
            selected={date}
            onChange={(date) => setDate(date)}
            className="border px-3 py-2 rounded w-full"
            dateFormat="dd/MM/yyyy"
            minDate={new Date()}
          />
        </div>

        {/* Khung giờ */}
        <div>
          <label className="block text-sm font-medium mb-1">Chọn khung giờ</label>
          <select
            value={timeSlot}
            onChange={(e) => setTimeSlot(e.target.value)}
            className="border px-3 py-2 rounded w-full"
          >
            <option value="">-- Chọn giờ --</option>
            <option value="9:00 - 10:00">9:00 - 10:00</option>
            <option value="13:30 - 14:30">13:30 - 14:30</option>
            <option value="18:00 - 19:00">18:00 - 19:00</option>
          </select>
        </div>

        {/* Cọc */}
        <div>
          <label className="block text-sm font-medium mb-1">Số tiền cọc (VNĐ)</label>
          <input
            type="number"
            value={deposit}
            onChange={(e) => setDeposit(e.target.value)}
            className="border px-3 py-2 rounded w-full"
            placeholder="Nhập số tiền cọc"
            min={100000}
            required
          />
        </div>

        {/* Gửi */}
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
        >
          Gửi yêu cầu giữ chỗ
        </button>
      </form>

      {/* Lịch sử booking */}
      {/* <div>
        <h3 className="text-lg font-semibold mt-6 mb-2">📋 Lịch sử đặt giữ chỗ</h3>
        {history.length === 0 ? (
          <p className="text-sm text-gray-500">Chưa có đặt giữ chỗ nào.</p>
        ) : (
          <ul className="space-y-2 text-sm">
            {history.map((item, i) => (
              <li
                key={i}
                className="border rounded p-3 flex justify-between items-center bg-gray-50"
              >
                <div>
                  <div><strong>Ngày:</strong> {item.date}</div>
                  <div><strong>Giờ:</strong> {item.timeSlot}</div>
                </div>
                <div className="text-right">
                  <div><strong>Cọc:</strong></div>
                  <div className="text-green-600 font-bold">
                    {item.deposit.toLocaleString()}₫
                  </div>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div> */}
    </div>
  );
}
