using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models.Turnover;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class TurnoverController : ControllerBase
    {
        private readonly TurnoverService _turnoverService;
        private readonly AccessService _accessService;

        public TurnoverController(TurnoverService turnoverService, AccessService accessService)
        {
            _turnoverService = turnoverService;
            _accessService = accessService;
        }

        [HttpGet]
        [Authorize(Policy = "RequireManagerRole")]
        public async Task<ActionResult<List<TurnoverResponse>>> GetTurnovers()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var turnovers = await _turnoverService.GetTurnoversAsync(userId);
                return Ok(turnovers);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving turnovers",
                        Error = ex.Message,
                    }
                );
            }
        }

        [HttpGet("{id}")]
        [Authorize(Policy = "RequireManagerRole")]
        public async Task<ActionResult<TurnoverResponse>> GetTurnover(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var turnover = await _turnoverService.GetTurnoverAsync(id, userId);
                return Ok(turnover);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Turnover not found" });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving the turnover",
                        Error = ex.Message,
                    }
                );
            }
        }

        [HttpPost]
        [Authorize(Policy = "RequireTenantRole")]
        public async Task<ActionResult<TurnoverResponse>> AddTurnover(
            [FromBody] TurnoverRequest request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new
                    {
                        Message = "Invalid request data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors),
                    }
                );
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Verify tenant access
                var hasAccess = await _accessService.HasAccessToTenantAsync(
                    userId,
                    request.TenantId
                );
                if (!hasAccess)
                {
                    return StatusCode(
                        403,
                        new { Message = "User does not have access to this tenant" }
                    );
                }

                var turnover = await _turnoverService.AddTurnoverAsync(request, userId);
                return CreatedAtAction(nameof(GetTurnover), new { id = turnover.Id }, turnover);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while adding the turnover",
                        Error = ex.Message,
                    }
                );
            }
        }

        [HttpPut("{id}")]
        [Authorize(Policy = "RequireTenantRole")]
        public async Task<ActionResult<TurnoverResponse>> UpdateTurnover(
            int id,
            [FromBody] TurnoverRequest request
        )
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(
                    new
                    {
                        Message = "Invalid request data",
                        Errors = ModelState.Values.SelectMany(v => v.Errors),
                    }
                );
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Verify tenant access
                var hasAccess = await _accessService.HasAccessToTenantAsync(
                    userId,
                    request.TenantId
                );
                if (!hasAccess)
                {
                    return StatusCode(
                        403,
                        new { Message = "User does not have access to this tenant" }
                    );
                }

                var turnover = await _turnoverService.UpdateTurnoverAsync(id, request, userId);
                return Ok(turnover);
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Turnover not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return StatusCode(
                    403,
                    new { Message = "User is not authorized to update this turnover" }
                );
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while updating the turnover",
                        Error = ex.Message,
                    }
                );
            }
        }

        [HttpDelete("{id}")]
        [Authorize(Policy = "RequireTenantRole")]
        public async Task<ActionResult> DeleteTurnover(int id)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                await _turnoverService.DeleteTurnoverAsync(id, userId);
                return Ok(new { Message = "Turnover deleted successfully" });
            }
            catch (KeyNotFoundException)
            {
                return NotFound(new { Message = "Turnover not found" });
            }
            catch (UnauthorizedAccessException)
            {
                return Forbid();
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while deleting the turnover",
                        Error = ex.Message,
                    }
                );
            }
        }

        [HttpGet("total/{tenantId}")]
        [Authorize(Policy = "RequireManagerRole")]
        public async Task<ActionResult<decimal>> GetTotalTurnover(int tenantId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var total = await _turnoverService.GetTotalTurnoverAsync(userId, tenantId);
                return Ok(new { Total = total });
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while calculating total turnover",
                        Error = ex.Message,
                    }
                );
            }
        }

        [AllowAnonymous]
        [HttpGet("store/{storeId}")]
        public async Task<ActionResult<List<TurnoverResponse>>> GetTurnoversByStore(int storeId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Verify tenant access
                var hasAccess = await _accessService.HasAccessToTenantAsync(userId, storeId);
                if (!hasAccess)
                {
                    return StatusCode(403, new { Message = "User does not have access to this store" });
                }

                var turnovers = await _turnoverService.GetTurnoversAsync(userId, storeId);
                return Ok(turnovers);
            }
            catch (Exception ex)
            {
                return StatusCode(500, new { Message = "An error occurred while retrieving turnovers", Error = ex.Message });
            }
        }
    }
}
