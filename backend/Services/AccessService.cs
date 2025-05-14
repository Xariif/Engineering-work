using backend.Database;
using backend.Models.Access.Request;
using backend.Models.Access.Response;
using Backend.Database;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace backend.Services;

public class AccessService : BaseService
{
    public AccessService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
        : base(context, configuration, httpContextAccessor)
    {
    }


    public GetAccessData GetAccessData()
    {
        var malls = _context.Malls
            .Select(m => new backend.Models.Access.Response.Mall
            {
                Name = m.Name,
                Address = m.Address,
                Stores = m.Tenants.Select(s => new Store
                {
                    Id = s.Id,
                    Name = s.Name,
                    ImageUrl = s.ImageUrl,
                    Accesses = _context.Accesses
                        .Include(a => a.User)
                        .Where(a => a.ResourceId == s.Id.ToString() && a.ResourceType == ResourceType.Store)
                        .Select(a => new backend.Models.Access.Response.Access
                        {
                            Id = a.Id,
                            UserId = a.UserId,
                            UserEmail = a.User.Email,
                            UserName = a.User.Name + " " + a.User.Surname,
                        }).ToList()
                }).ToList()
            }).ToList();

        return new GetAccessData { Malls = malls };
    }

    public async Task<GetAccessData> GetTenantAccessDataAsync(string userId)
    {
        // Get all store IDs the user has access to,
        var t = await _context.Accesses.ToListAsync();
        var accessibleStoreIds = await _context.Accesses
            .Where(a => a.UserId == userId && a.ResourceType == ResourceType.Store)
            .Select(a => int.Parse(a.ResourceId))
            .ToListAsync();

        if (!accessibleStoreIds.Any())
        {
            return new GetAccessData { Malls = new List<backend.Models.Access.Response.Mall>() };
        }

        // Get malls that contain the accessible stores
        var malls = await _context.Malls
            .Include(m => m.Tenants)
            .Where(m => m.Tenants.Any(t => accessibleStoreIds.Contains(t.Id)))
            .Select(m => new backend.Models.Access.Response.Mall
            {
                Name = m.Name,
                Address = m.Address,
                Stores = m.Tenants
                    .Where(t => accessibleStoreIds.Contains(t.Id))
                    .Select(s => new Store
                    {
                        Id = s.Id,
                        Name = s.Name,
                        ImageUrl = s.ImageUrl
                    }).ToList()
            }).ToListAsync();

        return new GetAccessData { Malls = malls };
    }

    public async Task<bool> HasAccessToTenantAsync(string userId, int tenantId)
    {
        // Check if user has specific access to the tenant
        bool hasDirectAccess = await _context.Accesses
            .AnyAsync(a => a.UserId == userId &&
                         a.ResourceId == tenantId.ToString() &&
                         a.ResourceType == ResourceType.Store);

        if (hasDirectAccess)
            return true;

        // Check if the user is a manager of the mall containing this tenant
        var tenant = await _context.Tenants
            .Include(t => t.Mall)
            .FirstOrDefaultAsync(t => t.Id == tenantId);

        if (tenant == null)
            return false;

        // Check if user is a manager for this mall
        return await _context.Accesses
            .AnyAsync(a => a.UserId == userId &&
                         a.ResourceId == tenant.Mall.Id.ToString() &&
                         a.ResourceType == ResourceType.Mall &&
                         a.Role == Role.Manager);
    }

    public async Task<IEnumerable<int>> GetAccessibleTenantIdsAsync(string userId)
    {
        // Get all tenant IDs the user has access to
        var tenantIds = await _context.Accesses
            .Where(a => a.UserId == userId && a.ResourceType == ResourceType.Store)
            .Select(a => int.Parse(a.ResourceId))
            .ToListAsync();

        return tenantIds;
    }

    public async Task AddTenantAccessAsync(string userEmail, int tenantId)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == userEmail);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with email {userEmail} not found.");
        }

        var tenant = await _context.Tenants.FirstOrDefaultAsync(t => t.Id == tenantId);
        if (tenant == null)
        {
            throw new KeyNotFoundException($"Tenant with ID {tenantId} not found.");
        }

        var existingAccess = await _context.Accesses
            .FirstOrDefaultAsync(a => a.UserId == user.Id &&
                                   a.ResourceId == tenantId.ToString() &&
                                   a.ResourceType == ResourceType.Store);

        if (existingAccess != null)
        {
            throw new InvalidOperationException($"User already has access to tenant '{tenant.Name}'.");
        }

        var access = new Backend.Database.Access
        {
            UserId = user.Id,
            User = user,
            ResourceId = tenantId.ToString(),
            ResourceType = ResourceType.Store,
            Role = Role.Tenant
        };

        _context.Accesses.Add(access);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveTenantAccessAsync(int accessId)
    {
        var access = await _context.Accesses
            .Include(a => a.User)
            .FirstOrDefaultAsync(a => a.Id == accessId);

        if (access == null)
        {
            throw new KeyNotFoundException($"Access with ID {accessId} not found.");
        }

        _context.Accesses.Remove(access);
        await _context.SaveChangesAsync();
    }

    public async Task RemoveTenantAccessByEmailAsync(string email)
    {
        var user = await _context.Users.FirstOrDefaultAsync(u => u.Email == email);
        if (user == null)
        {
            throw new KeyNotFoundException($"User with email {email} not found.");
        }

        var access = await _context.Accesses
            .FirstOrDefaultAsync(a => a.UserId == user.Id && a.ResourceType == ResourceType.Store);

        if (access == null)
        {
            throw new KeyNotFoundException($"No access found for user with email {email}.");
        }

        _context.Accesses.Remove(access);
        await _context.SaveChangesAsync();
    }

    // Get all malls a manager has access to
    public async Task<List<Backend.Database.Mall>> GetManagerMallsAsync(string userId)
    {
        // Check if user is a manager for any malls
        var mallAccessIds = await _context.Accesses
            .Where(a => a.UserId == userId &&
                     a.ResourceType == ResourceType.Mall &&
                     a.Role == Role.Manager)
            .Select(a => int.Parse(a.ResourceId))
            .ToListAsync();

        // Get all malls the manager has access to
        var malls = await _context.Malls
            .Where(m => mallAccessIds.Contains(m.Id))
            .ToListAsync();

        return malls;
    }

    // Check if a manager has access to a specific mall
    public async Task<bool> ManagerHasAccessToMallAsync(string userId, int mallId)
    {
        // Check if user is a manager for this mall
        return await _context.Accesses
            .AnyAsync(a => a.UserId == userId &&
                         a.ResourceId == mallId.ToString() &&
                         a.ResourceType == ResourceType.Mall &&
                         a.Role == Role.Manager);
    }
}
