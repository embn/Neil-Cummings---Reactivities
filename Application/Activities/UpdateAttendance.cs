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

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await context.Activities
                    .Include(a => a.Attendees)
                    .ThenInclude(aa => aa.AppUser)
                    .FirstOrDefaultAsync(x => x.Id == request.Id);

                if (activity == null)
                    return null;

                AppUser user = await context.Users
                    .FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());

                if (user == null)
                    return null;

                string hostName = activity.Attendees.FirstOrDefault(x => x.IsHost)?.AppUser?.UserName;
                ActivityAttendee attendance = activity.Attendees.FirstOrDefault(x => x.AppUserId == user.Id);
                if (hostName == user.UserName)
                {
                    return Result<Unit>.Failure("As a host you cannot update attendance. If you wish to cancel the event go to /activities/cancel");
                }
                if (attendance == null)
                {
                    attendance = new ActivityAttendee
                    {
                        AppUser = user,
                        Activity = activity,
                    };
                    activity.Attendees.Add(attendance);
                }
                else 
                {
                    activity.Attendees.Remove(attendance);
                }
                bool success = await context.SaveChangesAsync() > 0;
                return success ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Problem updating attendance");

            }
        }
    }
}