using System;
namespace staysocial_be.Models.Enums
{
	public enum BookingStatus
	{
        DepositPending,     // Vừa tạo booking, chưa cọc
        DepositPaid,        // Đã cọc, giữ chỗ trong tháng
        Active,             // Đang thuê chính thức
        Expired,            // Hết hạn giữ chỗ (không thuê)
        Terminated,         // Kết thúc hợp đồng thuê
        Cancelled           // Hủy booking
    }
}

