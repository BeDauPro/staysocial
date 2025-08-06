using AutoMapper;
using staysocial_be.DTOs.LandlordRequest;
using staysocial_be.Models;

public class LandlordRequestProfile : Profile
{
    public LandlordRequestProfile()
    {
        CreateMap<LandlordRequest, LandlordRequestDto>()
            .ForMember(dest => dest.Name, opt => opt.MapFrom(src => src.FullName))
            .ForMember(dest => dest.Phone, opt => opt.MapFrom(src => src.PhoneNumber))
            .ForMember(dest => dest.Status, opt => opt.MapFrom(src => src.Status.ToString()));

        CreateMap<LandlordRequestCreateDto, LandlordRequest>();
    }
}
