import { useState } from 'react';
import {
  DollarSign,
  MapPin,
  Plus,
  Trash2,
  Eye,
} from 'lucide-react';
import AddApartmentModal from './AddApartmentModal';
import { useNavigate } from 'react-router-dom';
const ApartmentList = () => {
  const [apartments, setApartments] = useState([
    {
      id: 1,
      name: 'Căn hộ A1',
      address: '123 Nguyễn Huệ, Q1',
      status: 'Đang cho thuê',
      price: '15,000,000',
      description: 'Căn hộ cao cấp với view thành phố tuyệt đẹp, đầy đủ nội thất hiện đại. Gần trung tâm thương mại, trường học và bệnh viện.',
      images: []
    },
    {
      id: 2,
      name: 'Căn hộ B2',
      address: '456 Lê Lợi, Q3',
      status: 'Trống',
      price: '12,000,000',
      description: 'Căn hộ 2 phòng ngủ, 2 toilet, ban công rộng rãi. Khu vực an ninh tốt, giao thông thuận tiện.',
      images: []
    },
    {
      id: 3,
      name: 'Căn hộ C3',
      address: '789 Trần Hưng Đạo, Q5',
      status: 'Đang cho thuê',
      price: '18,000,000',
      description: 'Penthouse cao cấp với sân thượng riêng, view sông Sài Gòn. Nội thất sang trọng, đầy đủ tiện nghi.',
      images: []
    }
  ]);

  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedApartment, setSelectedApartment] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [apartmentToDelete, setApartmentToDelete] = useState(null);
  // Mock navigate for demo
  const navigate = useNavigate();

  const handleAddApartment = () => {
    setShowAddModal(true);
  };

  const handleViewDetails = (apartment) => {
    setSelectedApartment(apartment);
    navigate(`/apartmentdetail`);
  };

  const handleDeleteApartment = (id) => {
    const apt = apartments.find(a => a.id === id);
    setApartmentToDelete(apt);
    setShowDeleteModal(true);
  };
  const confirmDeleteApartment = () => {
    setApartments(apartments.filter(apt => apt.id !== apartmentToDelete.id));
    setShowDeleteModal(false);
    setApartmentToDelete(null);
  };

  const handleSubmitApartment = (apartmentData) => {
    setApartments([
      ...apartments,
      {
        id: Date.now(),
        ...apartmentData
      }
    ]);
    setShowAddModal(false);
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

      <div className="grid gap-4">
        {apartments.map((apartment) => (
          <div key={apartment.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <div className="flex items-center justify-between">
              <div className="flex-1 cursor-pointer" onClick={() => handleViewDetails(apartment)}>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                  {apartment.name}
                </h3>
                <div className="flex items-center text-green-600 dark:text-green-400 mb-2">
                  <DollarSign className="w-4 h-4 mr-2" />
                  {apartment.price.toLocaleString()} VND/tháng
                </div>
                <div className="flex items-center text-gray-600 dark:text-gray-400 mb-2">
                  <MapPin className="w-4 h-4 mr-2" />
                  {apartment.address}
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${apartment.status === 'Đang cho thuê'
                  ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100'
                  : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100'
                  }`}>
                  {apartment.status}
                </span>
                <button
                  onClick={() => handleViewDetails(apartment)}
                  className="text-blue-600 hover:text-blue-700 p-2 hover:bg-blue-50 dark:hover:bg-blue-900 rounded"
                  title="Xem chi tiết"
                >
                  <Eye className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDeleteApartment(apartment.id)}
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