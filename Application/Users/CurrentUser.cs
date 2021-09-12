using System.Linq;
using System.Security.Claims;
using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using Identity;
using Identity.Services;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class CurrentUser
    {
        public class Query : IRequest<Result<UserDto>> { }
        public class Handler : IRequestHandler<Query, Result<UserDto>>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly IHttpContextAccessor httpContextAccessor;
            private readonly TokenService tokenService;

            public Handler(UserManager<AppUser> userManager, TokenService tokenService, IHttpContextAccessor httpContextAccessor)
            {
                this.userManager = userManager;
                this.httpContextAccessor = httpContextAccessor;
                this.tokenService = tokenService;
            }

            public async Task<Result<UserDto>> Handle(Query query, CancellationToken cancellationToken)
            {
                var user = await userManager.Users
                    .Include(x => x.Photos.Where(x => x.IsMain))
                    .FirstOrDefaultAsync(x => x.UserName == httpContextAccessor.HttpContext.User.Identity.Name);
                    
                if (user == null)
                    return null;

                var userDto = new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = tokenService.CreateToken(user),
                    UserName = user.UserName,
                    Image = user.Photos.FirstOrDefault(x => x.IsMain)?.Url
                };

                return Result<UserDto>.Success(userDto);
            }
        }
    }
}