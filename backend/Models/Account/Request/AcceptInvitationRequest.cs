using System;

namespace backend.Models.Account.Request;

public class AcceptInvitationRequest
{
    public required string Token { get; set; }
    public required string Email { get; set; }
    public required string Password { get; set; }
}
