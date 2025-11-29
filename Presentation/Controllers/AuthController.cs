using Application.User.Commands.Create;
using Application.User.Commands.Login;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.User;

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
            Result<string> result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginUserRequest request,CancellationToken cancellationToken)
        {
            var command = new LoginCommand(
                request.email,
                request.password);
            Result<string> result = await _sender.Send(command, cancellationToken);
            if( result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
    }
}
