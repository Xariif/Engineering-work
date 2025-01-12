using backend.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace backend.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {
        protected readonly MallDbContext _context;

        protected BaseController(MallDbContext context)
        {
            _context = context;
        }
    }
}
