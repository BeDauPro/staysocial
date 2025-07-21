using System;
namespace staysocial_be.Services.Interfaces
{
    public interface IPhotoService
    {
        Task<(string Url, string PublicId)> UploadImageAsync(IFormFile file);
        Task<bool> DeleteImageAsync(string publicId);
    }
}

