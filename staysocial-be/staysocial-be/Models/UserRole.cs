using System;
namespace staysocial_be.Models
{
    public class UserRole 
    {
        public int UserId { get; set; }
        public AppUser User { get; set; }

        public int RoleId { get; set; }
        public Role Role { get; set; }
    }
}

