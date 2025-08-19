import { useEffect, useState } from 'react';
import {
  DollarSign,
  MapPin,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import AddApartmentModal from './AddApartmentModal';
import { useNavigate } from 'react-router-dom';
import { getApprovedApartments, deleteApartment, getMyApartments } from '../../services/apartmentApi'; 

const ApartmentList = () => {
  const [apartments, setApartments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);

  const navigate = useNavigate();

  // Fetch data on mount
  useEffect(() => {
  const fetchApartments = async () => {
    try {
      const data = await getMyApartments();
      setApartments(data);
    } catch (error) {
      console.error('Lỗi khi tải căn hộ:', error);
      alert('Không thể tải danh sách căn hộ');
    } finally {
      setLoading(false);
    }
  };

  fetchApartments();
}, []);

  const handleAddApartment = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (apartment) => {
    setSelectedApartment(apartment);
    navigate(`/apartmentdetail/${apartment.apartmentId}`); // nên truyền ID cho chi tiết
  };

  const handleDeleteApartment = (apartmentId) => {
    const apt = apartments.find(a => a.apartmentId === apartmentId);
    setApartmentToDelete(apt);
    setShowDeleteModal(true);
  };

  const confirmDeleteApartment = async () => {
    try {
      await deleteApartment(apartmentToDelete.apartmentId);
      setApartments(apartments.filter(apt => apt.apartmentId !== apartmentToDelete.apartmentId));
      alert('Đã xoá thành công');
    } catch (error) {
      console.error('Xoá thất bại:', error);
      alert('Xoá căn hộ thất bại');
    } finally {
      setShowDeleteModal(false);
      setApartmentToDelete(null);
    }
  };

  const handleSubmitApartment = (apartmentData) => {
    // Reload or append logic tùy API xử lý thêm
    setShowAddModal(false);
  };

  const getAvailabilityStatusText = (status) => {
  switch (status) {
    case 0:
      return 'Còn trống';
    case 1:
      return 'Đã thuê';
    case 2:
      return 'Đã đặt cọc';
    default:
      return 'Không xác định';
  }
};

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Danh sách căn hộ</h2>
        <button
          onClick={handleAddApartment}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors flex items-center shadow-md hover:shadow-lg"
        >
          <Plus className="w-4 h-4 mr-2" />
          Thêm căn hộ mới
        </button>
      </div>

      {loading ? (
        <p className="text-gray-600 dark:text-gray-300">Đang tải danh sách căn hộ...</p>
      ) : (
        <div className="grid gap-4">
          {apartments.map((apartment) => (
            <div
              key={apartment.apartmentId}
              className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6"
            >
              <div className="flex items-center justify-between">
                <div className="flex-1 cursor-pointer" onClick={() => handleViewDetails(apartment)}>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                    {apartment.name}
                  </h3>
                  <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                    <DollarSign className="w-4 h-4 mr-2" />
                    {Number(apartment.price).toLocaleString()} VND/tháng
                  </div>
                  <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                    <MapPin className="w-4 h-4 mr-2" />
                    {apartment.address}
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <span
                    className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getAvailabilityStatusText(apartment.availabilityStatus)
                      ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                      : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                      }`}
                  >
                    {getAvailabilityStatusText(apartment.availabilityStatus)}
                  </span>
                  <button
                    onClick={() => handleViewDetails(apartment)}
                    className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                    title="Xem chi tiết"
                  >
                    <Eye className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => handleDeleteApartment(apartment.apartmentId)}
                    className="text-red-600 hover:text-red-700 p-2 hover:bg-red-50 dark:hover:bg-red-900 rounded"
                    title="Xóa"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal xác nhận xoá */}
      {showDeleteModal && apartmentToDelete && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-lg p-6 max-w-sm w-full">
            <h3 className="text-lg font-semibold mb-4">Xác nhận xoá</h3>
            <p className="mb-6">
              Bạn có chắc chắn muốn xoá căn hộ <span className="font-bold">{apartmentToDelete.name}</span> không?
            </p>
            <div className="flex justify-end gap-2">
              <button
                onClick={() => { setShowDeleteModal(false); setApartmentToDelete(null); }}
                className="px-4 py-2 rounded bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Huỷ
              </button>
              <button
                onClick={confirmDeleteApartment}
                className="px-4 py-2 rounded bg-red-600 hover:bg-red-700 text-white"
              >
                Xoá
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Apartment Modal */}
      <AddApartmentModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSubmit={handleSubmitApartment}
      />
    </div>
  );
};

export default ApartmentList;
