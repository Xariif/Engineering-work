using System.Net;
using System.Net.Mail;
using System.Net.Security;
using System.Security.Cryptography.X509Certificates;
using System.Text;
using backend.Database;
using Microsoft.AspNetCore.Identity;

namespace backend.Services
{
    public class CustomEmailSender : IEmailSender<User>
    {
        private readonly IConfiguration _config;

        public CustomEmailSender(IConfiguration config)
        {
            _config = config;
        }

        private async Task SendAsync(string to, string subject, string message)
        {
            // Get email settings from appsettings.json
            var smtpServer = _config["EmailSettings:Server"];
            var smtpPort = int.Parse(_config["EmailSettings:Port"]);
            var smtpUsername = _config["EmailSettings:Username"];
            var smtpPassword = _config["EmailSettings:Password"];

            SmtpClient client = new SmtpClient(smtpServer, smtpPort);
            client.DeliveryMethod = SmtpDeliveryMethod.Network;
            client.EnableSsl = true;
            client.UseDefaultCredentials = false;
            client.Credentials = new NetworkCredential(smtpUsername, smtpPassword);

            client.Timeout = 30000;

            MailMessage mailMessage = new MailMessage();
            mailMessage.From = new MailAddress("jakubfiliks7@gmail.com");
            mailMessage.To.Add(to);
            mailMessage.Subject = subject;
            mailMessage.IsBodyHtml = true;
            mailMessage.Body = message;

            try
            {
                await client.SendMailAsync(mailMessage);
            }
            catch (System.Exception ex) { }
        }

        public Task SendEmailAsync(string email, string subject, string message) =>
            SendAsync(email, subject, message);

        public Task SendConfirmationLinkAsync(User user, string email, string token) =>
            SendAsync(
                email,
                "Confirm your email",
                $@"<!DOCTYPE html>
<html>
<head>
    <title>Email Confirmation</title>
</head>
<body>
    <h2>Email Confirmation</h2>
    <p>Thank you for registering. Please confirm your email address by clicking the link below:</p>
    <a href='{_config["FrontendUrl"]}/confirm-account?token={token}&email={email}'>Activate Your Account</a>
</body>
</html>"
            );

        public Task SendPasswordResetLinkAsync(User user, string email, string token) =>
            SendAsync(
                email,
                "Reset your password",
                $@"<!DOCTYPE html>
<html>
<head>
    <title>Password Reset</title>
</head>
<body>
    <h2>Password Reset</h2>
    <p>Click the link below to reset your password:</p>
    <a href='{_config["FrontendUrl"]}/reset-password?token={token}&email={email}'>Reset Password</a>
</body>
</html>"
            );

        public Task SendPasswordResetCodeAsync(User user, string code, string subject) =>
            throw new NotImplementedException();
    }
}
