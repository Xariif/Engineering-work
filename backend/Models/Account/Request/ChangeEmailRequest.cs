using System;

namespace backend.Models.Account.Request;

public class ChangeEmailRequest
{ 
    public required string UserId { get; set; }
    public required string NewEmail { get; set; }
}
