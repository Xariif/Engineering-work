using System;
using System.Collections.Generic;

namespace backend.Models;

public partial class UserRole
{
    public int UserId { get; set; }

    public int RoleId { get; set; }

    public int? MallId { get; set; }

    public int? StoreId { get; set; }

    public virtual Mall? Mall { get; set; }

    public virtual Role Role { get; set; } = null!;

    public virtual Store? Store { get; set; }

    public virtual User User { get; set; } = null!;
}
