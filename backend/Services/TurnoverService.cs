using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using backend.Database;
using backend.Models.Turnover;
using Microsoft.EntityFrameworkCore;

namespace backend.Services
{
    public class TurnoverService
    {
        private readonly ApplicationDbContext _context;
        private readonly AccessService _accessService;

        public TurnoverService(ApplicationDbContext context, AccessService accessService)
        {
            _context = context;
            _accessService = accessService;
        }

        public async Task<IEnumerable<TurnoverResponse>> GetTurnoversAsync(string userId, int? tenantId = null)
        {
            var query = _context.Turnovers
                .Include(t => t.Tenant)
                .Include(t => t.User)
                .AsQueryable();

            // If tenantId is provided, check if user has access to that tenant
            if (tenantId.HasValue)
            {
                var hasAccess = await _accessService.HasAccessToTenantAsync(userId, tenantId.Value);
                if (!hasAccess)
                {
                    throw new UnauthorizedAccessException("User does not have access to this tenant");
                }
                query = query.Where(t => t.TenantId == tenantId);
            }
            else
            {
                // If no tenantId provided, get all turnovers for tenants the user has access to
                var accessibleTenantIds = await _accessService.GetAccessibleTenantIdsAsync(userId);
                query = query.Where(t => t.TenantId.HasValue && accessibleTenantIds.Contains(t.TenantId.Value));
            }

            var turnovers = await query
                .OrderByDescending(t => t.Date)
                .ToListAsync();

            return turnovers.Select(TurnoverResponse.FromEntity);
        }

        public async Task<TurnoverResponse> GetTurnoverAsync(int id, string userId)
        {
            var turnover = await _context.Turnovers
                .Include(t => t.Tenant)
                .Include(t => t.User)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (turnover == null)
            {
                throw new KeyNotFoundException($"Turnover with ID {id} not found.");
            }

            if (!turnover.TenantId.HasValue)
            {
                throw new InvalidOperationException("Turnover does not have an associated tenant.");
            }

            // Check if user has access to this turnover's tenant
            var hasAccess = await _accessService.HasAccessToTenantAsync(userId, turnover.TenantId.Value);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("User does not have access to this turnover");
            }

            return TurnoverResponse.FromEntity(turnover);
        }

        public async Task<TurnoverResponse> AddTurnoverAsync(TurnoverRequest request, string userId)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            // Check if user has access to the tenant
            var hasAccess = await _accessService.HasAccessToTenantAsync(userId, request.TenantId);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("User does not have access to this tenant");
            }

            var user = await _context.Users.FindAsync(userId);
            if (user == null)
            {
                throw new KeyNotFoundException($"User with ID {userId} not found.");
            }

            var tenant = await _context.Tenants.FindAsync(request.TenantId);
            if (tenant == null)
            {
                throw new KeyNotFoundException($"Tenant with ID {request.TenantId} not found.");
            }

            // Check if turnover already exists for this date and tenant
            var existingTurnover = await _context.Turnovers
                .FirstOrDefaultAsync(t => t.TenantId == request.TenantId && t.Date.Date == request.Date.Date.ToUniversalTime());

            if (existingTurnover != null)
            {
                throw new InvalidOperationException("Turnover already exists for this date");
            }

            var turnover = new backend.Database.Turnover
            {
                Value = request.Value,
                Date = DateTime.SpecifyKind(request.Date, DateTimeKind.Utc), // Convert to UTC
                TenantId = request.TenantId,
                Tenant = tenant,
                User = user,
                UserId = userId
            };

            try
            {
                _context.Turnovers.Add(turnover);
                await _context.SaveChangesAsync();
                return await GetTurnoverAsync(turnover.Id, userId);
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to create turnover. Please check the provided data.", ex);
            }
        }

        public async Task<TurnoverResponse> UpdateTurnoverAsync(int id, TurnoverRequest request, string userId)
        {
            if (request == null)
            {
                throw new ArgumentNullException(nameof(request));
            }

            var turnover = await _context.Turnovers
                .Include(t => t.Tenant)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (turnover == null)
            {
                throw new KeyNotFoundException($"Turnover with ID {id} not found.");
            }

            if (!turnover.TenantId.HasValue)
            {
                throw new InvalidOperationException("Turnover does not have an associated tenant.");
            }

            // Check if user has access to the tenant
            var hasAccess = await _accessService.HasAccessToTenantAsync(userId, turnover.TenantId.Value);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("User does not have access to this turnover");
            }

            // Check if the new date would conflict with an existing turnover
            if (turnover.Date.Date != request.Date.Date)
            {
                var existingTurnover = await _context.Turnovers
                    .FirstOrDefaultAsync(t => t.TenantId == turnover.TenantId && t.Date.Date == request.Date.Date && t.Id != id);

                if (existingTurnover != null)
                {
                    throw new InvalidOperationException("A turnover already exists for this date");
                }
            }

            turnover.Value = request.Value;
            turnover.Date = request.Date;

            try
            {
                await _context.SaveChangesAsync();
                return await GetTurnoverAsync(turnover.Id, userId);
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to update turnover. Please check the provided data.", ex);
            }
        }

        public async Task DeleteTurnoverAsync(int id, string userId)
        {
            var turnover = await _context.Turnovers
                .Include(t => t.Tenant)
                .FirstOrDefaultAsync(t => t.Id == id);

            if (turnover == null)
            {
                throw new KeyNotFoundException($"Turnover with ID {id} not found.");
            }

            if (!turnover.TenantId.HasValue)
            {
                throw new InvalidOperationException("Turnover does not have an associated tenant.");
            }

            // Check if user has access to the tenant
            var hasAccess = await _accessService.HasAccessToTenantAsync(userId, turnover.TenantId.Value);
            if (!hasAccess)
            {
                throw new UnauthorizedAccessException("User does not have access to this turnover");
            }

            try
            {
                _context.Turnovers.Remove(turnover);
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateException ex)
            {
                throw new InvalidOperationException("Failed to delete turnover.", ex);
            }
        }

        public async Task<decimal> GetTotalTurnoverAsync(string userId, int? tenantId = null)
        {
            var query = _context.Turnovers.AsQueryable();

            if (tenantId.HasValue)
            {
                // Check if user has access to the tenant
                var hasAccess = await _accessService.HasAccessToTenantAsync(userId, tenantId.Value);
                if (!hasAccess)
                {
                    throw new UnauthorizedAccessException("User does not have access to this tenant");
                }
                query = query.Where(t => t.TenantId == tenantId);
            }
            else
            {
                // If no tenantId provided, get all turnovers for tenants the user has access to
                var accessibleTenantIds = await _accessService.GetAccessibleTenantIdsAsync(userId);
                query = query.Where(t => t.TenantId.HasValue && accessibleTenantIds.Contains(t.TenantId.Value));
            }

            return await query.SumAsync(t => t.Value);
        }
    }
}