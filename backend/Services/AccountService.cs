using System;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using backend.Database;
using backend.Models.Account.Request;
using backend.Models.Account.Response;
using Microsoft.AspNetCore.Http.HttpResults;
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
            Role = roles.FirstOrDefault() ?? "Tenant",
        };
    }

    public async Task<User> RegisterAsync(RegisterRequest request)
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

        return user;
    }

    public async Task<string?> GeneratePasswordResetTokenAsync(ResetPasswordRequest request)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == request.Email);
        if (user == null || !user.IsActive)
        {
            return null;
        }

        

        var token = await _userManager.GeneratePasswordResetTokenAsync(user);


        //save token to validate it late on 
        
        return token;
    }

    public async Task<User> GetUserByEmailAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }
        return user;
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

    public async Task<UserProfileResponse> GetProfileAsync(string userId)
    {
        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new UserProfileResponse
        {
            FirstName = user.Name,
            LastName = user.Surname,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = roles.FirstOrDefault() ?? "Tenant"
        };
    }

    public async Task<UserProfileResponse> UpdateProfileAsync(string userId, UpdateProfileRequest request)
    {
        if (request == null)
        {
            throw new Exception("Request cannot be null");
        }

        // Validate first name
        if (string.IsNullOrWhiteSpace(request.FirstName) || request.FirstName.Length < 3)
        {
            throw new Exception("First name must be at least 3 characters long");
        }
        if (!System.Text.RegularExpressions.Regex.IsMatch(request.FirstName, @"^[a-zA-Z\s]*$"))
        {
            throw new Exception("First name can only contain letters and spaces");
        }

        // Validate last name
        if (string.IsNullOrWhiteSpace(request.LastName) || request.LastName.Length < 3)
        {
            throw new Exception("Last name must be at least 3 characters long");
        }
        if (!System.Text.RegularExpressions.Regex.IsMatch(request.LastName, @"^[a-zA-Z\s]*$"))
        {
            throw new Exception("Last name can only contain letters and spaces");
        }

        // Validate phone number if provided
        if (!string.IsNullOrWhiteSpace(request.PhoneNumber) &&
            !System.Text.RegularExpressions.Regex.IsMatch(request.PhoneNumber, @"^\d{9}$"))
        {
            throw new Exception("Phone number must be exactly 9 digits");
        }

        var user = await _userManager.FindByIdAsync(userId);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        user.Name = request.FirstName.Trim();
        user.Surname = request.LastName.Trim();
        user.PhoneNumber = request.PhoneNumber?.Trim();

        var result = await _userManager.UpdateAsync(user);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        var roles = await _userManager.GetRolesAsync(user);

        return new UserProfileResponse
        {
            FirstName = user.Name,
            LastName = user.Surname,
            Email = user.Email,
            PhoneNumber = user.PhoneNumber,
            Role = roles.FirstOrDefault() ?? "Tenant"
        };
    }

    private string GenerateJwtToken(User user)
    {
        var claims = new List<Claim>
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Name, user.Email),
            new Claim("firstName", user.Name ?? ""),
            new Claim("lastName", user.Surname ?? ""),
            new Claim("phoneNumber", user.PhoneNumber ?? "")
        };

        // Add roles to claims
        var roles = _userManager.GetRolesAsync(user).Result;
        foreach (var role in roles)
        {
            claims.Add(new Claim(_configuration["Jwt:RoleClaimType"], role));
        }

        var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]));
        var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);
        var expires = DateTime.Now.AddDays(int.Parse(_configuration["Jwt:ExpirationInDays"]));

        var token = new JwtSecurityToken(
            issuer: _configuration["Jwt:Issuer"],
            audience: _configuration["Jwt:Audience"],
            claims: claims,
            expires: expires,
            signingCredentials: creds
        );

        return new JwtSecurityTokenHandler().WriteToken(token);
    }

    public async Task<string> GenerateEmailConfirmationTokenAsync(string email)
    {
        var user = await _userManager.FindByEmailAsync(email);
        if (user == null || !user.IsActive)
        {
            throw new Exception("User not found or account is inactive");
        }

        var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
        return token;
    }

    public async Task<ConfirmEmailResponse> ConfirmEmailAsync(ConfirmEmailRequest request)
    {
        var user = await _userManager.FindByEmailAsync(request.Email);
        if (user == null)
        {
            throw new Exception("User not found");
        }

        var result = await _userManager.ConfirmEmailAsync(user, request.Token);
        if (!result.Succeeded)
        {
            throw new Exception(string.Join(", ", result.Errors.Select(e => e.Description)));
        }

        user.IsActive = true;

        var updateResult = await _userManager.UpdateAsync(user);
        if (!updateResult.Succeeded)
        {
            throw new Exception(string.Join(", ", updateResult.Errors.Select(e => e.Description)));
        }

        return new ConfirmEmailResponse
        {
            Message = "Email confirmed successfully"
        };
    }
}
