using System.ComponentModel.DataAnnotations;
using EngineeringWork.Backend.Database;

namespace Backend.Database
{
    public class Mall
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Address { get; set; }
        public double TotalArea { get; set; }
        public ICollection<Tenant> Tenants { get; set; }
    }
}
