using backend.Database;
using backend.Models.Reports;
using backend.Services;
using Backend.Database;
using EngineeringWork.Backend.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Xunit;

namespace backend.Test.Services
{
    public class ReportServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;

        public ReportServiceTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _mockConfiguration = new Mock<IConfiguration>();
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        }

        [Fact]
        public async Task GetBarChartData_ReturnsCorrectData()
        {
            // Arrange
            var mallId = 1;
            var startDate = new DateTime(2023, 1, 1);
            var endDate = new DateTime(2023, 3, 31);

            using (var context = new ApplicationDbContext(_options))
            {
                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                await context.Malls.AddAsync(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                await context.Tenants.AddRangeAsync(tenant1, tenant2);

                var user = new User { Id = "user1", UserName = "test@example.com" };
                await context.Users.AddAsync(user);

                // January turnovers
                var januaryTurnover1 = new Turnover { Id = 1, Value = 1000, Date = new DateTime(2023, 1, 15), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var januaryTurnover2 = new Turnover { Id = 2, Value = 1500, Date = new DateTime(2023, 1, 20), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                // February turnovers
                var februaryTurnover1 = new Turnover { Id = 3, Value = 2000, Date = new DateTime(2023, 2, 10), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var februaryTurnover2 = new Turnover { Id = 4, Value = 2500, Date = new DateTime(2023, 2, 15), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                // March turnovers
                var marchTurnover1 = new Turnover { Id = 5, Value = 3000, Date = new DateTime(2023, 3, 5), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var marchTurnover2 = new Turnover { Id = 6, Value = 3500, Date = new DateTime(2023, 3, 10), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                await context.Turnovers.AddRangeAsync(
                    januaryTurnover1, januaryTurnover2,
                    februaryTurnover1, februaryTurnover2,
                    marchTurnover1, marchTurnover2);

                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new ReportService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetBarChartDataAsync(mallId, startDate, endDate);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(3, result.Labels.Count);
                Assert.Equal(2, result.Series.Count);

                var tenant1Series = result.Series.FirstOrDefault(s => s.Name == "Tenant 1");
                var tenant2Series = result.Series.FirstOrDefault(s => s.Name == "Tenant 2");

                Assert.NotNull(tenant1Series);
                Assert.NotNull(tenant2Series);

                // Check tenant 1 data
                Assert.Equal(1000, tenant1Series.Data[0]);
                Assert.Equal(2000, tenant1Series.Data[1]);
                Assert.Equal(3000, tenant1Series.Data[2]);

                // Check tenant 2 data
                Assert.Equal(1500, tenant2Series.Data[0]);
                Assert.Equal(2500, tenant2Series.Data[1]);
                Assert.Equal(3500, tenant2Series.Data[2]);
            }
        }

        [Fact]
        public async Task GetBarChartData_FilteredByTenantIds_ReturnsFilteredData()
        {
            // Arrange
            var mallId = 1;
            var startDate = new DateTime(2023, 1, 1);
            var endDate = new DateTime(2023, 3, 31);
            var tenantIds = new List<int> { 1 };

            using (var context = new ApplicationDbContext(_options))
            {
                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                await context.Malls.AddAsync(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                await context.Tenants.AddRangeAsync(tenant1, tenant2);

                var user = new User { Id = "user1", UserName = "test@example.com" };
                await context.Users.AddAsync(user);

                // Turnovers for both tenants
                var turnover1 = new Turnover { Id = 1, Value = 1000, Date = new DateTime(2023, 1, 15), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var turnover2 = new Turnover { Id = 2, Value = 1500, Date = new DateTime(2023, 1, 20), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                await context.Turnovers.AddRangeAsync(turnover1, turnover2);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new ReportService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetBarChartDataAsync(mallId, startDate, endDate, tenantIds);

                // Assert
                Assert.NotNull(result);
                Assert.Single(result.Series);
                Assert.Equal("Tenant 1", result.Series[0].Name);
                Assert.Equal(1000, result.Series[0].Data[0]);
            }
        }

        [Fact]
        public async Task GetLineChartData_ReturnsCorrectData()
        {
            // Arrange
            var mallId = 1;
            var startDate = new DateTime(2023, 1, 1);
            var endDate = new DateTime(2023, 3, 31);

            using (var context = new ApplicationDbContext(_options))
            {
                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                await context.Malls.AddAsync(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mallId };
                await context.Tenants.AddRangeAsync(tenant1, tenant2);

                var user = new User { Id = "user1", UserName = "test@example.com" };
                await context.Users.AddAsync(user);

                // Monthly turnovers for both tenants
                var january1 = new Turnover { Id = 1, Value = 1000, Date = new DateTime(2023, 1, 15), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var january2 = new Turnover { Id = 2, Value = 500, Date = new DateTime(2023, 1, 20), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                var february1 = new Turnover { Id = 3, Value = 2000, Date = new DateTime(2023, 2, 10), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var february2 = new Turnover { Id = 4, Value = 800, Date = new DateTime(2023, 2, 15), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                var march1 = new Turnover { Id = 5, Value = 3000, Date = new DateTime(2023, 3, 5), Tenant = tenant1, TenantId = tenant1.Id, User = user, UserId = user.Id };
                var march2 = new Turnover { Id = 6, Value = 1200, Date = new DateTime(2023, 3, 10), Tenant = tenant2, TenantId = tenant2.Id, User = user, UserId = user.Id };

                await context.Turnovers.AddRangeAsync(january1, january2, february1, february2, march1, march2);
                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new ReportService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetLineChartDataAsync(mallId, startDate, endDate);

                // Assert
                Assert.NotNull(result);
                Assert.Equal(3, result.Labels.Count);
                Assert.Equal(2, result.Series.Count);

                var tenant1Series = result.Series.FirstOrDefault(s => s.Name == "Tenant 1");
                var tenant2Series = result.Series.FirstOrDefault(s => s.Name == "Tenant 2");

                Assert.NotNull(tenant1Series);
                Assert.NotNull(tenant2Series);

                // Check tenant 1 data (higher turnover)
                Assert.Equal(1000, tenant1Series.Data[0]);
                Assert.Equal(2000, tenant1Series.Data[1]);
                Assert.Equal(3000, tenant1Series.Data[2]);

                // Check tenant 2 data (lower turnover)
                Assert.Equal(500, tenant2Series.Data[0]);
                Assert.Equal(800, tenant2Series.Data[1]);
                Assert.Equal(1200, tenant2Series.Data[2]);
            }
        }

        [Fact]
        public async Task GetLineChartData_NoData_ReturnsEmptyResult()
        {
            // Arrange
            var mallId = 1;
            var startDate = new DateTime(2023, 1, 1);
            var endDate = new DateTime(2023, 3, 31);

            using (var context = new ApplicationDbContext(_options))
            {
                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };


                await context.Malls.AddAsync(mall);


                await context.SaveChangesAsync();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new ReportService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetLineChartDataAsync(mallId, startDate, endDate);

                Assert.NotNull(result);
                Assert.Empty(result.Series);

            }
        }
    }
}