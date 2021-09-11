using System;
using System.Linq;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Comments
{
    public class Create
    {
        public class Command : IRequest<Result<CommentDto>>
        {
            public Guid ActivityId { get; set; }
            public string Body { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator()
            {
                RuleFor(x => x.Body).NotEmpty();
                RuleFor(x => x.ActivityId).NotEmpty();
            }
        }
        public class Handler : IRequestHandler<Command, Result<CommentDto>>
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
            public async Task<Result<CommentDto>> Handle(Command cmd, CancellationToken cancellationToken)
            {
                Activity activity = await context.Activities.FindAsync(cmd.ActivityId);

                if (activity == null)
                    return null;

                string userName = userAccessor.GetUserName();
                AppUser user = await context.Users
                    .Include(x => x.Photos.Where(x => x.IsMain))
                    .FirstOrDefaultAsync(x => x.UserName == userName);

                if (user == null)
                {
                    return Result<CommentDto>.Failure("Failed to get user");
                }

                var comment = new Comment
                {
                    Author = user,
                    Activity = activity,
                    Body = cmd.Body
                };
                activity.Comments.Add(comment);

                bool added = await context.SaveChangesAsync() > 0;

                if (added)
                {
                    return Result<CommentDto>.Success(mapper.Map<CommentDto>(comment));
                }
                return Result<CommentDto>.Failure("Failed to add comment");
            }
        }
    }
}