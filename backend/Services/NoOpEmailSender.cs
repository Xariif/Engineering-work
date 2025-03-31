using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace backend.Services
{
    public class NoOpEmailSender : Microsoft.AspNetCore.Identity.IEmailSender<IdentityUser>
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendConfirmationLinkAsync(IdentityUser user, string link, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendPasswordResetLinkAsync(IdentityUser user, string link, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendPasswordResetCodeAsync(IdentityUser user, string code, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }
    }
}
