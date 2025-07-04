import React, { useState } from "react";

const Register = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
    role: "renter",
  });
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
      alert(`Đăng ký thành công với vai trò: ${form.role === "renter" ? "Người đi thuê" : "Chủ căn hộ"}`);
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white shadow-xl p-8">
        <div className="flex flex-col items-center">
          <img
            alt="StaySocial"
            src="https://tailwindcss.com/plus-assets/img/logos/mark.svg?color=indigo&shade=600"
            className="h-12 w-12 mb-2"
          />
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng ký tài khoản</h2>
          <p className="text-gray-500 text-sm mb-6">Tạo tài khoản mới tại StaySocial!</p>
        </div>
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              autoComplete="email"
              value={form.email}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="you@email.com"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Mật khẩu
            </label>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="new-password"
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="Nhập mật khẩu"
            />
          </div>
          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Xác nhận mật khẩu
            </label>
            <input
              id="confirmPassword"
              name="confirmPassword"
              type="password"
              required
              autoComplete="new-password"
              value={form.confirmPassword}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="Nhập lại mật khẩu"
            />
          </div>
           <div>
            <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">
              Vai trò
            </label>
            <select
              id="role"
              name="role"
              value={form.role}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
            >
              <option value="renter">Người đi thuê</option>
              <option value="owner">Chủ căn hộ</option>
            </select>
          </div>
          {error && (
            <div className="text-red-500 text-sm text-center">{error}</div>
          )}
          <button
            type="submit"
            className="w-full rounded-lg bg-indigo-600 py-2 text-white font-semibold text-base shadow hover:bg-indigo-700 transition"
          >
            Đăng ký
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Đã có tài khoản?{" "}
          <a href="/login" className="font-semibold text-indigo-600 hover:underline">
            Đăng nhập
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;