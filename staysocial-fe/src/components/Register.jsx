import React, { useState } from "react";
import { registerUser, verifyEmail } from "../services/authApi";

const Register = () => {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [verificationToken, setVerificationToken] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setError("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    
    // Client-side validation
    if (!form.email || !form.password || !form.confirmPassword) {
      setError("Vui lòng điền đầy đủ thông tin.");
      return;
    }
    
    if (form.password !== form.confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    if (form.password.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }

    setLoading(true);
    setError("");
    
    try {
      const registerData = {
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      
      console.log('Frontend sending:', registerData);
      
      const res = await registerUser(registerData);
      
      console.log('Backend response:', res);
      
      setSuccess("Đăng ký thành công! Mã xác thực đã được gửi về email của bạn.");
      setStep(2); // Chuyển sang bước xác thực
      
    } catch (err) {
      console.error('Registration failed:', err);
      setError(err.message || "Đã có lỗi xảy ra, vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyEmail = async (e) => {
    e.preventDefault();
    
    if (!verificationToken) {
      setError("Vui lòng nhập mã xác thực.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      const res = await verifyEmail(verificationToken);
      
      console.log('Email verification response:', res);
      
      setSuccess("Xác thực email thành công! Tài khoản của bạn đã được kích hoạt.");
      setStep(3); // Chuyển sang bước hoàn thành
      
    } catch (err) {
      console.error('Email verification failed:', err);
      setError(err.message || "Mã xác thực không đúng hoặc đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!form.email) {
      setError("Không thể gửi lại mã. Vui lòng thử đăng ký lại.");
      return;
    }
    
    setLoading(true);
    setError("");
    
    try {
      // Gọi lại API đăng ký để gửi lại email xác thực
      const registerData = {
        email: form.email.trim(),
        password: form.password,
        confirmPassword: form.confirmPassword,
      };
      
      await registerUser(registerData);
      setSuccess("Mã xác thực mới đã được gửi về email của bạn!");
      
    } catch (err) {
      console.error('Resend verification failed:', err);
      setError(err.message || "Không thể gửi lại mã. Vui lòng thử lại sau.");
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">
            {step === 1 && "Đăng ký tài khoản"}
            {step === 2 && "Xác thực email"}
            {step === 3 && "Đăng ký hoàn tất"}
          </h2>
          <p className="text-gray-500 text-sm mb-6">
            {step === 1 && "Tạo tài khoản mới tại StaySocial!"}
            {step === 2 && "Nhập mã xác thực đã gửi về email của bạn."}
            {step === 3 && "Chào mừng bạn đến với StaySocial!"}
          </p>
        </div>

        {error && (
          <div className="text-red-600 text-sm text-center bg-red-50 p-3 rounded-lg border border-red-200 mb-4">
            {error}
          </div>
        )}
        
        {success && (
          <div className="text-green-600 text-sm text-center bg-green-50 p-3 rounded-lg border border-green-200 mb-4">
            {success}
          </div>
        )}

        {/* Bước 1: Form đăng ký */}
        {step === 1 && (
          <div className="space-y-5">
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
                minLength="6"
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
                minLength="6"
              />
            </div>
            
            <button
              onClick={handleRegister}
              disabled={loading}
              className={`w-full rounded-lg py-3 text-white font-semibold text-base shadow transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Đang đăng ký...' : 'Đăng ký'}
            </button>
          </div>
        )}

        {/* Bước 2: Xác thực email */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center text-sm text-gray-600 mb-4">
              Mã xác thực đã được gửi đến:
              <div className="font-semibold text-indigo-600">{form.email}</div>
            </div>
            
            <div>
              <label htmlFor="verificationToken" className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác thực
              </label>
              <input
                id="verificationToken"
                name="verificationToken"
                type="text"
                required
                value={verificationToken}
                onChange={(e) => setVerificationToken(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập mã xác thực từ email"
              />
            </div>
            
            <button
              onClick={handleVerifyEmail}
              disabled={loading}
              className={`w-full rounded-lg py-3 text-white font-semibold text-base shadow transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Đang xác thực...' : 'Xác thực email'}
            </button>
          </div>
        )}

        {/* Bước 3: Hoàn thành */}
        {step === 3 && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <p className="text-gray-600">
              Tài khoản của bạn đã được tạo và xác thực thành công!
            </p>
            
            <a
              href="/"
              className="inline-block w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Đăng nhập ngay
            </a>
          </div>
        )}

        {/* Link đăng nhập (chỉ hiện ở bước 1) */}
        {step === 1 && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Đã có tài khoản?{" "}
            <a href="/" className="font-semibold text-indigo-600 hover:underline">
              Đăng nhập
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default Register;