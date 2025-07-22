namespace staysocial_be.DTOs.User
{
    public class CreateAppUserDto
    {
        public string FullName { get; set; }
        public string Email { get; set; } 
        public string PhoneNumber { get; set; }
        public string Address { get; set; }
        public string Role { get; set; }
    }
}