using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using backend.Database;
using backend.Models.Account.Request;
using backend.Models.Account.Response;
using backend.Services;
using Backend.Database;
using EngineeringWork.Backend.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Moq;
using Xunit;

namespace backend.Test.Services
{
    public class AccountServiceTests
    {
        private readonly DbContextOptions<ApplicationDbContext> _options;
        private readonly Mock<IConfiguration> _mockConfiguration;
        private readonly Mock<IHttpContextAccessor> _mockHttpContextAccessor;
        private readonly Mock<UserManager<User>> _mockUserManager;
        private readonly Mock<SignInManager<User>> _mockSignInManager;
        private readonly Mock<RoleManager<IdentityRole>> _mockRoleManager;

        public AccountServiceTests()
        {
            _options = new DbContextOptionsBuilder<ApplicationDbContext>()
                .UseInMemoryDatabase(databaseName: Guid.NewGuid().ToString())
                .Options;
                
            _mockConfiguration = new Mock<IConfiguration>();
            _mockHttpContextAccessor = new Mock<IHttpContextAccessor>();
            
            // Setup UserManager mock
            var userStoreMock = new Mock<IUserStore<User>>();
            _mockUserManager = new Mock<UserManager<User>>(
                userStoreMock.Object, null, null, null, null, null, null, null, null);
                
            // Setup SignInManager mock
            _mockSignInManager = new Mock<SignInManager<User>>(
                _mockUserManager.Object, 
                new Mock<IHttpContextAccessor>().Object, 
                new Mock<IUserClaimsPrincipalFactory<User>>().Object, 
                null, null, null, null);
                
            // Setup RoleManager mock
            var roleStoreMock = new Mock<IRoleStore<IdentityRole>>();
            _mockRoleManager = new Mock<RoleManager<IdentityRole>>(
                roleStoreMock.Object, null, null, null, null);
        }
        
        [Fact]
        public async Task Login_ValidCredentials_ReturnsLoginResponse()
        {
            // Arrange
            var user = new User 
            { 
                Id = "user1", 
                UserName = "test@example.com", 
                Email = "test@example.com",
                Name = "Test",
                Surname = "User",
                IsActive = true
            };
            
            var loginRequest = new LoginRequest
            {
                Email = "test@example.com",
                Password = "Password123!"
            };
            
            _mockUserManager.Setup(um => um.FindByEmailAsync("test@example.com"))
                .ReturnsAsync(user);
                
            _mockUserManager.Setup(um => um.CheckPasswordAsync(user, "Password123!"))
                .ReturnsAsync(true);
                
            _mockUserManager.Setup(um => um.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "Tenant" });
                
            _mockConfiguration.Setup(c => c["Jwt:Key"])
                .Returns("your-256-bit-secret-key-used-for-jwt-encryption");
            _mockConfiguration.Setup(c => c["Jwt:Issuer"])
                .Returns("your-issuer");

            using (var context = new ApplicationDbContext(_options))
            {
                // Act
                var service = new AccountService(
                    context, 
                    _mockConfiguration.Object,
                    _mockUserManager.Object,
                    _mockSignInManager.Object,
                    _mockRoleManager.Object,
                    _mockHttpContextAccessor.Object);
                    
                var result = await service.LoginAsync(loginRequest);
                
                // Assert
                Assert.NotNull(result);
                Assert.NotNull(result.Token);
                Assert.Equal("Test", result.FirstName);
                Assert.Equal("User", result.LastName);
                Assert.Equal("test@example.com", result.Email);
                Assert.Equal("Tenant", result.Role);
            }
        }
        
        [Fact]
        public async Task Login_InactiveUser_ThrowsException()
        {
            // Arrange
            var user = new User 
            { 
                Id = "user1", 
                UserName = "test@example.com", 
                Email = "test@example.com",
                IsActive = false
            };
            
            var loginRequest = new LoginRequest
            {
                Email = "test@example.com",
                Password = "Password123!"
            };
            
            _mockUserManager.Setup(um => um.FindByEmailAsync("test@example.com"))
                .ReturnsAsync(user);

            using (var context = new ApplicationDbContext(_options))
            {
                // Act & Assert
                var service = new AccountService(
                    context, 
                    _mockConfiguration.Object,
                    _mockUserManager.Object,
                    _mockSignInManager.Object,
                    _mockRoleManager.Object,
                    _mockHttpContextAccessor.Object);
                    
                await Assert.ThrowsAsync<Exception>(() => service.LoginAsync(loginRequest));
            }
        }
        
        [Fact]
        public async Task Register_ValidData_CreatesUser()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                Email = "newuser@example.com",
                Password = "Password123!",
                ConfirmPassword = "Password123!",
                FirstName = "New",
                LastName = "User",
                PhoneNumber = "123456789"
            };
            
            _mockUserManager.Setup(um => um.CreateAsync(It.IsAny<User>(), "Password123!"))
                .ReturnsAsync(IdentityResult.Success);
                
            _mockUserManager.Setup(um => um.AddToRoleAsync(It.IsAny<User>(), "Tenant"))
                .ReturnsAsync(IdentityResult.Success);

            using (var context = new ApplicationDbContext(_options))
            {
                // Act
                var service = new AccountService(
                    context, 
                    _mockConfiguration.Object,
                    _mockUserManager.Object,
                    _mockSignInManager.Object,
                    _mockRoleManager.Object,
                    _mockHttpContextAccessor.Object);
                    
                var result = await service.RegisterAsync(registerRequest);
                
                // Assert
                Assert.NotNull(result);
                Assert.Equal("newuser@example.com", result.Email);
                Assert.Equal("New", result.Name);
                Assert.Equal("User", result.Surname);
                Assert.Equal("123456789", result.PhoneNumber);
                Assert.False(result.IsActive);
            }
        }
        
        [Fact]
        public async Task Register_PasswordMismatch_ThrowsException()
        {
            // Arrange
            var registerRequest = new RegisterRequest
            {
                Email = "newuser@example.com",
                Password = "Password123!",
                ConfirmPassword = "DifferentPassword!",
                FirstName = "New",
                LastName = "User",
                PhoneNumber = "123456789"
            };

            using (var context = new ApplicationDbContext(_options))
            {
                // Act & Assert
                var service = new AccountService(
                    context, 
                    _mockConfiguration.Object,
                    _mockUserManager.Object,
                    _mockSignInManager.Object,
                    _mockRoleManager.Object,
                    _mockHttpContextAccessor.Object);
                    
                await Assert.ThrowsAsync<Exception>(() => service.RegisterAsync(registerRequest));
            }
        }
        
        [Fact]
        public async Task GetUserProfile_ExistingUser_ReturnsProfile()
        {
            // Arrange
            var userId = "user1";
            var user = new User 
            { 
                Id = userId, 
                UserName = "test@example.com", 
                Email = "test@example.com",
                Name = "Test",
                Surname = "User",
                PhoneNumber = "123456789",
                IsActive = true
            };
            
            _mockUserManager.Setup(um => um.FindByIdAsync(userId))
                .ReturnsAsync(user);
                
            _mockUserManager.Setup(um => um.GetRolesAsync(user))
                .ReturnsAsync(new List<string> { "Manager" });

            using (var context = new ApplicationDbContext(_options))
            {
                // Act
                var service = new AccountService(
                    context, 
                    _mockConfiguration.Object,
                    _mockUserManager.Object,
                    _mockSignInManager.Object,
                    _mockRoleManager.Object,
                    _mockHttpContextAccessor.Object);
                    
                var result = await service.GetProfileAsync(userId);
                
                // Assert
                Assert.NotNull(result);
                Assert.Equal("Test", result.FirstName);
                Assert.Equal("User", result.LastName);
                Assert.Equal("test@example.com", result.Email);
                Assert.Equal("123456789", result.PhoneNumber);
                Assert.Equal("Manager", result.Role);
            }
        }
    }
} 