using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using staysocial_be.DTOs.LandlordRequest;
using staysocial_be.Services.Interfaces;
using System.Security.Claims;

[Route("api/[controller]")]
[ApiController]
public class LandlordRequestController : ControllerBase
{
    private readonly ILandlordRequestService _service;

    public LandlordRequestController(ILandlordRequestService service)
    {
        _service = service;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> SendRequest([FromBody] LandlordRequestCreateDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        await _service.CreateRequestAsync(userId, dto);
        return Ok(new { message = "Yêu cầu đã được gửi." });
    }

    [HttpGet]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetAll()
    {
        var requests = await _service.GetAllRequestsAsync();
        return Ok(requests);
    }

    [HttpPost("{id}/approve")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Approve(int id)
    {
        await _service.ApproveRequestAsync(id);
        return Ok(new { message = "Đã duyệt yêu cầu." });
    }

    [HttpPost("{id}/reject")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Reject(int id)
    {
        await _service.RejectRequestAsync(id);
        return Ok(new { message = "Đã từ chối yêu cầu." });
    }
}
