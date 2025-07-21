import { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign,
} from 'lucide-react';

const RevenueStats = () => {
  const [timeRange, setTimeRange] = useState('month');
  
  const revenueData = {
    month: {
      current: '45,000,000',
      previous: '42,000,000',
      growth: '+7.1%'
    },
    year: {
      current: '520,000,000',
      previous: '480,000,000',
      growth: '+8.3%'
    }
  };

  const stats = [
    { 
      label: 'Doanh thu hiện tại', 
      value: revenueData[timeRange].current + ' VND',
      icon: DollarSign, 
      color: 'blue',
      growth: revenueData[timeRange].growth
    },
    { 
      label: 'Tỷ lệ lấp đầy', 
      value: '85%',
      icon: TrendingUp, 
      color: 'green',
      growth: '+2.3%'
    },
    { 
      label: 'Tổng căn hộ', 
      value: '3',
      icon: Building2, 
      color: 'purple',
      growth: '0%'
    },
    { 
      label: 'Khách hàng mới', 
      value: '12',
      icon: Users, 
      color: 'orange',
      growth: '+15%'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thống kê doanh thu</h2>
        <select 
          value={timeRange} 
          onChange={(e) => setTimeRange(e.target.value)}
          className="px-3 py-2 border rounded-lg dark:bg-gray-700 dark:border-gray-600"
        >
          <option value="month">Tháng này</option>
          <option value="year">Năm này</option>
        </select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          const colorClasses = {
            blue: 'bg-blue-100 text-blue-600 dark:bg-blue-800 dark:text-blue-300',
            green: 'bg-green-100 text-green-600 dark:bg-green-800 dark:text-green-300',
            purple: 'bg-purple-100 text-purple-600 dark:bg-purple-800 dark:text-purple-300',
            orange: 'bg-orange-100 text-orange-600 dark:bg-orange-800 dark:text-orange-300'
          };
          
          return (
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className={`p-3 rounded-full ${colorClasses[stat.color]}`}>
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{stat.label}</p>
                    <p className="text-lg font-semibold text-gray-900 dark:text-white">{stat.value}</p>
                  </div>
                </div>
                <div className={`text-sm font-medium ${
                  stat.growth.startsWith('+') ? 'text-green-600' : 'text-gray-500'
                }`}>
                  {stat.growth}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Doanh thu theo tháng</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Biểu đồ cột doanh thu</p>
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tỷ lệ lấp đầy</h3>
          <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">Biểu đồ tròn tỷ lệ lấp đầy</p>
          </div>
        </div>
      </div>
    </div>
  );
};
export default RevenueStats;