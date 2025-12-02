using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;

namespace Presentation.Controllers
{
    public class UserController : ApiController
    {
        public UserController(ISender sender) : base(sender)
        {
            
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            string userId = User.FindFirst("userId")!.Value;
            var command = new Application.User.Queries.GetProfile.GetProfileCommand(Guid.Parse(userId));
            var result =  await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }

    }
}
