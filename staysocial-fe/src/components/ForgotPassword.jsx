import React, { useState } from "react";

const ForgotPassword = () => {
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sentCode, setSentCode] = useState(""); 
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSendCode = (e) => {
    e.preventDefault();
    if (!email) {
      setError("Vui lòng nhập email.");
      return;
    }
    const fakeCode = "123456";
    setSentCode(fakeCode);
    setStep(2);
    setError("");
    setSuccess("Mã xác thực đã được gửi về email của bạn!");
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    if (code !== sentCode) {
      setError("Mã xác thực không đúng.");
      return;
    }
    setStep(3);
    setError("");
    setSuccess("");
  };

  const handleResetPassword = (e) => {
    e.preventDefault();
    if (newPassword.length < 6) {
      setError("Mật khẩu phải có ít nhất 6 ký tự.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("Mật khẩu xác nhận không khớp.");
      return;
    }
    setSuccess("Đổi mật khẩu thành công! Vui lòng đăng nhập lại.");
    setError("");
    setStep(4);
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

        {error && <div className="text-red-500 text-sm text-center mb-3">{error}</div>}
        {success && <div className="text-green-600 text-sm text-center mb-3">{success}</div>}

        {step === 1 && (
          <form className="space-y-5" onSubmit={handleSendCode}>
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
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2 text-white font-semibold text-base shadow hover:bg-indigo-700 transition"
            >
              Gửi mã xác thực
            </button>
          </form>
        )}

        {step === 2 && (
          <form className="space-y-5" onSubmit={handleVerifyCode}>
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-1">
                Mã xác thực
              </label>
              <input
                id="code"
                name="code"
                type="text"
                required
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="block w-full rounded-lg border-2 border-blue-400 bg-white px-3 py-2 text-base text-gray-900 placeholder:text-gray-400 focus:border-indigo-600 focus:ring-2 focus:ring-indigo-100 transition"
                placeholder="Nhập mã xác thực"
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2 text-white font-semibold text-base shadow hover:bg-indigo-700 transition"
            >
              Xác thực mã
            </button>
          </form>
        )}

        {step === 3 && (
          <form className="space-y-5" onSubmit={handleResetPassword}>
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
              />
            </div>
            <button
              type="submit"
              className="w-full rounded-lg bg-indigo-600 py-2 text-white font-semibold text-base shadow hover:bg-indigo-700 transition"
            >
              Đổi mật khẩu
            </button>
          </form>
        )}

        {step === 4 && (
          <div className="text-center">
            <a
              href="/login"
              className="inline-block mt-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700 transition"
            >
              Đăng nhập
            </a>
          </div>
        )}
      </div>
    </div>
  );
};

export default ForgotPassword;