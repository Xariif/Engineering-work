using backend.Controllers;
using backend.Database;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Backend.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class TurnoverController : BaseController 
    {
        public TurnoverController( 
            IConfiguration configuration
        ) : base(configuration)
        {
        }

        /*
         public TurnoverController(ApplicationDbContext context) : base(context)
        {
        }

        [HttpPut("{id}")]
        [Authorize(Roles = "Manager")]
        public IActionResult EditTurnover(int id)
        {

            // Logic for editing turnover
            return Ok(new { Message = "Turnover edited successfully", TurnoverId = id });
        }

        [HttpPost]
        [Authorize(Roles = "Tenant")]
        public IActionResult AddTurnover([FromBody] object turnoverData)
        {
            // Logic for adding turnover
            return CreatedAtAction(nameof(AddTurnover), new { Message = "Turnover added successfully" });
        }
        */
       
    }
}