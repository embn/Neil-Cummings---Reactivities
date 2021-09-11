using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.context = context;
                this.mapper = mapper;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query query, CancellationToken cancellationToken)
            {

                // Using projection (AutoMapper) eagerly loads related entities as long as they have a mapping profile,
                // And has the added benefit of generating simpler queries than IQbueryable.Include does.
                var activities = await context.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, new { currentUserName = userAccessor.GetUserName() })
                    .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}