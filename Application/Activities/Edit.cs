using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Edit
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
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<Unit>> Handle(Command command, CancellationToken cancellationToken)
            {
                Activity activity = await context.Activities.FindAsync(command.Activity.Id);

                if (activity == null) 
                    return null;

                mapper.Map(command.Activity, activity);
                bool success = await context.SaveChangesAsync() > 0;

                if (success) 
                    return Result<Unit>.Success(Unit.Value);
                return Result<Unit>.Failure("Failed to edit activity");
            }
        }
    }
}