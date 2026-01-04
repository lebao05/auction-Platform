using Application.Product.Commands.AddComment;
using Application.Product.Commands.AddDescription;
using Application.Product.Commands.AddToBlackList;
using Application.Product.Commands.AddToWatchList;
using Application.Product.Commands.CreateProduct;
using Application.Product.Commands.DeleteFromBlackList;
using Application.Product.Commands.DeleteFromWatchList;
using Application.Product.Commands.PlaceBid;
using Application.Product.Commands.UpdateComment;
using Application.Product.Queries.GetProductDetails;
using Application.Product.Queries.GetProductsForSeller;
using Application.Product.Queries.GetProductsOfAUser;
using Application.Product.Queries.GetRatings;
using Application.Product.Queries.GetTopBiddingCountProducts;
using Application.Product.Queries.GetTopSoonProducts;
using Application.Product.Queries.GetTopValueProducts;
using Application.Product.Queries.GetWachtList;
using Application.Product.Queries.SearchProducts;
using Domain.Shared;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Product;
using System.Threading;
namespace Presentation.Controllers
{
    [Route("api/product")]
    public class ProductController : ApiController
    {
        private readonly IWebHostEnvironment _env;

        public ProductController(ISender sender, IWebHostEnvironment env) : base(sender)
        {
            _env = env;
        }

        [HttpPost]
        [Authorize(Roles = "Seller")]
        public async Task<IActionResult> CreateProduct([FromForm] CreateProductRequest rq, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            if (rq.Images == null || rq.Images.Count < 3)
                return BadRequest("A product must have at least 3 images.");

            var localPaths = new List<string>();
            string uploadFolder = Path.Combine(_env.WebRootPath, "uploads", "products");

            if (!Directory.Exists(uploadFolder))
                Directory.CreateDirectory(uploadFolder);

            foreach (var file in rq.Images)
            {
                if (file.Length <= 0) continue;

                var fileName = $"{Guid.NewGuid()}{Path.GetExtension(file.FileName)}";
                var filePath = Path.Combine(uploadFolder, fileName);

                await using var stream = new FileStream(filePath, FileMode.Create);
                await file.CopyToAsync(stream, cancellationToken);

                localPaths.Add(filePath);
            }

            var command = new CreateProductCommand(
                userId: Guid.Parse(userId),
                Name: rq.Name,
                BuyNowPrice: rq.BuyNowPrice,
                StartPrice: rq.StartPrice,
                Description: rq.Description,
                StepPrice: rq.StepPrice,
                IsAutoRenewal: rq.IsAutoRenewal,
                AllowAll: rq.AllowAll,
                Hours: rq.Hours,
                CategoryId: rq.CategoryId,
                ImagePaths: localPaths,
                mainIndex: rq.MainIndex
            );

            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize(Roles = ("Seller"))]
        [HttpGet("seller")]
        public async Task<IActionResult> GetProductsForSeller(CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetProductsForSellerQuery(Guid.Parse(userId));
            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpGet("{productId}")]
        public async Task<IActionResult> GetProductDetails([FromRoute] Guid productId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetProductDetailsQuery(userId == string.Empty ? null : Guid.Parse(userId), productId);
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpPost("place/{productId}")]
        public async Task<IActionResult> PlaceBid([FromRoute] Guid productId, [FromBody] PlaceBidRequest request, CancellationToken cancellationToken)
        {
            var userid = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new PlaceBidCommand(Guid.Parse(userid), productId, request.MaxBidAmount);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpPost("blacklist")]
        [Authorize]
        public async Task<IActionResult> AddToBlackList([FromBody] AddToBlackListRequest request
            , CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new AddToBlackListCommand(Guid.Parse(userId), request.BidderId, request.ProductId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpDelete("blacklist/{blacklistId}")]
        [Authorize]
        public async Task<IActionResult> DeleteFromBLackList([FromRoute] Guid blacklistId, CancellationToken
            cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new DeleteFromBlackListCommand(blacklistId, Guid.Parse(userId));
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpPost("watchlist/{productId}")]
        [Authorize]
        public async Task<IActionResult> AddToWatchList([FromRoute] Guid productId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new AddToWatchListCommand(Guid.Parse(userId), productId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpDelete("watchlist/{id}")]
        [Authorize]
        public async Task<IActionResult> DeleteItemFromWatchList([FromRoute] Guid id, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new DeleteFromWatchListCommand(Guid.Parse(userId), id);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpGet("watchlist")]
        [Authorize]
        public async Task<IActionResult> GetWatchList(CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetWatchListQuery(Guid.Parse(userId));
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpPut("description")]
        [Authorize]
        public async Task<IActionResult> AddDescription([FromBody] AddDescriptionRequest request, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new AddDescriptionCommand(Guid.Parse(userId), request.productId, request.description);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpGet("top-count")]
        public async Task<IActionResult> GetTopBiddingCountProducts(
            [FromQuery] int pageIndex = 1,
            CancellationToken cancellationToken = default)
        {
            int pageSize = 8;
            var query = new GetTopBiddingCountProductsQuery(
                pageIndex,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [HttpGet("top-soon")]
        public async Task<IActionResult> GetTopSoonProducts(
            [FromQuery] int pageIndex = 1,
            CancellationToken cancellationToken = default)
        {
            int pageSize = 8;
            var query = new GetTopSoonProductsQuery(
                pageIndex,
                pageSize);

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [HttpGet("top-value")]
        public async Task<IActionResult> GetTopBiddingProducts(
            [FromQuery] int pageIndex = 1, CancellationToken cancellationToken = default)
        {
            int pageSize = 8;
            var query = new GetTopValueProductsQuery(pageIndex, pageSize);

            Result<List<GetTopProductsDto>> result = await _sender.Send(query);

            if (result.IsSuccess)
            {
                return Ok(result.Value);
            }

            return BadRequest(result.Error);
        }
        [HttpGet("search")]
        public async Task<IActionResult> SearchProducts(
            [FromQuery] string? searchTerm,
            [FromQuery] Guid? categoryId,
            [FromQuery] int pageIndex = 1,
            [FromQuery] string? sortBy = "endingsoon",
            CancellationToken cancellationToken = default)
        {
            int pageSize = 8;
            var query = new SearchProductsQuery(
                SearchTerm: searchTerm,
                CategoryId: categoryId,
                PageIndex: pageIndex,
                PageSize: pageSize,
                SortBy: sortBy
            );

            var result = await _sender.Send(query, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpPost("comment")]
        public async Task<IActionResult> PostComment([FromBody] AddCommentRequest request, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new AddCommentCommand(Guid.Parse(userId), request.ParentId, request.ProductId, request.Content);
            var result = await _sender.Send(command, cancellationToken);

            if (result.IsFailure)
                return HandleFailure(result);

            return Ok(result.Value);
        }
        [Authorize]
        [HttpPut("comment")]
        public async Task<IActionResult> EditComment([FromBody] UpdateCommentRequest request, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var command = new UpdateCommentCommand(Guid.Parse(userId), request.CommentId, request.Content);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }
        [HttpGet("products-user/{UserId}")]
        public async Task<IActionResult> GetProductsUser([FromRoute] Guid UserId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetProductOfAUserQuery(userId != "" ? Guid.Parse(userId) : null, UserId);
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
        [HttpGet("rating/user/{UserId}")]
        public async Task<IActionResult> GetRatingsOfAUser([FromRoute] Guid UserId, CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetRatingsQuery(UserId, userId != "" ? Guid.Parse(userId) : null);
            var result = await _sender.Send(query, cancellationToken);
            if (result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }
    }
}
