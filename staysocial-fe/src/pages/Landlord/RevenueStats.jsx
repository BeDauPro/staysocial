import { getDashboardStatistics } from '../../services/statisticsApi';

import React, { useState, useEffect } from 'react';
import { 
  Building2, 
  TrendingUp, 
  Users, 
  DollarSign,
  Loader2,
  AlertCircle,
  RefreshCw
} from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RevenueStats = () => {
  const [timeRange, setTimeRange] = useState('current');
  const [year, setYear] = useState(new Date().getFullYear());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Load statistics từ API
  useEffect(() => {
    const loadStatistics = async () => {
      try {
        setLoading(true);
        setError(null);
        const statisticsData = await getDashboardStatistics(year);
        setData(statisticsData);
      } catch (err) {
        console.error('Error loading statistics:', err);
        setError('Không thể tải dữ liệu thống kê. Vui lòng thử lại.');
      } finally {
        setLoading(false);
      }
    };

    loadStatistics();
  }, [year]);

  // Helper function to format currency
  const formatCurrency = (amount) => {
    if (!amount) return '0';
    return parseInt(amount).toLocaleString('vi-VN') + ' VND';
  };

  // Helper function to format growth percentage
  const formatGrowth = (growth) => {
    if (growth === null || growth === undefined) return '0%';
    return growth >= 0 ? `+${growth}%` : `${growth}%`;
  };

  // Prepare chart data
  const monthlyChartData = data?.monthlyRevenueChart?.map(item => ({
    month: `T${item.month}`,
    revenue: item.revenue
  })) || [];

  // Debug log để kiểm tra dữ liệu
  console.log('Raw data from API:', data);
  console.log('Monthly chart data:', monthlyChartData);
  console.log('Has monthlyRevenueChart:', !!data?.monthlyRevenueChart);
  console.log('Chart data length:', monthlyChartData.length);

  const occupancyChartData = data?.occupancyRateChart?.map((item, index) => ({
    name: item.apartmentName,
    value: item.rate,
    color: ['#3B82F6', '#10B981', '#F59E0B', '#EF4444', '#8B5CF6'][index % 5]
  })) || [];

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600 dark:text-gray-400">Đang tải dữ liệu thống kê...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-600 dark:text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center mx-auto"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            Thử lại
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    { 
      label: 'Doanh thu tháng này', 
      value: formatCurrency(data?.currentRevenue),
      icon: DollarSign, 
      color: 'blue',
      growth: formatGrowth(data?.revenueGrowthPercent)
    },
    { 
      label: 'Tỷ lệ lấp đầy', 
      value: `${data?.occupancyRate || 0}%`,
      icon: TrendingUp, 
      color: 'green',
      growth: formatGrowth(data?.occupancyGrowthPercent)
    },
    { 
      label: 'Tổng căn hộ', 
      value: data?.totalApartments || 0,
      icon: Building2, 
      color: 'purple',
      growth: '0%'
    },
    { 
      label: 'Khách hàng mới', 
      value: data?.newCustomers || 0,
      icon: Users, 
      color: 'orange',
      growth: formatGrowth(data?.customerGrowthPercent)
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Thống kê doanh thu</h2>
        <div className="flex items-center gap-4">
          <select 
            value={year} 
            onChange={(e) => setYear(parseInt(e.target.value))}
            className="px-3 py-2 border border-gray-300 rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white focus:ring-2 focus:ring-blue-500"
          >
            {Array.from({length: 5}, (_, i) => new Date().getFullYear() - i).map(y => (
              <option key={y} value={y}>Năm {y}</option>
            ))}
          </select>
          <button
            onClick={() => window.location.reload()}
            className="p-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            title="Làm mới dữ liệu"
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>
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
            <div key={index} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow">
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
                  stat.growth.startsWith('+') ? 'text-green-600' : 
                  stat.growth.startsWith('-') ? 'text-red-600' : 'text-gray-500'
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
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Doanh thu theo tháng - {year}
          </h3>
          <div className="h-64">
            {monthlyChartData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={monthlyChartData} margin={{ top: 20, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
                  <XAxis 
                    dataKey="month" 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                  />
                  <YAxis 
                    className="text-xs"
                    tick={{ fill: 'currentColor' }}
                    tickFormatter={(value) => {
                      if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
                      if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
                      return value.toString();
                    }}
                  />
                  <Tooltip 
                    formatter={(value) => [formatCurrency(value), 'Doanh thu']}
                    labelStyle={{ color: '#374151' }}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                  <Bar dataKey="revenue" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            ) : (
              <div className="flex flex-col items-center justify-center h-full bg-gray-50 dark:bg-gray-700 rounded-lg">
                <p className="text-gray-500 dark:text-gray-400 mb-2">Không có dữ liệu doanh thu</p>
                <p className="text-sm text-gray-400 dark:text-gray-500">
                  {data?.monthlyRevenueChart ? 
                    `Dữ liệu trống (${data.monthlyRevenueChart.length} tháng)` : 
                    'API chưa trả về monthlyRevenueChart'
                  }
                </p>
                {/* Debug info */}
                <div className="mt-4 p-2 bg-gray-100 dark:bg-gray-600 rounded text-xs text-gray-600 dark:text-gray-300">
                  <div>Raw data: {data ? 'Có' : 'Không'}</div>
                  <div>MonthlyRevenueChart: {data?.monthlyRevenueChart ? `${data.monthlyRevenueChart.length} items` : 'null'}</div>
                  <div>Processed data: {monthlyChartData.length} items</div>
                </div>
              </div>
            )}
          </div>
        </div>
        
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Tỷ lệ lấp đầy theo căn hộ</h3>
          {occupancyChartData.length > 0 ? (
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={occupancyChartData}
                    cx="50%"
                    cy="50%"
                    innerRadius={60}
                    outerRadius={100}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {occupancyChartData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip 
                    formatter={(value) => [`${value}%`, 'Tỷ lệ lấp đầy']}
                    contentStyle={{ 
                      backgroundColor: 'white', 
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px'
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="mt-4 flex flex-wrap gap-2">
                {occupancyChartData.map((entry, index) => (
                  <div key={index} className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2"
                      style={{ backgroundColor: entry.color }}
                    ></div>
                    <span className="text-xs text-gray-600 dark:text-gray-400">
                      {entry.name} ({entry.value}%)
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="h-64 flex items-center justify-center bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-gray-500 dark:text-gray-400">Không có dữ liệu căn hộ</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default RevenueStats;