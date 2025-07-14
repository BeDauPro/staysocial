using System;
namespace staysocial_be.Configuration
{
    public class SmtpSettings
    {
        public string SenderEmail { get; set; }
        public string SenderName { get; set; }
        public string Host { get; set; }
        public int Port { get; set; }
        public bool UseSSL { get; set; }
        public string Username { get; set; }
        public string Password { get; set; }
    }

}

