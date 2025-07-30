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
        public DbSet<Reaction> Reactions { get; set; }
        public DbSet<Comment> Comments { get; set; }
        public DbSet<Booking> Bookings { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<Payment> Payments { get; set; }
        public DbSet<Feedback> Feedbacks { get; set; }
        public DbSet<AppUser> AppUsers { get; set; }
        public DbSet<LandlordRequest> LandlordRequests { get; set; }
        public DbSet<Photo> Photos { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<Apartment>()
                .HasOne(a => a.Owner)
                .WithMany(u => u.OwnedApartments)
                .HasForeignKey(a => a.OwnerId)
                .OnDelete(DeleteBehavior.Restrict);

            // Cấu hình Photo với nullable ApartmentId và SetNull behavior
            modelBuilder.Entity<Photo>(entity =>
            {
                entity.Property(p => p.ApartmentId)
                    .IsRequired(false); // Đảm bảo nullable

                entity.HasOne(p => p.Apartment)
                    .WithMany(a => a.Photos)
                    .HasForeignKey(p => p.ApartmentId)
                    .OnDelete(DeleteBehavior.SetNull);
            });

            modelBuilder.Entity<Booking>()
              .HasOne(b => b.User)
              .WithMany()
              .HasForeignKey(b => b.UserId)
              .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Booking>()
                .HasOne(b => b.Apartment)
                .WithMany()
                .HasForeignKey(b => b.ApartmentId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}