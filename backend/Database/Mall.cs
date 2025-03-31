using System.ComponentModel.DataAnnotations;
using EngineeringWork.Backend.Database;

namespace Backend.Database
{
    public class Mall
    {
        [Key]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Address { get; set; }
        public required double TotalArea { get; set; }
        public required ICollection<Tenant> Tenants { get; set; }
    }
}
