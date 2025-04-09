using backend.Database;
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
        }
    }
}
