using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using Microsoft.AspNetCore.Identity;
using EngineeringWork.Backend.Database;

namespace backend.Database
{
    public class Turnover
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public required decimal Value { get; set; }
        public required DateTime Date { get; set; }
        public int? TenantId { get; set; }
        [ForeignKey("TenantId")]
        public Tenant? Tenant { get; set; }
        [ForeignKey("UserId")]
        public required string UserId { get; set; }
        public required User User { get; set; }
    }
}
