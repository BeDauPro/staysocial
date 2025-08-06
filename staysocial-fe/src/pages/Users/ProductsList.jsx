import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // Import Link để navigation
import { getApprovedApartments } from '../../services/apartmentApi'; // Import API
import FilterSidebar from '../../components/FilterSidebar';
import Pagination from '../../components/Pagination';

const ProductsList = () => {
    // State quản lý data
    const [apartments, setApartments] = useState([]);
    const [filteredApartments, setFilteredApartments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // State phân trang
    const [currentPage, setCurrentPage] = useState(1);
    const [apartmentsPerPage] = useState(9); 
    
    // State filter
    const [activeFilters, setActiveFilters] = useState({});

    // Fetch apartments khi component mount
    useEffect(() => {
        fetchApartments();
    }, []);

    // Apply filters khi apartments hoặc filters thay đổi
    useEffect(() => {
        applyFilters();
    }, [apartments, activeFilters]);

    const fetchApartments = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const data = await getApprovedApartments();
            console.log('Fetched apartments:', data);
            
            setApartments(data || []);
            setFilteredApartments(data || []);
        } catch (err) {
            setError(err.message || 'Không thể tải danh sách căn hộ');
            console.error('Error fetching apartments:', err);
        } finally {
            setLoading(false);
        }
    };

    const applyFilters = () => {
        let filtered = [...apartments];

        // Filter theo giá
        if (activeFilters.priceRange) {
            const { min, max } = activeFilters.priceRange;
            filtered = filtered.filter(apt => {
                const price = apt.price || 0;
                return price >= min && price <= max;
            });
        }

        // Filter theo địa chỉ/khu vực
        if (activeFilters.location && activeFilters.location.trim() !== '') {
            filtered = filtered.filter(apt => 
                apt.address && apt.address.toLowerCase().includes(activeFilters.location.toLowerCase())
            );
        }

        // Filter theo trạng thái sẵn có
        if (activeFilters.availability !== undefined) {
            filtered = filtered.filter(apt => apt.availabilityStatus === activeFilters.availability);
        }

        // Filter theo tiện ích
        if (activeFilters.amenities && activeFilters.amenities.length > 0) {
            filtered = filtered.filter(apt => {
                const apartmentAmenities = apt.amenities ? apt.amenities.toLowerCase() : '';
                return activeFilters.amenities.some(amenity => 
                    apartmentAmenities.includes(amenity.toLowerCase())
                );
            });
        }

        setFilteredApartments(filtered);
        setCurrentPage(1); 
    };

    const handleFilter = (filters) => {
        console.log('Applied filters:', filters);
        setActiveFilters(filters);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Scroll to top khi chuyển trang
            window.scrollTo({ top: 0, behavior: 'smooth' });
        }
    };

    const indexOfLastApartment = currentPage * apartmentsPerPage;
    const indexOfFirstApartment = indexOfLastApartment - apartmentsPerPage;
    const currentApartments = filteredApartments.slice(indexOfFirstApartment, indexOfLastApartment);
    const totalPages = Math.ceil(filteredApartments.length / apartmentsPerPage);

    const formatPrice = (price) => {
        if (!price) return 'Liên hệ';
        return `${price.toLocaleString('vi-VN')}₫ / tháng`;
    };

    // Get default image nếu không có photos
    const getApartmentImage = (apartment) => {
        if (apartment.photos && apartment.photos.length > 0) {
            return apartment.photos[0].url;
        }
        return `https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&auto=format`;
    };

    // Loading state
    if (loading) {
        return (
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                            <p className="text-gray-600">Đang tải danh sách căn hộ...</p>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    // Error state
    if (error) {
        return (
            <section>
                <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                    <div className="flex items-center justify-center h-64">
                        <div className="text-center">
                            <div className="text-red-500 text-6xl mb-4">⚠️</div>
                            <h2 className="text-2xl font-bold text-gray-900 mb-2">Không thể tải dữ liệu</h2>
                            <p className="text-gray-600 mb-4">{error}</p>
                            <button 
                                onClick={fetchApartments}
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                            >
                                Thử lại
                            </button>
                        </div>
                    </div>
                </div>
            </section>
        );
    }

    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Danh sách căn hộ</h2>
                    <p className="mt-4 max-w-md text-gray-500">
                        Khám phá hàng trăm căn hộ chất lượng, đa dạng mức giá và vị trí — dễ dàng chọn lựa nơi ở phù hợp nhất với nhu cầu và ngân sách của bạn.
                    </p>
                    
                    {/* Hiển thị số lượng kết quả */}
                    <div className="mt-2 text-sm text-gray-600">
                        Tìm thấy <span className="font-semibold">{filteredApartments.length}</span> căn hộ
                        {apartments.length !== filteredApartments.length && (
                            <span> (từ {apartments.length} căn hộ)</span>
                        )}
                    </div>
                </header>

                <div className="mt-8 block lg:hidden">
                    <button
                        className="flex cursor-pointer items-center gap-2 border-b border-gray-400 pb-1 text-gray-900 transition hover:border-gray-600"
                    >
                        <span className="text-sm font-medium"> Filters & Sorting </span>
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth="1.5"
                            stroke="currentColor"
                            className="size-4 rtl:rotate-180"
                        >
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </button>
                </div>

                <div className="mt-4 lg:mt-8 lg:grid lg:grid-cols-4 lg:items-start lg:gap-8">
                    <FilterSidebar onFilter={handleFilter} />
                    
                    <div className="lg:col-span-3 mt-8">
                        {currentApartments.length === 0 ? (
                            <div className="text-center py-12">
                                <div className="text-gray-400 text-6xl mb-4">🏠</div>
                                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                                    Không tìm thấy căn hộ nào
                                </h3>
                                <p className="text-gray-600 mb-4">
                                    Thử điều chỉnh bộ lọc hoặc tìm kiếm với từ khóa khác
                                </p>
                                <button 
                                    onClick={() => {
                                        setActiveFilters({});
                                        setCurrentPage(1);
                                    }}
                                    className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                                >
                                    Xóa bộ lọc
                                </button>
                            </div>
                        ) : (
                            <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                                {currentApartments.map((apt) => (
                                    <li key={apt.apartmentId}>
                                        <div className="group block overflow-hidden rounded-lg shadow hover:shadow-lg transition">
                                            <div className="relative">
                                                <img
                                                    src={getApartmentImage(apt)}
                                                    alt={apt.name}
                                                    className="h-[250px] w-full object-cover transition duration-500 group-hover:scale-105"
                                                    onError={(e) => {
                                                        e.target.src = 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400&h=300&fit=crop&auto=format';
                                                    }}
                                                />
                                                
                                                {/* Status badges */}
                                                <div className="absolute top-2 right-2 flex flex-col gap-1">
                                                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                                                        apt.status === 2 ? 'bg-green-100 text-green-800' : 
                                                        apt.status === 1 ? 'bg-yellow-100 text-yellow-800' : 
                                                        'bg-red-100 text-red-800'
                                                    }`}>
                                                        {apt.status === 1 ? 'Đã duyệt' : 
                                                         apt.status === 0 ? 'Chờ duyệt' : 'Bị ẩn'}
                                                    </span>
                                                    
                                                    {apt.availabilityStatus === 1 && (
                                                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                                                            Có sẵn
                                                        </span>
                                                    )}
                                                </div>
                                                
                                                {/* Photo count badge */}
                                                {apt.photos && apt.photos.length > 1 && (
                                                    <div className="absolute bottom-2 left-2 bg-black/50 text-white px-2 py-1 rounded text-xs">
                                                        {apt.photos.length} ảnh
                                                    </div>
                                                )}
                                            </div>
                                            
                                            <div className="relative bg-white p-4">
                                                <h3 className="text-lg font-semibold text-gray-900 mb-1">
                                                    {apt.name || `Căn hộ #${apt.apartmentId}`}
                                                </h3>
                                                <p className="text-green-600 font-bold mb-1">
                                                    {formatPrice(apt.price)}
                                                </p>
                                                <p className="text-gray-500 text-sm mb-2">
                                                    {apt.address || 'Địa chỉ chưa cập nhật'}
                                                </p>
                                                
                                                {/* Date info */}
                                                <p className="text-gray-400 text-xs mb-3">
                                                    Đăng ngày: {new Date(apt.createdAt).toLocaleDateString('vi-VN')}
                                                </p>
                                                
                                                <Link
                                                    to={`/apartmentdetail/${apt.apartmentId}`}
                                                    className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                                >
                                                    Xem chi tiết
                                                </Link>
                                            </div>
                                        </div>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
                
                {/* Pagination chỉ hiển thị khi có dữ liệu */}
                {currentApartments.length > 0 && totalPages > 1 && (
                    <Pagination
                        currentPage={currentPage}
                        totalPages={totalPages}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </section>
    );
};

export default ProductsList;