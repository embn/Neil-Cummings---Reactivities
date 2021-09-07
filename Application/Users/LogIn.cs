using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using Identity.Services;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class LogIn
    {
        public class Command : IRequest<Result<UserDto>> 
        { 
            public LoginDto Credentials { get; set; }
        }
        public class Handler : IRequestHandler<Command, Result<UserDto>>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly Identity.SignInManager<AppUser> signInManager;
            private readonly JWT tokenService;

            public Handler(UserManager<AppUser> userManager, Identity.SignInManager<AppUser> signInManager, JWT tokenService) 
            {
                this.userManager = userManager;
                this.signInManager = signInManager;
                this.tokenService = tokenService;
            }

            public async Task<Result<UserDto>> Handle(Command command, CancellationToken cancellationToken)
            {
                var user = await userManager.Users
                    .Include(x => x.Photos)
                    .SingleOrDefaultAsync(x => x.Email == command.Credentials.Email);
                
                if (user == null)
                    return Result<UserDto>.Failure("Login rejected");
                    
                SignInResult result = await signInManager.CheckPasswordSignInAsync(user, command.Credentials.Password, false);

                if (!result.Succeeded)
                    return Result<UserDto>.Failure("Login rejected");

                var userDto = new UserDto
                {
                    DisplayName = user.DisplayName,
                    Token = tokenService.CreateToken(user),
                    UserName = user.UserName,
                };
                return Result<UserDto>.Success(userDto);
            }
        }
    }
}