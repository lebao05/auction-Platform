using Domain.Entities;
using MediatR;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Presentation.Abstractions;

namespace Presentation.Controllers
{
    [Microsoft.AspNetCore.Components.Route("api/test")]
    public class TestController : ApiController
    {
        private UserManager<AppUser> _userManager;
        public TestController(ISender sender,UserManager<AppUser> userManager) : base(sender)
        {
            _userManager = userManager;
        }

    [HttpPut("assign-admin")]
        public async Task<IActionResult> AssignAdmin([FromBody] Guid userId)
        {
            // Find the user by Id
            var user = await _userManager.FindByIdAsync(userId.ToString());
            if (user == null)
            {
                return NotFound(new { message = "User not found." });
            }

            // Check if user is already an admin
            if (await _userManager.IsInRoleAsync(user, "Admin"))
            {
                return BadRequest(new { message = "User is already an admin." });
            }

            // Assign Admin role
            var result = await _userManager.AddToRoleAsync(user, "Admin");
            if (!result.Succeeded)
            {
                return StatusCode(500, new { message = "Failed to assign admin role.", errors = result.Errors });
            }

            return Ok(new { message = "User assigned as admin successfully." });
        }
    }
}
