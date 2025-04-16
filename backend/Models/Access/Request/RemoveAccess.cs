namespace backend.Models.Access.Request;

public class RemoveAccess
{
    public required string UserEmail { get; set; }
    public required int ResourceId { get; set; }
} 