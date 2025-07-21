using System;
using System.ComponentModel.DataAnnotations;

namespace staysocial_be.Models
{
    public class Photo
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
    }
}

