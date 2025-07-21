using System;
using AutoMapper;
using staysocial_be.DTOs.Apartment;
using staysocial_be.Models;

namespace staysocial_be.Profiles
{
    public class ApartmentProfile : Profile
    {
        public ApartmentProfile()
        {
            CreateMap<Apartment, ApartmentDto>()
                .ForMember(dest => dest.OwnerEmail, opt => opt.MapFrom(src => src.Owner.Email));

            CreateMap<CreateApartmentDto, Apartment>();
            CreateMap<UpdateApartmentDto, Apartment>();
        }
    }

}

