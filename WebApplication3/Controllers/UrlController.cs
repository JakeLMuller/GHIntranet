using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SharePointApi;

namespace WebApplication3.Controllers
{
    public class UrlController : Controller
    {
        // GET: Url
        public ActionResult Create(string id, string add, string AltName)
        {
            string result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(AltName), "");
            if (result == "none")
            {
                if (result.IndexOf("Error") < 0) {
                    result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(AltName), "Create");
                }
            }else
            {
                result = "Already Created or one of the Following is Already Is use:"; 
            }
            ViewBag.url = Library.MySqlEscape(add);
            ViewBag.id = Library.MySqlEscape(id);
            ViewBag.AltName = Library.MySqlEscape(AltName);
            ViewBag.result = result;
            return View();
        }
        public JsonResult Update(string id, string add, string AltName)
        {
            string result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(AltName), "");
            if (result != "none")
            {
                if (result.IndexOf("Error") < 0)
                {
                    result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(AltName), "Update");
                }
                else
                {
                    result = "Error";
                }
            }
            else
            {
                result = "Not Yet Created";
            }
            return Json(new { Reponse = result }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Delete(string id, string add, string AltName)
        {
            string result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(id), "");
            if (result != "none")
            {
                if (result.IndexOf("Error") < 0)
                {
                    result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(id), "Delete");
                }
                else
                {
                    result = "Error";
                }
            }
            else
            {
                result = "Already Deleted";
            }
            return Json(new { Reponse = result }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult Load(string id, string add, string AltName)
        {
            string result = SQL.urls.TinyURL(Library.MySqlEscape(id), Library.MySqlEscape(add), Library.MySqlEscape(id), "");
            if (result == "none")
            {
                result = "Not yet Created";
            }
            
            ViewBag.url = Library.MySqlEscape(add);
            ViewBag.id = Library.MySqlEscape(id);
            ViewBag.AltName = Library.MySqlEscape(id);
            ViewBag.result = result;
            return View();
        }
    }
}