using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SQL;

namespace WebApplication3.Controllers
{
    public class PTFaxController : Controller
    {
        // GET: PTFax
        public ActionResult PTFax(string route, string path, string Page, string FirstDate, string secondDate, string LN, string FN, string DOB,string faxID,string ViewOnly = "N")
        {
             if (route.IndexOf("View") >= 0)
            {
                route = route.Replace("View", "");
                ViewOnly = "Y";
            }
            string PTjson = PtFax.getPtFax(route, "FaxReceivedFaxes", path);
            string Faxes = PtFax.getPtFax(route, "FaxQueuedServices", path);
            string AllServices = PtFax.getPtFax(route, "FaxToServiceTypeID", path);
            string QueuedServices = PtFax.getPtFax(route, "QueuedServices", path);
            
            ViewBag.PTjson = PTjson;
            ViewBag.QueuedServices = QueuedServices;
            ViewBag.Faxes = Faxes;
            ViewBag.route = route;
            ViewBag.path = path;
            ViewBag.AllServices = AllServices;
            ViewBag.ViewOnly = ViewOnly;
            
            String ViewOnly2 = "";
            String StartGroup = @"ghvhs\ORMCIntranet";
            String GroupToCheck = "";
            String RoutePart = "";
            if (ViewOnly == "Y")
            {
                ViewOnly2 = "ViewOnly";

            }
            else
            {
                ViewOnly2 = "Admin";
            }
            if (route == "Cardiac")
            {
                RoutePart = "CardiacCath";
            }
            else
            {
                RoutePart = route;
            }
            GroupToCheck = StartGroup + RoutePart + "Fax" + ViewOnly2;
            if (System.Web.HttpContext.Current.User.IsInRole(@GroupToCheck))
            {
                return View();
            }
            else
            {
                return View("/Views/Home/NoAccess.cshtml");
            }
        }
    }
}