using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ServiceDirectory.Common;
using ServiceDirectory.Common.Config;
using ServiceDirectory.Common.Validation;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Net.Http.Headers;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;

namespace ServiceDirectoryValidator.Controllers
{
    public class ApiController : Controller
    {
        private IConfiguration configuration;

        public ApiController(IConfiguration configuration)
        {
            this.configuration = configuration;
        }

        public ActionResult Index()
        {
            return Feeds();
        }

        public Settings Settings
        {
            get
            {
                return new Settings(configuration);
            }
        }

        public Smtp Smtp
        {
            get
            {
                return new Smtp(configuration);
            }
        }

        public ActionResult Config()
        {
            return Json(new
            {
                DefaultSupportEmail = Settings.DefaultSupportEmail,
                RegisterAlertEmail = Settings.RegisterAlertEmail,
                RegisteredOrganisationsUrl = Settings.RegisteredOrganisationsUrl,
                RegisteredUsersUrl = Settings.RegisteredUsersUrl
            });
        }

        private ActionResult GetUnauthorizedAction(HttpResponse response)
        {
            response.Headers.Add("WWW-Authenticate", "Basic");
            return Unauthorized();
        }

        private ActionResult Authenticate(Func<ActionResult> getSuccessAction)
        {
            var authorization = Request.Headers["Authorization"];
            var success = AuthenticationHeaderValue.TryParse(authorization, out AuthenticationHeaderValue value);

            if (!success)
                return GetUnauthorizedAction(Response);

            string decoded = null;

            try
            {
                var encoding = Encoding.GetEncoding("iso-8859-1");
                decoded = encoding.GetString(Convert.FromBase64String(value.Parameter));
            }
            catch (Exception e)
            {
                Console.Error.Write(e.Message);
            }

            if (string.IsNullOrWhiteSpace(decoded))
                return GetUnauthorizedAction(Response);

            var usernamePassword = decoded.Split(':');

            if (usernamePassword.Length != 2)
                return GetUnauthorizedAction(Response);

            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);
            var password = db.GetPassword(usernamePassword[0]);

            if (password != usernamePassword[1])
                return GetUnauthorizedAction(Response);

            return getSuccessAction();
        }

        public ActionResult Secret()
        {
            return Authenticate(() => Content($"Shhhh!"));
        }

        public JsonResult Feeds()
        {
            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);
            var feeds = db.GetFeeds();
            return Json(feeds);
        }

        [HttpPost]
        public JsonResult RegisterUser(string email_address)
        {
            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);

            if (!EmailPassesSanityCheck(email_address))
                return Json(new { success = false, errors = new[] { new FieldError("email_address", "Email does not look valid.") } });

            var existingUser = db.GetRegisteredUser(email_address);

            if (existingUser != null)
                return Json(new { success = false, error = "Already registered.", existingUser });

            db.RegisterUser(email_address);

            var user = db.GetRegisteredUser(email_address);

            if (user == null)
                return Json(new { success = false, error = "Unknown problem." });

            SendRegisteredUser(email_address);

            return Json(new { success = true, user });
        }

        public ActionResult RegisteredUsers()
        {
            return Authenticate(() => {
                var connectionString = configuration.GetConnectionString("oruk_validation");
                var db = new Db(connectionString);
                var users = db.GetRegisteredUsers();

                var accept = Request.Headers["Accept"].ToString();
                if (accept.Contains("text/html"))
                    return CovertToHtmlTable("Registered users", users);

                return Json(users);
            });
        }

        public class RegisterOrganisationParameters
        {
            public string organisation_name { get; set; }
            public string organisation_type { get; set; }
            public string adoptation_stage { get; set; }
            public string url { get; set; }
            public string private_email_address { get; set; }
            public string public_email_address { get; set; }
        }

        [HttpPost]
        public JsonResult RegisterOrganisation(RegisterOrganisationParameters parameters)
        {
            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);

            var errors = ValidateOrganisationParameters(parameters);

            if (errors.Length > 0)
                return Json(new { success = false, errors });

            var existingOrganisation = db.GetRegisteredOrganisation(parameters.private_email_address);

            if (existingOrganisation != null)
                return Json(new { success = false, error = "Already registered.", existingOrganisation });

            db.RegisterOrganisation(parameters.organisation_name, parameters.organisation_type, parameters.adoptation_stage, parameters.url, parameters.private_email_address, parameters.public_email_address);
            
            var organisation = db.GetRegisteredOrganisation(parameters.private_email_address);

            if (organisation == null)
                return Json(new { success = false, error = "Unknown problem." });

            SendRegisteredOrganisationEmail(parameters);

            return Json(new { success = true, organisation });
        }

        public ActionResult RegisteredOrganisations()
        {
            return Authenticate(() => {
                var connectionString = configuration.GetConnectionString("oruk_validation");
                var db = new Db(connectionString);
                var organisations = db.GetRegisteredOrganisations();

                var accept = Request.Headers["Accept"].ToString();
                if (accept.Contains("text/html"))
                    return CovertToHtmlTable("Registered organisations", organisations);

                return Json(organisations);
            });
        }

        public static bool EmailPassesSanityCheck(string email_address)
        {
            if (string.IsNullOrWhiteSpace(email_address))
                return false;

            var regex = new Regex("^\\S+@\\S+$");

            return regex.IsMatch(email_address);
        }

        public class FieldError
        {
            public string field { get; set; }
            public string message { get; set; }

            public FieldError(string field, string message)
            {
                this.field = field;
                this.message = message;
            }
        }

        public static FieldError[] ValidateOrganisationParameters(RegisterOrganisationParameters parameters)
        {
            var errors = new List<FieldError>();

            if (string.IsNullOrWhiteSpace(parameters.organisation_name))
            {
                errors.Add(new FieldError("organisation_name", "Organisation name is required."));
            }

            if (string.IsNullOrWhiteSpace(parameters.organisation_type))
            {
                errors.Add(new FieldError("organisation_type", "Organisation type is required."));
            }

            if (string.IsNullOrWhiteSpace(parameters.adoptation_stage))
            {
                errors.Add(new FieldError("adoptation_stage", "Adoptation stage is required."));
            }

            if (!EmailPassesSanityCheck(parameters.private_email_address))
            {
                errors.Add(new FieldError("private_email_address", "A valid private email address is required."));
            }

            return errors.ToArray();
        }

        private void SendRegisteredUser(string email_address)
        {
            var subject = $"A user registered for ORUK";
            var body = $"{email_address} registered for ORUK.<br />See the full list at <a href=\"{Settings.RegisteredUsersUrl}\">{Settings.RegisteredUsersUrl}</a>.";

            try
            {
                EmailUtility.Send(Smtp, Settings.DefaultSupportEmail, Settings.RegisterAlertEmail, subject, body);
            }
            catch (Exception e)
            {
                Console.Error.Write(e.Message);
            }
        }

        private void SendRegisteredOrganisationEmail(RegisterOrganisationParameters parameters)
        {
            var subject = $"{parameters.organisation_name} registered for ORUK";
            var body = $"{parameters.organisation_name} ({parameters.private_email_address}) registered for ORUK.<br />See the full list at <a href=\"{Settings.RegisteredOrganisationsUrl}\">{Settings.RegisteredOrganisationsUrl}</a>.";

            try
            {
                EmailUtility.Send(Smtp, Settings.DefaultSupportEmail, Settings.RegisterAlertEmail, subject, body);
            }
            catch (Exception e)
            {
                Console.Error.Write(e.Message);
            }
        }

        private string ToHtmlRow(bool isHeading, string[] values)
        {
            var tag = isHeading ? "th" : "td";
            var tds = string.Join("", values.Select(v => $"<{tag}>{HttpUtility.HtmlEncode(v)}</{tag}>"));
            return $"<tr>{tds}</tr>";
        }

        private ActionResult ToHtmlTable(string title, string headerRow, string rows)
        {
            var table = $"<table><thead>{headerRow}</thead><tbody>{rows}</tbody></table>";
            var html = $"<!doctype html><title>{title}</title>{table}";

            return new ContentResult
            {
                ContentType = "text/html",
                Content = html
            };
        }

        private ActionResult CovertToHtmlTable(string title, List<RegisteredUser> users)
        {
            var headings = new string[] { "EmailAddress", "DateRegistered" };
            var values = users.Select(u => new string[] { u.EmailAddress, u.DateRegistered.ToString("dd MMM yyyy") });
            var headerRow = ToHtmlRow(true, headings);
            var rows = string.Join("", values.Select(v => ToHtmlRow(false, v)));

            return ToHtmlTable(title, headerRow, rows);
        }

        private ActionResult CovertToHtmlTable(string title, List<RegisteredOrganisation> organisations)
        {
            var headings = new string[] { "OrganisationName", "OrganisationType", "DateRegistered", "AdoptationStage", "PrivateEmailAddress", "PublicEmailAddress", "Url" };
            var values = organisations.Select(org => new string[] { org.OrganisationName, org.OrganisationType, org.DateRegistered.ToString("dd MMM yyyy"), org.AdoptationStage, org.PrivateEmailAddress, org.PublicEmailAddress, org.Url });
            var headerRow = ToHtmlRow(true, headings);
            var rows = string.Join("", values.Select(v => ToHtmlRow(false, v)));

            return ToHtmlTable(title, headerRow, rows);
        }
    }
}
