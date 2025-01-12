using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Store
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public int MallId { get; set; }

    public virtual Mall Mall { get; set; } = null!;

    public virtual ICollection<Turnover> Turnovers { get; set; } = new List<Turnover>();
}
