using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.UserProfiles
{
public class Details
    {
        public class Query : IRequest<Result<Profile>>
        {
            public string UserName { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<Profile>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                this.context = context;
                this.mapper = mapper;
            }

            public async Task<Result<Profile>> Handle(Query query, CancellationToken cancellationToken)
            {
                Profile profile = await context.Users
                    .ProjectTo<Profile>(mapper.ConfigurationProvider)
                    .SingleOrDefaultAsync(x => x.UserName == query.UserName);
                
                return Result<Profile>.Success(profile);
            }
        }
    }
}