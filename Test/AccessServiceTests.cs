using backend.Database;
using backend.Models.Access.Request;
using backend.Models.Access.Response;
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
using Mall = Backend.Database.Mall;

namespace backend.Test.Services
{
    public class AccessServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;

        public AccessServiceTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
            _mockConfiguration = new Mock<IConfiguration>();
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
        }

        [Fact]
        public void GetAccessData_ReturnsCorrectData()
        {
            // Arrange
            using (var context = new ApplicationDbContext(_options))
            {
                var user1 = new User { Id = "user1", UserName = "user1@example.com", Email = "user1@example.com", Name = "User", Surname = "One" };
                var user2 = new User { Id = "user2", UserName = "user2@example.com", Email = "user2@example.com", Name = "User", Surname = "Two" };
                context.Users.AddRange(user1, user2);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                context.Malls.Add(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image1.jpg", Mall = mall, MallId = mall.Id };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image2.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.AddRange(tenant1, tenant2);

                var access1 = new Backend.Database.Access { Id = 1, UserId = user1.Id, User = user1, ResourceId = tenant1.Id.ToString(), ResourceType = ResourceType.Store, Role = Role.Tenant };
                var access2 = new Backend.Database.Access { Id = 2, UserId = user2.Id, User = user2, ResourceId = tenant2.Id.ToString(), ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.AddRange(access1, access2);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = service.GetAccessData();

                // Assert
                Assert.NotNull(result);
                Assert.Single(result.Malls);

                var mall = result.Malls.First();
                Assert.Equal("Mall 1", mall.Name);
                Assert.Equal("Address 1", mall.Address);
                Assert.Equal(2, mall.Stores.Count);

                var store1 = mall.Stores.FirstOrDefault(s => s.Name == "Tenant 1");
                var store2 = mall.Stores.FirstOrDefault(s => s.Name == "Tenant 2");

                Assert.NotNull(store1);
                Assert.NotNull(store2);

                Assert.Single(store1.Accesses);
                Assert.Single(store2.Accesses);

                Assert.Equal("user1@example.com", store1.Accesses.First().UserEmail);
                Assert.Equal("user2@example.com", store2.Accesses.First().UserEmail);
            }
        }

        [Fact]
        public async Task GetTenantAccessDataAsync_UserWithAccess_ReturnsAccessibleTenants()
        {
            // Arrange
            var userId = "user1";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com", Email = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                context.Malls.Add(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image1.jpg", Mall = mall, MallId = mall.Id };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image2.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.AddRange(tenant1, tenant2);

                var access = new Backend.Database.Access { UserId = userId, User = user, ResourceId = tenant1.Id.ToString(), ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetTenantAccessDataAsync(userId);

                // Assert
                Assert.NotNull(result);
                Assert.Single(result.Malls);

                var mall = result.Malls.First();
                Assert.Equal("Mall 1", mall.Name);

                Assert.Single(mall.Stores);
                Assert.Equal("Tenant 1", mall.Stores.First().Name);
                Assert.Equal(1, mall.Stores.First().Id);
            }
        }

        [Fact]
        public async Task GetTenantAccessDataAsync_UserWithNoAccess_ReturnsEmptyCollection()
        {
            // Arrange
            var userId = "user1";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetTenantAccessDataAsync(userId);

                // Assert
                Assert.NotNull(result);
                Assert.Empty(result.Malls);
            }
        }

        [Fact]
        public async Task HasAccessToTenantAsync_UserWithDirectAccess_ReturnsTrue()
        {
            // Arrange
            var userId = "user1";
            var tenantId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                var access = new Backend.Database.Access { UserId = userId, User = user, ResourceId = tenantId.ToString(), ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.HasAccessToTenantAsync(userId, tenantId);

                // Assert
                Assert.True(result);
            }
        }

        [Fact]
        public async Task HasAccessToTenantAsync_ManagerWithMallAccess_ReturnsTrue()
        {
            // Arrange
            var userId = "user1";
            var mallId = 1;
            var tenantId = 2;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                var access = new Backend.Database.Access { UserId = userId, User = user, ResourceId = mallId.ToString(), ResourceType = ResourceType.Mall, Role = Role.Manager };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.HasAccessToTenantAsync(userId, tenantId);

                // Assert
                Assert.True(result);
            }
        }

        [Fact]
        public async Task HasAccessToTenantAsync_NoAccess_ReturnsFalse()
        {
            // Arrange
            var userId = "user1";
            var tenantId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000, Tenants = new List<Tenant>() };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.HasAccessToTenantAsync(userId, tenantId);

                // Assert
                Assert.False(result);
            }
        }

        [Fact]
        public async Task GetAccessibleTenantIdsAsync_UserWithAccess_ReturnsIds()
        {
            // Arrange
            var userId = "user1";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant1 = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image1.jpg", Mall = mall, MallId = mall.Id };
                var tenant2 = new Tenant { Id = 2, Name = "Tenant 2", Category = "Category", ImageUrl = "image2.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.AddRange(tenant1, tenant2);

                var access1 = new Backend.Database.Access { UserId = userId, User = user, ResourceId = "1", ResourceType = ResourceType.Store, Role = Role.Tenant };
                var access2 = new Backend.Database.Access { UserId = userId, User = user, ResourceId = "2", ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.AddRange(access1, access2);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetAccessibleTenantIdsAsync(userId);

                // Assert
                var tenantIds = result.ToList();
                Assert.Equal(2, tenantIds.Count);
                Assert.Contains(1, tenantIds);
                Assert.Contains(2, tenantIds);
            }
        }

        [Fact]
        public async Task AddTenantAccessAsync_ValidData_AddsAccess()
        {
            // Arrange
            var userEmail = "test@example.com";
            var tenantId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = userEmail, Email = userEmail };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await service.AddTenantAccessAsync(userEmail, tenantId);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var access = await context.Accesses.FirstOrDefaultAsync(a => a.ResourceId == tenantId.ToString() && a.User.Email == userEmail);
                Assert.NotNull(access);
                Assert.Equal(ResourceType.Store, access.ResourceType);
                Assert.Equal(Role.Tenant, access.Role);
            }
        }

        [Fact]
        public async Task AddTenantAccessAsync_UserNotFound_ThrowsException()
        {
            // Arrange
            var userEmail = "nonexistent@example.com";
            var tenantId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                context.SaveChanges();
            }

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<KeyNotFoundException>(() => service.AddTenantAccessAsync(userEmail, tenantId));
            }
        }

        [Fact]
        public async Task AddTenantAccessAsync_TenantNotFound_ThrowsException()
        {
            // Arrange
            var userEmail = "test@example.com";
            var nonExistentTenantId = 999;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = userEmail, Email = userEmail };
                context.Users.Add(user);

                context.SaveChanges();
            }

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<KeyNotFoundException>(() => service.AddTenantAccessAsync(userEmail, nonExistentTenantId));
            }
        }

        [Fact]
        public async Task AddTenantAccessAsync_DuplicateAccess_ThrowsException()
        {
            // Arrange
            var userEmail = "test@example.com";
            var tenantId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = userEmail, Email = userEmail };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = tenantId, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                var access = new Backend.Database.Access { UserId = user.Id, User = user, ResourceId = tenantId.ToString(), ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<InvalidOperationException>(() => service.AddTenantAccessAsync(userEmail, tenantId));
            }
        }

        [Fact]
        public async Task RemoveTenantAccessAsync_ExistingAccess_RemovesAccess()
        {
            // Arrange
            var accessId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                var access = new Backend.Database.Access { Id = accessId, UserId = user.Id, User = user, ResourceId = "1", ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await service.RemoveTenantAccessAsync(accessId);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var access = await context.Accesses.FindAsync(accessId);
                Assert.Null(access);
            }
        }

        [Fact]
        public async Task RemoveTenantAccessAsync_NonExistentAccess_ThrowsException()
        {
            // Arrange
            var nonExistentAccessId = 999;

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<KeyNotFoundException>(() => service.RemoveTenantAccessAsync(nonExistentAccessId));
            }
        }

        [Fact]
        public async Task RemoveTenantAccessByEmailAsync_ExistingAccess_RemovesAccess()
        {
            // Arrange
            var userEmail = "test@example.com";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = userEmail, Email = userEmail };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var tenant = new Tenant { Id = 1, Name = "Tenant 1", Category = "Category", ImageUrl = "image.jpg", Mall = mall, MallId = mall.Id };
                context.Tenants.Add(tenant);

                var access = new Backend.Database.Access { Id = 1, UserId = user.Id, User = user, ResourceId = "1", ResourceType = ResourceType.Store, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await service.RemoveTenantAccessByEmailAsync(userEmail);
            }

            // Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var access = await context.Accesses.FirstOrDefaultAsync(a => a.User.Email == userEmail);
                Assert.Null(access);
            }
        }

        [Fact]
        public async Task RemoveTenantAccessByEmailAsync_UserNotFound_ThrowsException()
        {
            // Arrange
            var nonExistentEmail = "nonexistent@example.com";

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<KeyNotFoundException>(() => service.RemoveTenantAccessByEmailAsync(nonExistentEmail));
            }
        }

        [Fact]
        public async Task RemoveTenantAccessByEmailAsync_NoAccessFound_ThrowsException()
        {
            // Arrange
            var userEmail = "test@example.com";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = "user1", UserName = userEmail, Email = userEmail };
                context.Users.Add(user);

                context.SaveChanges();
            }

            // Act & Assert
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                await Assert.ThrowsAsync<KeyNotFoundException>(() => service.RemoveTenantAccessByEmailAsync(userEmail));
            }
        }

        [Fact]
        public async Task GetManagerMallsAsync_ManagerWithAccess_ReturnsMalls()
        {
            // Arrange
            var userId = "user1";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall1 = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                var mall2 = new Mall { Id = 2, Name = "Mall 2", Address = "Address 2", TotalArea = 2000 };
                context.Malls.AddRange(mall1, mall2);

                var access1 = new Backend.Database.Access { UserId = userId, User = user, ResourceId = "1", ResourceType = ResourceType.Mall, Role = Role.Manager };
                var access2 = new Backend.Database.Access { UserId = userId, User = user, ResourceId = "2", ResourceType = ResourceType.Mall, Role = Role.Manager };
                context.Accesses.AddRange(access1, access2);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetManagerMallsAsync(userId);

                // Assert
                Assert.Equal(2, result.Count);
                Assert.Contains(result, m => m.Name == "Mall 1");
                Assert.Contains(result, m => m.Name == "Mall 2");
            }
        }

        [Fact]
        public async Task GetManagerMallsAsync_NoAccess_ReturnsEmptyList()
        {
            // Arrange
            var userId = "user1";

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = 1, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.GetManagerMallsAsync(userId);

                // Assert
                Assert.Empty(result);
            }
        }

        [Fact]
        public async Task ManagerHasAccessToMallAsync_WithAccess_ReturnsTrue()
        {
            // Arrange
            var userId = "user1";
            var mallId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                var access = new Backend.Database.Access { UserId = userId, User = user, ResourceId = mallId.ToString(), ResourceType = ResourceType.Mall, Role = Role.Manager };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.ManagerHasAccessToMallAsync(userId, mallId);

                // Assert
                Assert.True(result);
            }
        }

        [Fact]
        public async Task ManagerHasAccessToMallAsync_NoAccess_ReturnsFalse()
        {
            // Arrange
            var userId = "user1";
            var mallId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.ManagerHasAccessToMallAsync(userId, mallId);

                // Assert
                Assert.False(result);
            }
        }

        [Fact]
        public async Task ManagerHasAccessToMallAsync_WrongRole_ReturnsFalse()
        {
            // Arrange
            var userId = "user1";
            var mallId = 1;

            using (var context = new ApplicationDbContext(_options))
            {
                var user = new User { Id = userId, UserName = "test@example.com" };
                context.Users.Add(user);

                var mall = new Mall { Id = mallId, Name = "Mall 1", Address = "Address 1", TotalArea = 1000 };
                context.Malls.Add(mall);

                // Access with Tenant role instead of Manager
                var access = new Backend.Database.Access { UserId = userId, User = user, ResourceId = mallId.ToString(), ResourceType = ResourceType.Mall, Role = Role.Tenant };
                context.Accesses.Add(access);

                context.SaveChanges();
            }

            // Act
            using (var context = new ApplicationDbContext(_options))
            {
                var service = new AccessService(context, _mockConfiguration.Object, _mockHttpContextAccessor.Object);
                var result = await service.ManagerHasAccessToMallAsync(userId, mallId);

                // Assert
                Assert.False(result);
            }
        }
    }
}