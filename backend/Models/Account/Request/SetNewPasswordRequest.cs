using System;

namespace backend.Models.Account.Request;

public class SetNewPasswordRequest
{
    public required string Password { get; set; }
    public required string ConfirmPassword { get; set; }
    public required string Token { get; set; }
    public required string Email { get; set; }
}
