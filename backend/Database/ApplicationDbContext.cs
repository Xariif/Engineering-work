using Backend.Database;
using EngineeringWork.Backend.Database;
using Microsoft.AspNetCore.Identity;
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
        public DbSet<Turnover> Turnovers { get; set; }
        public DbSet<Access> Accesses { get; set; }
        public DbSet<Newsletter> Newsletters { get; set; }

        protected override void OnModelCreating(ModelBuilder builder)
        {
            base.OnModelCreating(builder);

            // Mall → Tenant (One-to-Many)
            builder
                .Entity<Tenant>()
                .HasOne(s => s.Mall)
                .WithMany(m => m.Tenants)
                .HasForeignKey(s => s.MallId)
                .OnDelete(DeleteBehavior.Cascade);

            // Turnover → User (Many-to-One)
            builder
                .Entity<Turnover>()
                .HasOne(u => u.User)
                .WithMany(u => u.Turnovers)
                .HasForeignKey(t => t.UserId)
                .OnDelete(DeleteBehavior.NoAction);

            // Access → User (Many-to-One)
            builder
                .Entity<Access>()
                .HasOne(a => a.User)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            // User -> Newsletter (One-to-Many)
            builder
                .Entity<Newsletter>()
                .HasOne(n => n.User)
                .WithMany()
                .HasForeignKey(n => n.UserId)
                .OnDelete(DeleteBehavior.Restrict);
        }
    }
}
