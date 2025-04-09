using System;
using System.Collections.Generic;
using System.Linq;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize(Roles = "Manager")]
public class AccessController : BaseController
{
    private readonly AccountService _accountService;

    public AccessController(IConfiguration configuration, AccountService accountService)
        : base(configuration)
    {
        _accountService = accountService;
    }

}
