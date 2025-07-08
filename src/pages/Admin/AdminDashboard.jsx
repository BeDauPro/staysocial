import { useState } from 'react';
import AdminHeader from './AdminHeader';
import SearchAndFilter from "./SearchAndFilter";
import PostsTable from "./PostsTable";
import UsersTable from "./UserTable";
import NavigationTabs from './NavigationTabs';
const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  // Sample data
  const [posts, setPosts] = useState([
    {
      id: 1,
      title: "Cho thuê căn hộ 2PN tại Vinhomes",
      author: "Nguyễn Văn A",
      date: "2024-07-08",
      status: "pending",
      type: "rent",
      price: "15,000,000",
      reports: 0
    },
    {
      id: 2,
      title: "Bán nhà 3 tầng quận 1",
      author: "Trần Thị B",
      date: "2024-07-07",
      status: "approved",
      type: "sale",
      price: "5,200,000,000",
      reports: 2
    },
    {
      id: 3,
      title: "Căn hộ studio giá rẻ",
      author: "Lê Văn C",
      date: "2024-07-06",
      status: "violation",
      type: "rent",
      price: "8,000,000",
      reports: 5
    }
  ]);

  const [users, setUsers] = useState([
    {
      id: 1,
      name: "Nguyễn Văn A",
      email: "nguyenvana@email.com",
      role: "user",
      status: "active",
      joinDate: "2024-01-15",
      postsCount: 12,
      reportsCount: 0
    },
    {
      id: 2,
      name: "Trần Thị B",
      email: "tranthib@email.com",
      role: "agent",
      status: "active",
      joinDate: "2023-11-22",
      postsCount: 45,
      reportsCount: 1
    },
    {
      id: 3,
      name: "Lê Văn C",
      email: "levanc@email.com",
      role: "user",
      status: "banned",
      joinDate: "2024-05-10",
      postsCount: 3,
      reportsCount: 8
    }
  ]);

  const [apartments, setApartments] = useState([
    {
      id: 1,
      name: "Vinhomes Central Park",
      location: "Bình Thạnh, TP.HCM",
      totalUnits: 3500,
      availableUnits: 245,
      status: "active"
    },
    {
      id: 2,
      name: "Masteri Thảo Điền",
      location: "Quận 2, TP.HCM",
      totalUnits: 2800,
      availableUnits: 189,
      status: "active"
    },
    {
      id: 3,
      name: "Landmark 81",
      location: "Bình Thạnh, TP.HCM",
      totalUnits: 1000,
      availableUnits: 67,
      status: "maintenance"
    }
  ]);

  // Event handlers
  const handleApprovePost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'approved' } : post
    ));
  };

  const handleRejectPost = (postId) => {
    setPosts(posts.map(post => 
      post.id === postId ? { ...post, status: 'rejected' } : post
    ));
  };

  const handleDeletePost = (postId) => {
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleBanUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'banned' } : user
    ));
  };

  const handleUnbanUser = (userId) => {
    setUsers(users.map(user => 
      user.id === userId ? { ...user, status: 'active' } : user
    ));
  };

  // Filter functions
  const filterData = (data, type) => {
    return data.filter(item => {
      const searchFields = type === 'posts' 
        ? [item.title, item.author]
        : type === 'users'
        ? [item.name, item.email]
        : [item.name, item.location];
      
      const matchesSearch = searchFields.some(field => 
        field.toLowerCase().includes(searchTerm.toLowerCase())
      );
      
      const matchesFilter = statusFilter === 'all' || item.status === statusFilter;
      
      return matchesSearch && matchesFilter;
    });
  };

  const filteredPosts = filterData(posts, 'posts');
  const filteredUsers = filterData(users, 'users');
  const filteredApartments = filterData(apartments, 'apartments');

  return (
    <div className="min-h-screen bg-gray-50">
      <AdminHeader />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <NavigationTabs activeTab={activeTab} setActiveTab={setActiveTab} />
        
        <SearchAndFilter 
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          statusFilter={statusFilter}
          setStatusFilter={setStatusFilter}
          activeTab={activeTab}
        />

        <div className="bg-white rounded-lg shadow">
          {activeTab === 'posts' && (
            <PostsTable 
              posts={filteredPosts}
              onApprove={handleApprovePost}
              onReject={handleRejectPost}
              onDelete={handleDeletePost}
            />
          )}

          {activeTab === 'users' && (
            <UsersTable 
              users={filteredUsers}
              onBan={handleBanUser}
              onUnban={handleUnbanUser}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;