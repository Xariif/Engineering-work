using backend.Database;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;


namespace backend.Controllers
{
    public abstract class BaseController : ControllerBase
    {
        protected readonly IConfiguration _configuration;

        public BaseController(
            IConfiguration configuration
        )
        {
            _configuration = configuration;
        }
    }
}
