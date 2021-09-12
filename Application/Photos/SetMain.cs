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
    public class SetMain
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string Id { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;
            private readonly IUserAccessor userAccessor;
            public Handler(DataContext context, IUserAccessor userAccessor)
            {
                this.context = context;
                this.userAccessor = userAccessor;
            }
            public async Task<Result<Unit>> Handle(Command command, CancellationToken cancellationToken)
            {
                AppUser user = await context.Users
                .Include(x => x.Photos)
                .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());

                if (user == null)
                    return null;

                Photo photo = user.Photos.FirstOrDefault(x => x.Id == command.Id);

                if (photo == null)
                    return null;

                Photo currentMain = user.Photos.FirstOrDefault(x => x.IsMain);

                if (currentMain != null)
                    currentMain.IsMain = false;
                photo.IsMain = true;

                bool dbSuccess = await context.SaveChangesAsync() > 0;
                if (dbSuccess)
                {
                    return Result<Unit>.Success(Unit.Value);
                }
                return Result<Unit>.Failure("Failed to set main photo");
            }
        }
    }
}