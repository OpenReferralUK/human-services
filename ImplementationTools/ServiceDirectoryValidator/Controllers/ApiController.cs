using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ServiceDirectory.Common.Validation;
using System.Collections.Generic;
using System.Text.RegularExpressions;

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
                return Json(new { success = false, errors = new[] { new FieldError("email", "Email does not look valid.") } });

            var existingUser = db.GetRegisteredUser(email_address);

            if (existingUser != null)
                return Json(new { success = false, error = "Already registered.", existingUser });

            db.RegisterUser(email_address);

            var user = db.GetRegisteredUser(email_address);

            if (user == null)
                return Json(new { success = false, error = "Unknown problem." });

            return Json(new { success = true, user });
        }

        public JsonResult RegisteredUsers()
        {
            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);
            var users = db.GetRegisteredUsers();
            return Json(users);
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

            return Json(new { success = true, organisation });
        }

        public JsonResult RegisteredOrganisations()
        {
            var connectionString = configuration.GetConnectionString("oruk_validation");
            var db = new Db(connectionString);
            var users = db.GetRegisteredOrganisations();
            return Json(users);
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
    }
}
