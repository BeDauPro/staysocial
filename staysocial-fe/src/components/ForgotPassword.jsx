import React, { useState } from "react";
import { forgotPassword, resetPassword } from "../services/authApi";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSendCode = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword(email);
      
      console.log('Forgot password response:', res);
      
      setSuccess(res.message || "Mã xác thực đã được gửi về email của bạn!");
      setStep(2);
      
    } catch (err) {
      console.error('Forgot password failed:', err);
      setError(err.message || "Không thể gửi mã xác thực. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    
    if (!resetToken) {
      setError("Vui lòng nhập mã xác thực.");
      return;
    }
    
    setStep(3);
    setError("");
    setSuccess("");
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const resetData = {
        token: resetToken,
        NewPassword: newPassword,
        ConfirmPassword: confirmPassword
      };

      const res = await resetPassword(resetData);
      
      console.log('Reset password response:', res);
      
      setSuccess(res.message || "Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
      setStep(4);
      
    } catch (err) {
      console.error('Reset password failed:', err);
      setError(err.message || "Không thể đổi mật khẩu. Mã xác thực có thể đã hết hạn.");
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!email) {
      setError("Không thể gửi lại mã. Vui lòng thử lại từ đầu.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await forgotPassword(email);
      setSuccess("Mã xác thực mới đã được gửi về email của bạn!");
      
    } catch (err) {
      console.error('Resend code failed:', err);
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
          <h2 className="text-2xl font-bold text-gray-900 mb-1">Quên mật khẩu</h2>
          <p className="text-gray-500 text-sm mb-6">
            {step === 1 && "Nhập email để nhận mã xác thực."}
            {step === 2 && "Nhập mã xác thực đã gửi về email của bạn."}
            {step === 3 && "Đặt lại mật khẩu mới cho tài khoản."}
            {step === 4 && "Bạn đã đổi mật khẩu thành công!"}
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

        {/* Bước 1: Nhập email */}
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
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập email của bạn"
              />
            </div>
            <button
              onClick={handleSendCode}
              disabled={loading}
              className={`w-full rounded-lg py-3 text-white font-semibold text-base shadow transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Đang gửi...' : 'Gửi mã xác thực'}
            </button>
          </div>
        )}

        {/* Bước 2: Xác thực mã */}
        {step === 2 && (
          <div className="space-y-5">
            <div className="text-center text-sm text-gray-600 mb-4">
              Mã xác thực đã được gửi đến:
              <div className="font-semibold text-indigo-600">{email}</div>
            </div>
            
            <div>
              <label htmlFor="resetToken" className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác thực
              </label>
              <input
                id="resetToken"
                name="resetToken"
                type="text"
                required
                value={resetToken}
                onChange={(e) => setResetToken(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập mã xác thực từ email"
              />
            </div>
            
            <button
              onClick={handleVerifyCode}
              className="w-full rounded-lg bg-indigo-600 py-3 text-white font-semibold text-base shadow hover:bg-indigo-700 transition"
            >
              Xác thực mã
            </button>
            
            <div className="text-center">
              <button
                onClick={handleResendCode}
                disabled={loading}
                className={`text-sm transition ${
                  loading 
                    ? 'text-gray-400 cursor-not-allowed' 
                    : 'text-indigo-600 hover:underline'
                }`}
              >
                {loading ? 'Đang gửi...' : 'Không nhận được mã? Gửi lại'}
              </button>
            </div>
          </div>
        )}

        {/* Bước 3: Đặt lại mật khẩu */}
        {step === 3 && (
          <div className="space-y-5">
            <div>
              <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Mật khẩu mới
              </label>
              <input
                id="newPassword"
                name="newPassword"
                type="password"
                required
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập mật khẩu mới"
                minLength="6"
              />
            </div>
            
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
                Xác nhận mật khẩu mới
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập lại mật khẩu mới"
                minLength="6"
              />
            </div>
            
            <button
              onClick={handleResetPassword}
              disabled={loading}
              className={`w-full rounded-lg py-3 text-white font-semibold text-base shadow transition ${
                loading 
                  ? 'bg-gray-400 cursor-not-allowed' 
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {loading ? 'Đang đổi mật khẩu...' : 'Đổi mật khẩu'}
            </button>
          </div>
        )}

        {/* Bước 4: Hoàn thành */}
        {step === 4 && (
          <div className="text-center space-y-4">
            <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
              </svg>
            </div>
            
            <p className="text-gray-600">
              Mật khẩu của bạn đã được đổi thành công!
            </p>
            
            <a
              href="/"
              className="inline-block w-full mt-4 px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition font-semibold"
            >
              Đăng nhập ngay
            </a>
          </div>
        )}

        {/* Link quay lại đăng nhập */}
        {(step === 1 || step === 2) && (
          <p className="mt-6 text-center text-sm text-gray-500">
            Nhớ mật khẩu?{" "}
            <a href="/" className="font-semibold text-indigo-600 hover:underline">
              Đăng nhập
            </a>
          </p>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;