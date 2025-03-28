using backend.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    [ApiController]
    public abstract class BaseController : ControllerBase
    {        
         protected readonly ApplicationDbContext _context;

         protected BaseController(ApplicationDbContext context)
         {
             _context = context;
         }
    }
}
