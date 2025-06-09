using System.Security.Claims;
using backend.Database;
using backend.Models.Account.Request;
using backend.Models.Account.Response;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : BaseController
    {
        private readonly AccountService _accountService;
        private readonly CustomEmailSender _emailSender;
        private readonly UserManager<User> _userManager;

        public AccountController(
            IConfiguration configuration,
            AccountService accountService,
            CustomEmailSender emailSender,
            UserManager<User> userManager
        )
            : base(configuration)
        {
            _accountService = accountService;
            _emailSender = emailSender;
            _userManager = userManager;
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
                var user = await _accountService.RegisterAsync(request);
                var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
                await _emailSender.SendConfirmationLinkAsync(user, request.Email, token);

                return Ok(new { Message = "Registration successful. Please check your email to activate your account." });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("confirm-email")]
        public async Task<IActionResult> ConfirmEmail([FromBody] ConfirmEmailRequest request)
        {
            try
            {
                var response = await _accountService.ConfirmEmailAsync(request);
                return Ok(response);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("resend-confirmation-email")]
        public async Task<IActionResult> ResendConfirmationEmail([FromBody] ResetPasswordRequest request)
        {
            try
            {
                var token = await _accountService.GenerateEmailConfirmationTokenAsync(request.Email);
                var user = await _userManager.FindByEmailAsync(request.Email);

                await _emailSender.SendConfirmationLinkAsync(user, request.Email, token);

                return Ok(new { Message = "Confirmation email sent successfully" });
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpPost("generate-password-reset-token")]
        public async Task<IActionResult> GeneratePasswordResetToken(
            [FromBody] ResetPasswordRequest request
        )
        {
            try
            {
                var response = await _accountService.GeneratePasswordResetTokenAsync(request);

                if (response == null)
                {
                    return Ok(new { Token = response });
                }

                var user = await _accountService.GetUserByEmailAsync(request.Email);

                await _emailSender.SendPasswordResetLinkAsync(user, request.Email, response);

                return Ok(new { Token = "" });
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

        [Authorize]
        [HttpGet("profile")]
        public async Task<IActionResult> GetProfile()
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var profile = await _accountService.GetProfileAsync(userId);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [Authorize]
        [HttpPut("profile")]
        public async Task<IActionResult> UpdateProfile([FromBody] UpdateProfileRequest request)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized(new { Message = "User ID not found in token" });
            }

            try
            {
                var profile = await _accountService.UpdateProfileAsync(userId, request);
                return Ok(profile);
            }
            catch (Exception ex)
            {
                return BadRequest(new { Message = ex.Message });
            }
        }

        [HttpGet("verify-token")]
        [Authorize]
        public IActionResult VerifyToken()
        {
            return Ok(new { valid = true });
        }
    }
}
