using System.Threading.Tasks;
using Application.UserProfiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfileController : BaseApiController
    {
        [HttpGet("{userName}")]
        public async Task<IActionResult> GetProfile(string userName)
        {
            return HandleResult(await Mediator.Send(new Details.Query { UserName = userName }));
        }
        [HttpPut]
         public async Task<IActionResult> UpdateProfile(Edit.Command command)
         {
             return HandleResult(await Mediator.Send(command));
         }
    }
}