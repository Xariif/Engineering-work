using System;

namespace backend.Models.Account.Request;

public class SendInvitationRequest
{
    public required string Email { get; set; }
    public required string Role { get; set; }
    public required IEnumerable<string> Resources { get; set; }

}
