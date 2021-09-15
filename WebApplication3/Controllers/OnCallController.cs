using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SQL;
using Syncfusion.DocToPDFConverter;
using Syncfusion.Pdf;
using Syncfusion.DocIO.DLS;
using Syncfusion.DocIO;
using System.IO;
using System.Net;
using WebApplication3.CustomApps.OnCall.Models;
using System.Globalization;

namespace WebApplication3.Controllers
{
    public class OnCallController : Controller
    {
        public List<AllGroups> Groups()
        {
            List<AllGroups> AllGroups = new List<AllGroups>();
            AllGroups = (HttpContext.Cache["AllGroups"] as List<AllGroups>);
            if (AllGroups == null)
            {
                AllGroups = CustomApps.OnCall.get.getGroups("","");
            }
            HttpContext.Cache.Insert("MetaData", AllGroups);
            return AllGroups;
        }

        public AllGroups returnSelectedGroup(List<AllGroups> Groups, string id)
        {
            AllGroups returnValue = new AllGroups();
            for (var i = 0; i < Groups.Count; i++)
            {
                if (Groups[i].Fields.GroupID == id)
                {
                    returnValue =  Groups[i];
                    break;
                }
            }
            return returnValue;
        }
        // GET: OnCall
        public ActionResult Administration(string id)
        {
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                List<People> AllPeople = CustomApps.OnCall.GroupAccess.getPeopleForAdmin(id);
                List<AllGroups> getGroups = Groups();
                AllGroups SelectedGroup = returnSelectedGroup(getGroups, id);
                List<AllUsers> PeopleInGroup = CustomApps.OnCall.GroupAccess.getUserAccessMembers( id);
                string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
                uNameTemp = uNameTemp.Replace("GHVHS\\", "");
                ViewBag.groupId = id;
                ViewBag.selectedGroup = SelectedGroup;
                ViewBag.AllGroups = getGroups;
                ViewBag.PeopleInGroup = PeopleInGroup;
                ViewBag.UserName = uNameTemp;
                ViewBag.AllPeople = AllPeople;
                return View();

            }
            else
            {
                return View("/Views/Home/NoAccess.cshtml");
            }

           
        }
        public ActionResult SecurityEmployee(string id)
        {
                List<People> AllPeople = CustomApps.OnCall.get.getPeople("", "", "", "");
                List<AllGroups> getGroups = Groups();
                string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
                uNameTemp = uNameTemp.Replace("GHVHS\\", "");
                ViewBag.groupId = id;
                ViewBag.AllGroups = getGroups;
                ViewBag.UserName = uNameTemp;
                ViewBag.AllPeople = AllPeople;
                return View();

            


        }
        public ActionResult Daily(string Id, string date, string Entity)
        {
            if (String.IsNullOrEmpty(date) == true || date == null)
            {
                DateTime dt = DateTime.Now;

                date = dt.ToString("MM'/'dd'/'yyyy");
            }
            if (String.IsNullOrEmpty(Entity) == false)
            {
                Id = Id + " (" + Entity + ")";
            }
            String[] strlist = date.Split('/');
            int numVal = Int32.Parse(strlist[0]);
            int numVal2 = Int32.Parse(strlist[1]);
            int numVal3 = Int32.Parse(strlist[2]);
            DateTime justDate = new DateTime(numVal3, numVal, numVal2);
            int DayOfWeek = (int)justDate.DayOfWeek;
            List<AllDailyOnCalls> Data  = CustomApps.OnCall.get.getDailyCalls(date, Id);
            List<AllGroups> getGroups = Groups();
            AllGroups SelectedGroup = returnSelectedGroup(getGroups, Id);
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, Id);
            List<AllUsers> AllPeopleInGroup = CustomApps.OnCall.GroupAccess.getUserAccessMembers( Id);
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                ViewBag.Admin = true;
            }
            ViewBag.groupId = Id; 
            ViewBag.selectedGroup = SelectedGroup;
            ViewBag.AllGroups = getGroups;
            ViewBag.AllPeopleInGroup = AllPeopleInGroup;
            ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
            ViewBag.DayOfTheWeek = DayOfWeek;
            ViewBag.Calls = Data;
            ViewBag.date = date;
            ViewBag.Access = checkAccess;
            return View();
        }
        public ActionResult Month(string Id, string month, string Entity, string year)
        {

            int Year = 0;
            int Month = 0;
            if (String.IsNullOrEmpty(year) == true)
            {
                Year = DateTime.Now.Year;
            }
            else
            {
                Year = Int32.Parse(year);
            }
            if (String.IsNullOrEmpty(month) == true)
            {
                Month = DateTime.Now.Month;
            }
            else
            {
                Month = Int32.Parse(month);
            }
            if (String.IsNullOrEmpty(Id) == true)
            {
                Id = "1";
            }
            int getAmountOfDays = DateTime.DaysInMonth(Year, Month);

            string startDate = Month.ToString() + "/1/" + Year.ToString();
            string endDate = Month.ToString() + "/" + getAmountOfDays.ToString() + "/" + Year.ToString();
            AllInMonth Data = CustomApps.OnCall.get.GetAllInMonth(Id, startDate, Entity, endDate);
            List<AllGroups> getGroups = Groups();
            string[] getName = Data.Group[0].Fields.GroupName.Split('(');
            string entity = Data.Group[0].Fields.FacilityFilter;
            char[] charsToTrim = { '*', ' ', '\'' };
            string result = entity.Trim(charsToTrim);
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, Id);
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                ViewBag.Admin = true;
            }
            ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
            ViewBag.Groups = getGroups;
            ViewBag.Department = getName[0];
            ViewBag.Entity = result;
            ViewBag.Data = Data;
            ViewBag.id = Id;
            ViewBag.Access = checkAccess;
            ViewBag.AmountOfDays = getAmountOfDays.ToString();
            ViewBag.Month = Month.ToString();
            ViewBag.Year = Year.ToString();
            return View();
        }
        public ActionResult History(string id, string Date)
        {
            if (String.IsNullOrEmpty(Date) == true || Date == null)
            {
                DateTime dt = DateTime.Now;

                Date = dt.ToString("MM'/'dd'/'yyyy");
            }
            List<AllHistory> Data = CustomApps.OnCall.History.getHistory(id, Date);
            List<AllGroups> getGroups = Groups();
            AllGroups SelectedGroup = returnSelectedGroup(getGroups, id);
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, id);
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                ViewBag.Admin = true;
            }
            ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
            ViewBag.Groups = getGroups;
            ViewBag.Data = Data;
            ViewBag.Access = checkAccess;
            ViewBag.selectedGroup = SelectedGroup;
            ViewBag.date = Date;
            ViewBag.id = id;
            ViewBag.DateLabel = Date;
            return View();
        }
        public ActionResult MonthlyHistory(string id, string Date)
        {

            var formats = new[] { "MM/dd/yyyy", "MM/d/yyyy" };

            DateTime dt;
            if (String.IsNullOrEmpty(Date) == true)
            {
                DateTime.TryParseExact(Date, formats, null, DateTimeStyles.None, out dt);
            }
            else
            {
                dt = DateTime.Now;
            }
            int Year = 0;
            int Month = 0;
            Year = dt.Year;
            Month = dt.Month;
            int getAmountOfDays = DateTime.DaysInMonth(Year, Month);
            string startDate = Month.ToString() + "/1/" + Year.ToString();
            string endDate = Month.ToString() + "/" + getAmountOfDays.ToString() + "/" + Year.ToString();
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, id);
            List<AllHistory> Data = CustomApps.OnCall.History.getMonthlyHistory(id, startDate, endDate);
            List<AllGroups> getGroups = Groups();
            AllGroups SelectedGroup = returnSelectedGroup(getGroups, id);
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                ViewBag.Admin = true;
            }
            ViewBag.Access = checkAccess;
            ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
            ViewBag.Groups = getGroups;
            ViewBag.Data = Data;
            ViewBag.selectedGroup = SelectedGroup;
            ViewBag.DateLabel = startDate + "-" + endDate;
            ViewBag.date = Date;
            ViewBag.id = id;
            return View();
        }
        public ActionResult WeeklyHistory(string id, string Date)
        {
            if (String.IsNullOrEmpty(Date) == true || Date == null)
            {
                DateTime dt = DateTime.Now;
                Date = dt.ToString("MM'/'dd'/'yyyy");
            }
            List<DateTime> test = CustomApps.OnCall.library.GetWeekStartAndEndFromString(Date);
            string StartOfWeek = test[0].ToString("MM/dd/yyyy");
            string EndOfWeek = test[1].ToString("MM/dd/yyyy");
            List<AllHistory> Data = CustomApps.OnCall.History.getMonthlyHistory(id, StartOfWeek, EndOfWeek);
            List<AllGroups> getGroups = Groups();
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, id);
            AllGroups SelectedGroup = returnSelectedGroup(getGroups, id);
            if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
            {
                ViewBag.Admin = true;
            }
            ViewBag.UserName = System.Web.HttpContext.Current.User.Identity.Name;
            ViewBag.Groups = getGroups;
            ViewBag.Access = checkAccess;
            ViewBag.Data = Data;
            ViewBag.selectedGroup = SelectedGroup;
            ViewBag.date = Date;
            ViewBag.id = id;
            ViewBag.DateLabel = StartOfWeek + "-" + EndOfWeek;
            return View();
        }

        public ActionResult NewCalendarEvent(string id)
        {
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            Boolean checkAccess = CustomApps.OnCall.library.ValidateUser(uNameTemp, id);
            if (checkAccess)
            {
                List<AllDefaultTimes> Times = CustomApps.OnCall.GroupAccess.getDefaultTimes(id);
                List<AllUsers> AllPeopleInGroup = CustomApps.OnCall.GroupAccess.getUserAccessMembers(id);
                List<AllGroups> getGroups = Groups();
                AllGroups SelectedGroup = returnSelectedGroup(getGroups, id);
                DateTime today = DateTime.Now;
                string Date = today.ToString("MM'/'dd'/'yyyy");
                if (System.Web.HttpContext.Current.User.IsInRole(@"ghvhs\ORMCIntranetOnCallAdmin"))
                {
                    ViewBag.Admin = true;
                }
                List<DateTime> Week = CustomApps.OnCall.library.GetWeekStartAndEndFromString(Date);
                ViewBag.UserName = uNameTemp;
                ViewBag.Groups = getGroups;
                ViewBag.Access = checkAccess;
                ViewBag.Date = today;
                ViewBag.People = AllPeopleInGroup;
                ViewBag.selectedGroup = SelectedGroup;
                ViewBag.startWeek = Week[0];
                ViewBag.endWeek = Week[1];
                ViewBag.Times = Times;
                ViewBag.id = id;
                return View();
            }else
            {
                return View("/Views/Home/NoAccess.cshtml");
            }


        }
        public JsonResult CreateOnCallTime(string PrivateComment, string Group, string PublicComment, string Person, string StartTime, string EndTime)
        {
            string PTJson = CustomApps.OnCall.Create.CreateCallTime(Group, Person, StartTime, EndTime, PublicComment, PrivateComment);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddMember(string id, string GroupId)
        {
            string PTJson = CustomApps.OnCall.Create.AddMember(id, GroupId);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteMember(string id)
        {
            string PTJson = CustomApps.OnCall.Create.DeleteMember(id);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateOnCallTime(string PrivateComment, string Group, string PublicComment, string Person, string StartTime, string EndTime, string id)
        {
            string PTJson = CustomApps.OnCall.Create.UpdateCallTime(Group, Person, StartTime, EndTime, PublicComment, PrivateComment, id);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteCallTime(string id)
        {
            string PTJson = CustomApps.OnCall.Create.DeleteCall(id);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult GetOnCallTimes(string Item, string Group, string Page, string External, string StartTime, string EndTime)
        {
            string PTJson = OnCall.GetTimes(Item, Group, Page, External, StartTime, EndTime);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetGroups(string GroupID)
        {
            string PTJson = OnCall.GetGroups(GroupID);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPhoneTypes(string PhoneType)
        {
            string PTJson = OnCall.GetPhoneTypes(PhoneType);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPhones(string ExternalID)
        {
            string PTJson = OnCall.GetPhones(ExternalID);

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetPeople(string FirstName, string LastName)
        {
            List<People> Data = CustomApps.OnCall.get.getPeople("", "", FirstName, LastName);

            return Json(new { Data }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Data(string Id, string date, string Entity)
        {
            var Items = CustomApps.OnCall.get.GetAll(Id, date, Entity);

            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllOnCalls(string id, string Date)
        {
            List<AllDailyOnCalls> Data = CustomApps.OnCall.get.getDailyCalls(Date, id);

            return Json(new { Data }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult StartWeenk (string Date)
        {
            List<DateTime> test = CustomApps.OnCall.library.GetWeekStartAndEndFromString(Date);
            string StartOfWeek = test[0].ToString("MM/dd/yyyy");
            string EndOfWeek = test[1].ToString("MM/dd/yyyy");
            return Json(new { StartOfWeek, EndOfWeek }, JsonRequestBehavior.AllowGet);

        }
    }
}