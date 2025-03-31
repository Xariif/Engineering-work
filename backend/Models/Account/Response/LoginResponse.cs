using System;

namespace backend.Models.Account.Response;

public class LoginResponse
{
    public required string Token { get; set; }
    public required string FirstName { get; set; }
    public required string LastName { get; set; }
    public required string PhoneNumber { get; set; }
    public required string Email { get; set; }
    public required string Role { get; set; }
}
