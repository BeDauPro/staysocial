import React, { useState, useEffect } from 'react';
import { User, Building, Phone, Mail, Send, CheckCircle, XCircle, Clock } from 'lucide-react';
import {
  getAllLandlordRequests,
  approveLandlordRequest,
  rejectLandlordRequest
} from '../../services/landlordRequestApi'; // Import API functions

const AdminLandlordRequests = ({ onUpdateRequest }) => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [rejectReason, setRejectReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [processingId, setProcessingId] = useState(null);
  const [filter, setFilter] = useState('all');

  // Load requests from API
  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
  try {
    setLoading(true);
    setError('');
    const data = await getAllLandlordRequests();
    setRequests(
      (data || []).map(item => ({
        ...item,
        status: (item.Status || item.status || '').toLowerCase(), // map Status về status, viết thường
        name: item.Name || item.name,
        phone: item.Phone || item.phone,
        email: item.Email || item.email,
        id: item.Id || item.id,
        createdAt: item.CreatedAt || item.createdAt,
      }))
    );
  } catch (err) {
    console.error('Error loading landlord requests:', err);
    setError(err.message || 'Không thể tải danh sách yêu cầu');
    setRequests([]);
  } finally {
    setLoading(false);
  }
};

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'text-yellow-700 bg-yellow-100';
      case 'approved': return 'text-green-700 bg-green-100';
      case 'rejected': return 'text-red-700 bg-red-100';
      default: return 'text-gray-700 bg-gray-100';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'pending': return 'Chờ duyệt';
      case 'approved': return 'Đã duyệt';
      case 'rejected': return 'Đã từ chối';
      default: return 'Không xác định';
    }
  };

  const handleApprove = async (requestId) => {
    try {
      setProcessingId(requestId);
      await approveLandlordRequest(requestId);

      // Update local state
      setRequests(prev => prev.map(req =>
        req.id === requestId ? { ...req, status: 'approved' } : req
      ));

      // Call parent callback if provided
      if (onUpdateRequest) {
        onUpdateRequest(requestId, 'approved');
      }

      alert('Đã duyệt yêu cầu thành công!');
    } catch (err) {
      console.error('Error approving request:', err);
      alert(err.message || 'Có lỗi xảy ra khi duyệt yêu cầu');
    } finally {
      setProcessingId(null);
    }
  };

  const handleReject = async (requestId, reason) => {
    try {
      setProcessingId(requestId);
      await rejectLandlordRequest(requestId, reason || 'Không đáp ứng yêu cầu');

      // Update local state
      setRequests(prev => prev.map(req =>
        req.id === requestId ? {
          ...req,
          status: 'rejected',
          rejectReason: reason
        } : req
      ));

      // Call parent callback if provided
      if (onUpdateRequest) {
        onUpdateRequest(requestId, 'rejected', reason);
      }

      setShowRejectModal(false);
      setSelectedRequest(null);
      setRejectReason('');
      alert('Đã từ chối yêu cầu!');
    } catch (err) {
      console.error('Error rejecting request:', err);
      alert(err.message || 'Có lỗi xảy ra khi từ chối yêu cầu');
    } finally {
      setProcessingId(null);
    }
  };

  const openRejectModal = (request) => {
    setSelectedRequest(request);
    setShowRejectModal(true);
    setRejectReason('');
  };

  const closeRejectModal = () => {
    setShowRejectModal(false);
    setSelectedRequest(null);
    setRejectReason('');
  };

  const filteredRequests = requests.filter(req => {
    if (filter === 'all') return true;
    return req.status === filter;
  });

  const formatDate = (dateString) => {
    try {
      return new Date(dateString).toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      });
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-white rounded-lg shadow-lg">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              Yêu cầu trở thành Landlord
            </h2>
          </div>
          <div className="p-12 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-500">Đang tải danh sách yêu cầu...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-white rounded-lg shadow-lg">
        <div className="px-6 py-4 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-bold text-gray-900 flex items-center">
              <Building className="h-6 w-6 text-blue-600 mr-2" />
              Yêu cầu trở thành Landlord
            </h2>
            <div className="flex space-x-2">
              {['all', 'pending', 'approved', 'rejected'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-3 py-1 rounded-full text-sm font-medium ${filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                >
                  {status === 'all' ? 'Tất cả' : getStatusText(status)}
                  {status !== 'all' && (
                    <span className="ml-1 text-xs">
                      ({requests.filter(r => r.status === status).length})
                    </span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>

        {error && (
          <div className="mx-6 mt-4 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex items-center">
              <XCircle className="h-5 w-5 text-red-600 mr-2" />
              <p className="text-red-700">{error}</p>
            </div>
            <button
              onClick={loadRequests}
              className="mt-2 text-sm text-red-600 hover:text-red-800 font-medium"
            >
              Thử lại
            </button>
          </div>
        )}

        <div className="divide-y divide-gray-200">
          {filteredRequests.length === 0 ? (
            <div className="text-center py-12">
              <Building className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-sm font-medium text-gray-900">Không có yêu cầu nào</h3>
              <p className="mt-1 text-sm text-gray-500">
                {filter === 'all' ? 'Chưa có yêu cầu nào được gửi.' : `Không có yêu cầu nào ở trạng thái ${getStatusText(filter)}.`}
              </p>
              {error && (
                <button
                  onClick={loadRequests}
                  className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
                >
                  Tải lại
                </button>
              )}
            </div>
          ) : (
            filteredRequests.map((request) => (
              <div key={request.id} className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center mb-3">
                      <h3 className="text-lg font-medium text-gray-900">{request.name}</h3>
                      <span className={`ml-3 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}>
                        {getStatusText(request.status)}
                      </span>
                    </div>

                    <div className="space-y-2 mb-3">
                      <div className="flex items-center text-sm text-gray-600">
                        <Mail className="h-4 w-4 mr-2" />
                        {request.email}
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <Phone className="h-4 w-4 mr-2" />
                        {request.phone}
                      </div>
                    </div>

                    <p className="text-xs text-gray-500">
                      Gửi lúc: {formatDate(request.createdAt)}
                    </p>

                    {request.status === 'rejected' && request.rejectReason && (
                      <div className="mt-3 bg-red-50 border border-red-200 rounded-lg p-3">
                        <h4 className="font-medium text-red-900 text-sm mb-1">Lý do từ chối:</h4>
                        <p className="text-sm text-red-700">{request.rejectReason}</p>
                      </div>
                    )}
                  </div>

                  {request.status === 'pending' && (
                    <div className="ml-6 flex space-x-2">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingId === request.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        {processingId === request.id ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-1"></div>
                        ) : (
                          <CheckCircle className="h-4 w-4 mr-1" />
                        )}
                        Duyệt
                      </button>
                      <button
                        onClick={() => handleReject(request.id, 'Không đáp ứng yêu cầu')}
                        disabled={processingId === request.id}
                        className="inline-flex items-center px-3 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                      >
                        <XCircle className="h-4 w-4 mr-1" />
                        Từ chối
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </div>


    </div>
  );
};

export default AdminLandlordRequests;