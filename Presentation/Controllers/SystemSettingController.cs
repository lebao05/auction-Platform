using Application.Category.Queries.GetAll;
using Application.SystemSetting.Commands.AdjustSetting;
using Application.SystemSetting.Queries.GetAllSettings;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;
using Presentation.Contracts.SystemSetting;

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
            var query = new GetAllSettingsQuery();
            var result = await _sender.Send(query,cancellationToken);
            if( result.IsFailure)
                return HandleFailure(result);
            return Ok(result.Value);
        }

        [HttpPut]
        [Authorize(Roles = ("Admin"))]
        public async Task<IActionResult> SetUpSystemSettings(
            [FromBody] SetUpSystemSettingsRequest request
            ,CancellationToken cancellationToken
            )
        {
            var command = new AdjustSettingCommand(request.systemKey, request.systemValue);
            var result = await _sender.Send(command,cancellationToken);
            if( result.IsFailure)
                return HandleFailure(result);
            return Ok();
        }

    }
}
