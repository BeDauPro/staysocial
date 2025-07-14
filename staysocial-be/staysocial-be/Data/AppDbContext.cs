using System;
using System.Reflection.Emit;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using staysocial_be.Models;

namespace staysocial_be.Data
{
    public class AppDbContext : IdentityDbContext<AppUser>
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }
       
        public DbSet<Apartment> Apartments { get; set; }
        public DbSet<ApartmentImage> ApartmentImages { get; set; }
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<UserRole>()
                .HasKey(ur => new { ur.UserId, ur.RoleId });
        }
    }
}

