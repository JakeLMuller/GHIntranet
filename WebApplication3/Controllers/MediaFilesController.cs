using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class MediaFilesController : Controller
    {
        public ActionResult GHVHSWeeklyMeetings()
        {
            return View("~/Views/Files/AudioFiles.cshtml");
        }

        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getFileLinks(string route, string path)
        {
            if (route == "GHVHSWeeklyMeetings")
            {
                route = "GHVHS%20Weekly%20Meetings";
            }
            FileModel fileModel = new FileModel(route, path);
            return Json(new { fileModel }, JsonRequestBehavior.AllowGet);
        }
    }
}