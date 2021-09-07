using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Add
    {
        public class Command : IRequest<Result<PhotoDto>>
        {
            public IFormFile File { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<PhotoDto>>
        {
            private readonly DataContext context;
            private readonly IPhotoAccessor photoAccessor;
            private readonly IUserAccessor userAccessor;
            private readonly IMapper mapper;

            public Handler(DataContext context, IPhotoAccessor photoAccessor, IUserAccessor userAccessor, IMapper mapper)
            {
                this.mapper = mapper;
                this.context = context;
                this.photoAccessor = photoAccessor;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<PhotoDto>> Handle(Command command, CancellationToken cancellationToken)
            {

                AppUser user = await context.Users
                    .Include(u => u.Photos.Where(x => x.IsMain))
                    .FirstOrDefaultAsync(u => u.UserName == userAccessor
                    .GetUserName());
                if (user == null)
                {
                    return null;
                }
                PhotoUploadResult result = await photoAccessor.AddPhoto(command.File);
                var photo = new Photo
                {
                    Id = result.PublicId,
                    Url = result.Url,
                    UserId = user.Id
                };
                if (user.Photos.Any(x => x.IsMain) == false)
                    photo.IsMain = true;

                await context.Photos.AddAsync(photo);
                bool added = await context.SaveChangesAsync() > 0;
                if (added)
                {
                    return Result<PhotoDto>.Success(mapper.Map<PhotoDto>(photo));
                }
                return Result<PhotoDto>.Failure("Failed to add photo");
            }
        }
    }
}