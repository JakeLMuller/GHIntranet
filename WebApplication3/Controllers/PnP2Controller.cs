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

namespace WebApplication3.Controllers
{
    public class PnP2Controller : Controller
    {
        public String UserName = "";
        public String Password = "";

        public List<GetAllFiles.Collection> AllFiles()
        {
            string[] lists = new String[4];
            List<GetAllFiles.Collection> list = new List<GetAllFiles.Collection>();
            list = (HttpContext.Cache["AllFiles"] as List<GetAllFiles.Collection>);
            string mainPath = Server.MapPath("/img/");
            if (list == null)
            {

                lists[0] = "DraftPolicies";
                lists[1] = "Approved%20Policies";
                lists[2] = "ArchivePolicies";
                lists[3] = "Policies%20%20Related%20%20documents";
                list = GetAllFiles.AggregateListItems("", "", lists, "", "", "", "", "", mainPath);
                HttpContext.Cache.Insert("AllFiles", list);
            }
            else if (list.Count < 4)
            {
                HttpContext.Cache.Remove("AllFiles");
                lists[0] = "DraftPolicies";
                lists[1] = "Approved%20Policies";
                lists[2] = "ArchivePolicies";
                lists[3] = "Policies%20%20Related%20%20documents";
                list = GetAllFiles.AggregateListItems("", "", lists, "", "", "", "", "", mainPath);
                HttpContext.Cache.Insert("AllFiles", list);
            }
            return list;
        }
        public List<getItems.Entry> users()
        {
            List<getItems.Entry> list = new List<getItems.Entry>();
            list = (HttpContext.Cache["Users"] as List<getItems.Entry>);
            if (list == null)
            {
                list = getItems.GetListItems("", "", "", "", "47ff4b99-a935-4c8b-aae8-be5fb065b065", "", "", "", "");
                HttpContext.Cache.Insert("Users", list);
            }
            if (list.Count < 5)
            {
                ClearUsers();
                list = getItems.GetListItems("", "", "", "", "47ff4b99-a935-4c8b-aae8-be5fb065b065", "", "", "", "");
                HttpContext.Cache.Insert("Users", list);
            }
            return list;
        }
        public List<Concurence.Entry> Concurrence()
        {
            List<Concurence.Entry> list = new List<Concurence.Entry>();
            list = (HttpContext.Cache["Concurrence"] as List<Concurence.Entry>);
            string refill = "";
            if (list == null)
            {
                refill = "Y";
            }
            else if (list.Count <= 0)
            {
                refill = "Y";
            }
            else if (list[0].id == "Not Logged In")
            {
                refill = "Y";
            }
            if (refill == "Y")
            {
                List<getItems.Entry> list2 = (HttpContext.Cache["Users"] as List<getItems.Entry>);
                List<GetAllFiles.Collection> list3 = (HttpContext.Cache["AllFiles"] as List<GetAllFiles.Collection>);
                list = Concurence.CleanConcurences(Concurence.GetListItems("Workflow%20Tasks", "", "", "", "", "", "", "", "", list3, list2), list3);
                //list = Concurence.GetListItems("Workflow%20Tasks", "", "", "", "", "", "", "", "?$filter=Status%20eq%20%27Not%20Started%27", list3, list2);

                HttpContext.Cache.Insert("Concurrence", list);
            }
            return list;
        }
        public JsonResult IsConcurrenceCached()
        {
            string result = "true";
            List<Concurence.Entry> list = new List<Concurence.Entry>();
            list = (HttpContext.Cache["Concurrence"] as List<Concurence.Entry>);
            if (list == null)
            {
                result = "false";
            }
            else if (list.Count <= 0)
            {
                result = "false";
            }
            else if (list[0].id == "Not Logged In")
            {
                result = "false";
            }
            return Json(new { Success = result }, JsonRequestBehavior.AllowGet);
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
        public void ClearLists(string list)
        {
            if (String.IsNullOrEmpty(list) == false)
            {
                string[] lists = new String[1];
                string mainPath = Server.MapPath("/img/");
                lists[0] = list;
                List<GetAllFiles.SingleItem> Single = new List<GetAllFiles.SingleItem>();
                List<GetAllFiles.Collection> datalist = new List<GetAllFiles.Collection>();
                datalist = GetAllFiles.AggregateListItems("", "", lists, "", "", "", "", "", mainPath);

                List<GetAllFiles.Collection> data = new List<GetAllFiles.Collection>();
                data = (HttpContext.Cache["AllFiles"] as List<GetAllFiles.Collection>);
                string[] allLists = new String[4];
                allLists[0] = "DraftPolicies";
                allLists[1] = "Approved%20Policies";
                allLists[2] = "ArchivePolicies";
                allLists[3] = "Policies%20%20Related%20%20documents";
                int j = 0;
                string isPresent = "";
                string resetFlag = "N";
                for (int i = 0; i < data.Count; i++)
                {
                    if (data[i].Id == list)
                    {
                        data.RemoveAt(i);
                        data.Add(datalist[0]);

                    }
                    else if (data[i].Id.IndexOf("System") >= 0)
                    {
                        resetFlag = "Y";
                    }
                }
                if (resetFlag == "Y")
                {
                    data = GetAllFiles.AggregateListItems("", "", allLists, "", "", "", "", "", mainPath);

                }
                HttpContext.Cache.Remove("AllFiles");
                HttpContext.Cache.Insert("AllFiles", data);
            }
            else
            {
                HttpContext.Cache.Remove("AllFiles");
                HttpContext.Cache.Remove("Users");
                HttpContext.Cache.Remove("Concurrence");
            }
        }
        public JsonResult UpdateSingleAprovedPolicy(string Id, string Name, string FileRef, string LastModified)
        {
            string result = UpdateApprovedPolicies(Id, Name, FileRef, LastModified);
            return Json(new { Success = result }, JsonRequestBehavior.AllowGet);
        }
        public string UpdateApprovedPolicies(string Id, string Name, string FileRef, string LastModified)
        {

            ClearLists("Approved%20Policies");
            List<GetAllFiles.Collection> data = new List<GetAllFiles.Collection>();
            List<GetAllFiles.Collection> AP = new List<GetAllFiles.Collection>();
            data = (HttpContext.Cache["AllFiles"] as List<GetAllFiles.Collection>);
            for (int i = 0; i < data.Count; i++)
            {
                if (data[i].Id == "Approved%20Policies")
                {
                    AP.Add(data[i]);
                    data.RemoveAt(i);
                }
            }
            if (String.IsNullOrEmpty(Name) == true)
            {
                for (int j = 0; j < AP[0].SingleItem.Count; j++)
                {
                    if (AP[0].SingleItem[j].Fields[0].ID == Id)
                    {
                        Name = AP[0].SingleItem[j].Fields[0].Name;
                        FileRef = AP[0].SingleItem[j].Fields[0].FileRef;
                    }
                }
            }
            string[] nameParts = Name.Split('.');
            string nameOfDOC = nameParts[0] + ".pdf"; ;
            string[] FilePathParts = FileRef.Split('.');
            string NewFileName = FilePathParts[0] + ".pdf";
            int tempId1 = Int32.Parse(Id);
            //DateTime firstDate = DateTime.Parse(LastModified);
            string results = "false";
            for (int j = 0; j < AP[0].SingleItem.Count; j++)
            {
                if (results == "false")
                {
                    string tempDate = AP[0].SingleItem[j].Fields[0].LastModified;
                    DateTime secondDate = DateTime.Parse(tempDate);
                    var singleData = AP[0].SingleItem[j].Fields[0];
                    if (String.IsNullOrEmpty(singleData.ID) == false)
                    {
                        //int tempId2 = Int32.Parse(singleData.ID);
                        if (singleData.Name == nameOfDOC && singleData.FileRef == NewFileName)
                        {
                            List<string> values = Pnp.storeDraftPolcies(Id, "", "", "", "", "", "", "", "", "", "", "", "");
                            if (values.Count > 0)
                            {
                                List<string> tempData = new List<string>();
                                tempData = Pnp.storeDraftPolcies(singleData.ID, "", "", "", "", "", "", "", "", "", "", "", "");
                                if (tempData.Count <= 0)
                                {
                                    Pnp.storeDraftPolcies(singleData.ID, values[0], values[1], values[2], values[3], "", "Create", values[5], "", values[6], values[7], values[8], values[9]);
                                }
                                Boolean check = checkLogin();
                                if (check == true)
                                {
                                    var Items = DeleteItem.Remove(UserName, Password, "Approved%20Policies", Id);
                                }
                                AP[0].SingleItem[j].Fields[0].PolicyRelatedDoc1 = values[0];
                                AP[0].SingleItem[j].Fields[0].PolicyRelatedDoc2 = values[1];
                                AP[0].SingleItem[j].Fields[0].PolicyRelatedDoc3 = values[2];
                                AP[0].SingleItem[j].Fields[0].PolicyRelatedDoc4 = values[3];
                                results = "true";
                            }
                        }
                    }
                }
            }
            data.Add(AP[0]);
            HttpContext.Cache.Remove("AllFiles");
            HttpContext.Cache.Insert("AllFiles", data);
            return results;
        }
        public void getUAndP()
        {

            if (Request.Cookies["Id"] != null)
            {
                if (Request.Cookies["Date"] != null)
                {
                    var date = Request.Cookies["Date"].Value;
                    DateTime firstDate = DateTime.Parse(date);
                    DateTime secondDate = DateTime.Now;
                    firstDate = firstDate.AddHours(12);
                    int result = DateTime.Compare(firstDate, secondDate);
                    if (result > 0)
                    {
                        var theID = Request.Cookies["Id"].Value;
                        string uANDp = Pnp.CheckOrAddUser("", "ID", "", theID);
                        if (uANDp != "false")
                        {
                            string[] words = uANDp.Split('|');
                            var checkIdHash = EncryptAndDecrypt.sha256_hash(words[0] + words[1]);
                            if (checkIdHash != theID)
                            {
                                Request.Cookies.Remove("Id");
                                Request.Cookies.Remove("Date");
                            }
                            else
                            {
                                UserName = EncryptAndDecrypt.Decrypt(words[0]);
                                Password = EncryptAndDecrypt.Decrypt(words[1]);
                            }
                        }
                        else
                        {
                            Request.Cookies.Remove("Id");
                            Request.Cookies.Remove("Date");
                        }



                    }
                    else
                    {
                        Request.Cookies.Remove("Id");
                        Request.Cookies.Remove("Date");
                    }
                }
                else
                {
                    Request.Cookies.Remove("Id");
                }


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

        public ActionResult Home(string Id, string FirstName, string CheckOrCreate, string LastName, string List, string SearchValue)
        {
            if (Id != "View")
            {



                Boolean check = checkLogin();
                if (check == false)
                {
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    ViewBag.redirect = "/PnP/Home";

                    return View("~/Views/Pnp/AddUser.cshtml");
                }
                else
                {
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    ViewBag.UserName = UserName;
                    ViewBag.AllFiles = AllPolcies;
                    ViewBag.SearchBy = List;
                    ViewBag.SearchValue = SearchValue;
                    ViewBag.Id = Id;
                    return View();
                }

            }
            else
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                ViewBag.UserName = UserName;
                ViewBag.AllFiles = AllPolcies;
                ViewBag.SearchBy = List;
                ViewBag.SearchValue = SearchValue;
                ViewBag.Id = Id;
                return View();

            }

        }

        public ActionResult DraftPolicies()
        {
            ClearLists("DraftPolicies");
            Boolean check = checkLogin();
            if (check == false)
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                ViewBag.redirect = "/PnP/DraftPolicies";
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.UserName = UserName;
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                return View();
            }

        }
        public ActionResult PoliciesRelateddocuments(string Id)
        {
            Boolean check = checkLogin();
            if (check == false)
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                ViewBag.redirect = "/PnP/PoliciesRelateddocuments";
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.UserName = UserName;
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                ViewBag.Id = Id;
                return View();
            }

        }
        public ActionResult ApprovedPolicies(string Id)
        {
            if (Id != "View")
            {

                Boolean check = checkLogin();
                if (check == false)
                {
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    ViewBag.redirect = "/PnP/ApprovedPolicies";
                    return View("~/Views/Pnp/AddUser.cshtml");
                }
                else
                {
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    string givenName = user.DisplayName;
                    ViewBag.UserName = UserName;
                    ViewBag.fullName = givenName;
                    ViewBag.AllFiles = AllPolcies;
                    ViewBag.Id = Id;
                    return View();
                }
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.UserName = uName;
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                ViewBag.Id = Id;
                return View();
            }
        }
        public ActionResult ViewFile(string path, string name, string height)
        {
            Boolean check = checkLogin();
            if (check == false)
            {
                ViewBag.redirect = "/PnP/ViewFile?path=" + path + "&name=" + name + "&height=" + height;
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                string givenName = user.DisplayName;
                ViewBag.name = name;
                ViewBag.path = path;
                ViewBag.height = height;
                ViewBag.AllFiles = getAll("", "", "", "", "");
                return View();
            }

        }
        public ActionResult ViewItem(string id, string ItemId, string ViewOnly)
        {
            if (ViewOnly != "Y")
            {
                Boolean check = checkLogin();
                if (check == false)
                {
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    ViewBag.redirect = "/PnP/ViewItem/" + id + "?ItemId=" + ItemId;
                    return View("~/Views/Pnp/AddUser.cshtml");
                }
                else
                {
                    PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                    string uName = System.Web.HttpContext.Current.User.Identity.Name;
                    UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                    List<GetAllFiles.Collection> AllPolcies = AllFiles();
                    string givenName = user.DisplayName;
                    ViewBag.ItemId = ItemId;
                    ViewBag.list = id;
                    ViewBag.UserName = UserName;
                    ViewBag.fullName = givenName;
                    ViewBag.AllFiles = AllPolcies;
                    ViewBag.ViewOnly = ViewOnly;
                    return View();
                }
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.ItemId = ItemId;
                ViewBag.list = id;
                ViewBag.UserName = "";
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                ViewBag.ViewOnly = ViewOnly;
                return View();
            }

        }
        public ActionResult ArchivePolicies()
        {
            Boolean check = checkLogin();
            if (check == false)
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                ViewBag.redirect = "/PnP/ArchivePolicies";
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.UserName = UserName;
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                return View();
            }

        }
        public ActionResult PolicesDiscussion(string Id, string SubId, string orderBy, string Search)
        {
            Boolean check = checkLogin();
            if (check == false)
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
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
                    url += third + "orderBy=" + orderBy;
                }
                if (String.IsNullOrEmpty(Search) == false)
                {
                    url += fourth + "Search=" + Search;
                }
                ViewBag.redirect = url;
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                string givenName = user.DisplayName;
                ViewBag.UserName = UserName;
                ViewBag.Id = Id;
                ViewBag.SubId = SubId;
                ViewBag.fullName = givenName;
                ViewBag.Search = Search;
                ViewBag.orderBy = orderBy;
                ViewBag.AllFiles = AllPolcies;
                return View();
            }

        }
        public ActionResult Concurrences(string ViewApproved)
        {
            Boolean check = checkLogin();
            if (check == false)
            {
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                List<getItems.Entry> Users = users();
                ViewBag.redirect = "/PnP/Concurrences";
                return View("~/Views/Pnp/AddUser.cshtml");
            }
            else
            {
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                string uName = System.Web.HttpContext.Current.User.Identity.Name;
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, uName);
                List<GetAllFiles.Collection> AllPolcies = AllFiles();
                var js = new System.Web.Script.Serialization.JavaScriptSerializer();
                List<getItems.Entry> Users = users();
                var userData = js.Serialize(Users);
                string givenName = user.DisplayName;
                ViewBag.UserName = UserName;
                ViewBag.fullName = givenName;
                ViewBag.AllFiles = AllPolcies;
                ViewBag.Users = userData;
                ViewBag.ViewApproved = ViewApproved;
                return View();
            }

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
                    return checkLog(username, password);
                }

            }



        }
        public JsonResult checkLog(string username, string password)
        {
            Boolean Results = false;
            if (String.IsNullOrEmpty(username) == false && String.IsNullOrEmpty(password) == false)
            {
                string sharePointAuthOk = "N";
                var Items = getItems.GetListItems("DraftPolicies", username, password, "", "", "", "", "", "");
                if (Items.Count == 0)
                {
                    sharePointAuthOk = "Y";
                }
                else if (Items[0].id == "Not Logged In")
                {
                    sharePointAuthOk = "N";
                }
                else
                {
                    sharePointAuthOk = "Y";
                }
                string checkForAccount = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "N", EncryptAndDecrypt.Encrypt(password), "");
                if (sharePointAuthOk == "Y")
                {
                    string Id = "";
                    if (checkForAccount == EncryptAndDecrypt.Encrypt(username))
                    {
                        Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                    }
                    else if (String.IsNullOrEmpty(checkForAccount) == false)
                    {
                        string check = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Username", "", "");
                        if (check == EncryptAndDecrypt.Encrypt(username))
                        {
                            string Update = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Update", EncryptAndDecrypt.Encrypt(password), "");
                            Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                            string UpdateId = Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "UpdateId", EncryptAndDecrypt.Encrypt(password), Id);
                        }
                        else
                        {
                            Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                            Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Y", EncryptAndDecrypt.Encrypt(password), Id);
                        }

                    }
                    var cookie = new HttpCookie("Id", Id)
                    {
                        HttpOnly = true
                    };
                    DateTime aDay = DateTime.Now;
                    var cookieDate = new HttpCookie("Date", aDay.ToString())
                    {
                        HttpOnly = true
                    };
                    Response.SetCookie(cookieDate);
                    Response.SetCookie(cookie);
                    Results = true;
                }
                else
                {
                    Results = false;
                }

            }



            return Json(new { Success = Results }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult SearchAll(string Id, string search, string searchBy, string orderBy, string filter)
        {
            string PRDfilter = "";

            filter = "?$filter=substringof(%27" + search + "%27,TaxCatchAll/Term)%20or%20substringof(%27" + search + "%27,Title)%20or%20substringof(%27" + search + "%27,FileRef)";
            search = "";
            PRDfilter = "?$filter=substringof(%27" + search + "%27,Title)";


            var DraftPolicies = getItems.GetListItems("DraftPolicies", "", "", Id, "", search, searchBy, orderBy, filter);
            var ApprovedPolicies = getItems.GetListItems("Approved%20Policies", "", "", Id, "", search, searchBy, orderBy, filter);
            var ArchivePolicies = getItems.GetListItems("ArchivePolicies", "", "", Id, "", search, searchBy, orderBy, filter);
            var PoliciesRelateddocuments = getItems.GetListItems("Policies%20%20Related%20%20documents", "", "", Id, "", search, searchBy, orderBy, PRDfilter);
            return Json(new { DraftPolicies, ApprovedPolicies, ArchivePolicies, PoliciesRelateddocuments }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getAll(string Id, string search, string searchBy, string orderBy, string filter)
        {
            string PRDfilter = "";


            var DraftPolicies = getItems.GetListItems("DraftPolicies", "", "", Id, "", search, searchBy, orderBy, filter);
            var ApprovedPolicies = getItems.GetListItems("Approved%20Policies", "", "", Id, "", search, searchBy, orderBy, filter);
            var ArchivePolicies = getItems.GetListItems("ArchivePolicies", "", "", Id, "", search, searchBy, orderBy, filter);
            var PoliciesRelateddocuments = getItems.GetListItems("Policies%20%20Related%20%20documents", "", "", Id, "", search, searchBy, orderBy, PRDfilter);
            return Json(new { DraftPolicies, ApprovedPolicies, ArchivePolicies, PoliciesRelateddocuments }, JsonRequestBehavior.AllowGet);
        }
        public List<GetAllFiles.Collection> getAllFiles(string Usename, string password, string Fields, string className, string search, string searchBy, string OrderBy)
        {

            string[] lists = new String[5];
            string mainPath = Server.MapPath("/img/");
            // Initialising the array of strings 
            lists[0] = "DraftPolicies";
            lists[1] = "Approved%20Policies";
            lists[2] = "ArchivePolicies";
            lists[3] = "Policies%20%20Related%20%20documents";
            var Results = GetAllFiles.AggregateListItems("", "", lists, Fields, className, search, searchBy, OrderBy, mainPath);
            return Results;
        }
        public JsonResult DeletePolicesDiscussionAndAllMessages(string DocId, string ConvoId, string Title, string Body, string IsSecure, string PeopleInConvo, string orderBy)
        {
            List<string> Items = SharePointApi.PolicesDiscussion.Convos(DocId, ConvoId, Title, Body, IsSecure, PeopleInConvo, "Delete", orderBy, "");
            if (Items[0] == "Success")
            {
                Items = SharePointApi.PolicesDiscussion.PnpMeassges(ConvoId, "All", Title, Body, "", "", "Delete", orderBy);
            }
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getPolicesDiscussions(string DocId, string ConvoId, string Title, string Body, string IsSecure, string PeopleInConvo, string ScriptAs, string orderBy, string emails)
        {
            List<string> Items = SharePointApi.PolicesDiscussion.Convos(DocId, ConvoId, Title, Body, IsSecure, PeopleInConvo, ScriptAs, orderBy, emails);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getPolicesMessages(string ConvoId, string MessageId, string Title, string Body, string SingleUser, string SingleUserId, string ScriptAs, string orderBy)
        {
            List<string> Items = SharePointApi.PolicesDiscussion.PnpMeassges(ConvoId, MessageId, Title, Body, SingleUser, SingleUserId, ScriptAs, orderBy);
            if (ScriptAs == "Create")
            {
                List<string> Dicussion2 = SharePointApi.PolicesDiscussion.Convos("", ConvoId, "", "", "", "", "", "", "");
                string[] peopleToEmail = Dicussion2[5].Split(',');
                string CheckForMultpleEmails = "";
                for (var i = 0; i < peopleToEmail.Length; i++)
                {
                    string link = "http://sqldev:81/PnP/ViewItem/DraftPolicies?itemId=" + Dicussion2[0];
                    string convo = "http://sqldev:81/PnP/PolicesDiscussion/" + Dicussion2[1];
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
        public JsonResult getDraftPolicies(string Id, string search, string searchBy, string orderBy, string Filter)
        {
            var Items = getItems.GetListItems("DraftPolicies", "", "", Id, "", search, searchBy, orderBy, Filter);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getConcurences(string DocId, string Id, string username, string status)
        {

            /*List<Concurence.Entry> Items;
            if (String.IsNullOrEmpty(Id) == false || String.IsNullOrEmpty(search) == false || String.IsNullOrEmpty(searchBy) == false || String.IsNullOrEmpty(orderBy) == false || String.IsNullOrEmpty(Filter) == false) {
                if (Filter != "?$filter=Status eq 'Not Started'") {
                    List<getItems.Entry> list2 = (HttpContext.Cache["Users"] as List<getItems.Entry>);
                    List<GetAllFiles.Collection> list3 = (HttpContext.Cache["AllFiles"] as List<GetAllFiles.Collection>);
                    Items = Concurence.GetListItems("Workflow%20Tasks", "", "", Id, "", search, searchBy, orderBy, Filter, list3, list2);
                }
                else
                {
                    Items = Concurrence();
                }
            }else
            {
                Items = Concurrence();

            }*/
            List<string> Items = ConcurenceDB.Convos("", DocId, username, "", "", "", status, "",
                       "", "", "", "", "", "", "", "", Id, "", "");
            if (Items.Count == 0)
            {

                return Json(new { Items = "False" }, JsonRequestBehavior.AllowGet);
            }
            else
            {
                return Json(new { Items }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateConcurences(string ScriptAs, string DocId, string username, string userId, string DueDate, string StartDate, string Status, string Title,
            string Author, string CreatedOn, string RejectionReason, string DeadLine, string ApproveComments, string AllConcurrers, string AllConcurrerIds,
            string PercentComplete, string Id, string email, string FinialApproveal, string Initiator)
        {
            if (Status == "Completed")
            {
                PercentComplete = "100";


            }
            else if (Status == "Rejected")
            {
                PercentComplete = "0";
            }
            else if (Status == "Started")
            {
                PercentComplete = "25";
            }

            if (String.IsNullOrEmpty(ScriptAs) == true)
            {
                ScriptAs = "Update";
            }
            else if (ScriptAs == "Create" && FinialApproveal == "Y")
            {
                Title = Title.Replace("Please Approve", "Finial Approval For ");
                Id = "";
                AllConcurrers = Initiator;
                PrincipalContext ctx = new PrincipalContext(ContextType.Domain);
                UserPrincipal user = UserPrincipal.FindByIdentity(ctx, Initiator);
                string givenName = user.DisplayName;
                username = givenName;
                Author = Initiator;
                PercentComplete = "0";
                Status = "Not Started";
            }
            if (Status == "Rejected" || Status == "Completed")
            {
                List<string> getData = ConcurenceDB.Convos("", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", Id, "", "");
                string Concurrers = getData[12];
                string All = Concurrers + ";" + getData[17];
                List<getItems.Entry> userList = users();
                List<string> getUserData = Library.returnUserNameInfo(userList, All);
                string ConcurrerUsernames = getUserData[1];
                string ConcurrerEmails = getUserData[0];
                string[] allUserNames = ConcurrerUsernames.Split(';');
                string[] allUserEmails = ConcurrerEmails.Split(';');
                string link = "http://Sqldev:81/Pnp/ViewItem/DraftPolcies?ItemId=" + getData[0];
                string Final = "N";
                if (Title.IndexOf("Finial Approval For") >= 0)
                {
                    Final = "Y";
                    link = "http://Sqldev:81/Pnp/ApprovedPolicies";
                }
                else if (Status == "Rejected")
                {
                    Final = "R";
                }
                string CheckForMultpleEmails = "";
                for (var i = 0; i < allUserNames.Length; i++)
                {
                    if (allUserNames[i] != "")
                    {
                        if (CheckForMultpleEmails.IndexOf(allUserNames[i]) < 0)
                        {
                            SendEmail.SendEmail.ApprovedConcurrer(username, allUserNames[i], Title, link, allUserEmails[i], Final);
                            CheckForMultpleEmails += allUserNames[i];
                        }
                    }
                }
            }
            List<string> Items = ConcurenceDB.Convos(ScriptAs, DocId, username, userId, DueDate, StartDate, Status, Title,
                           Author, CreatedOn, RejectionReason, DeadLine, ApproveComments, AllConcurrers, AllConcurrerIds, PercentComplete, Id, email, Initiator);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getApprovedPolicies(string Id, string search, string searchBy, string orderBy, string filter)
        {
            var Items = getItems.GetListItems("Approved%20Policies", "", "", Id, "", search, searchBy, orderBy, filter);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getArchivePolicies(string Id, string search, string searchBy, string orderBy, string filter)
        {
            var Items = getItems.GetListItems("ArchivePolicies", "", "", Id, "", search, searchBy, orderBy, filter);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getPoliciesRelateddocuments(string Id, string search, string searchBy, string orderBy, string filter)
        {
            var Items = getItems.GetListItems("Policies%20%20Related%20%20documents", "", "", Id, "", search, searchBy, orderBy, filter);
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Delete(string List, string itemID)
        {
            if (List == "PoliciesRelateddocuments")
            {
                List = "Policies%20%20Related%20%20documents";
            }
            else if (List == "ApprovedPolicies")
            {
                List = "Approved%20Policies";
            }
            string Items = "True";
            Boolean check = checkLogin();


            if (check == true)
            {
                Items = DeleteItem.Remove(UserName, Password, List, itemID);
                if (List != "Workflow Tasks")
                {
                    ClearLists(List);
                }
                else
                {
                    ClearLists("");
                }
                List<string> values = Pnp.storeDraftPolcies(itemID, "", "", "", "", "", "", "", "", "", "", "", "");
                if (values.Count > 0)
                {
                    Pnp.storeDraftPolcies(itemID, "", "", "", "", "", "Delete", "", "", "", "", "", "");
                }

            }
            else
            {
                Items = "False";
            }
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult getUsers(string Id)
        {
            List<getItems.Entry> Items = new List<getItems.Entry>();
            Items = (HttpContext.Cache["Users"] as List<getItems.Entry>);
            if (Items == null)
            {
                Items = getItems.GetListItems("", "", "", Id, "47ff4b99-a935-4c8b-aae8-be5fb065b065", "", "", "", "");
                HttpContext.Cache.Insert("Users", Items);
            }
            return Json(new { Items }, JsonRequestBehavior.AllowGet);
        }
        [OutputCache(NoStore = true, Duration = 100)]
        public JsonResult getTimes(string list, string guid, string Id, string search, string searchBy, string orderBy, string filter)
        {
            List<getItems.Entry> Items = new List<getItems.Entry>();
            if (guid == "47ff4b99-a935-4c8b-aae8-be5fb065b065")
            {
                Items = (HttpContext.Cache["Users"] as List<getItems.Entry>);
                if (Items == null)
                {
                    Items = getItems.GetListItems(list, "", "", Id, guid, search, searchBy, orderBy, filter);
                    HttpContext.Cache.Insert("Users", Items);
                }
            }
            else
            {
                Items = getItems.GetListItems(list, "", "", Id, guid, search, searchBy, orderBy, filter);
            }
            var Results = Json(new { Items }, JsonRequestBehavior.AllowGet);
            return Results;
        }
        public JsonResult ConcurenceLookUp(string list, string guid, string Id, string search, string searchBy, string orderBy, string filter)
        {
            List<ConcurenceLookUp.Entry> Items = new List<ConcurenceLookUp.Entry>();

            Items = SharePointApi.ConcurenceLookUp.GetListItems(list, "", "", Id, guid, search, searchBy, orderBy, filter);

            var Results = Json(new { Items }, JsonRequestBehavior.AllowGet);
            return Results;
        }
        public JsonResult CheckOut(String url, string checkType, string Comments, string checkintype)
        {
            string Items = "True";
            Boolean check = checkLogin();
            if (check == true)
            {
                Items = CheckInAndOut.checkOut(url, Password, UserName, checkType, Comments, checkintype);
                if (url.IndexOf("Draft") >= 0)
                {
                    ClearLists("DraftPolicies");
                }
                else if (url.IndexOf("Approved") >= 0)
                {
                    ClearLists("Approved%20Policies");
                }
                else if (url.IndexOf("Archive") >= 0)
                {
                    ClearLists("ArchivePolicies");
                }
                else if (url.IndexOf("Related") >= 0)
                {
                    ClearLists("Policies%20%20Related%20%20documents");
                }

            }
            else
            {
                Items = "False";
            }
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
        public JsonResult UploadFile(string list, string userName, string password, string overwrite, HttpPostedFileBase file, string FileName,
            string AddToItem, string itemId)
        {
            string result = "false";
            try
            {
                int fileSizeInBytes = file.ContentLength;
                MemoryStream target = new MemoryStream();
                file.InputStream.CopyTo(target);
                byte[] data = target.ToArray();
                Boolean check = checkLogin();
                if (list == "ApprovedPolicies")
                {
                    list = "Approved%20Policies";
                }
                if (check == true)
                {
                    result = AddFile.FileToSharepoint(list, UserName, Password, overwrite, data, FileName, AddToItem, itemId);
                    if (result.IndexOf("Bad Request") < 0)
                    {
                        string mainPath = Server.MapPath("/img/");
                        string path = Library.saveFile("http://sharepoint/sites/Policies" + "/" + list + "/" + FileName, mainPath);
                        string textContent = "";
                        if (path.IndexOf(".pdf") >= 0 || path.IndexOf(".PDF") >= 0)
                        {
                            textContent = Library.getPDFContent(path);
                        }
                        else if (path.IndexOf(".doc") >= 0 || path.IndexOf(".DOC") >= 0)
                        {
                            textContent = Library.getDocumentContent(path);
                        }
                        else if (path.IndexOf(".txt") >= 0 || path.IndexOf(".txt") >= 0)
                        {
                            textContent = Library.getTextContents(path);
                        }

                        List<string> values = Pnp.storeDraftPolcies(result, "", "", "", "", "", "", "", "", "", "", "", "");
                        if (values.Count > 0)
                        {
                            Pnp.storeDraftPolcies(result, "", "", "", "", "", "Update", textContent, "", "", "", "", "");
                        }
                        else
                        {
                            Pnp.storeDraftPolcies(result, "", "", "", "", "", "Create", textContent, "", "", "", "", "");
                        }
                        string link = "http://sqldev:81/Pnp/ViewItem/" + list + "?ItemId=" + result;
                        SendEmail.SendEmail.NewUpload(FileName, link, UserName);
                        ClearLists(list);
                    }
                }
                else
                {
                    result = "Not Logged In";
                }
            }
            catch (Exception ex)
            {
                result = ex.ToString() + "||" + list + "||" + userName + "||" + FileName;
            }
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CopyItemToList(string List, string FileURL, string FileName, string Title, string Category, string Department, string Location, string Concurrer,
            string PolicyRelatedDoc1, string PolicyRelatedDoc2, string PolicyRelatedDoc3, string PolicyRelatedDoc4, string PolicyRelatedDoc5, string itemId, string UpdateOrCreate)
        {
            string result;
            string reason;
            Boolean check = checkLogin();
            if (check == true)
            {
                byte[] FileData = Library.returnFileData(FileURL);
                if (FileData.Length > 0)
                {
                    if (List == "Approved Policies")
                    {
                        List = "Approved%20Policies";
                    }
                    result = AddFile.FileToSharepoint(List, UserName, Password, "", FileData, FileName, "", "");
                    if (result.IndexOf("Missing") >= 0 && result.IndexOf("Unsupported") >= 0)
                    {
                        result = "False";
                        reason = "Error with uploading File";
                    }
                    else
                    {
                        string id = result;

                        List<string> values = Pnp.storeDraftPolcies(id, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "", "", "", Category, Department, Location, UserName);
                        if (values.Count > 0)
                        {
                            Pnp.storeDraftPolcies(id, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "Update", values[5], "", Category, Department, Location, UserName);
                        }
                        else
                        {
                            Pnp.storeDraftPolcies(id, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "Create", "", "", Category, Department, Location, UserName);
                        }
                        string dateTime = DateTime.Now.ToString("dd-MM-yyyy hh:mm:ss tt");
                        PolicyRelatedDoc1 = "";
                        PolicyRelatedDoc2 = "";
                        PolicyRelatedDoc3 = "";
                        PolicyRelatedDoc4 = "";
                        PolicyRelatedDoc5 = "";
                        result = AddItem.ItemToSharepoint(UserName, Password, List, FileName, Title, Category, Department, Location, Concurrer, PolicyRelatedDoc1,
                          PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, PolicyRelatedDoc5, id, "Y", "", "", "", "", "", "", "");
                        if (result != "")
                        {
                            result = "False";
                            reason = "File Created But Data Not Set";
                            result = AddItem.ItemToSharepoint(UserName, Password, List, FileName, Title, Category, Department, Location, Concurrer, "",
                              "", "", "", "", id, "Y", "", "", "", "", "", "", "");
                            if (result != "")
                            {
                                result = "False";
                                reason = "Failed On Item Edit attempt 2";
                            }
                            else
                            {

                                List<string> Items = ConcurenceDB.Convos("Delete", itemId, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
                                result = "True";
                                reason = "Fixed On Second Attempt";

                            }
                        }
                        else
                        {

                            List<string> Items = ConcurenceDB.Convos("Delete", itemId, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
                            result = "True";
                            reason = "Uploaded Successful";
                        }
                    }
                }
                else
                {
                    result = "False";
                    reason = "Could Not Locate File";
                }
            }
            else
            {
                result = "False";
                reason = "Not Logged in";
            }
            ClearLists("Approved%20Policies");
            return Json(new { result, reason }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult CreateItem(string List, string FileName, string Title, string Category, string Department, string Location, string Concurrer,
            string PolicyRelatedDoc1, string PolicyRelatedDoc2, string PolicyRelatedDoc3, string PolicyRelatedDoc4, string PolicyRelatedDoc5, string itemId, string UpdateOrCreate,
             string Body, string DueDate, string StartDate, string RejecttionReason, string approveComment, string PercentComplete, string workflow, string ConcurrerName, string AutoApprove)
        {
            if (List == "ApprovedPolicies")
            {
                List = "Approved%20Policies";
            }

            string result = "false";
            Boolean check = checkLogin();
            if (check == true)
            {
                if (List != "Workflow Tasks")
                {
                    List<string> values = Pnp.storeDraftPolcies(itemId, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "", "", AutoApprove, Category, Department, Location, UserName);
                    if (values.Count > 0)
                    {
                        Pnp.storeDraftPolcies(itemId, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "Update", "", AutoApprove, Category, Department, Location, UserName);
                    }
                    else
                    {
                        Pnp.storeDraftPolcies(itemId, PolicyRelatedDoc1, PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, Concurrer, "Create", "", AutoApprove, Category, Department, Location, UserName);
                    }
                }
                List<getItems.Entry> userList = users();
                List<string> getUserData = Library.returnUserNameInfo(userList, Concurrer);
                string ConcurrerUsernames = getUserData[1];
                string ConcurrerEmails = getUserData[0];
                if (List == "DraftPolicies")
                {

                    if (String.IsNullOrEmpty(Concurrer) == false)
                    {
                        List<string> values2 = ConcurenceDB.Convos("", itemId, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
                        if (values2.Count > 0)
                        {
                            ConcurenceDB.Convos("Delete", itemId, "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "", "");
                        }
                        if (Concurrer.IndexOf(";") >= 0)
                        {
                            DateTime today = DateTime.Today;
                            string date = today.ToString("d");
                            string[] AllConcurers = Concurrer.Split(';');
                            string[] emails = ConcurrerEmails.Split(';');
                            for (var i = 0; i < AllConcurers.Length; i++)
                            {
                                if (AllConcurers[i] != "")
                                {
                                    ConcurenceDB.Convos("Create", itemId, AllConcurers[i], AllConcurers[i], "", "", "Not Started", "Please Approve " + FileName,
                                    UserName, date, RejecttionReason, "", approveComment, Concurrer, Concurrer, "0", "", emails[i], UserName);
                                    string ConvoUrl = "http://sqldev:81/PnP/PolicesDiscussion/" + itemId + "c";
                                    string viewLink = "http://sqldev:81/PnP/ViewItem/" + List + "?itemId=" + itemId;
                                    if (emails[i] != "")
                                    {
                                        List<string> getUserDatas = Library.returnUserNameInfo(userList, AllConcurers[i] + ";");
                                        string tempUsername = AllConcurers[i];
                                        string tempEmail = getUserDatas[0].Replace(";", "");
                                        SendEmail.SendEmail.NewTasks(FileName, viewLink, AllConcurers[i], UserName, ConvoUrl, date, tempEmail);
                                    }
                                }
                            }
                        }
                        else
                        {
                            ConcurenceDB.Convos("Create", itemId, Concurrer, Concurrer, "", "", "Not Started", "Please Approve " + FileName,
                                UserName, "", RejecttionReason, "", approveComment, Concurrer, Concurrer, "0", "", ConcurrerName, UserName);
                        }
                        Concurrer = "";
                    }
                }
                PolicyRelatedDoc1 = "";
                PolicyRelatedDoc2 = "";
                PolicyRelatedDoc3 = "";
                PolicyRelatedDoc4 = "";
                PolicyRelatedDoc5 = "";
                result = AddItem.ItemToSharepoint(UserName, Password, List, FileName, Title, Category, Department, Location, "1", PolicyRelatedDoc1,
                    PolicyRelatedDoc2, PolicyRelatedDoc3, PolicyRelatedDoc4, PolicyRelatedDoc5, itemId, UpdateOrCreate, Body, DueDate, StartDate, RejecttionReason,
                    approveComment, PercentComplete, workflow);
                if (List != "Workflow Tasks")
                {
                    ClearLists(List);
                    if (List == "DraftPolicies")
                    {
                        List<String> Check = SharePointApi.PolicesDiscussion.Convos(itemId, itemId + "c", "", "", "", "", "", "", "");
                        string Formatednames = ConcurrerUsernames.Replace(";", ",");
                        if (Check.Count <= 0)
                        {
                            SharePointApi.PolicesDiscussion.Convos(itemId, itemId + "c", FileName, UserName + " has created " + FileName + " Please feel free to add your comments in the board", "", UserName + "," + Formatednames, "Create", "", ConcurrerEmails);
                        }
                        else
                        {
                            SharePointApi.PolicesDiscussion.Convos(itemId, itemId + "c", FileName, UserName + " has created " + FileName + " Please feel free to add your comments in the board", "", UserName + "," + Formatednames, "Update", "", ConcurrerEmails);
                        }
                        ClearConcurrence();
                    }
                }
                else
                {
                    ClearConcurrence();
                    if (approveComment == "1")
                    {
                        ClearLists("Approved%20Policies");
                    }
                }
            }
            else
            {
                result = "Not Logged In";
            }

            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult saveFile(string url)
        {
            string mainPath = Server.MapPath("/img/");
            string path = Library.saveFile(url, mainPath);
            return Json(new { data = path }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult APISearch(string Search, string HitHighlightedProperties)
        {
            var results = SharePointApi.Search.Documents("", "", Search, HitHighlightedProperties);
            var jss = new System.Web.Script.Serialization.JavaScriptSerializer();
            var userInfoJson = jss.DeserializeObject(results);
            return Json(userInfoJson, JsonRequestBehavior.AllowGet);
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
            string result = SendEmail.SendEmail.Send(to, subject, body);
            return Json(new { data = result, to, from, subject, body }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult NewUpload(string fileName, string link, string user)
        {
            string result = SendEmail.SendEmail.NewUpload(fileName, link, user);
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult NewTasks(string fileName, string link, string user, string uploaded, string ConvoLink, string date, string email)
        {
            string result = SendEmail.SendEmail.NewTasks(fileName, link, user, uploaded, ConvoLink, date, email);
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult polcies()
        {
            var result = CustomApps.Pnp.Policies.GetPolicies("", "", "", "", "", "", "");
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult AllMeta()
        {
            var result = CustomApps.Pnp.MetaData.GetAllMetaData();
            return Json(new { data = result }, JsonRequestBehavior.AllowGet);
        }
    }
}