using System.Linq;
using Application.Activities;
using Application.UserProfiles;
using Domain;

namespace Application.Core
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.HostUserName, opt => 
                    opt.MapFrom(src => src.Attendees.FirstOrDefault(x => x.IsHost).AppUser.UserName));

            CreateMap<ActivityAttendee, AttendeeDto>()
                .ForMember(dest => dest.DisplayName, opt => 
                    opt.MapFrom(src => src.AppUser.DisplayName))
                .ForMember(dest => dest.UserName, opt => 
                    opt.MapFrom(src => src.AppUser.UserName))
                .ForMember(dest => dest.Bio, opt => 
                    opt.MapFrom(src => src.AppUser.Bio))
                .ForMember(dest => dest.Image, opt => 
                    opt.MapFrom(src => src.AppUser.Photos.FirstOrDefault(x => x.IsMain).Url));

            CreateMap<AppUser, Profile>()
                .ForMember(dest => dest.Image, opt => 
                    opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}