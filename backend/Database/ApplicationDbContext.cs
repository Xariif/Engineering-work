using Backend.Database;
using EngineeringWork.Backend.Database;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace backend.Database
{
    public class ApplicationDbContext : IdentityDbContext<User>
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options) { }

        public DbSet<Mall> Malls { get; set; }
        public DbSet<Tenant> Tenants { get; set; }
        public DbSet<TenantPeriod> TenantPeriods { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Mall → Store (One-to-Many)
            builder
                .Entity<Tenant>()
                .HasOne(s => s.Mall)
                .WithMany(m => m.Tenants)
                .HasForeignKey(s => s.MallId)
                .OnDelete(DeleteBehavior.Cascade);

            // Store → TenantPeriod (One-to-Many)
            builder
                .Entity<TenantPeriod>()
                .HasOne(tp => tp.Tenant)
                .WithMany(s => s.TenantPeriods)
                .HasForeignKey(tp => tp.TenantId)
                .OnDelete(DeleteBehavior.Cascade);

            // TenantPeriod → Turnover (One-to-Many)
            builder
                .Entity<Turnover>()
                .HasOne(t => t.TenantPeriod)
                .WithMany(tp => tp.Turnovers)
                .HasForeignKey(t => t.TenantPeriodId)
                .OnDelete(DeleteBehavior.Cascade);

            // Turnover → User (Many-to-One)
            builder
                .Entity<Turnover>()
                .HasOne(t => t.User)
                .WithMany()
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
