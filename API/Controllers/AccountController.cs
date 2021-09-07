using System.Threading.Tasks;
using Application.Users;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class AccountController : BaseApiController
    {

        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register(RegisterUserDto registration) 
        {
            var result = await Mediator.Send(new RegisterNewUser.Command { Registration = registration });

            if (result.IsSuccess)
            {
                return result.Value;
            }
            if (result.Error == "EmailTaken")
            {
                ModelState.AddModelError("Email", "Email taken");
                return ValidationProblem();
            } 
            if (result.Error == "UserNameTaken")
            {
                ModelState.AddModelError("UserName", "Username taken");
                return ValidationProblem();
            }
            return BadRequest("An unknown error occoured. Please contact your administrator.");
        }
        [HttpPost("login")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Login(LoginDto login)
        {
            var result = await Mediator.Send(new LogIn.Command { Credentials = login });
            if (result.IsSuccess)
                return result.Value;
            return Unauthorized();
        }
        [HttpGet]
        public async Task<IActionResult> GetCurrentUser()
        {
            return HandleResult(await Mediator.Send(new CurrentUser.Query()));
        }
    }
}