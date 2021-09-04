using System.Linq;
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
    public class AccountController : ControllerBase
    {
        private readonly UserManager<AppUser> userManager;
        private readonly SignInManager<AppUser> signInManager;
        private readonly TokenService tokenService;

        private UserDto createUserObject(AppUser user) {
            return new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user.Photos?.FirstOrDefault(x => x.IsMain)?.Url,
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
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Login(Login login)
        {
            var user = await userManager.Users
                .Include(x => x.Photos)
                .SingleOrDefaultAsync(x => x.Email == login.Email);
            if (user == null) 
                return Unauthorized();

            var result = await signInManager.CheckPasswordSignInAsync(user, login.Password, false);

            if (result.Succeeded)
                return createUserObject(user);

            return Unauthorized();
        }
        [HttpPost("register")]
        [AllowAnonymous]
        public async Task<ActionResult<UserDto>> Register(Registration registration) 
        {
            if (await userManager.Users.AnyAsync(x => x.Email == registration.Email))
            {
                ModelState.AddModelError("Email", "Email taken");
                return ValidationProblem();
            }
                
            if (await userManager.Users.AnyAsync(x => x.UserName == registration.UserName))
            {
                ModelState.AddModelError("UserName", "UserName taken");
                return ValidationProblem();
            }
                

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
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await userManager.FindByEmailAsync(User.FindFirstValue(ClaimTypes.Email));
            return createUserObject(user);
        }
    }
}