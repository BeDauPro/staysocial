import React from "react";
import { Facebook, Instagram, Mail } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-10">
      <div className="max-w-6xl mx-auto px-4 flex flex-col md:flex-row justify-between items-center gap-4">
        {/* Logo & Tên */}
        <div className="text-xl font-semibold">
          StaySocial<span className="text-blue-500">.</span>
        </div>

        {/* Navigation */}
        <div className="flex gap-6 text-sm text-gray-400">
          <a href="/" className="hover:text-white transition">Trang chủ</a>
          <a href="/about" className="hover:text-white transition">Về chúng tôi</a>
          <a href="/contact" className="hover:text-white transition">Liên hệ</a>
          <a href="/terms" className="hover:text-white transition">Điều khoản</a>
        </div>

        {/* Mạng xã hội */}
        <div className="flex gap-4">
          <a href="https://facebook.com" target="_blank" rel="noreferrer">
            <Facebook className="w-5 h-5 hover:text-blue-400 transition" />
          </a>
          <a href="https://instagram.com" target="_blank" rel="noreferrer">
            <Instagram className="w-5 h-5 hover:text-pink-400 transition" />
          </a>
          <a href="mailto:support@staysocial.vn">
            <Mail className="w-5 h-5 hover:text-green-400 transition" />
          </a>
        </div>
      </div>

      {/* Copy */}
      <div className="text-center text-xs text-gray-500 mt-4">
        © {new Date().getFullYear()} StaySocial. All rights reserved.
      </div>
    </footer>
  );
}
