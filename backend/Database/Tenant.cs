using System.ComponentModel.DataAnnotations;
using Backend.Database;

namespace EngineeringWork.Backend.Database
{
    public class Tenant
    {
        [Key]
        public int Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string ImageUrl { get; set; }
        public int MallId { get; set; }
        public Mall Mall { get; set; }
        public ICollection<TenantPeriod> TenantPeriods { get; set; }
    }
}
