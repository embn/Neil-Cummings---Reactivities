using System.Collections.Generic;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Followers
{
    public class List
    {
        public class Query : IRequest<Result<List<UserProfiles.Profile>>>
        {
            public string Predicate { get; set; }
            public string UserName { get; set; }
        }
        public class Handler : IRequestHandler<Query, Result<List<UserProfiles.Profile>>>
        {
            private readonly DataContext context;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, IUserAccessor userAccessor)
            {
                this.userAccessor = userAccessor;
                this.context = context;
                this.mapper = mapper;
            }
            public async Task<Result<List<UserProfiles.Profile>>> Handle(Query request, CancellationToken cancellationToken)
            {
                var profiles = new List<UserProfiles.Profile>();
                
                switch (request.Predicate.ToLower())
                {
                    //in any case we pass current userName to ProjectTo in order to check set following flag.
                    case "followers":
                        profiles = await context.UserFollowings
                            .Where(x => x.Target.UserName == request.UserName)
                            .Select(x => x.Observer)
                            .ProjectTo<UserProfiles.Profile>(mapper.ConfigurationProvider, new { currentUserName = userAccessor.GetUserName() })
                            .ToListAsync();
                        break;
                    case "following":
                        profiles = await context.UserFollowings
                            .Where(x => x.Observer.UserName == request.UserName)
                            .Select(x => x.Target)
                            .ProjectTo<UserProfiles.Profile>(mapper.ConfigurationProvider, new { currentUserName = userAccessor.GetUserName() })
                            .ToListAsync();
                        break;
                    default:
                        return Result<List<UserProfiles.Profile>>.Failure("Failed to fetch list. Predicate must be: 'followers' or 'following'");
                }
                return Result<List<UserProfiles.Profile>>.Success(profiles);
            }
        }

    }
}