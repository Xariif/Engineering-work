using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Database;
using backend.Models.Account.Request;
using backend.Models.Account.Response;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.IdentityModel.Tokens;

namespace backend.Services;

public class AccountService : BaseService
{
    protected readonly UserManager<User> _userManager;
    protected readonly SignInManager<User> _signInManager;
    protected readonly RoleManager<IdentityRole> _roleManager;

    public AccountService(
        ApplicationDbContext context,
        IConfiguration configuration,
        UserManager<User> userManager,
        SignInManager<User> signInManager,
        RoleManager<IdentityRole> roleManager,
        IHttpContextAccessor httpContextAccessor
    )
        : base(context, configuration, httpContextAccessor)
    {
        _userManager = userManager;
        _signInManager = signInManager;
        _roleManager = roleManager;
    }

    public async Task<LoginResponse> LoginAsync(LoginRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            throw new Exception("Invalid login attempt or account is inactive");
        }

        if (!await _userManager.CheckPasswordAsync(user, request.Password))
        {
            throw new Exception("Invalid login attempt");
        }

        var token = GenerateJwtToken(user);
        var roles = await _userManager.GetRolesAsync(user);

        return new LoginResponse
        {
            Token = token,
            FirstName = user.Name,
            LastName = user.Surname,
            PhoneNumber = user.PhoneNumber,
            Email = user.Email,
            Role = roles.FirstOrDefault() ?? "User"
        };
    }

    public async Task<RegisterResponse> RegisterAsync(RegisterRequest request)
    {
        if (request.Password != request.ConfirmPassword)
        {
            throw new Exception("Passwords do not match");
        }

        var user = new User
        {
            UserName = request.Email,
            Email = request.Email,
            Name = request.FirstName,
            Surname = request.LastName,
            PhoneNumber = request.PhoneNumber,
            IsActive = false
        };

        var result = await _userManager.CreateAsync(user, request.Password);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return new RegisterResponse
        {
            Message = "Registration successful"
        };
    }

    public async Task<ResetPasswordResponse> GeneratePasswordResetTokenAsync(ResetPasswordRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);
        return new ResetPasswordResponse
        {
            Token = token
        };
    }

    public async Task<SetNewPasswordResponse> ResetPasswordAsync(SetNewPasswordRequest request)
    {
        if (request.Password != request.ConfirmPassword)
        {
            throw new Exception("Passwords do not match");
        }

        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        var result = await _userManager.ResetPasswordAsync(user, request.Token, request.Password);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return new SetNewPasswordResponse
        {
            Message = "Password reset successful"
        };
    }

    public async Task<ChangeEmailResponse> ChangeEmailAsync(ChangeEmailRequest request)
    {
        var user = await _userManager.FindByIdAsync(request.UserId);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        var token = await _userManager.GenerateChangeEmailTokenAsync(user, request.NewEmail);
        var result = await _userManager.ChangeEmailAsync(user, request.NewEmail, token);

        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        return new ChangeEmailResponse
        {
            Message = "Email changed successfully"
        };
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(JwtRegisteredClaimNames.Sub, user.Id),
            new Claim(JwtRegisteredClaimNames.Email, user.Email),
            new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
            new Claim(ClaimTypes.Name, user.UserName),
        };

        var roles = _userManager.GetRolesAsync(user).Result;
        claims.AddRange(roles.Select(role => new Claim(ClaimTypes.Role, role)));

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: DateTime.Now.AddHours(1),
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}
