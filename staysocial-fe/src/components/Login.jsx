import React, { useState } from "react";
import { loginUser } from "../services/authApi";
import { useNavigate } from "react-router-dom";
import { useDispatch } from 'react-redux';
import { login } from '../redux/slices/authSlice'; // đúng path bạn lưu file slice


const Login = () => {

  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.email || !form.password) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const loginData = {
        email: form.email.trim(),
        password: form.password,
      };

      const res = await loginUser(loginData);

      // 1. Lưu localStorage
      localStorage.setItem("token", res.token);
      localStorage.setItem("user", JSON.stringify(res));

      // 2. Cập nhật Redux store
      dispatch(login({
        user: res.user || res.email, // hoặc object user tuỳ backend trả về
        role: res.role,
      }));

      // 3. Navigate theo role
      if (res.role === 'Admin') {
        navigate('/admindashboard');
      } else if (res.role === 'Landlord') {
        navigate('/landlorddashboard'); // bạn đang viết nhầm: /landlord/dashboard
      } else {
        navigate('/productslist');
      }


    } catch (err) {
      console.error('Login failed:', err);
      setError(err.message || "Đăng nhập thất bại.");
    } finally {
      setLoading(false);
    }
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Đăng nhập tài khoản</h2>
          <p className="text-gray-500 text-sm mb-6">Chào mừng bạn quay lại StaySocial!</p>
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
            <div className="flex items-center justify-between mb-1">
              <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                Mật khẩu
              </label>
              <a href="/forgot-password" className="text-xs text-indigo-600 hover:underline">
                Quên mật khẩu?
              </a>
            </div>
            <input
              id="password"
              name="password"
              type="password"
              required
              autoComplete="current-password"
              value={form.password}
              onChange={handleChange}
              className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
              placeholder="••••••••"
            />
          </div>
          {error && (
            <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200">
              {error}
            </div>
          )}
          <button
            type="submit"
            disabled={loading}
            className={`w-full rounded-lg py-3 text-white font-semibold text-base shadow transition ${loading
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
          >
            {loading ? 'Đang đăng nhập...' : 'Đăng nhập'}
          </button>
        </form>
        <p className="mt-6 text-center text-sm text-gray-500">
          Chưa có tài khoản?{' '}
          <a href="/register" className="font-semibold text-indigo-600 hover:underline">
            Đăng ký ngay
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;