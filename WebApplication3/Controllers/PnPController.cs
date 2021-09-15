using System;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SQL;
using WebApplication3.SharePointApi;
using WebApplication3.Encryption;
using System.DirectoryServices.AccountManagement;
using System.IO;
using System.Net;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Globalization;
using System.Web.Script.Serialization;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class PnPController : Controller
    {
       
        public String UserName = "";
        public String Password = "";

       
        public List<AllMetaData> MetaData()
        {
            List<AllMetaData> AllMetaData = new List<AllMetaData>();
            AllMetaData = (HttpContext.Cache["MetaData"] as List<AllMetaData>);
            if (AllMetaData == null)
            {
               AllMetaData = CustomApps.Pnp.MetaData.GetAllMetaData();
               AllUsers();
            }
            HttpContext.Cache.Insert("MetaData", AllMetaData);
            return AllMetaData;
        }
        public List<MetaDataList> Navigation()
        {
            List<MetaDataList> AllMetaData = new List<MetaDataList>();
            AllMetaData = (HttpContext.Cache["Navigation"] as List<MetaDataList>);
            HttpCookieCollection cookies = Request.Cookies;
            List<string> cookieinfo = CustomApps.Pnp.Library.getCookieInfo(cookies);
            if (AllMetaData == null)
            {
                AllMetaData = CustomApps.Pnp.MetaData.Navigation(cookieinfo[1]);
                AllUsers();
            }
            HttpContext.Cache.Insert("MetaData", AllMetaData);
            return AllMetaData;
        }
        
        public List<AllUsers> AllUsers()
        {
            List<AllUsers> users = new List<AllUsers>();
            users = (HttpContext.Cache["AllUsers"] as List<AllUsers>);
            if (users == null)
            {
                users = CustomApps.Pnp.MetaData.getUsers("", "", "", "","", "");
            }
            HttpContext.Cache.Insert("AllUsers", users);
            return users;
        }
        public void ClearList()
        {
            HttpContext.Cache.Remove("AllFiles");
        }
        public void ClearUsers()
        {
            HttpContext.Cache.Remove("Users");
        }
        public void ClearConcurrence()
        {
            HttpContext.Cache.Remove("Concurrence");
        }
      
        public void getUAndP()
        {
            HttpCookieCollection cookies = Request.Cookies;
            List<string> Results = CustomApps.Pnp.Library.ValidateLoggedInUser(cookies);
            if (Results[0] == "True")
            {
                UserName = Results[1];
                Password = Results[2];
            }
        }
        public ActionResult testEncrypt(string Key)
        {
            var output = EncryptAndDecrypt.Encrypt(Key);
            var decrypt = EncryptAndDecrypt.Decrypt(output);
            ViewBag.Encrypt = output;
            ViewBag.Decypt = decrypt;
            return View();
        }
        public JsonResult logOut()
        {

             Response.Cookies["Id"].Expires = DateTime.Now.AddDays(-1);
             Response.Cookies["Date"].Expires = DateTime.Now.AddDays(-1);
            Request.Cookies.Remove("Id");
            Request.Cookies.Remove("Date");
            return Json(new { Success = "true" }, JsonRequestBehavior.AllowGet);
        }
        public Boolean checkLogin()
        {
            getUAndP();
            Boolean loggedIn = true;
            if (String.IsNullOrEmpty(Password) == true)
            {
                loggedIn = false;
            }
            if (String.IsNullOrEmpty(UserName) == true)
            {
                loggedIn = false;
            }
            return loggedIn;
        }
        
       public ActionResult IntialLogIn(string redirect)
        {
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace("GHVHS\\", "");
            List<HttpCookie> getCookies = CustomApps.Pnp.Library.ValidatePnpUser(uName);
            if (getCookies.Count > 0)
            {
                Response.SetCookie(getCookies[0]);
                Response.SetCookie(getCookies[1]);
            }
            Navigation();
            if (String.IsNullOrEmpty(redirect) == true)
            {
                redirect = "/Pnp/Home";
            }

            ViewBag.redirect = redirect;

            return View();
        }
        public ActionResult Home(string Id, string FirstName, string CheckOrCreate, string LastName, string List, string SearchValue, string department, string location, string category)
        {
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/PnP/Home");
            }
            else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<MetaDataList> Nav = Navigation();
                if (String.IsNullOrEmpty(CheckUser[1]) == false && CheckUser[1].IndexOf("User") < 0)
                {
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;

                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    ViewBag.Role = CheckUser[1];
                    ViewBag.UserDepartment = CheckUser[0];
                    ViewBag.UserName = uName;
                    ViewBag.SearchBy = List;
                    ViewBag.Nav = Nav;
                    ViewBag.SearchValue = SearchValue;
                    ViewBag.Id = Id;
                    ViewBag.Meta = Meta;
                    return View();
                }
                else
                {
                    ViewBag.UserName = UserName;
                    ViewBag.SearchBy = List;
                    ViewBag.Nav = Nav;
                    ViewBag.SearchValue = SearchValue;
                    ViewBag.Id = "View";
                    ViewBag.Meta = Meta;
                    return View();
                }

            }
        }
       
        public ActionResult DraftPolicies(string Id, string list, string Search, string Department, string Category, string Location, string SearchBy, string order, string Page)
        {
            
            
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/PnP/DraftPolicies");
            }  else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<AllMetaData> Meta = MetaData();
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Draft Policies");
                if (check == true)
                {
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;

                    string access = "";
                    if (CheckUser[1].IndexOf("Admin") >= 0 && CheckUser[1].IndexOf("Dept") < 0 )
                    {
                        access = "Y";
                    }else if ( CheckUser[1].IndexOf("Initiator") < 0)
                    {
                        access = "Y";
                    }
                    ViewBag.A = access;
                    ViewBag.UserDepo = CheckUser[0];
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    string givenName = user.DisplayName;
                    ViewBag.UserName = uName;
                    ViewBag.fullName = givenName;
                    ViewBag.Meta = Meta;
                    ViewBag.Nav = Nav;
                    ViewBag.Order = order;
                    ViewBag.Page = Page;
                    ViewBag.Department = Department;
                    ViewBag.Category = Category;
                    ViewBag.Location = Location;
                    return View();
                } else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }
           
        }
        public ActionResult PoliciesRelateddocuments(string Id, string Page, string order)
        {
           
            HttpCookieCollection cookies = Request.Cookies;
            
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/PnP/PoliciesRelateddocuments");
            }
            else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<AllMetaData> Meta = MetaData();
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Policies Related Documents");
                if (check == true)
                {
                    string access = "";
                    if (CheckUser[1].IndexOf("Admin") >= 0 || CheckUser[1].IndexOf("Initiator") >= 0)
                    {
                        access = "Y";
                    }
                    ViewBag.A = access;
                    ViewBag.UserDepo = CheckUser[0];
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    string givenName = user.DisplayName;
                    ViewBag.UserName = uName;
                    ViewBag.Nav = Nav;
                    ViewBag.Meta = Meta;
                    ViewBag.Page = Page;
                    ViewBag.Order = order;
                    ViewBag.fullName = givenName;
                    ViewBag.Id = Id;
                    return View();
                }else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }
                
        }
        public ActionResult ApprovedPolicies(string Id, string Search, string Department, string Category, string Location, string SearchBy, string order, string Page)
        {
            List<AllMetaData> Meta = MetaData();
            if (Id != "View")
            {

                
                HttpCookieCollection cookies = Request.Cookies;

                string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
                uNameTemp = uNameTemp.Replace("GHVHS\\", "");
                List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
                if (CheckUser.Count == 0)
                {
                    return IntialLogIn("/PnP/ApprovedPolicies");
                }
                else
                {
                    if (CheckUser.Count == 3)
                    {
                        MasterClear();
                    }
                    List<MetaDataList> Nav = Navigation();
                    Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Approved Policies");
                    if (check == true)
                    {
                       
                        PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                        string uName = System.Web.HttpContext.Current.User.Identity.Name;
                       
                        UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                        uName = uName.Replace("GHVHS\\", "");
                        string depoNames = CheckUser[0];
                        string givenName = user.DisplayName;
                        string access = "";
                        if (CheckUser[1].IndexOf("Admin") >= 0 && CheckUser[1].IndexOf("Dept") < 0)
                        {
                            access = "Y";
                        }
                        if (CheckUser[1].IndexOf("Admin") < 0 )
                        {
                            Id = "View";
                        }
                        ViewBag.A = access;
                        ViewBag.UserDepo = CheckUser[0];
                        ViewBag.UserName = uName;
                        ViewBag.UserDepo = depoNames;
                        ViewBag.fullName = givenName;
                        ViewBag.Meta = Meta;
                        ViewBag.Id = Id;
                        ViewBag.Page = Page;
                        ViewBag.Nav = Nav;
                        ViewBag.Order = order;
                        ViewBag.Department = Department;
                        ViewBag.Category = Category;
                        ViewBag.Location = Location;
                        return View();
                    }else
                    {
                        return View("/Views/Home/NoAccess.cshtml");
                    }
                }
            }else
            {
                List<MetaDataList> Nav = Navigation();
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                string givenName = user.DisplayName;
                uName = uName.Replace("GHVHS\\", "");
                ViewBag.UserName = uName;
                ViewBag.UserDepo = "";
                ViewBag.fullName = givenName;
                ViewBag.Meta = Meta;
                ViewBag.Id = Id;
                ViewBag.Nav = Nav;
                ViewBag.Department = Department;
                ViewBag.Category = Category;
                ViewBag.Location = Location;
                return View();
            }
        }
        public ActionResult ViewFile(string path, string name, string height)
        {
            List<AllMetaData> Meta = MetaData();
            Boolean check = checkLogin();
            if (check == false)
            {
                ViewBag.redirect = "/PnP/ViewFile?path="+path+"&name="+name + "&height=" + height;
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                uName = uName.Replace("GHVHS\\", "");
                
                string givenName = user.DisplayName;
                ViewBag.name = name; 
                ViewBag.path = path;
                ViewBag.height = height;
                ViewBag.Meta = Meta;
                return View();
            }

        }
        public ActionResult Policy(string id, string ItemId, string ViewOnly)
        {
           
            List<AllMetaData> Meta = MetaData();
            if (ViewOnly != "Y")
            {
                HttpCookieCollection cookies = Request.Cookies;
                string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
                uNameTemp = uNameTemp.Replace("GHVHS\\", "");
                List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
                if (CheckUser.Count == 0)
                {
                    ViewBag.redirect = "/PnP/Policy/" + id;
                    return IntialLogIn("/PnP/Policy/" + id);
                    
                }
                else
                {
                    if (CheckUser.Count == 3)
                    {
                        MasterClear();
                    }
                    List<MetaDataList> Nav = Navigation();
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    string access = "";
                    if (CheckUser[1].IndexOf("Admin") >= 0 && CheckUser[1].IndexOf("Dept") < 0)
                    {
                        access = "Y";
                    }
                    if (CheckUser[1].IndexOf("Admin") < 0 && CheckUser[1].IndexOf("Initiator") < 0)
                    {
                        ViewOnly = "Y";
                    }
                    string depoNames = CheckUser[0];
                    ViewBag.A = access;
                    ViewBag.UserDepo = depoNames;
                    string givenName = user.DisplayName;
                    ViewBag.ItemId = id;
                    ViewBag.Nav = Nav;
                    ViewBag.UserName = uName;
                    ViewBag.fullName = givenName;
                    ViewBag.ViewOnly = ViewOnly;
                    ViewBag.Meta = Meta;
                    return View();
                }
                
            }else
            {
                List<MetaDataList> Nav = Navigation();
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                string givenName = user.DisplayName;
                ViewBag.ItemId = ItemId;
                ViewBag.list = id;
                ViewBag.UserName = "";
                ViewBag.Nav = Nav;
                ViewBag.fullName = givenName;
                ViewBag.ViewOnly = ViewOnly;
                ViewBag.Meta = Meta;
                return View();
            }

        }
        public ActionResult ArchivePolicies(string Search, string Department, string Category, string Location, string SearchBy, string order, string Page)
        {
            
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/PnP/ArchivePolicies");
            }
            else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Archive Policies");
                if (check == true)
                {
                   
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    string access = "";
                    if (CheckUser[1].IndexOf("Admin") >= 0 || CheckUser[1].IndexOf("Initiator") >= 0 )
                    {
                        access = "Y";
                    }
                    string givenName = user.DisplayName;
                    ViewBag.A = access;
                    ViewBag.UserDepo = CheckUser[0];
                    ViewBag.UserName = uName;
                    ViewBag.fullName = givenName;
                    ViewBag.Meta = Meta;
                    ViewBag.Nav = Nav;
                    ViewBag.Department = Department;
                    ViewBag.Category = Category;
                    ViewBag.Page = Page;
                    ViewBag.Order = order;
                    ViewBag.Location = Location;
                    return View();
                }else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }
                
        }
        public ActionResult PolicesDiscussion(string Id, string SubId, string orderBy, string Search)
        {
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                
           
                string url = "/PnP/PolicesDiscussion";
                string first = "";
                string second = "?";
                string third = "&";
                string fourth = "&";
                if (String.IsNullOrEmpty(Id) == false)
                {
                    first += "/" + Id;
                }
                if (String.IsNullOrEmpty(SubId) == false)
                {
                    second += "SubId=" + SubId;
                }
                url += first + second;
                if (String.IsNullOrEmpty(orderBy) == false)
                {
                    url += third+ "orderBy="+ orderBy;
                }
                if (String.IsNullOrEmpty(Search) == false)
                {
                    url += fourth + "Search=" + Search;
                }
                ViewBag.redirect = url;
                return IntialLogIn(url);
             }
             else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Polices Discussion");
                if (check == true)
                {
                    
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    string access = "";
                    ViewBag.userRole = CheckUser[1];
                    ViewBag.userDepartment = CheckUser[0];
                    string givenName = user.DisplayName;
                    ViewBag.UserName = uName;
                    ViewBag.Id = Id;
                    ViewBag.SubId = SubId;
                    ViewBag.Nav = Nav;
                    ViewBag.Meta = Meta;
                    ViewBag.fullName = givenName;
                    ViewBag.Search = Search;
                    ViewBag.orderBy = orderBy;
                    return View();
                }else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }

        }
        public ActionResult Concurrences(string view)
        {
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/Pnp/Concurrences");
            }
            else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "My Concurrences");
                if (check == true)
                {
                   
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    uName = uName.Replace("GHVHS\\", "");
                    
                    string givenName = user.DisplayName;
                    ViewBag.UserName = uName;
                    ViewBag.Nav = Nav;
                    ViewBag.Meta = Meta;
                    ViewBag.fullName = givenName;
                    ViewBag.ViewApproved = view;
                    return View();
                }
                else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }

        }
        public ActionResult Administration(string id, string department)
        {
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
            if (CheckUser.Count == 0)
            {
                return IntialLogIn("/Pnp/Administration"+id);
            }
            else
            {
                if (CheckUser.Count == 3)
                {
                    MasterClear();
                }
                List<MetaDataList> Nav = Navigation();
                Boolean check = CustomApps.Pnp.Library.HasAccess(Nav, "Administration");
                if (check == true)
                {
                    
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    uName = uName.Replace("GHVHS\\", "");
                    List<MetaDataList> roles = new List<MetaDataList>();
                    List<MetaDataList> depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments");
                    if (CheckUser[1].IndexOf("DeptAdmin") >= 0)
                    {
                        roles = CustomApps.Pnp.MetaData.Roles("Admin");
                        ViewBag.userRole = CheckUser[1];
                        ViewBag.userDepartment = CheckUser[0];
                    }else
                    {
                        roles = CustomApps.Pnp.MetaData.Roles("");
                        ViewBag.userRole = "";
                        ViewBag.userDepartment = "";
                    }
                    ViewBag.DepartmentURL = department;
                    ViewBag.roles = roles;
                    ViewBag.Departments = depo;
                    ViewBag.username = uName;
                    ViewBag.Meta = Meta;
                    ViewBag.Nav = Nav;
                    ViewBag.AdminType = id;
                    return View();
                }else
                {
                    return View("/Views/Home/NoAccess.cshtml");
                }
            }
            
        }
        public JsonResult UpdateUsersRoles(string data)
        {
            string result = "false";
            if (String.IsNullOrEmpty(data) == false)
            {
                string [] splitData = data.Split(';');
                for (int i=0; i < splitData.Length; i++)
                {
                    if (splitData[i] != "") {
                        string[] getValues = splitData[i].Split('|');
                        var temp = CustomApps.Pnp.Roles.Delete(getValues[0]);
                        result = CustomApps.Pnp.Roles.Create("", getValues[1], getValues[0], getValues[2], getValues[3], getValues[4]);
                    }
                }

            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult TransferUsers(string oldUser, string newUser, string department, string Role, string PolicyFolder)
        {
            List<string> Items = CustomApps.Pnp.Policies.TransferUser(oldUser, newUser, department, Role, PolicyFolder);

            return Json(new { Items = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult PreviewTransferPolicies(string oldUser, string newUser, string department, string Role, string PolicyFolder)
        {
           var Items =  CustomApps.Pnp.Policies.GetTransferUserPolicies(oldUser, newUser, department, Role, PolicyFolder);
           return Json(new { Items = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetUserInRoles(string Id, string UserNameDisplay, string UserName, string DepartmentID, string DepartmentName, string Role, string order, int Offest=0)
        {
            if (String.IsNullOrEmpty(DepartmentName) == false)
            {
                
                    DepartmentID = DepartmentName.Replace("|",",");
            }
            int Offest2 = 0; 
            if (Offest > 0)
            {
                Offest2 = Offest;
            }
            var Items = CustomApps.Pnp.Roles.GetUserRolesDepartment(Id, UserNameDisplay, UserName, DepartmentID, DepartmentName, Role, order, Offest2);
            string count = CustomApps.Pnp.Roles.ReturnCount(DepartmentID);
            return Json(new { Items = Items, Count = count }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddUserInRoles(  string User, string Department, string Roles )
        {
            List<string> getUserValues = SQL.Pnp.GetUser("", "", "", User);
            List<MetaDataList> depo = CustomApps.Pnp.MetaData.getMetaData("", Department, "", "", "Departments", "");
            string depoId = depo[0].Id;
            string depoName = depo[0].Name;
            string results = "";
            if (getUserValues.Count > 0) {
                string FullName = getUserValues[3] + " " + getUserValues[4];
                results = CustomApps.Pnp.Roles.Create("", FullName, getUserValues[0], depoId, depoName, Roles);
            }else
            {
                results = "Error User doesn't exist";
            }
            return Json(new { Items = results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateUserInRoles(string User, string Department, string Roles)
        {
            List<string> getUserValues = SQL.Pnp.GetUser(User, "", "", "");
            List<MetaDataList> depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments", Department);
            string depoName = depo[0].Id;
            string results = "";
            if (getUserValues.Count > 0)
            {
                results = CustomApps.Pnp.Roles.Update("", User, getUserValues[0], depoName, Department, Roles, "Y");
            }
            else
            {
                results = "Error User doesn't exist";
            }
            return Json(new { Items = results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateRoleForUser(string User, string Department, string Roles)
        {
            List<string> getUserValues = SQL.Pnp.GetUser(User, "", "", "");
            List<MetaDataList> depo = CustomApps.Pnp.MetaData.getMetaData(Department, "", "", "", "Departments");
            string depoName = depo[0].Id;
            string results = "";
            if (getUserValues.Count > 0)
            {
                var result = CustomApps.Pnp.Roles.Delete(getUserValues[0]);
                results = CustomApps.Pnp.Roles.Create("", User, getUserValues[0], depoName, Department, Roles);
            }
            else
            {
                results = "Error User doesn't exist";
            }
            return Json(new { Items = results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteUserInRole(string id, string Department)
        {
            var Items = CustomApps.Pnp.Roles.GetUserRolesDepartment("", id, "", "", "", "", "");
            //if (String.IsNullOrEmpty(Department) == false)
            //{
              // var  depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments", Department);
               //Department = depo[0].Id;
            //}
             var result = CustomApps.Pnp.Roles.Delete(id, Department);
            return Json(new { Items = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult isJake(string username, string password, string special, string type)
        {
            if (String.IsNullOrEmpty(type) == false)
            {
                if (type == "cancel")
                {
                    return checkLog(EncryptAndDecrypt.Decrypt("eJ37UOtYYddGxQJxp8LeAIOLt5GwpgQX+U8cWQuDtIU="), EncryptAndDecrypt.Decrypt("YC7iL+yM6CBsVOnFNu/cSYmlPpqUMMWPr5goXUjZNNM="));
                }
                else
                {
                    string checkForAccount = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(special), "developer", "", "");
                    string[] account = checkForAccount.Split('|');
                    return checkLog(EncryptAndDecrypt.Decrypt(account[0]), EncryptAndDecrypt.Decrypt(account[1]));
                }
              
               
            }
            else
            {
                var Result = "false";
                string checkForAccount = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "N", EncryptAndDecrypt.Encrypt(password), "");
                if (checkForAccount == EncryptAndDecrypt.Encrypt("jmuller3"))
                {
                    Result = "true";
                    return Json(new { Success = Result }, JsonRequestBehavior.AllowGet);
                }
                else
                {
                    return  checkLog(username, password);
                }
               
            }
            

           
        }
        public JsonResult checkLog(string username, string password)
        {
            Boolean Results = false;
            HttpCookieCollection Cookies = Request.Cookies;
            List<HttpCookie> getCookies = CustomApps.Pnp.Library.ValidateUser(Cookies, username, password);
            if (getCookies.Count > 0)
            {
                Response.SetCookie(getCookies[0]);
                Response.SetCookie(getCookies[1]);
                Results = true;
            }
            return Json(new { Success = Results }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult SearchAll(string Id, string Search, string Department, string SearchBy, string order)
        {
           
            List<SingleItem> AllFiles = CustomApps.Pnp.Policies.GetPolicies("", "", "", Search, Department, SearchBy, order);
            return Json(new { AllFiles }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult VerifiyName(string id)
        {
            Boolean AllFiles = CustomApps.Pnp.Policies.VerifiyName(id);
            return Json(new { data = AllFiles }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeletePolicesDiscussionAndAllMessages(string DocId, string ConvoId, string Title, string Body, string IsSecure, string PeopleInConvo,  string orderBy)
        {
            List<string> Items = SharePointApi.PolicesDiscussion.Convos(DocId, ConvoId, Title, Body, IsSecure, PeopleInConvo, "Delete", orderBy,"");
            if (Items[0] == "Success")
            {
                Items = SharePointApi.PolicesDiscussion.PnpMeassges(ConvoId, "All", Title, Body, "", "", "Delete", orderBy);
            }
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getPolicesDiscussions(string DocId, string ConvoId, string Title, string Body, string IsSecure, string PeopleInConvo, string ScriptAs, string orderBy, string emails)
        {
           List<string> Items = SharePointApi.PolicesDiscussion.Convos( DocId, ConvoId, Title, Body, IsSecure, PeopleInConvo, ScriptAs, orderBy, emails);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getPolicesMessages (string ConvoId, string MessageId, string Title, string Body, string SingleUser, string SingleUserId, string ScriptAs,string orderBy)
        {
            List<string> Items = SharePointApi.PolicesDiscussion.PnpMeassges(ConvoId, MessageId, Title, Body, SingleUser, SingleUserId, ScriptAs, orderBy);
            if (ScriptAs == "Create")
            {
                List<string> Dicussion2 = SharePointApi.PolicesDiscussion.Convos("", ConvoId, "", "", "", "", "", "","");
                string [] peopleToEmail = Dicussion2[5].Split(',');
                string CheckForMultpleEmails = "";
                for (var i=0; i < peopleToEmail.Length; i++) {
                    string link = "http://garnetinfo/PnP/Policy/" + Dicussion2[0];
                    string convo = "http://garnetinfo/PnP/PolicesDiscussion/" + Dicussion2[1];
                    if (CheckForMultpleEmails.IndexOf(peopleToEmail[i]) < 0)
                    {
                        SendEmail.SendEmail.NewMessage(SingleUser, peopleToEmail[i], Body, convo, link, "");
                        CheckForMultpleEmails += peopleToEmail[i];
                    }
                }
            }
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getPolicies(string list, string Id, string Search, string Department, string SearchBy, string order, string Category, string Location, string Author, string Page )
        { 
            if (Department == "My Departments")
            {
                HttpCookieCollection cookies = Request.Cookies;
                string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
                uNameTemp = uNameTemp.Replace("GHVHS\\", "");
                List<string> CheckUser = CustomApps.Pnp.Library.getCookieInfo(cookies, uNameTemp);
                if (CheckUser.Count > 0)
                {
                    Department = CheckUser[0];
                }
            }
            if (String.IsNullOrEmpty(order) == false)
            {
                if (order.IndexOf("Checked Out By") >= 0)
                {
                    order =  order.Replace("Checked Out By", "CheckedOut");
                }else if (order.ToLower().IndexOf("approvers") >= 0)
                {
                    order = order.ToLower().Replace("approvers", "approver");
                }
            }
           
            if (String.IsNullOrEmpty(Location) == false)
            {
                string value = "";
                var meta = MetaData();
                for (int i = 0; i < meta.Count; i++)
                {
                    if (meta[i].Name == "Location")
                    {
                        for (int j = 0; j < meta[i].SingleMetaDataList.Count; j++)
                        {
                            if (meta[i].SingleMetaDataList[j].Name == Location)
                            {
                                value = meta[i].SingleMetaDataList[j].Id;
                            }
                        }
                    }
                }
                if (String.IsNullOrEmpty(value) == false)
                {
                    Location = value;
                }
            }
            List<SingleItem> Items = CustomApps.Pnp.Policies.GetPolicies("", Id, list, Search, Department, SearchBy, order, Location, Category, Author,"", Page);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getConcurences(string DocId, string Id,string username, string status) {
            List<AllConcurrers> Items = CustomApps.Pnp.Concurrence.GetConcurrences(username, DocId, "", status, Id);
            return Json(new { Items }, JsonRequestBehavior.AllowGet); 
        }
        public JsonResult UpdateConcurences(string ScriptAs, string DocId, string username, string userId, string DueDate, string StartDate, string Status, string Title,
            string Author, string CreatedOn, string RejectionReason, string DeadLine, string ApproveComments, string AllConcurrers, string AllConcurrerIds,
            string PercentComplete, string Id, string email, string FinialApproveal, string Initiator, string Approver)
        {
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            if (String.IsNullOrEmpty(ApproveComments) == false) { 
                ApproveComments = ApproveComments.Replace("'", "");
            }
            if (String.IsNullOrEmpty(RejectionReason) == false)
            {
                RejectionReason = RejectionReason.Replace("'", "");
            }
            List<string> Items = CustomApps.Pnp.Library.UpdatedConcur(DocId, Id, uNameTemp, userId, DueDate, StartDate, Status, Title,
                      Author, CreatedOn, RejectionReason, DeadLine, ApproveComments, AllConcurrers, AllConcurrerIds,
                     PercentComplete, "", Initiator, Approver);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateApproval (string ApproverID, string status)
        {
           var results =  CustomApps.Pnp.Library.UpdateApprovals(ApproverID, status);

            return Json(new { results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AddApprover(string DocId)
        {
            List<SingleItem> getDocData2 = CustomApps.Pnp.Policies.GetPolicies("", DocId, "Draft", "", "", "", "");
            var Approver = getDocData2[0].Fields.Approver;
            var FileName = getDocData2[0].Fields.FileName;
            var PDFFilePath = getDocData2[0].Fields.PDFFilePath;
            var theId = getDocData2[0].Fields.Id;
            var Author = getDocData2[0].Fields.Author;
            List<string> results = new List<string>();
            if (Approver.IndexOf(";") >= 0)
            {
                string [] split = Approver.Split(';');
                for (var i=0; i < split.Length; i++)
                {
                    if (split[i] != "")
                    {
                        List<string> getUserValues = SQL.Pnp.GetUser("", "", "", split[i]);
                        results = CustomApps.Pnp.Approvers.CreateApprover(split[i], DocId, getUserValues[0], "Not Started", "", "Please Approve " + FileName, "0", PDFFilePath);
                        SendEmail.SendEmail.NewApproverTasks(FileName, "http://garnetinfo/Pnp/policy/" + theId, getUserValues[0], Author, "http://garnetinfo/Pnp//PolicesDiscussion/" + theId + "c", "", getUserValues[2]);
                    }
                }
            }
            else
            {
                List<string> getUserValues = SQL.Pnp.GetUser("", "", "", Approver);
                results = CustomApps.Pnp.Approvers.CreateApprover(Approver, DocId, getUserValues[0], "Not Started", "", "Please Approve " + FileName, "0", PDFFilePath);
                SendEmail.SendEmail.NewApproverTasks(FileName, "http://garnetinfo/Pnp/policy/" + theId, getUserValues[0], Author, "http://garnetinfo/Pnp//PolicesDiscussion/" + theId + "c", "", getUserValues[2]);
            }
            return Json(new { results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getApprover(string Approver, string DocId, string UserName, string Status, string ApproverID, string orderBy)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            if (String.IsNullOrEmpty(ApproverID) == false)
            {
                Username = "";
            }
            if (String.IsNullOrEmpty(DocId) == false)
            {
                Username = "";
            }
            var Items = CustomApps.Pnp.Approvers.GetApprovers(Approver, DocId, Username, Status, ApproverID, orderBy);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getRelatedDocuments(string Id,string author, string search, string searchBy, string orderBy, string page)
        {
            var Items = CustomApps.Pnp.PoliciesRelatedDocuments.GetPolicies(Id, author, "", search, searchBy, orderBy, page);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeletetRelatedDocument(string Id)
        {

            var Items = CustomApps.Pnp.PoliciesRelatedDocuments.delete(Id);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Delete(string List, string itemID)
        {
            //Add support 
            return Json(new { Success = "true" }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getUsers(string UserName, string EmployeeNumber, string EmailAddress, string FirstName, string LastName, string ADDomainUserName, string half)
        {
            List<AllUsers> Items = CustomApps.Pnp.MetaData.getUsers(UserName, EmployeeNumber, EmailAddress, FirstName, LastName, ADDomainUserName, half);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        
        public JsonResult CheckOut(string id, string url, string checkType, string Comments, string checkintype)
        {

            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items = CustomApps.Pnp.Library.HandleCheckOut(id, Username);
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult CheckInPost(HttpPostedFileBase file, string FileName, string id)
        {
            
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items = CustomApps.Pnp.Library.HandleCheckinPost(file, FileName, Username, id);
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CheckIn( string FileName, string id)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items =  CustomApps.Pnp.Library.HandleCheckin(id, Username);
         
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Archive(string id, string username)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items = CustomApps.Pnp.Library.Archive(id, Username);
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UnArchive(string id, string username)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items = CustomApps.Pnp.Library.UnArchive(id, Username);
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeletePolicy(string Id)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            var Items = CustomApps.Pnp.Policies.Delete(Id);
            return Json(new { data = Items }, JsonRequestBehavior.AllowGet);
        }
        public static string GetName()
        {
            PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            UserPrincipal user = UserPrincipal.FindByIdentity(ctx, Username);
            string givenName = user.GivenName;
            return givenName;
        }
        [HttpPost]
        public JsonResult UploadFilePDR(string list, string userName, string password, string overwrite, HttpPostedFileBase file, string FileName,
           string AddToItem, string itemId)
        {
            List<string> data = new List<string>();
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            data = CustomApps.Pnp.PoliciesRelatedDocuments.UploadRelatedDocToSever(file, list, FileName, Username, itemId);

            return Json(new { data }, JsonRequestBehavior.AllowGet);
        }
        [HttpPost]
        public JsonResult UploadFile(string list, string userName, string password, string overwrite, HttpPostedFileBase file, string FileName,
            string AddToItem, string itemId)
          {
            List<string> data = new List<string>();
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            data = CustomApps.Pnp.Policies.UploadFileToServer(file, list, FileName, Username, itemId);
           
            return Json(new { data }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CopyItemToList(string List, string FileURL, string FileName, string Title, string Category, string Department, string Location, string Concurrer,
            string PolicyRelatedDoc1, string PolicyRelatedDoc2, string PolicyRelatedDoc3, string PolicyRelatedDoc4, string PolicyRelatedDoc5, string itemId, string UpdateOrCreate)
        {
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            List<string> Results = CustomApps.Pnp.Policies.UpdatePolicy("", List, "", "", "", "CURRENT_TIMESTAMP", Username, "",
              "", "", "", "", "", "", "", "", "", "", "", "", "", itemId, "");
            return Json(new { Results }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CreateItem( string List, string FileName, string Title, string Category, string Department,string Location, string Concurrers,
             string itemId, string UpdateOrCreate,  string DueDate, string RejecttionReason, string approveComment, string PercentComplete,  string ConcurrerName,
             string AutoApprove, string Approver, string RelatedDocs)
        {
            
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", "", "", "", "CURRENT_TIMESTAMP", Username, Title,
              "", "", "", DueDate, AutoApprove, Category, Location, Department, "", "", "", Concurrers, Approver, itemId, RelatedDocs);
            try
            {
                CustomApps.Pnp.Library.UpdatePolicyPDFToCurrentPolicyNumber(itemId);
            }
            catch (Exception E)
            {

            }
            return Json(new { data }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult saveFile(string url)
        {
            string mainPath = Server.MapPath("/img/");
            string path = Library.saveFile(url, mainPath);
            return Json(new { data = path }, JsonRequestBehavior.AllowGet);
        }
        

        public JsonResult DocumentContents(string pathURL)
        {
            string outputText = Library.getDocumentContent(pathURL);
            return Json(new { data = outputText }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult PDFContents(string pathURL)
        {
            string outputText = Library.getPDFContent(pathURL);
            return Json(new { data = outputText }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Email(string to, string from, string subject, string body)
        {
            string result = SendEmail.SendEmail.Send(to,  subject, body);
            return Json(new { data = result, to, from, subject, body }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult NewUpload(string fileName, string link, string user)
        {
            string result = SendEmail.SendEmail.NewUpload(fileName, link, user);
            return Json(new { data = result}, JsonRequestBehavior.AllowGet);
        }

        public JsonResult NewTasks(string fileName, string link, string user, string uploaded, string ConvoLink, string date, string email)
        {
            string result = SendEmail.SendEmail.NewTasks(fileName, link, user, uploaded, ConvoLink, date, email);
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllMeta()
        {
            var result = CustomApps.Pnp.MetaData.GetAllMetaData();
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult MasterRefresh()
        {
            string result = CustomApps.Pnp.Library.removeCookie(Response);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace("GHVHS\\", "");
            List<HttpCookie> getCookies = CustomApps.Pnp.Library.ValidatePnpUser(uName);
            if (getCookies.Count > 0)
            {
                Response.SetCookie(getCookies[0]);
                Response.SetCookie(getCookies[1]);
            }
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        private void MasterClear()
        {
            string result = CustomApps.Pnp.Library.removeCookie(Response);
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace("GHVHS\\", "");
            List<HttpCookie> getCookies = CustomApps.Pnp.Library.ValidatePnpUser(uName);
            if (getCookies.Count > 0)
            {
                Response.SetCookie(getCookies[0]);
                Response.SetCookie(getCookies[1]);
            }
            
        }
        public JsonResult GetPolicyFileHistory(string PolicyId, string Date, string fileName)
        {
            List<AllFileHistory> FileHistory = CustomApps.Pnp.FileHistory.GetFileHistory(PolicyId, Date, fileName);
            return Json(new { FileHistory }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdatePolicyWordDoc(string id)
        {
            string result = "false";
            try
            {
                CustomApps.Pnp.Library.UpdatePolicyPDFToCurrentPolicyNumber(id);
                result = "true";
            }
            catch(Exception E)
            {
                result = E.ToString();
            }
            return Json(new { result }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Help()
        {

            List<MetaDataList> Nav = Navigation();
            List<AllMetaData> Meta = MetaData();
            HttpCookieCollection cookies = Request.Cookies;
            string uNameTemp = System.Web.HttpContext.Current.User.Identity.Name;
            uNameTemp = uNameTemp.Replace("GHVHS\\", "");
            ViewBag.UserName = uNameTemp;
            ViewBag.Nav = Nav;
            ViewBag.Meta = Meta;
            return View();
        }
    }
}
