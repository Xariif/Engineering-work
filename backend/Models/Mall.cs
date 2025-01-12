using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class Mall
{
    public int Id { get; set; }

    public string Name { get; set; } = null!;

    public string Location { get; set; } = null!;

    public virtual ICollection<Store> Stores { get; set; } = new List<Store>();
}
