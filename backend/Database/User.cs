using System;
using Microsoft.AspNetCore.Identity;

namespace backend.Database;

public class User : IdentityUser
{
        public string Name { get; set; }  = string.Empty;
        public string Surname { get; set; } = string.Empty;
        public ICollection<Turnover> Turnovers { get; set; } = new List<Turnover>();
        public bool IsActive { get; set; } = false;
}
