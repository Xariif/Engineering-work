using System;

namespace backend.Models.Account.Request;

public class AddPermissionsRequest
{
    public required string Email { get; set; }
    public required string Role { get; set; }
    public required string[] ResourcesIds { get; set;}
}
