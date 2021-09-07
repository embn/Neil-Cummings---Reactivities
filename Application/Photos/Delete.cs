using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Photos
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
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
            public async Task<Result<Unit>> Handle(Command command, CancellationToken cancellationToken)
            {
                var photo = await context.Photos.Include(p => p.User).FirstOrDefaultAsync(x => x.Id == command.Id);

                if (photo == null || photo.User == null) 
                    return null;

                if (userAccessor.GetUserName() != photo.User.UserName)
                    return Result<Unit>.Failure("You do not own this photo");

                if (photo.IsMain)
                    return Result<Unit>.Failure("You cannot delete your main photo");
            
                bool deleted_fromCloud = await photoAccessor.DeletePhoto(photo.Id);

                if (deleted_fromCloud == false)
                    return Result<Unit>.Failure("Failed to delete photo from cloud");

                context.Photos.Remove(photo);
                bool deleted_fromDb = await context.SaveChangesAsync() > 0;

                if (deleted_fromDb)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to delete photo from API");
            }
        }
    }
}