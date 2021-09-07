using System.Collections.Generic;
using Application.Photos;
using Domain;

namespace Application.UserProfiles
{
    public class Profile
    {
        public string UserName { get; set; }
        public string DisplayName { get; set; }
        public string Bio { get; set; }
        public string Image { get; set; }
        public ICollection<PhotoDto> Photos { get; set; }
    }
}