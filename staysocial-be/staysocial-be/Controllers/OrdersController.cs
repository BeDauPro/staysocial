using System.Threading.Tasks;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.Order;
using staysocial_be.Services.Interfaces;

namespace staysocial_be.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly IOrderService _orderService;

        public OrdersController(IOrderService orderService)
        {
            _orderService = orderService;
        }

        [HttpPost("create")]
        public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
        {
            try
            {
                var returnUrl = "https://your-frontend.com/payment-return"; // đổi theo FE
                var ipAddress = HttpContext.Connection.RemoteIpAddress?.ToString();
                var paymentUrl = await _orderService.CreateOrderAsync(dto, returnUrl, ipAddress);
                return Ok(new { paymentUrl });
            }
            catch (System.Exception ex)
            {
                return BadRequest(new { message = ex.Message });
            }
        }

        // Endpoint xác nhận thanh toán từ VNPay webhook/callback
        [HttpPost("confirm")]
        public async Task<IActionResult> ConfirmPayment([FromQuery] int orderId, [FromQuery] bool success)
        {
            var result = await _orderService.ConfirmPaymentAsync(orderId, success);
            if (!result) return BadRequest(new { message = "Xác nhận thanh toán thất bại" });
            return Ok(new { message = "Thanh toán thành công" });
        }
    }
}
