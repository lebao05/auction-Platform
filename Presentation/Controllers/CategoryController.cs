using Application.Category.Commands.Create;
using Application.Category.Commands.Delete;
using Application.Category.Commands.Update;
using Application.Category.Queries.GetAll;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.Category;
namespace Presentation.Controllers
{
    [Route("api/category")]
    public class CategoryController : ApiController
    {
        public CategoryController(ISender sender) : base(sender)
        {
        }
        [HttpPost]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategory([FromBody] CreateCategoryRequest rq, CancellationToken cancellationToken)
        {
            var command = new CreateCategoryCommand(rq.Name, rq.ParentId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [Authorize(Roles = "Admin")]
        [HttpGet]
        public async Task<IActionResult> GetAllCategory(CancellationToken cancellationToken)
        {
            var command = new GetAllCategoryQuery();
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok(result.Value);
        }
        [HttpPut("{categoryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> UpdateCategory([FromRoute] Guid categoryId, [FromBody] UpdateCategoryRequest rq, CancellationToken cancellationToken)
        {
            var command = new UpdateCategoryCommand(categoryId,rq.Name,rq.ParentId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok();
        }
        [HttpDelete("{categoryId}")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> DeleteCategory([FromRoute] Guid categoryId, CancellationToken cancellationToken)
        {
            var command = new DeleteCategoryCommand(categoryId);
            var result = await _sender.Send(command, cancellationToken);
            if (result.IsFailure)
            {
                return HandleFailure(result);
            }
            return Ok();
        }
    }
}
