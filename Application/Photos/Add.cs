using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<Photo>>
        {
            public IFormFile File { get; set; }    
        }
        public class Handler : IRequestHandler<Command, Result<Photo>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor)
            {
                this.context = context;
                this.photoAccessor = photoAccessor;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<Photo>> Handle(Command request, CancellationToken cancellationToken)
            {
                
                AppUser user = await context.Users
                    .Include(u => u.Photos)
                    .FirstOrDefaultAsync(u => u.UserName == userAccessor
                    .GetUserName());
                if (user == null)
                {
                    return null;
                }
                PhotoUploadResult result = await photoAccessor.AddPhoto(request.File);
                var photo = new Photo
                {
                    Id = result.PublicId,
                    Url = result.Url,
                    //AppUserId = user.Id
                };
                if (user.Photos.Any(x => x.IsMain) == false)
                    photo.IsMain = true;
                    
                user.Photos.Add(photo);
                bool added = await context.SaveChangesAsync() > 0;
                if (added)
                {
                    return Result<Photo>.Success(photo);
                }
                return Result<Photo>.Failure("Failed to add photo");
            }
        }
    }
}