using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Database;
using backend.Database;

namespace EngineeringWork.Backend.Database
{
    public class Tenant
    {
        [Key]
        public required int Id { get; set; }
        public required string Name { get; set; }
        public required string Category { get; set; }
        public required string ImageUrl { get; set; }
        [ForeignKey("MallId")]
        public required int MallId { get; set; }
        public required Mall Mall { get; set; }
        public required ICollection<Turnover> Turnovers{ get; set; }
    }
}
