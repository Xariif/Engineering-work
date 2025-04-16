using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace Backend.Database
{
    public class Access
    {
        [Key]
        public int Id { get; set; }

        [ForeignKey("UserId")]
        public required string UserId { get; set; }
        public required User User { get; set; }
        public required string ResourceId { get; set; } // ID of the resource (e.g., Mall1, Store1)
        public ResourceType ResourceType { get; set; }
        public Role Role { get; set; }
    }

    public enum Role
    {
        Manager,
        Tenant,
    }

    public enum ResourceType
    {
        Mall = 0,
        Store = 1,
    }
}
