using System;
using System.Security.Claims;
using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace backend.Services;

public abstract class BaseService
{
    protected readonly ApplicationDbContext _context;
    protected readonly User? _user; 
    protected readonly IConfiguration _configuration;

    public BaseService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
    {
        _context = context;
        _configuration = configuration;

        var userId = httpContextAccessor.HttpContext?.User?.FindFirst(ClaimTypes.NameIdentifier)?.Value;

        if (userId != null)
        {
            _user = _context.Users.FirstOrDefault(u => u.Id == userId);
        }
    }
}
