using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.UserProfiles
{
    public class Edit
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string DisplayName { get; set; }
            public string Bio { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.DisplayName).NotEmpty();
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
            public async Task<Result<Unit>> Handle(Command cmd, CancellationToken cancellationToken)
            {
                //will return Failure if values are the same as before 
                //if we wanted to return success in that case we would need:
                //context.Entry(user).State = EntityState.Modified;

                var user = await context.Users.FirstOrDefaultAsync(x => x.UserName == userAccessor.GetUserName());
                
                if (user == null)
                    return null;

                if (string.IsNullOrEmpty(user.DisplayName))
                    return Result<Unit>.Failure("DisplayName is required");

                user.DisplayName = cmd.DisplayName ?? user.DisplayName;
                user.Bio = cmd.Bio ?? user.Bio;


                bool updated = await context.SaveChangesAsync() > 0;

                if (updated)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to update user");

            }
        }
    }
}