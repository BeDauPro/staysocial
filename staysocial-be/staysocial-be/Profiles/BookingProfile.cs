using System;
using AutoMapper;
using staysocial_be.DTOs.Booking;
using staysocial_be.Models;
using staysocial_be.Models.Enums;

namespace staysocial_be.Profiles
{
    public class BookingProfile : Profile
    {
        public BookingProfile()
        {
            CreateMap<Booking, BookingDto>();

            CreateMap<CreateBookingDto, Booking>()
                .ForMember(dest => dest.CreatedAt, opt => opt.MapFrom(src => DateTime.UtcNow))
                .ForMember(dest => dest.Status, opt => opt.MapFrom(src => BookingStatus.DepositPending));

        }
    }
}

