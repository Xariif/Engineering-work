using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Turnover
{
    public int Id { get; set; }

    public int StoreId { get; set; }

    public decimal Value { get; set; }

    public DateOnly Date { get; set; }

    public int AssignedBy { get; set; }

    public virtual User AssignedByNavigation { get; set; } = null!;

    public virtual Store Store { get; set; } = null!;
}
