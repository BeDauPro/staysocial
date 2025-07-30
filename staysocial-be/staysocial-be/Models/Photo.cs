using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace staysocial_be.Models
{
    public class Photo
    {
        [Key]
        public int Id { get; set; }
        public string Url { get; set; }
        public string PublicId { get; set; }
        public DateTime UploadedAt { get; set; } = DateTime.UtcNow;
        public int? ApartmentId { get; set; } 
        [ForeignKey("ApartmentId")]
        public virtual Apartment Apartment { get; set; }
    }
}

