using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using ServiceDirectory.Common.Validation;

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
    }
}
