using Application.User.Commands.AcceptSellerRequest;
using Application.User.Commands.ChangePassword;
using Application.User.Commands.UpdateInfo;
using Application.User.Queries.GetProfile;
using Application.User.Queries.GetSellerRequest;
using Application.User.Queries.GetSellerRequestsAsAdmin;
using Domain.Shared;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Presentation.Abstractions;
using Presentation.Contracts.SellerRequest;
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
        [HttpPut("password-change")]
        public async Task<IActionResult> ChangePassword(ChangePasswordRequest request,CancellationToken cancellationToken)
        {
            string userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new ChangePasswordCommand(userId,request.OldPassword,request.NewPassword);
            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok();
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
        [Authorize]
        [HttpPost("request-seller")]
        public async Task<IActionResult> RequestSeller(CancellationToken cancellationToken)
        {
            string userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new Application.User.Commands.RequestSeller.RequestSellerCommand( Guid.Parse(userId) );
            var result = await _sender.Send(command, cancellationToken);
            if( result.IsFailure )
            {
                return HandleFailure(result);
            }
            return Ok();
        }
        [Authorize]
        [HttpGet("request-seller")]
        public async Task<IActionResult> GetSellerRequest(CancellationToken cancellationToken)
        {
            string userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new Application.User.Queries.GetSellerRequest.GetSellerRequestQuery( Guid.Parse(userId) );
            var result = await _sender.Send(command, cancellationToken);
            if( result.IsFailure )
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [Authorize(Roles ="Admin")]
        [HttpGet("request-seller/all")]
        public async Task<IActionResult> GetSellerRequestsAsAdmin([FromQuery] GetSellerRequestAsAdminRequest request,CancellationToken cancellationToken)
        {
            string[] words = string.IsNullOrWhiteSpace(request.query)
                ? Array.Empty<string>()
                : request.query.Split(' ', StringSplitOptions.RemoveEmptyEntries); 
            var query = new GetSellerRequestsAsAdminQuery(words, request.pageNumber, request.createdDecsending);
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure) {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [Authorize(Roles = "Admin")]
        [HttpPut("request-seller/{id}")]
        public async Task<IActionResult> HandleSellerRequest(
            [FromRoute] Guid id,
            [FromQuery] bool isAccepted,
            CancellationToken cancellationToken)
        {
            var command = new HandleSellerCommand(id, isAccepted);
            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
            {
                return HandleFailure(result);
            }

            return Ok();
        }
    }
}
