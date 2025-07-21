import { useState } from "react";

export default function FilterSidebar({ onFilter }) {
  const [sortBy, setSortBy] = useState("default");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [location, setLocation] = useState("");

  const handleApply = () => {
    onFilter({ sortBy, minPrice, maxPrice, location });
  };

  const handleReset = () => {
    setSortBy("default");
    setMinPrice("");
    setMaxPrice("");
    setLocation("");
    onFilter({ sortBy: "default", minPrice: "", maxPrice: "", location: "" });
  };

  return (
    <div className="hidden lg:block bg-white rounded-lg shadow p-5 space-y-5">
      <h3 className="text-lg font-semibold text-gray-800">Bộ lọc</h3>

      {/* Sort */}
      <div>
        <label htmlFor="SortBy" className="block text-sm font-medium text-gray-700">Sắp xếp</label>
        <select
          id="SortBy"
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="mt-1 w-full rounded border-gray-300 shadow-sm text-sm"
        >
          <option value="default">Mặc định</option>
          <option value="price_asc">Giá tăng dần</option>
          <option value="price_desc">Giá giảm dần</option>
          <option value="name_asc">Tên A → Z</option>
          <option value="name_desc">Tên Z → A</option>
        </select>
      </div>

      {/* Price */}
      <div>
        <label className="block text-sm font-medium text-gray-700">Khoảng giá (VNĐ / tháng)</label>
        <div className="mt-2 flex gap-2">
          <input
            type="number"
            placeholder="Từ"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm"
          />
          <input
            type="number"
            placeholder="Đến"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full rounded border border-gray-300 p-2 text-sm"
          />
        </div>
      </div>

      {/* Location */}
      <div>
        <label htmlFor="location" className="block text-sm font-medium text-gray-700">Khu vực</label>
        <select
          id="location"
          value={location}
          onChange={(e) => setLocation(e.target.value)}
          className="mt-1 w-full rounded border-gray-300 shadow-sm text-sm"
        >
          <option value="">Tất cả</option>
          <option value="quan7">Quận 7</option>
          <option value="binhthanh">Bình Thạnh</option>
          <option value="quan2">Quận 2</option>
          <option value="thuduc">Thủ Đức</option>
        </select>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-2 pt-3">
        <button
          onClick={handleApply}
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition text-sm font-medium"
        >
          Áp dụng bộ lọc
        </button>
        <button
          onClick={handleReset}
          className="w-full border border-gray-300 text-gray-600 py-2 rounded hover:bg-gray-100 transition text-sm"
        >
          Đặt lại
        </button>
      </div>
    </div>
  );
}
