using ServiceDirectory.Common.Config;
using System;
using System.Linq;
using System.Net;
using System.Net.Mail;
using System.Text;

namespace ServiceDirectory.Common
{
    public class EmailUtility
    {
        public static SmtpClient GetSmtpClient(Smtp smtp)
        {
            var credentials = !string.IsNullOrEmpty(smtp.Username) && !string.IsNullOrEmpty(smtp.Password)
                ? new NetworkCredential(smtp.Username, smtp.Password)
                : null;

            var client = new SmtpClient(smtp.Host, smtp.Port)
            {
                Credentials = credentials,
                EnableSsl = smtp.EnableSsl,
                DeliveryMethod = SmtpDeliveryMethod.Network,
            };

            return client;
        }

        public static void Send(Smtp smtp, string from, string[] to, string subject, string body, bool isHtml = true)
        {
            var message = new MailMessage()
            {
                From = new MailAddress(from),
                Subject = subject,
                Body = body,
                BodyEncoding = Encoding.UTF8,
                IsBodyHtml = isHtml
            };

            to.ToList().ForEach(t => message.To.Add(t));

            Send(smtp, message);
        }

        public static void Send(Smtp smtp, MailMessage message)
        {
            var client = GetSmtpClient(smtp);

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
