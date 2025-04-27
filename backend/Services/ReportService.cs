using System;
using System.Globalization;
using backend.Database;
using backend.Models.Reports;
using Microsoft.EntityFrameworkCore;

namespace backend.Services;

public class ReportService : BaseService
{
  public ReportService(
    ApplicationDbContext context,
    IConfiguration configuration,
    IHttpContextAccessor httpContextAccessor
)
    : base(context, configuration, httpContextAccessor)
  {


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

        
}
