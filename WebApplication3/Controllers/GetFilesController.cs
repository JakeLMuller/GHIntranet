using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.Models;

namespace WebApplication3.Controllers
{
    public class GetFilesController : Controller
    {
        // GET: GetFiles
        public JsonResult Files(string route, string path)
        {
            
            FileModel fileModel = new FileModel(route, path);
            return Json(new { fileModel }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult TestNewFiles(string route, string path)
        {
            if (String.IsNullOrEmpty(path) == false)
            {
                path = path.Replace("()(", "&");
            }
            FileModel2 fileModel = CustomApps.Files.FileInfo.GetFileInfo(route, path);
            return Json(new { fileModel }, JsonRequestBehavior.AllowGet);
        }
    }
}