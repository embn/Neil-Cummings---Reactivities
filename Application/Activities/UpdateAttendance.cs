using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class UpdateAttendance
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
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
                Activity activity = await context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(aa => aa.User)
                    .FirstOrDefaultAsync(x => x.Id == command.Id);

                if (activity == null)
                    return null;

                AppUser user = await context.Users
                    .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());

                if (user == null)
                    return null;

                string hostName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.User?.UserName;
                ActivityAttendance attendance = activity.Attendees.FirstOrDefault(x => x.UserId == user.Id);

                if (attendance != null && hostName == user.UserName)
                    activity.IsCancelled = !activity.IsCancelled;

                if (attendance != null && hostName != user.UserName)
                    activity.Attendees.Remove(attendance);

                if (attendance == null)
                {
                    attendance = new ActivityAttendance
                    {
                        User = user,
                        Activity = activity,
                        IsHost = false
                    };

                    activity.Attendees.Add(attendance);
                }
                bool success = await context.SaveChangesAsync() > 0;
                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");
            }
        }
    }
}