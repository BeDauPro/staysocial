import { 
  Search,
  Filter,
} from 'lucide-react';
const SearchAndFilter = ({ searchTerm, setSearchTerm, statusFilter, setStatusFilter, activeTab }) => {
  const getFilterOptions = () => {
    const options = [{ value: 'all', label: 'Tất cả trạng thái' }];
    
    if (activeTab === 'posts') {
      options.push(
        { value: 'pending', label: 'Chờ duyệt' },
        { value: 'approved', label: 'Đã duyệt' },
        { value: 'rejected', label: 'Từ chối' },
        { value: 'violation', label: 'Vi phạm' }
      );
    } else if (activeTab === 'users') {
      options.push(
        { value: 'active', label: 'Hoạt động' },
        { value: 'banned', label: 'Bị cấm' }
      );
    } else if (activeTab === 'apartments') {
      options.push(
        { value: 'active', label: 'Hoạt động' },
        { value: 'maintenance', label: 'Bảo trì' }
      );
    }
    
    return options;
  };

  return (
    <div className="mb-6 flex flex-col sm:flex-row gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
      </div>
      <div className="flex items-center gap-2">
        <Filter className="h-4 w-4 text-gray-400" />
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {getFilterOptions().map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
export default SearchAndFilter;