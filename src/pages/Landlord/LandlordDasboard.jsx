import React, { useState } from 'react';
import { 
  Home, 
  Calendar, 
  BarChart3, 
  LogOut, 
  Menu, 
  X, 
  Building2, 
  User,
} from 'lucide-react';
import ApartmentList from "../Landlord/ApartmentList";
import BookingHistory from "../Landlord/BookingHistory";
import RevenueStats from "../Landlord/RevenueStats";
import ProfileSettings from './ProfileSetting';
import Logout from './Logout';
const LandlordDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('apartments');

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  const menuItems = [
    { id: 'apartments', label: 'Danh sách căn hộ', icon: Building2 },
    { id: 'bookings', label: 'Lịch sử booking', icon: Calendar },
    { id: 'revenue', label: 'Thống kê doanh thu', icon: BarChart3 },
    {id: 'profile', label: 'Thông tin cá nhân', icon: User },
    { id: 'logout', label: 'Đăng xuất', icon: LogOut }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'apartments':
        return <ApartmentList />;
      case 'bookings':
        return <BookingHistory />;
      case 'revenue':
        return <RevenueStats />;
      case 'profile':
        return <ProfileSettings/>;
      case 'logout':
        return <Logout />;
      default:
        return <ApartmentList />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      {/* Mobile menu button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 z-50 p-2 rounded-lg bg-white dark:bg-gray-800 shadow-lg lg:hidden"
      >
        {sidebarOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
      </button>

      {/* Sidebar */}
      <div className={`fixed inset-y-0 left-0 z-40 w-64 bg-white dark:bg-gray-800 shadow-lg transform transition-transform duration-300 ease-in-out ${
        sidebarOpen ? 'translate-x-0' : '-translate-x-full'
      } lg:translate-x-0`}>
        <div className="h-full px-3 py-4 overflow-y-auto">
          {/* Logo/Header */}
          <div className="flex items-center mb-8 px-4">
            <Home className="w-8 h-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-bold text-gray-900 dark:text-white">Chủ nhà Dashboard</h1>
          </div>

          {/* Navigation */}
          <nav className="space-y-2">
            {menuItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    if (window.innerWidth < 1024) {
                      setSidebarOpen(false);
                    }
                  }}
                  className={`w-full flex items-center px-4 py-3 text-left rounded-lg transition-colors ${
                    activeTab === item.id
                      ? 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300'
                      : 'text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700'
                  }`}
                >
                  <Icon className="w-5 h-5 mr-3" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main content */}
      <div className="lg:ml-64 p-4">
        <div className="max-w-7xl mx-auto">
          {renderContent()}
        </div>
      </div>

      {/* Overlay for mobile */}
      {sidebarOpen && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-50 z-30 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  );
};

export default LandlordDashboard;