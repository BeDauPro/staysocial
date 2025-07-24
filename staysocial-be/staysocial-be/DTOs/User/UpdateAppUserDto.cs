using System;
namespace staysocial_be.DTOs.User
{
    public class UpdateAppUserDto
    {
        public string FullName { get; set; }
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string AvatarUrl { get; set; }
    }
}

