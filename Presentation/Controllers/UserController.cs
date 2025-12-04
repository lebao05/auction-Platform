using Application.User.Commands.UpdateInfo;
using Application.User.Queries.GetProfile;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Presentation.Abstractions;
using Presentation.Contracts.User;

namespace Presentation.Controllers
{
    [Route("api/user")]
    public class UserController : ApiController
    {
        private readonly ILogger<UserController> _logger;
        public UserController(ISender sender,ILogger<UserController> logger) : base(sender)
        {
            _logger = logger;
        }
        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile(CancellationToken cancellationToken)
        {
            string userId = ClaimsPrincipalExtensions.GetUserId(User);

            var command = new GetProfileCommand(Guid.Parse(userId));
            var result =  await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [Authorize]
        [HttpGet("{userId}")]
        public async Task<IActionResult> GetUserById([FromRoute] Guid userId,CancellationToken cancellationToken)
        {
            var command = new GetProfileCommand(userId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [Authorize]
        [HttpPut]
        public async Task<IActionResult> UpdateInfo([FromBody] UpdateInfoRequest rq,CancellationToken cancellation)
        {
            string userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new UpdateInfoCommand(Guid.Parse(userId), rq.FullName, rq.Email, rq.PhoneNumber, rq.DateOfBirth, rq.Address, rq.AvatarUrl);
            var result = await _sender.Send(command, cancellation);
            if( result.IsFailure )
            {
                return HandleFailure(result);
            }
            return Ok();
        }
    }
}
