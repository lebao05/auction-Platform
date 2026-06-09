using Application.User.Commands.Create;
using Application.User.Commands.Login;
using Application.User.Commands.ResetPassword;
using Application.User.Commands.TriggerRestoringPassword;
using Domain.Shared;
using MediatR;
using Microsoft.AspNetCore.Identity.Data;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Presentation.Abstractions;
using Presentation.Contracts.User;
using System.Net.Http;
using System.Text.Json;
using ResetPasswordRequest = Presentation.Contracts.User.ResetPasswordRequest;

namespace Presentation.Controllers
{
    [Route("api/auth")]
    public class AuthController : ApiController
    {
        private readonly IConfiguration _configuration;
        private readonly IHttpClientFactory _httpClientFactory;

        public AuthController(
            ISender sender,
            IConfiguration configuration,
            IHttpClientFactory httpClientFactory
        ) : base(sender)
        {
            _configuration = configuration;
            _httpClientFactory = httpClientFactory;
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(
            [FromBody] RegisterUserRequest request,
            CancellationToken cancellationToken)
        {
            var isHuman = await VerifyRecaptchaAsync(request.recaptchaToken);
            if (!isHuman)
            {
                return BadRequest("reCAPTCHA verification failed");
            }

            var command = new RegisterCommand(
                request.fullname,
                request.email,
                request.password,
                request.address);

            Result<string> result =
                await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

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

        private async Task<bool> VerifyRecaptchaAsync(string token)
        {
            var secretKey = _configuration["Recaptcha:SecretKey"];
            if (string.IsNullOrWhiteSpace(token))
                return false;

            var client = _httpClientFactory.CreateClient();

            var response = await client.PostAsync(
                "https://www.google.com/recaptcha/api/siteverify",
                new FormUrlEncodedContent(new Dictionary<string, string>
                {
                    ["secret"] = secretKey!,
                    ["response"] = token
                })
            );

            var json = await response.Content.ReadAsStringAsync();
            if (json == null) return false;
            var result = JsonSerializer.Deserialize<RecaptchaResponse>(json);

            return result?.success == true;
        }

        private sealed class RecaptchaResponse
        {
            public bool success { get; set; }
        }

    }
}
