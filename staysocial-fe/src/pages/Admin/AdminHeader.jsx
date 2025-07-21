import { 
  Shield, 
} from 'lucide-react';

// Header Component
const AdminHeader = () => {
  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <Shield className="h-8 w-8 text-blue-600 mr-3" />
            <h1 className="text-xl font-semibold text-gray-900">
              Trang Quản Trị Admin
            </h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-500">Admin: Nguyễn Văn Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;