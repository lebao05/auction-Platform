using Application.Category.Queries.GetAll;
using Application.SystemSetting.Commands.AdjustSetting;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.SystemSetting;
using RouteAttribute = Microsoft.AspNetCore.Components.RouteAttribute;

namespace Presentation.Controllers
{
    [Route("api/system-setting")]
    public class SystemSettingController : ApiController
    {
        public SystemSettingController(ISender sender) : base(sender)
        {

        }

        [HttpGet]
        [Authorize(Roles = ("Admin"))]
        public async Task<IActionResult> GetAllSystemSettings(CancellationToken cancellationToken)
        {
            var query = new GetAllCategoryQuery();
            var result = await _sender.Send(query,cancellationToken);
            if( result.IsFailure)
                return HandleFailure(result);
            return Ok(result);
        }

        [HttpPut("{systemKey}")]
        [Authorize(Roles = ("Admin"))]
        public async Task<IActionResult> SetUpSystemSettings([FromRoute] string systemKey,
            [FromBody] SetUpSystemSettingsRequest request
            ,CancellationToken cancellationToken
            )
        {
            var command = new AdjustSettingCommand(systemKey, request.Value);
            var result = await _sender.Send(command,cancellationToken);
            if( result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }

    }
}
