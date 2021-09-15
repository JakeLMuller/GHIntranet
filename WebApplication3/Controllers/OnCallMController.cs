using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.CustomApps.OnCall.Models;

namespace WebApplication3.Controllers
{
    [AllowAnonymous]
    public class OnCallMController : Controller
    {
        public List<AllGroups> Groups()
        {
            List<AllGroups> AllGroups = new List<AllGroups>();
            AllGroups = (HttpContext.Cache["AllGroups"] as List<AllGroups>);
            if (AllGroups == null)
            {
                AllGroups = CustomApps.OnCall.get.getGroups("", "");
            }
            HttpContext.Cache.Insert("MetaData", AllGroups);
            return AllGroups;
        }
        // GET: OnCallM
        [AllowAnonymous]
        public ActionResult Month(string Id, string month, string Entity, string year )
        {
            int Year = 0;
            int Month = 0;
            if (String.IsNullOrEmpty(year) == true)
            {
                Year  = DateTime.Now.Year; 
            }
            else
            {
                Year = Int32.Parse(year);
            }
            if (String.IsNullOrEmpty(month) == true)
            {
                Month = DateTime.Now.Month;
            }else
            {
                Month = Int32.Parse(month);
            }
            int getAmountOfDays = DateTime.DaysInMonth(Year, Month);

            string startDate = Month.ToString() + "/1/" + Year.ToString();
            string endDate = Month.ToString() + "/" + getAmountOfDays.ToString() + "/" + Year.ToString();
            AllInMonth Data = CustomApps.OnCall.get.GetAllInMonth(Id, startDate, Entity, endDate);
            List<AllGroups> getGroups = Groups();
            string [] getName = Data.Group[0].Fields.GroupName.Split('(');
            string entity = Data.Group[0].Fields.FacilityFilter;
            char[] charsToTrim = { '*', ' ', '\'' };
            string result = entity.Trim(charsToTrim);
            ViewBag.Groups = getGroups;
            ViewBag.Department = getName[0];
            ViewBag.Entity = result;
            ViewBag.Data = Data;
            ViewBag.AmountOfDays = getAmountOfDays.ToString();
            ViewBag.Month = Month.ToString();
            ViewBag.Year = Year.ToString();
            return View();
        }

    }
}