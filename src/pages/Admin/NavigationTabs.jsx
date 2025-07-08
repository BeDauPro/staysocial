import { 
  Users, 
  FileText, 
} from 'lucide-react';

const NavigationTabs = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'posts', label: 'Quản lý bài đăng', icon: FileText },
    { id: 'users', label: 'Quản lý người dùng', icon: Users },
  ];

  return (
    <nav className="flex space-x-8 mb-6">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center px-1 py-2 border-b-2 font-medium text-sm ${
            activeTab === tab.id
              ? 'border-blue-500 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          }`}
        >
          <tab.icon className="h-4 w-4 mr-2" />
          {tab.label}
        </button>
      ))}
    </nav>
  );
};
export default NavigationTabs;