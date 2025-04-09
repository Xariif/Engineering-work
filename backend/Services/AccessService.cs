using System;
using backend.Database;
using backend.Models.Access.Response;
using Backend.Database;

namespace backend.Services;

public class AccessService : BaseService
{
    public AccessService(
        ApplicationDbContext context,
        IConfiguration configuration,
        IHttpContextAccessor httpContextAccessor
    )
        : base(context, configuration, httpContextAccessor)
    {
    }

    
    public GetAccessData GetAccessData()
    {
        var malls = _context.Malls
            .Select(m => new backend.Models.Access.Response.Mall
            {
                Name = m.Name,
                Address = m.Address,
                Stores = m.Tenants.Select(s => new Store
                {
                    Name = s.Name,
                    ImageUrl = s.ImageUrl,
                //    Accesses = s.
                   
                }).ToList()
            }).ToList();

        return new GetAccessData { Malls = malls };
    }

}
