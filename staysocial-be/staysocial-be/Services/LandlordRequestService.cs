using AutoMapper;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Data;
using staysocial_be.DTOs.LandlordRequest;
using staysocial_be.Models;
using staysocial_be.Models.Enums;
using staysocial_be.Services.Interfaces;

public class LandlordRequestService : ILandlordRequestService
{
    private readonly AppDbContext _context;
    private readonly IMapper _mapper;
    private readonly UserManager<AppUser> _userManager;

    public LandlordRequestService(AppDbContext context, IMapper mapper, UserManager<AppUser> userManager)
    {
        _context = context;
        _mapper = mapper;
        _userManager = userManager;
    }

    public async Task CreateRequestAsync(string userId, LandlordRequestCreateDto dto)
    {
        var existing = await _context.LandlordRequests.FirstOrDefaultAsync(r => r.AppUserId == userId && r.Status == RequestStatus.Pending);
        if (existing != null)
            throw new Exception("Bạn đã gửi yêu cầu trước đó và đang chờ duyệt.");

        var entity = _mapper.Map<LandlordRequest>(dto);
        entity.AppUserId = userId;

        _context.LandlordRequests.Add(entity);
        await _context.SaveChangesAsync();
    }

    public async Task<List<LandlordRequestDto>> GetAllRequestsAsync()
    {
        var requests = await _context.LandlordRequests
            .Include(r => r.AppUser)
            .OrderByDescending(r => r.CreatedAt)
            .ToListAsync();

        return _mapper.Map<List<LandlordRequestDto>>(requests);
    }

    public async Task ApproveRequestAsync(int requestId)
    {
        var request = await _context.LandlordRequests.Include(r => r.AppUser).FirstOrDefaultAsync(r => r.Id == requestId);
        if (request == null) throw new Exception("Không tìm thấy yêu cầu.");

        request.Status = RequestStatus.Approved;
        await _userManager.AddToRoleAsync(request.AppUser, "Landlord");

        await _context.SaveChangesAsync();
    }

    public async Task RejectRequestAsync(int requestId)
    {
        var request = await _context.LandlordRequests.FirstOrDefaultAsync(r => r.Id == requestId);
        if (request == null) throw new Exception("Không tìm thấy yêu cầu.");

        request.Status = RequestStatus.Rejected;

        await _context.SaveChangesAsync();
    }
}
