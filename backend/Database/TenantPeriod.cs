

using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Backend.Database;
using EngineeringWork.Backend.Database;

public class TenantPeriod
{
    [Key]
    public int Id { get; set; }
    [ForeignKey("TenantId")]
    public int TenantId { get; set; }
    public Tenant Tenant { get; set; }
    public int MallId { get; set; }
    public Mall Mall { get; set; }
    public DateTime StartDate { get; set; }
    public ICollection<Turnover> Turnovers { get; set; }

}