using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.Models;


namespace WebApplication3.Controllers
{
    public class FaxController : Controller
    {
        // GET: Fax
        [AllowAnonymous]
        public ActionResult Fax(string route, string path, string Page, string FirstDate, string secondDate,string edit,string ServiceStatus, string LN, string FN, string DOB)
        {
           
            
                Fax faxModel = new Fax(route, path, Page, FirstDate, secondDate ,edit, ServiceStatus, LN, FN, DOB);
                ViewBag.Json = faxModel.Json;
                ViewBag.debug = faxModel.Debug;
                ViewBag.Tabs = faxModel.Tabs;
                ViewBag.rout = route;
                ViewBag.HeaderTitle = faxModel.HeaderTitle;
                ViewBag.NewOrGet = faxModel.NewOrGet;
                ViewBag.page = faxModel.page;
                ViewBag.edit = edit;
                ViewBag.ptJson = faxModel.PTJson;
                ViewBag.RowNames = faxModel.RowNames;
                ViewBag.headerNames = faxModel.headerNames;
                ViewBag.path = faxModel.path;
                ViewBag.route = faxModel.route;
                ViewBag.ViewOnly = faxModel.ViewOnly;
                ViewBag.FaxTypes = faxModel.FaxTypes;
            String ViewOnly = "";
            String StartGroup = @"ghvhs\ORMCIntranet";
            String GroupToCheck = "";
            String RoutePart = "";
            String Temproute = route.Replace("NewFax","");
            if (faxModel.ViewOnly == "Y")
            {
                ViewOnly = "ViewOnly";

            }else {
                ViewOnly = "Admin";
            }
            if (Temproute == "Cardiac")
            {
                RoutePart = "CardiacCath";
            }else
            {
                RoutePart = Temproute;
            }
            GroupToCheck = StartGroup + RoutePart + "Fax" + ViewOnly;
            if (System.Web.HttpContext.Current.User.IsInRole(@GroupToCheck))
            {
                return View();
            }
            else
            {
                ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
                return View("/Views/Home/NoAccess.cshtml");
            }
            
        }

        


    }
}