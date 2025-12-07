using Application.Product.Commands.CreateProduct;
using Application.Product.Queries.GetProductsForSeller;
using Infraestructure.Extensions;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Product;
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
        [Authorize(Roles =("Seller"))]
        [HttpGet("seller")]
        public async Task<IActionResult> GetProductsForSeller(CancellationToken cancellationToken)
        {
            var userId = ClaimsPrincipalExtensions.GetUserId(User);
            var query = new GetProductsForSellerQuery(Guid.Parse(userId));
            var result = await _sender.Send(query, cancellationToken);

            if( result.IsFailure )
                return HandleFailure(result);
            return Ok(result.Value);
        }
    }
}
