using System;

namespace backend.Models.Account.Request;

public class DeletePermissionsRequest
{
    public required string Email { get; set; }
    public required string[] ResourcesIds { get; set;}

}
