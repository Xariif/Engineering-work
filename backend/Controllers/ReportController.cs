using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Models;
using backend.Models.Reports;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ReportController : ControllerBase
    {
        private readonly TurnoverService _turnoverService;
        private readonly AccessService _accessService;

        public ReportController(TurnoverService turnoverService, AccessService accessService)
        {
            _turnoverService = turnoverService;
            _accessService = accessService;
        }

        // Get malls that the manager has access to
        [HttpGet("malls")]
        public async Task<ActionResult<List<MallSelectDTO>>> GetAccessibleMalls()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var malls = await _accessService.GetManagerMallsAsync(userId);
                var mallsDTO = malls.Select(m => new MallSelectDTO
                {
                    Id = m.Id,
                    Name = m.Name
                }).ToList();

                return Ok(mallsDTO);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving malls",
                        Error = ex.Message,
                    }
                );
            }
        }

        // Get tenants for a specific mall
        [HttpGet("tenants/{mallId}")]
        public async Task<ActionResult<List<TenantSelectDTO>>> GetTenants(int mallId)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Check if manager has access to this mall
                var hasAccess = await _accessService.ManagerHasAccessToMallAsync(userId, mallId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                var tenants = await _turnoverService.GetTenantsForMallAsync(mallId);
                return Ok(tenants);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving tenants",
                        Error = ex.Message,
                    }
                );
            }
        }

        // Get bar chart data for a specific mall
        [HttpGet("chart/bar/{mallId}")]
        public async Task<ActionResult<BarChartDataDTO>> GetBarChartData(int mallId, [FromQuery] ChartPeriodRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Check if manager has access to this mall
                var hasAccess = await _accessService.ManagerHasAccessToMallAsync(userId, mallId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                // Get data for bar chart
                var chartData = await _turnoverService.GetBarChartDataAsync(mallId, request.StartDate, request.EndDate, request.TenantIds);
                return Ok(chartData);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving bar chart data",
                        Error = ex.Message,
                    }
                );
            }
        }

        // Get line chart data for a specific mall
        [HttpGet("chart/line/{mallId}")]
        public async Task<ActionResult<LineChartDataDTO>> GetLineChartData(int mallId, [FromQuery] ChartPeriodRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Check if manager has access to this mall
                var hasAccess = await _accessService.ManagerHasAccessToMallAsync(userId, mallId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                // Get data for line chart
                var chartData = await _turnoverService.GetLineChartDataAsync(mallId, request.StartDate, request.EndDate, request.TenantIds);
                return Ok(chartData);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving line chart data",
                        Error = ex.Message,
                    }
                );
            }
        }

        // Get pie chart data for a specific mall
        [HttpGet("chart/pie/{mallId}")]
        public async Task<ActionResult<PieChartDataDTO>> GetPieChartData(int mallId, [FromQuery] ChartPeriodRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                // Check if manager has access to this mall
                var hasAccess = await _accessService.ManagerHasAccessToMallAsync(userId, mallId);
                if (!hasAccess)
                {
                    return Forbid();
                }

                // Get data for pie chart
                var chartData = await _turnoverService.GetPieChartDataAsync(mallId, request.StartDate, request.EndDate, request.TenantIds);
                return Ok(chartData);
            }
            catch (Exception ex)
            {
                return StatusCode(
                    500,
                    new
                    {
                        Message = "An error occurred while retrieving pie chart data",
                        Error = ex.Message,
                    }
                );
            }
        }
    }
}
