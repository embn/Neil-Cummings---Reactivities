using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class FollowToggle
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string TargetUserName { get; set; }   
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

            public async Task<Result<Unit>> Handle(Command cmd, CancellationToken cancellationToken)
            {
                AppUser observer = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());
                AppUser target = await context.Users.FirstOrDefaultAsync(x => x.UserName == cmd.TargetUserName);

                if (target == null)
                    return null;


                if (observer.Id == target.Id)
                    return Result<Unit>.Failure("Failed to update user following. You are not allowed to follow yourself");
                    
                UserFollowing following = await context.UserFollowings.FindAsync(observer.Id, target.Id);

                if (following == null)
                {
                    following = new UserFollowing 
                    {
                        Observer = observer,
                        Target = target
                    };
                    context.Add(following);
                }
                else
                {
                    context.Remove(following);
                }
                bool success = await context.SaveChangesAsync() > 0;
                if (success)
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to update user following");
            }
        }
    }
}