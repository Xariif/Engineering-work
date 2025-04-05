using System;

namespace backend.Models.Account.Response;

public class ResetPasswordResponse
{
    public required string Token { get; set; }
}
