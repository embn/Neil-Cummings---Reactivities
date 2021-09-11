using System;
using System.Collections.Generic;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using Domain;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    //This class exists only to demonstrate a long running task
    public class CancelleableListTest
    {
        public class Query : IRequest<Result<List<ActivityDto>>> { }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private readonly DataContext context;
            private readonly ILogger<CancelleableListTest> logger;
            private readonly IMapper mapper;
            private readonly IUserAccessor userAccessor;

            public Handler(DataContext context, IMapper mapper, ILogger<CancelleableListTest> logger, IUserAccessor userAccessor)
            {
                this.mapper = mapper;
                this.context = context;
                this.logger = logger;
                this.userAccessor = userAccessor;
            }

            public async Task<Result<List<ActivityDto>>> Handle(Query query, CancellationToken cancellationToken)
            {

                try
                {
                    for (int i = 0; i < 10; i++)
                    {
                        cancellationToken.ThrowIfCancellationRequested();
                        await Task.Delay(1000, cancellationToken);
                        logger.LogInformation($"Task {i} has completed");
                    }
                }
                catch (Exception ex) when (ex is TaskCanceledException)
                {
                    logger.LogInformation("Task was cancelled.");
                }
                var activities = await context.Activities
                    .ProjectTo<ActivityDto>(mapper.ConfigurationProvider, new { currentUserName = userAccessor.GetUserName() })
                    .ToListAsync(cancellationToken);

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}