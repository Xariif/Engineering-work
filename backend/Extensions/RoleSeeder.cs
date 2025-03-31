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
            var userManager = serviceProvider.GetRequiredService<UserManager<IdentityUser>>();

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

            // Optionally, assign roles to specific users
            var user = await userManager.FindByEmailAsync("manager@example.com");
            if (user != null && !await userManager.IsInRoleAsync(user, "Manager"))
            {
                await userManager.AddToRoleAsync(user, "Manager");
            }
        }
    }
}
