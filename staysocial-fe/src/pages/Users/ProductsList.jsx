import React,{useState} from 'react'
import FilterSidebar from '../../components/FilterSidebar';
import Pagination from '../../components/Pagination';
const apartments = [
    {
        id: 1,
        name: "Sunrise City View",
        price: "10,000,000₫ / tháng",
        address: "Quận 7, TP.HCM",
        image: "https://source.unsplash.com/random/400x300/?apartment,1",
    },
    {
        id: 2,
        name: "Vinhomes Central Park",
        price: "15,000,000₫ / tháng",
        address: "Bình Thạnh, TP.HCM",
        image: "https://source.unsplash.com/random/400x300/?apartment,2",
    },
    {
        id: 3,
        name: "Masteri Thảo Điền",
        price: "12,000,000₫ / tháng",
        address: "Quận 2, TP.HCM",
        image: "https://source.unsplash.com/random/400x300/?apartment,3",
    },
];


const ProductsList = () => {
    const [currentPage, setCurrentPage] = useState(1);
    const totalPages = 5;

    const handlePageChange = (page) => {
        if (page >= 1 && page <= totalPages) {
            setCurrentPage(page);
            // Gọi API hoặc cập nhật dữ liệu ở đây
        }
    }
    return (
        <section>
            <div className="mx-auto max-w-screen-xl px-4 py-8 sm:px-6 sm:py-12 lg:px-8">
                <header>
                    <h2 className="text-xl font-bold text-gray-900 sm:text-3xl">Danh sách căn hộ</h2>
                    <p className="mt-4 max-w-md text-gray-500">
                        Khám phá hàng trăm căn hộ chất lượng, đa dạng mức giá và vị trí — dễ dàng chọn lựa nơi ở phù hợp nhất với nhu cầu và ngân sách của bạn.
                    </p>
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
                    <FilterSidebar onFilter={(filters) => console.log(filters)} />
                    <div className="lg:col-span-3 mt-8">
                        <ul className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                            {apartments.map((apt) => (
                                <li key={apt.id}>
                                    <div className="group block overflow-hidden rounded-lg shadow hover:shadow-lg transition">
                                        <img
                                            src={apt.image}
                                            alt={apt.name}
                                            className="h-[250px] w-full object-cover transition duration-500 group-hover:scale-105"
                                        />
                                        <div className="relative bg-white p-4">
                                            <h3 className="text-lg font-semibold text-gray-900">{apt.name}</h3>
                                            <p className="text-green-600 font-bold">{apt.price}</p>
                                            <p className="text-gray-500 text-sm mb-2">{apt.address}</p>
                                            <a
                                                href={`/apartmentdetail`}
                                                className="inline-block mt-2 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                                            >
                                                Xem chi tiết
                                            </a>
                                        </div>
                                    </div>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
                <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    onPageChange={handlePageChange}
                />

            </div>
        </section>
    )
}

export default ProductsList
