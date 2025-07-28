import { useState } from 'react';
import {
  Building2,
  X,
  Upload,
  Camera,
} from 'lucide-react';
import { createApartment } from '../../services/apartmentApi';
import { uploadPhoto } from '../../services/photoApi';
const AddApartmentModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    address: '',
    price: '',
    amenities: ''
  });
  const [newImages, setNewImages] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [isLoading, setIsLoading] = useState(false);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const remainingSlots = 5 - previewUrls.length;
    const filesToAdd = files.slice(0, remainingSlots);

    const newPreviewUrls = filesToAdd.map(file => URL.createObjectURL(file));

    setNewImages(prev => [...prev, ...filesToAdd]);
    setPreviewUrls(prev => [...prev, ...newPreviewUrls]);
  };

  const removeImage = (index) => {
    const newImagesCopy = [...newImages];
    const newPreviewUrlsCopy = [...previewUrls];

    URL.revokeObjectURL(newPreviewUrlsCopy[index]);

    newImagesCopy.splice(index, 1);
    newPreviewUrlsCopy.splice(index, 1);

    setNewImages(newImagesCopy);
    setPreviewUrls(newPreviewUrlsCopy);
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.address || !formData.price) {
      alert('Vui lòng điền đầy đủ thông tin căn hộ!');
      return;
    }

    try {
      setIsLoading(true);

      // Upload ảnh lên server
      const uploadedPhotos = [];
      for (let file of newImages) {
        const uploaded = await uploadPhoto(file);
        uploadedPhotos.push(uploaded.url);
      }

      // Chuẩn bị dữ liệu căn hộ
      const apartmentData = {
        ...formData,
        imageUrls: uploadedPhotos,
        availabilityStatus: 0, 
        status: 1              
      };

      // Gọi API tạo căn hộ
      const created = await createApartment(apartmentData);

      alert("Tạo căn hộ thành công!");
      onSubmit(created); // Gửi dữ liệu về component cha nếu cần
      resetForm();
    } catch (err) {
      console.error("Lỗi khi tạo căn hộ:", err);
      alert("Không thể tạo căn hộ!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      address: '',
      price: '',
      amenities: ''
    });
    setNewImages([]);
    // Clean up preview URLs
    previewUrls.forEach(url => URL.revokeObjectURL(url));
    setPreviewUrls([]);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
            <Building2 className="w-5 h-5 mr-2 text-blue-600" />
            Thêm căn hộ mới
          </h3>
          <button
            onClick={resetForm}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Tên căn hộ <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                placeholder="Nhập tên căn hộ"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.name}
                onChange={e => handleInputChange('name', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Giá thuê (VND) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                placeholder="Nhập giá thuê"
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                value={formData.price}
                onChange={e => handleInputChange('price', e.target.value)}
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Địa chỉ <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              placeholder="Nhập địa chỉ căn hộ"
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
              value={formData.address}
              onChange={e => handleInputChange('address', e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Mô tả
            </label>
            <textarea
              placeholder="Nhập mô tả chi tiết về căn hộ..."
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent dark:bg-gray-700 dark:text-white resize-none"
              value={formData.amenities}
              onChange={e => handleInputChange('amenities', e.target.value)}
            />
          </div>

          {/* Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Hình ảnh căn hộ (tối đa 5 ảnh)
            </label>

            {/* Upload Area */}
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:border-blue-500 dark:hover:border-blue-400 transition-colors">
              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageChange}
                className="hidden"
                id="image-upload"
                disabled={previewUrls.length >= 5}
              />
              <label
                htmlFor="image-upload"
                className={`cursor-pointer ${previewUrls.length >= 5 ? 'cursor-not-allowed opacity-50' : ''}`}
              >
                <div className="flex flex-col items-center">
                  <Upload className="w-8 h-8 text-gray-400 mb-2" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {previewUrls.length >= 5
                      ? 'Đã đạt giới hạn tối đa 5 ảnh'
                      : 'Nhấp để tải ảnh lên hoặc kéo thả vào đây'
                    }
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-500 mt-1">
                    PNG, JPG, JPEG (Tối đa 5 ảnh)
                  </span>
                </div>
              </label>
            </div>

            {/* Preview Images */}
            {previewUrls.length > 0 && (
              <div className="mt-4">
                <div className="flex items-center mb-2">
                  <Camera className="w-4 h-4 mr-2 text-gray-500" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {previewUrls.length}/5 ảnh đã chọn
                  </span>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {previewUrls.map((url, index) => (
                    <div key={index} className="relative group">
                      <img
                        src={url}
                        alt={`preview ${index + 1}`}
                        className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-600"
                      />
                      <button
                        onClick={() => removeImage(index)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
          <button
            onClick={resetForm}
            className="px-4 py-2 text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
            disabled={isLoading}
          >
            Hủy
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-md hover:shadow-lg"
          >
            {isLoading ? "Đang xử lý..." : "Thêm căn hộ"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default AddApartmentModal;