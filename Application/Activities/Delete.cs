using System;
using System.Threading;
using System.Threading.Tasks;
using Domain;
using MediatR;
using Persistence;

namespace Application.Activities
{
    public class Delete
    {
        public class Command : IRequest
        {
            public Guid Id { get; set; }
        }

        public class Handler : IRequestHandler<Command>
        {
            private readonly DataContext context;

            public Handler(DataContext context)
            {
                this.context = context;
            }

            public async Task<Unit> Handle(Command request, CancellationToken cancellationToken)
            {
                Activity activity = await context.Activities.FindAsync(request.Id);

                //TODO: null check activity
                context.Activities.Remove(activity);

                await context.SaveChangesAsync();

                return Unit.Value;
            }
        }
    }
}