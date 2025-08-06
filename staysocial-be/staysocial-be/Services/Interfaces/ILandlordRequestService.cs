using System;
using staysocial_be.DTOs.LandlordRequest;

namespace staysocial_be.Services.Interfaces
{
    public interface ILandlordRequestService
    {
        Task CreateRequestAsync(string userId, LandlordRequestCreateDto dto);
        Task<List<LandlordRequestDto>> GetAllRequestsAsync();
        Task ApproveRequestAsync(int requestId);
        Task RejectRequestAsync(int requestId);
    }
}

