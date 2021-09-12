using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace Identity
{
    public class SignInManager<T> : Microsoft.AspNetCore.Identity.SignInManager<T> where T : class
    {
        public SignInManager(Microsoft.AspNetCore.Identity.UserManager<T> userManager, IHttpContextAccessor contextAccessor, IUserClaimsPrincipalFactory<T> claimsFactory, IOptions<IdentityOptions> optionsAccessor, ILogger<Microsoft.AspNetCore.Identity.SignInManager<T>> logger, IAuthenticationSchemeProvider schemes, IUserConfirmation<T> confirmation) : base(userManager, contextAccessor, claimsFactory, optionsAccessor, logger, schemes, confirmation)
        {
        }
    }
}