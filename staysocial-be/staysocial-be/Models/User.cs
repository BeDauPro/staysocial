using System;
namespace staysocial_be.Models
{
    public class User
    {
        public int UserId { get; set; }
        public string FullName { get; set; }
        public string Email { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string PasswordHash { get; set; }
        public string? AvatarUrl { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        public ICollection<UserRole> UserRoles { get; set; }
        public ICollection<Apartment> Apartments { get; set; }
        public DateTime CodeGeneratedAt { get; internal set; }
    }

}

