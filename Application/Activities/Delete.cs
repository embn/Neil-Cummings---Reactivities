using System;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest<Result<Unit>>
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command, Result<Unit>>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await context.Activities.FindAsync(request.Id);

                if (activity == null)
                    return null;

                context.Activities.Remove(activity);
                var deleted = await context.SaveChangesAsync() > 0;

                if (deleted)
                    return Result<Unit>.Success(Unit.Value);

                return Result<Unit>.Failure("Failed to delete activity");
            }
        }
    }
}