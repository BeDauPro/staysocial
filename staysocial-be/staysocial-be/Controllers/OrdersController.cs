using Microsoft.AspNetCore.Mvc;
using Org.BouncyCastle.Asn1.Ocsp;
using staysocial_be.Data;
using staysocial_be.DTOs.Order;
using staysocial_be.Services.Interfaces;

[ApiController]
[Route("api/[controller]")]
public class OrdersController : ControllerBase
{
    private readonly IOrderService _orderService;
    private readonly IVnPayService _vnPayService;
    private readonly AppDbContext _db;
    private readonly IConfiguration _config;

    public OrdersController(IOrderService orderService, IVnPayService vnPayService, AppDbContext db, IConfiguration config)
    {
        _orderService = orderService;
        _vnPayService = vnPayService;
        _db = db;
        _config = config;
    }

    [HttpPost]
    public async Task<IActionResult> CreateOrder([FromBody] CreateOrderDto dto)
    {
        // returnUrl should be route to handle vnpay return in your frontend
        string returnUrl = _config["VnPay:ReturnUrl"]; // e.g. https://your-frontend.com/payment-result
        var paymentUrl = await _orderService.CreateOrderAsync(dto, returnUrl);
        return Ok(new { paymentUrl });
    }

    // VNPay will redirect to this endpoint (server side) if you configured it so.
    // Alternatively VNPay can redirect to frontend and frontend then call backend verify endpoint.
    [HttpGet("vnpay-return")]
    public async Task<IActionResult> VnPayReturn()
    {
        var query = Request.Query;

        // verify signature
        var valid = _vnPayService.ValidateResponse(query);
        if (!valid)
        {
            return BadRequest("Invalid signature");
        }

        // read txnRef (OrderId) and response code
        var txnRef = query["vnp_TxnRef"].ToString();
        var respCode = query["vnp_ResponseCode"].ToString(); // "00" success

        if (!int.TryParse(txnRef, out var orderId))
            return BadRequest("Invalid order ref");

        var success = respCode == "00";
        await _orderService.ConfirmPaymentAsync(orderId, success);

        // You can redirect to frontend success/fail page
        var frontUrl = _config["VnPay:FrontReturnUrl"]; // e.g. https://your-frontend/payment-result
        return Redirect(frontUrl + $"?orderId={orderId}&success={success}");
    }

    // Optional: webhook/ipn to receive async notification
    [HttpPost("vnpay-ipn")]
    public async Task<IActionResult> VnPayIpn()
    {
        var query = Request.Form; // VNPay may POST form fields
        var valid = _vnPayService.ValidateResponse((IQueryCollection)Request.Form.ToDictionary(k => k.Key, v => v.Value.ToString()));
        if (!valid) return BadRequest();

        var txnRef = Request.Form["vnp_TxnRef"].ToString();
        var respCode = Request.Form["vnp_ResponseCode"].ToString();
        if (!int.TryParse(txnRef, out var orderId)) return BadRequest();

        var success = respCode == "00";
        await _orderService.ConfirmPaymentAsync(orderId, success);

        return Ok(new { RspCode = "00", Message = "Confirm Success" });
    }
}
