using Application.Abstractions;
using Application.Product.Commands.AddRating;
using Application.Product.Commands.CancelOrder;
using Application.Product.Commands.ConfirmOrderStatus;
using Application.Product.Commands.UpdatePaymentPhaseOfOrder;
using Application.Product.Commands.UpdateShippingPhaseOfOrder;
using Application.Product.Queries.GetOrder;
using Domain.Entities;
using Domain.Shared;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Order;
using Presentation.Contracts.Rating;

namespace Presentation.Controllers
{
    [Route("api/order")]
    [Authorize]
    public class OrderController : ApiController
    {
        private readonly IWebHostEnvironment _env;
        private readonly IFileStorageService _fileStorageService;
        public OrderController(ISender sender
            , IWebHostEnvironment env
            , IFileStorageService fileStorageService
            ) : base(sender)
        {
            _env = env;
            _fileStorageService = fileStorageService;
        }
        [HttpGet("{ProductId}")]
        public async Task<IActionResult> GetOrder(Guid ProductId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetOrderQuery(Guid.Parse(userId), ProductId);
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpPut("payment/{productId}")]
        public async Task<IActionResult> UpdatePaymentPhase(
          Guid productId,
          [FromForm] UpdatePaymentPhaseRequest request,
          CancellationToken cancellationToken)
        {
            try
            {
                var userId = ClaimsPrincipalExtensions.GetUserId(User);
                string? paymentUrl = null;

                if (request.PaymentImage is not null)
                {
                    var fileName =
                        $"payments/{productId}_{Guid.NewGuid()}{Path.GetExtension(request.PaymentImage.FileName)}";

                    await using var stream = request.PaymentImage.OpenReadStream();

                    paymentUrl = await _fileStorageService.UploadFileAsync(
                        stream,
                        fileName,
                        cancellationToken);
                }

                var command = new UpdatePaymentPhaseOfOrderCommand(
                    Guid.Parse(userId),
                    productId,
                    request.Address,
                    request.PhoneNumber,
                    paymentUrl
                );

                var result = await _sender.Send(command, cancellationToken);

                if (result.IsFailure)
                    return HandleFailure(result);

                return Ok();
            }
            catch (Exception)
            {
                return HandleFailure(
                    Result.Failure(
                        new Error(
                            "Payment.UploadingFailed",
                            "Uploading payment image failed")));
            }
        }
        [HttpDelete("{ProductId}")]
        public async Task<IActionResult> CancelOrder(Guid ProductId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new CancelOrderCommand(Guid.Parse(userId), ProductId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure) return HandleFailure(result);
            return Ok();
        }
        [HttpPut("confirm-status/{ProductId}")]
        public async Task<IActionResult> ConfirmOrderStatus(Guid ProductId, [FromBody] ConfirmOrderStatusRequest request, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new ConfirmOrderStatusCommand(Guid.Parse(userId), ProductId, request.OrderStatus);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure) return HandleFailure(result);
            return Ok();
        }
        [HttpPut("shipping/{productId}")]
        public async Task<IActionResult> UpdateShippingPhase(
          Guid productId,
          [FromForm] UpdateShippingPhaseRequest request,
          CancellationToken cancellationToken)
        {
            try
            {
                var userId = ClaimsPrincipalExtensions.GetUserId(User);
                string? shippingUrl = null;

                var fileName =
                    $"shippings/{productId}_{Guid.NewGuid()}{Path.GetExtension(request.ShippingInvoiceImage.FileName)}";
                await using var stream = request.ShippingInvoiceImage.OpenReadStream();
                shippingUrl = await _fileStorageService.UploadFileAsync(
                    stream,
                    fileName,
                    cancellationToken);

                var command = new UpdateShippingPhaseOfOrderCommand(
                    Guid.Parse(userId),
                    productId,
                    shippingUrl
                );
                var result = await _sender.Send(command, cancellationToken);
                if (result.IsFailure)
                    return HandleFailure(result);
                return Ok();
            }
            catch (Exception)
            {
                return HandleFailure(
                    Result.Failure(
                        new Error(
                            "Shipping.UploadingFailed",
                            "Uploading shipping image failed")));
            }
        }
        [HttpPost("rate/{ProductId}")]
        public async Task<IActionResult> AddRatingToOrder(Guid ProductId, [FromBody] AddRatingRequest request, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new AddRatingCommand(
                Userid:Guid.Parse(userId),
                ProductId:ProductId,
                RatingType:request.RatingType,
                Comment:request.Comment);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure) return HandleFailure(result);
            return Ok();
        }
        [HttpPut("rate/{RatingId}")]
        public async Task<IActionResult> UpdateRatingOfOrder(Guid RatingId, [FromBody] UpdateRatingRequest request, CancellationToken cancellationToken)
        {
            var userid = Guid.Parse(ClaimsPrincipalExtensions.GetUserId(User));
            var command = new Application.Product.Commands.UpdateRating.UpdateRatingCommand(
                UserId: userid,
                RatingId: RatingId,
                RatingType: request.RatingType,
                Comment: request.Comment);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure) return HandleFailure(result);
            return Ok();
        }
    }

}
