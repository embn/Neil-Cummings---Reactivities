using System.Linq;
using Application.Activities;
using Application.Comments;
using Application.Photos;
using Application.UserProfiles;
using Domain;

namespace Application.Core
{
    public class MappingProfile : AutoMapper.Profile
    {
        public MappingProfile()
        {
            string currentUserName = null;

            CreateMap<Activity, Activity>();
            CreateMap<Activity, ActivityDto>()
                .ForMember(dest => dest.HostUserName, opt => opt.MapFrom(src => src.Attendees
                    .FirstOrDefault(x => x.IsHost).User.UserName));

            CreateMap<ActivityAttendance, AttendeeDto>()
                .ForMember(dest => dest.DisplayName, opt => opt.MapFrom(src => src.User.DisplayName))
                .ForMember(dest => dest.UserName, opt => opt.MapFrom(src => src.User.UserName))
                .ForMember(dest => dest.Bio, opt => opt.MapFrom(src => src.User.Bio))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.User.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.FollowersCount, opt => opt.MapFrom(src => src.User.Followers.Count))
                .ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.User.Followings.Count))
                .ForMember(dest => dest.Following, opt => opt.MapFrom(src => 
                    src.User.Followers.Any(x => x.Observer.UserName == currentUserName)));

            CreateMap<AppUser, Profile>()
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Photos.FirstOrDefault(x => x.IsMain).Url))
                .ForMember(dest => dest.FollowersCount, opt => opt.MapFrom(src => src.Followers.Count))
                .ForMember(dest => dest.FollowingCount, opt => opt.MapFrom(src => src.Followings.Count))
                .ForMember(dest => dest.Following, opt => opt.MapFrom(src => 
                    src.Followers.Any(x => x.Observer.UserName == currentUserName)));

                //.ForMember(dest => dest.Photos, opt => opt.MapFrom(src => (src.UserName == currentUserName) ? src.Photos : src.Photos.Where(p => p.IsMain)));

            CreateMap<Photo, PhotoDto>();

            CreateMap<Comment, CommentDto>()
                .ForMember(dest => dest.AuthorDisplayName, opt => opt.MapFrom(src => src.Author.DisplayName))
                .ForMember(dest => dest.AuthorName, opt => opt.MapFrom(src => src.Author.UserName))
                .ForMember(dest => dest.Image, opt => opt.MapFrom(src => src.Author.Photos.FirstOrDefault(x => x.IsMain).Url));
        }
    }
}