import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "../../components/ui/Tabs";
import { Dialog, DialogTrigger, DialogContent } from "../../components/ui/Dialog";
import { Card, CardContent } from "../../components/ui/Card";
import { Button } from "../../components/ui/Button";
import { Star, Heart, ThumbsUp, ThumbsDown } from "lucide-react";


export default function ApartmentDetail() {
  const [showBooking, setShowBooking] = useState(false);
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6">
      {/* Left: Image gallery */}
      <div className="space-y-4">
        <img
          src="https://source.unsplash.com/random/800x600/?apartment"
          alt="Apartment"
          className="rounded-2xl w-full h-auto object-cover shadow-md"
        />
        <div className="grid grid-cols-4 gap-2">
          {[1, 2, 3, 4].map((_, i) => (
            <img
              key={i}
              src={`https://source.unsplash.com/random/200x200/?apartment,${i}`}
              className="rounded-xl object-cover w-full h-24"
              alt={`thumb-${i}`}
            />
          ))}
        </div>
      </div>

      {/* Right: Details */}
      <div className="space-y-4">
        <h1 className="text-3xl font-bold">Căn hộ Sunrise City View</h1>
        <p className="text-xl text-green-600 font-semibold">10,000,000₫ / tháng</p>
        <p className="text-gray-600">📍 Quận 7, TP.HCM</p>
        <div className="text-sm text-gray-500">Tiện ích: Hồ bơi, Gym, Bảo vệ 24/7</div>

        {/* Reactions */}
        <div className="flex items-center gap-4 mt-2">
          <Button variant="ghost"><Heart className="w-5 h-5 text-red-500" /></Button>
          <Button variant="ghost"><ThumbsUp className="w-5 h-5 text-green-500" /></Button>
          <Button variant="ghost"><ThumbsDown className="w-5 h-5 text-yellow-500" /></Button>
        </div>

        {/* Tabs for comments/feedback */}
        <Tabs defaultValue="feedback">
          <TabsList>
            <TabsTrigger value="feedback">Đánh giá</TabsTrigger>
            <TabsTrigger value="comments">Bình luận</TabsTrigger>
          </TabsList>

          <TabsContent value="feedback">
            {[1, 2].map((id) => (
              <Card key={id} className="mb-3">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <img
                      src={`https://i.pravatar.cc/150?img=${id}`}
                      alt="user"
                      className="w-10 h-10 rounded-full"
                    />
                    <div>
                      <p className="font-semibold">Người thuê {id}</p>
                      <div className="flex text-yellow-500">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} className="w-4 h-4 fill-yellow-500" />
                        ))}
                      </div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-700">
                    Căn hộ sạch sẽ, an ninh tốt. Chủ nhà nhiệt tình, hỗ trợ nhanh chóng.
                  </p>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          <TabsContent value="comments">
            <div className="text-sm text-gray-600">(Đoạn này sẽ load comment từ user, có thể phân trang)</div>
          </TabsContent>
        </Tabs>

        {/* Booking/Order Buttons */}
        <div className="flex gap-4 mt-6">
          <Dialog open={showBooking} onOpenChange={setShowBooking}>
            <DialogTrigger asChild>
              <Button variant="default">🗓️ Giữ chỗ</Button>
            </DialogTrigger>
            <DialogContent>
              <h2 className="text-xl font-semibold mb-2">Chọn ngày giữ chỗ</h2>
              <p className="text-sm text-gray-500">(Bạn sẽ tích hợp date picker ở đây)</p>
            </DialogContent>
          </Dialog>

          <Button variant="secondary">💳 Thuê ngay</Button>
        </div>
      </div>
    </div>
  );
}
