import { useEffect, useState } from 'react';
import AdminHeader from './AdminHeader';
import SearchAndFilter from "./SearchAndFilter";
import PostsTable from "./PostsTable";
import UsersTable from "./UserTable";
import NavigationTabs from './NavigationTabs';
import Pagination from '../../components/Pagination';
import AdminLandlordRequests from "./AdminLandlordRequest";
import {
  getAllApartmentsForAdmin,
  approveApartment,
  hideApartment,
} from "../../services/apartmentApi";
import { getAllUsers } from "../../services/appuserApi";
import { getAllLandlordRequests } from "../../services/landlordRequestApi"; // Import API

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('posts');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [posts, setPosts] = useState([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [requests, setRequests] = useState([]);
  const [loadingRequests, setLoadingRequests] = useState(false);

  // Load data based on active tab
  useEffect(() => {
    const loadData = async () => {
      try {
        if (activeTab === 'posts') {
          setLoadingPosts(true);
          const [apartmentsData, usersData] = await Promise.all([
            getAllApartmentsForAdmin(),
            getAllUsers()
          ]);
          
          // Map user info vào từng apartment
          const postsWithUser = apartmentsData.map(apartment => {
            const owner = usersData.find(user => user.id === apartment.ownerId);
            return {
              ...apartment,
              // Thêm thông tin user vào post
              ownerName: owner?.fullName || owner?.name || 'N/A',
              ownerEmail: owner?.email || '',
              ownerPhone: owner?.phoneNumber || owner?.phone || '',
              // Đảm bảo có các field cần thiết cho table
              title: apartment.title || apartment.name || 'Không có tiêu đề',
              author: owner?.fullName || owner?.name || 'N/A',
              location: apartment.address || apartment.location || 'N/A',
              price: apartment.price || 0,
              createdAt: apartment.createdAt || apartment.datePosted || new Date().toISOString(),
            };
          });
          
          setPosts(postsWithUser);
          setLoadingPosts(false);
        } 
        else if (activeTab === 'users') {
          setLoadingUsers(true);
          const usersData = await getAllUsers();
          
          // Format users data để phù hợp với UsersTable
          const formattedUsers = usersData.map(user => ({
            ...user,
            name: user.fullName || user.name || 'N/A',
            address: user.address || 'Chưa có địa chỉ',
            status: user.status || 'active', // default status
            role: user.role || 'User', // giữ nguyên case từ API
            postsCount: user.postsCount || 0, // Có thể cần tính toán từ posts
          }));
          
          setUsers(formattedUsers);
          setLoadingUsers(false);
        }
        else if (activeTab === 'landlordrequest') {
          setLoadingRequests(true);
          try {
            const requestsData = await getAllLandlordRequests();
            
            // Format requests data để đảm bảo có đầy đủ field cần thiết
            const formattedRequests = (requestsData || []).map(request => ({
              ...request,
              // Đảm bảo có các field cần thiết
              id: request.id,
              name: request.name || 'N/A',
              email: request.email || '',
              phone: request.phone || '',
              status: request.status || 'pending',
              createdAt: request.createdAt || request.dateCreated || new Date().toISOString(),
              rejectReason: request.rejectReason || null,
            }));
            
            setRequests(formattedRequests);
          } catch (error) {
            console.error('Error loading landlord requests:', error);
            setRequests([]);
          }
          setLoadingRequests(false);
        }
      } catch (error) {
        console.error(`Error loading ${activeTab} data:`, error);
        if (activeTab === 'posts') {
          setPosts([]);
          setLoadingPosts(false);
        } else if (activeTab === 'users') {
          setUsers([]);
          setLoadingUsers(false);
        } else if (activeTab === 'landlordrequest') {
          setRequests([]);
          setLoadingRequests(false);
        }
      }
    };

    loadData();
  }, [activeTab]);

  const handleUpdateRequest = (id, status, reason) => {
    setRequests(prev =>
      prev.map(req =>
        req.id === id
          ? { ...req, status, ...(reason ? { rejectReason: reason } : {}) }
          : req
      )
    );
  };

  // Event handlers
  const handleApprovePost = async (postId) => {
    try {
      await approveApartment(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, status: 'approved' } : post
        )
      );
      alert("Duyệt căn hộ thành công!");
    } catch (err) {
      console.error('Approve apartment error:', err);
      alert("Duyệt căn hộ thất bại!");
    }
  };

  const handleRejectPost = async (postId) => {
    try {
      await hideApartment(postId);
      setPosts(prevPosts =>
        prevPosts.map(post =>
          post.id === postId ? { ...post, status: 'rejected' } : post
        )
      );
      alert("Ẩn căn hộ thành công!");
    } catch (err) {
      console.error('Hide apartment error:', err);
      alert("Ẩn căn hộ thất bại!");
    }
  };

  const handleDeletePost = (postId) => {
    // Tạm thời chỉ xóa khỏi state, có thể cần API deleteApartment
    setPosts(posts.filter(post => post.id !== postId));
  };

  const handleBanUser = (userId) => {
    // Cần API để ban user, tạm thời update state
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: 'banned' } : user
    ));
    alert("Đã chặn người dùng!");
  };

  const handleUnbanUser = (userId) => {
    // Cần API để unban user, tạm thời update state
    setUsers(users.map(user =>
      user.id === userId ? { ...user, status: 'active' } : user
    ));
    alert("Đã bỏ chặn người dùng!");
  };

  // Filter functions
  const filterData = (data, type) => {
    return data.filter(item => {
      const searchFields = type === 'posts'
        ? [item.title, item.author, item.ownerName, item.location]
        : type === 'users'
          ? [item.name, item.email, item.fullName, item.address]
          : [item.name, item.email]; // for requests

      const matchesSearch = searchFields.some(field =>
        (field || '').toLowerCase().includes(searchTerm.toLowerCase())
      );

      const matchesFilter = statusFilter === 'all' || item.status === statusFilter;

      return matchesSearch && matchesFilter;
    });
  };

  const filteredPosts = filterData(posts, 'posts');
  const filteredUsers = filterData(users, 'users');
  const filteredRequests = filterData(requests, 'requests');
  
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  
  // Calculate pagination for current tab
  const getCurrentData = () => {
    switch (activeTab) {
      case 'posts':
        return filteredPosts;
      case 'users':
        return filteredUsers;
      case 'landlordrequest':
        return filteredRequests;
      default:
        return [];
    }
  };

  const currentData = getCurrentData();
  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedData = currentData.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  // Reset page when changing tabs
  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

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
              posts={paginatedData}
              onApprove={handleApprovePost}
              onReject={handleRejectPost}
              onDelete={handleDeletePost}
              loading={loadingPosts}
            />
          )}

          {activeTab === 'users' && (
            <UsersTable
              users={paginatedData}
              onBan={handleBanUser}
              onUnban={handleUnbanUser}
              loading={loadingUsers}
            />
          )}
          
          {activeTab === 'landlordrequest' && (
            <AdminLandlordRequests
              requests={paginatedData}
              onUpdateRequest={handleUpdateRequest}
            />
          )}
        </div>

        {totalPages > 1 && (
          <div className="mt-8 flex justify-center">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;