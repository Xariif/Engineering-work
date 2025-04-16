using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Models.Access.Request;
using backend.Models.Access.Response;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class AccessController : ControllerBase
{
    private readonly AccessService _accessService;

    public AccessController(AccessService accessService)
    {
        _accessService = accessService;
    }

    [HttpGet]
    [Authorize(Roles = "Manager")]
    public IActionResult GetAllAccesses()
    {
        var accessData = _accessService.GetAccessData();
        return Ok(accessData);
    }

    [HttpGet("tenant")]
    [Authorize(Roles = "Tenant")]
    public async Task<IActionResult> GetTenantAccesses()
    {
        var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
        if (string.IsNullOrEmpty(userId))
        {
            return Unauthorized();
        }

        var accessData = await _accessService.GetTenantAccessDataAsync(userId);
        return Ok(accessData);
    }

    [HttpPost("tenant")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> AddTenantAccess([FromBody] AddAccess request)
    {
        try
        {
            await _accessService.AddTenantAccessAsync(request.UserEmail, request.ResourceId);
            return Ok(new { Message = "Access granted successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
        catch (InvalidOperationException ex)
        {
            return BadRequest(new { Message = ex.Message });
        }
    }

    [HttpDelete("tenant/{id}")]
    [Authorize(Roles = "Manager")]
    public async Task<IActionResult> RemoveTenantAccess(int id)
    {
        try
        {
            await _accessService.RemoveTenantAccessAsync(id);
            return Ok(new { Message = "Access removed successfully" });
        }
        catch (KeyNotFoundException ex)
        {
            return NotFound(new { Message = ex.Message });
        }
    }
}
