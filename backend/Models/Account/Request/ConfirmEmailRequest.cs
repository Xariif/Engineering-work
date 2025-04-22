using System;

namespace backend.Models.Account.Request;

public class ConfirmEmailRequest
{
    public required string Email { get; set; }
    public required string Token { get; set; }
} 