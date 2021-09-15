using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class FilesController : Controller
    {
       
        // GET: Files
        [AllowAnonymous]
        [OutputCache(NoStore = true, Duration = 100)]
        public ActionResult Files(string route, string path)
        {
           
                ViewBag.Route = route;
                ViewBag.Path = path;
                
            //FileModel fileModel = new FileModel(route, path);
            // var TempFile = fileModel;
            //fileModel = null;
            //ViewBag.fileModel = TempFile;
            ViewBag.route = route;
            ViewBag.path = path;
              return View();
            
        }
        public JsonResult GetFiles(string route, string path)
        {
            if (String.IsNullOrEmpty(path) == false)
            {
                path = path.Replace("()(", "&");
            }
            FileModel fileModel = new FileModel(route, path);
            return Json(new { fileModel }, JsonRequestBehavior.AllowGet);
        }

     

    }
}
