

using System.ComponentModel.DataAnnotations.Schema;
using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace Backend.Database
{
    public class Newsletter
    {
        public required int Id { get; set; }
        public required string Title { get; set; }
        public required string Content { get; set; }
        public required DateTime CreatedAt { get; set; }
        public required DateTime UpdatedAt { get; set; }

        [ForeignKey("MallId")]
        public required int MallId { get; set; }
        public required Mall Mall { get; set; }

        [ForeignKey("UserId")]
        public required string UserId { get; set; }
        public required User User { get; set; }
    }
}