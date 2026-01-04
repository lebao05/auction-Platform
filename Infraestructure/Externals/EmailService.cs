using Application.Abstractions;
using Infraestructure.Options;
using MailKit.Security;
using Microsoft.Extensions.Options;
using MimeKit;

namespace Infraestructure.Externals
{
    public class EmailService : IEmailService
    {
        private readonly EmailSettings _settings;

        public EmailService(IOptions<EmailSettings> options)
        {
            _settings = options.Value;
        }
        public async Task SendAsync(string to, string subject, string body, bool isHtml = true)
        {
            var email = new MimeMessage();
            email.From.Add(MailboxAddress.Parse(_settings.From));
            email.To.Add(MailboxAddress.Parse(to));
            email.Subject = subject;

            email.Body = new TextPart(isHtml ? "html" : "plain")
            {
                Text = body
            };

            // FIX: Use MailKit.Net.Smtp.SmtpClient instead of System.Net.Mail.SmtpClient
            using var smtp = new MailKit.Net.Smtp.SmtpClient();
            await smtp.ConnectAsync(_settings.Host, _settings.Port, SecureSocketOptions.StartTls);
            await smtp.AuthenticateAsync(_settings.Username, _settings.Password);

            await smtp.SendAsync(email);
            await smtp.DisconnectAsync(true);
        }
    }
}
