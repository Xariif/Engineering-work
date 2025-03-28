using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;

public class Turnover
{
    [Key]
    public int Id { get; set; }
    [ForeignKey("TenantPeriodId")]
    public int TenantPeriodId { get; set; }
    public TenantPeriod TenantPeriod { get; set; }
    public decimal Value { get; set; }
    public DateTime Date { get; set; }
    [ForeignKey("UserId")]
    public string UserId { get; set; }
    public User User { get; set; }
}
