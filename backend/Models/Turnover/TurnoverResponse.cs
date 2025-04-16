using System;
using backend.Database;

namespace backend.Models.Turnover
{
    public class TurnoverResponse
    {
        public int Id { get; set; }
        public decimal Value { get; set; }
        public DateTime Date { get; set; }
        public int? TenantId { get; set; }
        public string TenantName { get; set; }
        public string UserId { get; set; }
        public string UserName { get; set; }

        public static TurnoverResponse FromEntity(backend.Database.Turnover turnover)
        {
            return new TurnoverResponse
            {
                Id = turnover.Id,
                Value = turnover.Value,
                Date = turnover.Date,
                TenantId = turnover.TenantId,
                TenantName = turnover.Tenant?.Name,
                UserId = turnover.UserId,
                UserName = $"{turnover.User.Name} {turnover.User.Surname}".Trim()
            };
        }
    }
} 