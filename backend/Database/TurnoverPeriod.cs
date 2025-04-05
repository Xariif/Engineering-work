

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Database;
using EngineeringWork.Backend.Database;

public class TurnoverPeriod
{
    [Key]
    public required int Id { get; set; }
    [ForeignKey("TenantId")]
    public required int TenantId { get; set; }
    public required Tenant Tenant { get; set; }
    public required DateTime StartDate { get; set; }
    public DateTime? EndDate { get; set; }
    public required int Month { get; set; }
    public required int Year { get; set; }
    public required ICollection<Turnover> Turnovers { get; set; }

}