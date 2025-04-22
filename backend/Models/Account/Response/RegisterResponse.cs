using System;

namespace backend.Models.Account.Response;

public class RegisterResponse
{
    public required string UserId { get; set; }
    public required string Name { get; set; }
    public required string Surname { get; set; }
    public required string Email { get; set; }
    public required string Token { get; set; }
}
