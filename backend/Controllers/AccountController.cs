using backend.Models.Account.Request;
using backend.Models.Account.Response;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly AccountService _accountService;

        public AccountController(
            IConfiguration configuration,
            AccountService accountService
        )
            : base(configuration)
        {
            _accountService = accountService;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                var response = await _accountService.LoginAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            try
            {
                var response = await _accountService.RegisterAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("generate-password-reset-token")]
        public async Task<IActionResult> GeneratePasswordResetToken([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var response = await _accountService.GeneratePasswordResetTokenAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("reset-password")]
        public async Task<IActionResult> ResetPassword([FromBody] SetNewPasswordRequest request)
        {
            try
            {
                var response = await _accountService.ResetPasswordAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("change-email")]
        public async Task<IActionResult> ChangeEmail([FromBody] ChangeEmailRequest request)
        {
            try
            {
                var response = await _accountService.ChangeEmailAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }
    }
}
