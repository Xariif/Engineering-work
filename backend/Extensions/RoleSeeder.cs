using backend.Database;
using Backend.Database;
using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.DependencyInjection;

namespace backend.Extensions
{
    public static class RoleSeeder
    {
        public static async Task SeedRolesAsync(IServiceProvider serviceProvider)
        {
            var roleManager = serviceProvider.GetRequiredService<RoleManager<IdentityRole>>();
            var userManager = serviceProvider.GetRequiredService<UserManager<User>>();
            var dbContext = serviceProvider.GetRequiredService<ApplicationDbContext>();

            // Define roles
            string[] roles = { "Tenant", "Manager" };

            // Create roles if they don't exist
            foreach (var role in roles)
            {
                if (!await roleManager.RoleExistsAsync(role))
                {
                    await roleManager.CreateAsync(new IdentityRole(role));
                }
            }

            // Create a default manager account
            var managerEmail = "manager@example.com";
            var managerPassword = "Manager123!";
            var managerUser = await userManager.FindByEmailAsync(managerEmail);

            if (managerUser == null)
            {
                managerUser = new User
                {
                    UserName = managerEmail,
                    Email = managerEmail,
                    Name = "Default",
                    Surname = "Manager",
                    PhoneNumber = "123456789"
                };

                var result = await userManager.CreateAsync(managerUser, managerPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(managerUser, "Manager");
                }
                else
                {
                    throw new Exception($"Failed to create manager account: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                // Ensure the manager has the "Manager" role
                if (!await userManager.IsInRoleAsync(managerUser, "Manager"))
                {
                    await userManager.AddToRoleAsync(managerUser, "Manager");
                }
            }

            // Create a default tenant account
            var tenantEmail = "tenant@example.com";
            var tenantPassword = "Tenant123!";
            var tenantUser = await userManager.FindByEmailAsync(tenantEmail);

            if (tenantUser == null)
            {
                tenantUser = new User
                {
                    UserName = tenantEmail,
                    Email = tenantEmail,
                    Name = "Default",
                    Surname = "Tenant",
                    PhoneNumber = "987654321"
                };

                var result = await userManager.CreateAsync(tenantUser, tenantPassword);
                if (result.Succeeded)
                {
                    await userManager.AddToRoleAsync(tenantUser, "Tenant");

                    // Assign default access to the tenant
                    var defaultAccess = new List<Access>
                    {
                        new Access
                        {
                            User = tenantUser,
                            UserId = tenantUser.Id,
                            ResourceId = "Mall1",
                            ResourceType = ResourceType.Mall,
                            Role = Role.Tenant
                        },
                        new Access
                        {
                            User = tenantUser,
                            UserId = tenantUser.Id,
                            ResourceId = "Store1",
                            ResourceType = ResourceType.Store,
                            Role = Role.Tenant
                        }
                    };

                    dbContext.Accesses.AddRange(defaultAccess);
                    await dbContext.SaveChangesAsync();
                }
                else
                {
                    throw new Exception($"Failed to create tenant account: {string.Join(", ", result.Errors.Select(e => e.Description))}");
                }
            }
            else
            {
                // Ensure the tenant has the "Tenant" role
                if (!await userManager.IsInRoleAsync(tenantUser, "Tenant"))
                {
                    await userManager.AddToRoleAsync(tenantUser, "Tenant");
                }

                // Ensure the tenant has default access
                var existingAccess = dbContext.Accesses.Where(a => a.UserId == tenantUser.Id).ToList();
                if (!existingAccess.Any())
                {
                    var defaultAccess = new List<Access>
                    {
                        new Access
                        {
                            User = tenantUser,
                            UserId = tenantUser.Id,
                            ResourceId = "1",
                            ResourceType = ResourceType.Mall,
                            Role = Role.Tenant
                        },
                        new Access
                        {
                            User = tenantUser,
                            UserId = tenantUser.Id,
                            ResourceId = "1",
                            ResourceType = ResourceType.Store,
                            Role = Role.Tenant
                        }
                    };

                    dbContext.Accesses.AddRange(defaultAccess);
                    await dbContext.SaveChangesAsync();
                }
            }
        }
    }
}
