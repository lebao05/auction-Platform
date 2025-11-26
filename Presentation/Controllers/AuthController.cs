using Application.User.Commands.Create;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts;

namespace Presentation.Controllers
{
    public class AuthController : ApiController
    {
        public AuthController(ISender sender) : base(sender)
        {
            
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterUserRequest request,CancellationToken cancellationToken)
        {
            var command = new RegisterCommand(
                request.fullname,
                request.email,
                request.password);
            Result<Guid> result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return BadRequest(result.Error);
            }
            return new OkResult();
        }
    }
}
