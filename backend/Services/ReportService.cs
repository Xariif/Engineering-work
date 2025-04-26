using System;
using backend.Database;

namespace backend.Services;

public class ReportService : BaseService
{
    public ReportService(
      ApplicationDbContext context,
      IConfiguration configuration,
      IHttpContextAccessor httpContextAccessor
  )
      : base(context, configuration, httpContextAccessor)
    {
    }


}
