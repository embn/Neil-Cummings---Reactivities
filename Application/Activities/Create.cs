using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class Create
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Activity Activity { get; set; }
        }

        public class CommandValidator : AbstractValidator<Command> 
        {
            public CommandValidator()
            {
                RuleFor(x => x.Activity).SetValidator(new ActivityValidator());

            }
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
                AppUser user = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());

                var attendee = new ActivityAttendee
                {
                    AppUser = user,
                    Activity = command.Activity,
                    IsHost = true
                };
                command.Activity.Attendees.Add(attendee);
                
                //Unnecessary to use AddAsync 
                context.Activities.Add(command.Activity);

                bool created = await context.SaveChangesAsync() > 0;

                //Returning Unit.Value is just to report success

                return (created) ? Result<Unit>.Success(Unit.Value) : Result<Unit>.Failure("Failed to create activity");
            }
        }
    }
}