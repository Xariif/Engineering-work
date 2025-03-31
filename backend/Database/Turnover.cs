using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using Microsoft.AspNetCore.Identity;

public class Turnover
{
    [Key]
    public required int Id { get; set; }
    [ForeignKey("TurnoverPeriodId")]
    public required int TurnoverPeriodId { get; set; }
    public required TurnoverPeriod TurnoverPeriod { get; set; }
    public required decimal Value { get; set; }
    public required DateTime Date { get; set; }
    [ForeignKey("UserId")]
    public required string UserId { get; set; }
    public required IdentityUser User { get; set; }
}
