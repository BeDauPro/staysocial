using System;
namespace staysocial_be.Models.Enums
{
	public enum OrderType
	{
        Deposit,            // Tiền cọc giữ chỗ (CHƯA TÍNH DOANH THU)
        MonthlyRent,        // Tiền thuê hàng tháng (TÍNH DOANH THU)
        DepositRefund
    }
}

