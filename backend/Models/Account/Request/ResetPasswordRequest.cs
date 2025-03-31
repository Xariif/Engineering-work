using System;

namespace backend.Models.Account.Request;

public class ResetPasswordRequest
{
    public required string Email { get; set; }
}
