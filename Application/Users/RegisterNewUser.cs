using System.Threading;
using System.Threading.Tasks;
using Application.Core;
using Domain;
using FluentValidation;
using Identity;
using Identity.Services;
using MediatR;
using Microsoft.EntityFrameworkCore;

namespace Application.Users
{
    public class RegisterNewUser
    {
        public class Command : IRequest<Result<UserDto>>
        {
            public RegisterUserDto Registration { get; set; }
        }
        public class CommandValidator : AbstractValidator<Command>
        {
            public CommandValidator(UserValidator userValidator)
            {
                RuleFor(x => x.Registration).SetValidator(userValidator);
            }
        }
        public class Handler : IRequestHandler<Command, Result<UserDto>>
        {
            private readonly UserManager<AppUser> userManager;
            private readonly JWT tokenService;

            public Handler(UserManager<AppUser> userManager, JWT tokenService)
            {
                this.userManager = userManager;
                this.tokenService = tokenService;
            }

            public async Task<Result<UserDto>> Handle(Command command, CancellationToken cancellationToken)
            {
                if (await userManager.Users.AnyAsync(x => x.Email == command.Registration.Email))
                {
                    return Result<UserDto>.Failure("EmailTaken");
                }
                if (await userManager.Users.AnyAsync(x => x.UserName == command.Registration.UserName))
                {
                    return Result<UserDto>.Failure("UserNameTaken");
                }

                var user = new AppUser
                {
                    DisplayName = command.Registration.DisplayName,
                    Email = command.Registration.Email,
                    UserName = command.Registration.UserName,
                };

                var result = await userManager.CreateAsync(user, command.Registration.Password);

                if (result.Succeeded)
                {
                    UserDto userDto = new UserDto
                    {
                        DisplayName = user.DisplayName,
                        Token = tokenService.CreateToken(user),
                        UserName = user.UserName,
                    };
                    return Result<UserDto>.Success(userDto);
                }
                return Result<UserDto>.Failure(null);
            }
        }
    }
}