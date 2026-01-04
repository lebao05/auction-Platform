using Application.User.Commands.Create;
using Application.User.Commands.Login;
using Application.User.Commands.ResetPassword;
using Application.User.Commands.TriggerRestoringPassword;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.User;
using ResetPasswordRequest = Presentation.Contracts.User.ResetPasswordRequest;

namespace Presentation.Controllers
{
    [Route("api/auth")]
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
                request.password,
                request.address);
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
        [HttpPost("forgot-password")]
        public async Task<IActionResult> ForgotPassword(
            [FromBody] ForgotPasswordRequest request,
            CancellationToken cancellationToken)
        {
            var command = new TriggerRestoringPasswordCommand(
                request.Email);

            Result result =
                await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result);
        }
        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword(
              [FromBody] ResetPasswordRequest request,
              CancellationToken cancellationToken)
        {
            var command = new ResetPasswordCommand(
                request.Email,
                request.Otp,
                request.NewPassword);

            Result result =
                await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(new
            {
                message = "Password reset successfully."
            });
        }
    }
}
