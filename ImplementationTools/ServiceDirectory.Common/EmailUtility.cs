using System;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace ServiceDirectory.Common
{
    public class EmailUtility
    {
        public static SmtpClient GetSmtpClient()
        {
            var credentials = !string.IsNullOrEmpty(Settings.Smtp.Username) && !string.IsNullOrEmpty(Settings.Smtp.Password)
                ? new NetworkCredential(Settings.Smtp.Username, Settings.Smtp.Password)
                : null;

            var client = new SmtpClient(Settings.Smtp.Host, Settings.Smtp.Port)
            {
                Credentials = credentials,
                EnableSsl = Settings.Smtp.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            return client;
        }

        public static void Send(string from, string to, string subject, string body, bool isHtml = false)
        {
            var message = new MailMessage(from, to)
            {
                Subject = subject,
                Body = body,
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = isHtml
            };

            Send(message);
        }

        public static void Send(MailMessage message)
        {
            var client = GetSmtpClient();

            try
            {
                client.Send(message);
            }
            catch (Exception e)
            {
                Console.Error.WriteLine("Could not send e-mail to " + message.To + ".\n" + message.Subject + "\n" + e.Message);
            }
        }
    }
}
