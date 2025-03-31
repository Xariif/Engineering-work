using System.ComponentModel.DataAnnotations;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Database;
using backend.Models.Account.Request;
using backend.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Controllers
{
    public class AccountController : BaseController
    { 
        AccountService _accountService;
        public AccountController(
            ApplicationDbContext context,
            IConfiguration configuration,
            AccountService accountService
 
        ) : base(configuration)
        {     
            _accountService = accountService;
        }


        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return await _accountService.LoginAsync(request);
        }

        [HttpPost("register")]
        public async Task<IActionResult> Register([FromBody] RegisterRequest request)
        {
            if (!ModelState.IsValid)
            {
                return BadRequest(ModelState);
            }

            return await _accountService.RegisterAsync(request);
        }

        



    }
}
