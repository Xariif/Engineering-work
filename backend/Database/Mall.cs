using EngineeringWork.Backend.Database;
using System.ComponentModel.DataAnnotations;

namespace Backend.Database
{
    public class Mall
    {
        [Key]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required double TotalArea { get; set; }
        public ICollection<Tenant> Tenants { get; set; } = new List<Tenant>();
    }
}
