using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace backend.Services
{
    public class NoOpEmailSender : Microsoft.AspNetCore.Identity.IEmailSender<User>
    {
        public Task SendEmailAsync(string email, string subject, string message)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendConfirmationLinkAsync(User user, string link, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendPasswordResetLinkAsync(User user, string link, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }

        public Task SendPasswordResetCodeAsync(User user, string code, string subject)
        {
            // No-op implementation
            return Task.CompletedTask;
        }
    }
}
