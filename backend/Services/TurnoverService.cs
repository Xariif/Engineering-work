using System;
using System.Collections.Generic;
using System.Globalization;  // Add this import for CultureInfo
using System.Linq;
using System.Threading.Tasks;
using backend.Database;
using backend.Models.Reports;
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

        public async Task<List<TenantSelectDTO>> GetTenantsForMallAsync(int mallId)
        {
            var tenants = await _context.Tenants
                .Where(t => t.MallId == mallId)
                .OrderBy(t => t.Name)
                .ToListAsync();
            
            return tenants.Select(t => new TenantSelectDTO
            {
                Id = t.Id,
                Name = t.Name,
                Category = t.Category,
                ImageUrl = t.ImageUrl
            }).ToList();
        }

        public async Task<BarChartDataDTO> GetBarChartDataAsync(int mallId, DateTime startDate, DateTime endDate, List<int> tenantIds = null)
        {
            // Get all stores in the mall
            var query = _context.Tenants
                .Where(t => t.MallId == mallId);
            
            // If tenant IDs are provided, filter by them
            if (tenantIds != null && tenantIds.Any())
            {
                query = query.Where(t => tenantIds.Contains(t.Id));
            }
            
            var stores = await query.ToListAsync();

            if (!stores.Any())
            {
                return new BarChartDataDTO
                {
                    Labels = new List<string>(),
                    Series = new List<BarChartSeriesDTO>()
                };
            }

            var storeIds = stores.Select(s => s.Id).ToList();

            // Format dates to be in UTC
            var utcStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            // Get all turnovers for these stores within the date range
            var turnovers = await _context.Turnovers
                .Where(t => t.TenantId.HasValue && storeIds.Contains(t.TenantId.Value))
                .Where(t => t.Date >= utcStartDate && t.Date <= utcEndDate)
                .Include(t => t.Tenant)
                .ToListAsync();

            // Create months for the x-axis (labels)
            var months = new List<DateTime>();
            var current = new DateTime(utcStartDate.Year, utcStartDate.Month, 1);
            while (current <= utcEndDate)
            {
                months.Add(current);
                current = current.AddMonths(1);
            }

            // Use invariant culture for English month names
            var labels = months.Select(m => m.ToString("MMM yyyy", CultureInfo.InvariantCulture)).ToList();

            // Create series data for each store
            var series = new List<BarChartSeriesDTO>();
            foreach (var store in stores)
            {
                var storeTurnovers = turnovers
                    .Where(t => t.TenantId == store.Id)
                    .ToList();

                var storeData = new List<decimal>();
                foreach (var month in months)
                {
                    // Get sum of turnovers for this store in this month
                    var monthlyTotal = storeTurnovers
                        .Where(t => t.Date.Year == month.Year && t.Date.Month == month.Month)
                        .Sum(t => t.Value);

                    storeData.Add(monthlyTotal);
                }

                // Only add stores that have turnover data
                if (storeData.Any(d => d > 0))
                {
                    series.Add(new BarChartSeriesDTO
                    {
                        Name = store.Name,
                        Data = storeData
                    });
                }
            }

            return new BarChartDataDTO
            {
                Labels = labels,
                Series = series
            };
        }

        public async Task<LineChartDataDTO> GetLineChartDataAsync(int mallId, DateTime startDate, DateTime endDate, List<int> tenantIds = null)
        {
            // Get all stores in the mall
            var query = _context.Tenants
                .Where(t => t.MallId == mallId);
            
            // If tenant IDs are provided, filter by them
            if (tenantIds != null && tenantIds.Any())
            {
                query = query.Where(t => tenantIds.Contains(t.Id));
            }
            
            var stores = await query.ToListAsync();

            if (!stores.Any())
            {
                return new LineChartDataDTO
                {
                    Labels = new List<string>(),
                    Series = new List<LineChartSeriesDTO>()
                };
            }

            var storeIds = stores.Select(s => s.Id).ToList();

            // Format dates to be in UTC
            var utcStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            // Get all turnovers for these stores within the date range
            var turnovers = await _context.Turnovers
                .Where(t => t.TenantId.HasValue && storeIds.Contains(t.TenantId.Value))
                .Where(t => t.Date >= utcStartDate && t.Date <= utcEndDate)
                .Include(t => t.Tenant)
                .ToListAsync();

            // Create months for the x-axis (labels)
            var months = new List<DateTime>();
            var current = new DateTime(utcStartDate.Year, utcStartDate.Month, 1);
            while (current <= utcEndDate)
            {
                months.Add(current);
                current = current.AddMonths(1);
            }

            // Use invariant culture for English month names
            var labels = months.Select(m => m.ToString("MMM yyyy", CultureInfo.InvariantCulture)).ToList();


            // Create series for each store (top 5 by turnover)
            var storeSeries = new List<LineChartSeriesDTO>();
            
            // Get top 5 stores by total turnover
            var topStores = stores
                .Select(store => new
                {
                    Store = store,
                    TotalTurnover = turnovers
                        .Where(t => t.TenantId == store.Id)
                        .Sum(t => t.Value)
                })
                .OrderByDescending(x => x.TotalTurnover)
                .Take(5)
                .ToList();

            foreach (var storeData in topStores)
            {
                var store = storeData.Store;
                var storeTurnovers = turnovers
                    .Where(t => t.TenantId == store.Id)
                    .ToList();

                var monthlyData = new List<decimal>();
                foreach (var month in months)
                {
                    var monthlyTotal = storeTurnovers
                        .Where(t => t.Date.Year == month.Year && t.Date.Month == month.Month)
                        .Sum(t => t.Value);

                    monthlyData.Add(monthlyTotal);
                }

                storeSeries.Add(new LineChartSeriesDTO
                {
                    Name = store.Name,
                    Data = monthlyData
                });
            }

            // Combine all series, with total first
            var allSeries = new List<LineChartSeriesDTO>();
            allSeries.AddRange(storeSeries);

            return new LineChartDataDTO
            {
                Labels = labels,
                Series = allSeries
            };
        }

        public async Task<PieChartDataDTO> GetPieChartDataAsync(int mallId, DateTime startDate, DateTime endDate, List<int> tenantIds = null)
        {
            // Get all stores in the mall
            var query = _context.Tenants
                .Where(t => t.MallId == mallId);
            
            // If tenant IDs are provided, filter by them
            if (tenantIds != null && tenantIds.Any())
            {
                query = query.Where(t => tenantIds.Contains(t.Id));
            }
            
            var stores = await query.ToListAsync();

            if (!stores.Any())
            {
                return new PieChartDataDTO
                {
                    Labels = new List<string>(),
                    Values = new List<decimal>(),
                    Colors = new List<string>()
                };
            }

            var storeIds = stores.Select(s => s.Id).ToList();

            // Format dates to be in UTC
            var utcStartDate = DateTime.SpecifyKind(startDate, DateTimeKind.Utc);
            var utcEndDate = DateTime.SpecifyKind(endDate, DateTimeKind.Utc);

            // Get all turnovers for these stores within the date range
            var turnovers = await _context.Turnovers
                .Where(t => t.TenantId.HasValue && storeIds.Contains(t.TenantId.Value))
                .Where(t => t.Date >= utcStartDate && t.Date <= utcEndDate)
                .Include(t => t.Tenant)
                .ToListAsync();

            // Calculate total turnover for each store
            var storeTotals = new List<(string Name, decimal Total)>();
            foreach (var store in stores)
            {
                var total = turnovers
                    .Where(t => t.TenantId == store.Id)
                    .Sum(t => t.Value);

                if (total > 0) // Only include stores with turnover
                {
                    storeTotals.Add((store.Name, total));
                }
            }

            // Sort by total turnover descending
            storeTotals = storeTotals.OrderByDescending(s => s.Total).ToList();

            // If we have more than 10 stores, combine the rest into "Others"
            if (storeTotals.Count > 10)
            {
                var topStores = storeTotals.Take(9).ToList();
                var otherStores = storeTotals.Skip(9).ToList();
                
                var otherTotal = otherStores.Sum(s => s.Total);
                topStores.Add(("Others", otherTotal));
                
                storeTotals = topStores;
            }

            // Generate a list of distinct colors for the pie chart
            var colors = new List<string>
            {
                "#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF",
                "#FF9F40", "#8AC54B", "#FF5A5E", "#C9CBCF", "#7B68EE"
            };

            return new PieChartDataDTO
            {
                Labels = storeTotals.Select(s => s.Name).ToList(),
                Values = storeTotals.Select(s => s.Total).ToList(),
                Colors = colors.Take(storeTotals.Count).ToList()
            };
        }
    }
}