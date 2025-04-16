using System;

namespace backend.Models.Access.Request;

public class AddAccess
{
    public required string UserEmail { get; set; }
    public required int ResourceId { get; set; } 
}
