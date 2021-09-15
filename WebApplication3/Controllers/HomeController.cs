using Newtonsoft.Json;
using System;
using System.Collections;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.CustomApps.Applications.Models;

namespace WebApplication3.Controllers
{
    [AllowAnonymous]
    public class HomeController : Controller
    {
        [AllowAnonymous]
        public ActionResult Index()
        {
            
            return View();
        }
        [Authorize]
        public ActionResult MyAppications()
        {
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<AllApps> getApps = CustomApps.Applications.Apps.getApps(uNameTemp);
            ViewBag.Apps = getApps;
            return View();
        }

        public ActionResult SpaceInvaders()
        {
           

            return View();
        }
        public ActionResult Donation()
        {
            return View();
        }
    }
}