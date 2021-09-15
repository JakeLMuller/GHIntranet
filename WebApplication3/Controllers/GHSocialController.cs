using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;

namespace WebApplication3.Controllers
{
    public class GHSocialController : Controller
    {
        // GET: GHSocial
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetPosts(string username, string date, string Category, string search, string Order)
        {
            var result = CustomApps.Forum.Posts.getPosts(username, date, Category, search, Order);

            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
    }
}