import React, { useState } from "react";
import { Star, Heart, ThumbsUp, ThumbsDown, MapPin, Wifi, Car, Shield, Waves, Dumbbell, Camera } from "lucide-react";

const Tabs = ({ defaultValue, children }) => {
  const [activeTab, setActiveTab] = useState(defaultValue);

  const tabsList = children.find(child => child.type === TabsList);
  const tabsContents = children.filter(child => child.type === TabsContent);

  return (
    <div className="w-full">
      {tabsList && React.cloneElement(tabsList, { activeTab, setActiveTab })}
      {tabsContents.map(content =>
        React.cloneElement(content, {
          key: content.props.value,
          isActive: activeTab === content.props.value
        })
      )}
    </div>
  );
};

const TabsList = ({ children, activeTab, setActiveTab }) => (
  <div className="flex space-x-1 rounded-xl bg-gray-100 p-1 mb-4">
    {children.map(child =>
      React.cloneElement(child, {
        key: child.props.value,
        isActive: activeTab === child.props.value,
        onClick: () => setActiveTab(child.props.value)
      })
    )}
  </div>
);

const TabsTrigger = ({ value, children, isActive, onClick }) => (
  <button
    className={`flex-1 rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${isActive
      ? 'bg-white text-blue-600 shadow-sm'
      : 'text-gray-600 hover:text-gray-900'
      }`}
    onClick={onClick}
  >
    {children}
  </button>
);

const TabsContent = ({ value, children, isActive }) => (
  isActive ? <div className="mt-4">{children}</div> : null
);

const Card = ({ children, className = "" }) => (
  <div className={`bg-white rounded-xl shadow-lg border border-gray-200 ${className}`}>
    {children}
  </div>
);

const CardContent = ({ children, className = "" }) => (
  <div className={className}>
    {children}
  </div>
);

const Button = ({ variant = "default", children, onClick, className = "" }) => {
  const baseClasses = "inline-flex items-center justify-center rounded-lg font-medium transition-all duration-200 hover:scale-105";
  const variants = {
    default: "bg-blue-600 text-white px-4 py-2 hover:bg-blue-700",
    ghost: "bg-transparent hover:bg-gray-100 px-3 py-2"
  };

  return (
    <button
      className={`${baseClasses} ${variants[variant]} ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  );
};

export default function ApartmentDetail() {
  const [showBooking, setShowBooking] = useState(false);
  const [liked, setLiked] = useState(false);
  const [thumbsUp, setThumbsUp] = useState(false);
  const [thumbsDown, setThumbsDown] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);

  const images = [
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=800&h=600&fit=crop",
    "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1502672023488-70e25813eb80?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1484154218962-a197022b5858?w=200&h=200&fit=crop",
    "https://images.unsplash.com/photo-1493663284031-b7e3aaa4b7bb?w=200&h=200&fit=crop"
  ];

  return (
    <div className="bg-gradient-to-br from-blue-50 via-white to-purple-50 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left: Image Gallery */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 overflow-hidden">
              <div className="relative group">
                <img
                  src={images[selectedImage]}
                  alt="Apartment main view"
                  className="w-full h-96 object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <button className="absolute top-4 right-4 bg-white/90 backdrop-blur-sm rounded-full p-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <Camera className="w-5 h-5 text-gray-700" />
                </button>
              </div>

              <div className="p-4">
                <div className="grid grid-cols-4 gap-3">
                  {images.slice(1).map((img, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedImage(i + 1)}
                      className={`relative rounded-xl overflow-hidden transition-all duration-200 hover:scale-105 ${selectedImage === i + 1 ? 'ring-2 ring-blue-500' : ''
                        }`}
                    >
                      <img
                        src={img}
                        className="w-full h-20 object-cover"
                        alt={`Apartment view ${i + 1}`}
                      />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Reviews Section */}
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6">
              <Tabs defaultValue="feedback">
                <TabsList>
                  <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
                  <TabsTrigger value="comments">Bình luận</TabsTrigger>
                </TabsList>

                <TabsContent value="feedback">
                  <div className="space-y-4">
                    {[1, 2].map((id) => (
                      <Card key={id} className="hover:shadow-lg transition-shadow duration-200">
                        <CardContent className="p-6">
                          <div className="flex items-center gap-4 mb-4">
                            <img
                              src={`https://i.pravatar.cc/150?img=${id}`}
                              alt="user"
                              className="w-12 h-12 rounded-full border-2 border-blue-100"
                            />
                            <div>
                              <p className="font-semibold text-gray-900">Người thuê {id}</p>
                              <div className="flex text-yellow-500 mt-1">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-4 h-4 fill-yellow-500" />
                                ))}
                              </div>
                            </div>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Căn hộ sạch sẽ, an ninh tốt. Chủ nhà nhiệt tình, hỗ trợ nhanh chóng. Tiện ích đầy đủ, vị trí thuận lợi.
                          </p>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </TabsContent>

                <TabsContent value="comments">
                  <div className="text-center py-8">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </div>
                    <p className="text-gray-600">Chưa có bình luận nào</p>
                    <p className="text-sm text-gray-500 mt-1">Hãy là người đầu tiên chia sẻ ý kiến của bạn!</p>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>

          {/* Right: Details */}
          <div className="lg:col-span-1">
            <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/20 p-6 sticky top-6">
              <div className="space-y-6">
                <div>
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    Căn hộ Sunrise City View
                  </h1>
                  <div className="flex items-center text-gray-600 mb-3">
                    <MapPin className="w-5 h-5 mr-2" />
                    <span>Quận 7, TP.HCM</span>
                  </div>
                  <div className="text-3xl font-bold text-green-600 mb-4">
                    10,000,000₫
                    <span className="text-base font-normal text-gray-600">/ tháng</span>
                  </div>
                </div>

                {/* Amenities */}
                {/* Amenities */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Tiện ích</h3>
                  <p className="text-gray-700 text-sm bg-gray-50 rounded-xl p-4">
                    Căn hộ được trang bị đầy đủ tiện ích: hồ bơi, phòng gym, bảo vệ 24/7, bãi đỗ xe rộng rãi, wifi miễn phí và nhiều tiện ích khác đáp ứng nhu cầu sinh hoạt hiện đại.
                  </p>
                </div>

                {/* Reactions */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Phản hồi</h3>
                  <div className="flex items-center justify-center gap-4 p-4 bg-gray-50 rounded-xl">
                    <Button
                      variant="ghost"
                      onClick={() => setLiked(!liked)}
                      className={`flex-1 ${liked ? 'bg-red-50 text-red-600' : ''}`}
                    >
                      <Heart className={`w-5 h-5 mr-2 ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                      {liked ? 'Đã thích' : 'Thích'}
                    </Button>
                    <Button
                      variant="ghost"
                      onClick={() => setThumbsUp(!thumbsUp)}
                      className={`flex-1 ${thumbsUp ? 'bg-green-50 text-green-600' : ''}`}
                    >
                      <ThumbsUp className={`w-5 h-5 mr-2 ${thumbsUp ? 'text-green-500' : 'text-gray-400'}`} />
                      {thumbsUp ? 'Đã vote' : 'Vote'}
                    </Button>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <a
                    href="/booking-form"
                    className="block w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                      </svg>
                      Đặt cọc ngay
                    </span>
                  </a>

                  <a
                    href="/checkoutpage"
                    className="block w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-105 text-center"
                  >
                    <span className="flex items-center justify-center">
                      <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4m0 0L7 13m0 0l-2.5 5L9 21" />
                      </svg>
                      Thuê ngay
                    </span>
                  </a>
                </div>

                {/* Contact Info */}
                <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl">
                  <h4 className="font-semibold text-gray-900 mb-2">Liên hệ chủ nhà</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      <span className="text-gray-700">0987.654.321</span>
                    </div>
                    <div className="flex items-center">
                      <svg className="w-4 h-4 mr-2 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                      <span className="text-gray-700">owner@email.com</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}