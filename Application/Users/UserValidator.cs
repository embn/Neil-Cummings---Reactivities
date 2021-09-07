using Application.Validation;
using FluentValidation;
using Microsoft.Extensions.Options;

namespace Application.Users
{
    public class UserValidator : AbstractValidator<RegisterUserDto>
    {
        public UserValidator(IOptions<PasswordRequirements> settings)
        {
            RuleFor(x => x.DisplayName).NotEmpty();
            
            RuleFor(x => x.Email).NotEmpty().EmailAddress();

            RuleFor(x => x.Password)
                .NotEmpty()
                .MinimumLength(settings.Value.RequiredLength)
                .MinimumUniqueCharacters(settings.Value.RequiredUniqueChars)
                    .WithMessage($"Password must contain at least {settings.Value.RequiredUniqueChars} unique characters");

            RuleFor(x => x.UserName).NotEmpty();
            
        }
    }
}