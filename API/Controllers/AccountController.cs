using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [AllowAnonymous]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;

        private User createUserObject(AppUser user) {
            return new User
            {
                DisplayName = user.DisplayName,
                Image = null,
                Token = tokenService.CreateToken(user),
                UserName = user.UserName,
            };
        }
        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService)
        {
            this.userManager = userManager;
            this.signInManager = signInManager;
            this.tokenService = tokenService;
        }
        [HttpPost("login")]
        public async Task<ActionResult<User>> Login(Login login)
        {
            var user = await userManager.FindByEmailAsync(login.Email);
            if (user == null) 
                return Unauthorized();

            var result = await signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (result.Succeeded)
                return createUserObject(user);

            return Unauthorized();
        }
        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(Registration registration) 
        {
            if (await userManager.Users.AnyAsync(x => x.Email == registration.Email))
                return BadRequest("Email taken");
            if (await userManager.Users.AnyAsync(x => x.UserName == registration.UserName))
                return BadRequest("UserName taken");

            var user = new AppUser
            {
                DisplayName = registration.DisplayName,
                Email = registration.Email,
                UserName = registration.UserName,
            };

            var result = await userManager.CreateAsync(user, registration.Password);

            if (result.Succeeded)
                return createUserObject(user);

            return BadRequest("Problem registering user");
        }
        [HttpGet()]
        [Authorize]
        public async Task<ActionResult<User>> GetCurrentUser()
        {
            var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return createUserObject(user);
        }
    }
}