using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SQL;

namespace WebApplication3.Controllers
{
    public class UploaderController : Controller
    {
        // GET: Uploader
        public ActionResult Index(string Username , string Location, String UploadId, String Cid, string MyPosts, string Search)
        {
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace(@"GHVHS\", "");
            if (String.IsNullOrEmpty(MyPosts) == false)
            {
                MyPosts = uName;
            }
            string hi = Uploader.getUploads(Username, Location, UploadId, Cid, MyPosts, Search);
            
            ViewBag.json =  hi;
            ViewBag.username = uName;
            ViewBag.search = Search;
            return View();
        }

        // GET: Uploader/Details/5
        public ActionResult Details(string id)
        {
            string hi = Uploader.getUploads("", "", id, "");
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace(@"GHVHS\", "");
            ViewBag.json = hi;
            ViewBag.username = uName;
            return View();
        }
        
        // GET: Uploader/Create
        public ActionResult Create()
        {
            return View();
        }

        // POST: Uploader/Create
        [HttpPost]
        
        public JsonResult CreatePost(HttpPostedFileBase file, string Username, string Caption, string Location, string CommentId, string UploadId)
        {
            String Result = "";
            try
            {
                if (file != null)
                {
                    string pic = System.IO.Path.GetFileName(file.FileName);
                    string path = System.IO.Path.Combine(
                                           Server.MapPath("/img/"), pic);
                    // file is uploaded
                    try
                    {
                        file.SaveAs(path);

                        // save the image path path to the database or you can send image 
                        // directly to database
                        // in-case if you want to store byte[] ie. for DB
                       
                        string uName = System.Web.HttpContext.Current.User.Identity.Name;
                        uName = uName.Replace(@"GHVHS\", "");
                        string hi = Uploader.addUpload(uName, Caption, Location, pic);
                        Result = hi;
                    }
                    catch( Exception ex)
                    {
                        Result = ex.ToString();
                    }
                }
               
                return Json(new { Success = Result }, JsonRequestBehavior.AllowGet);
            }
            catch (Exception ex)
            {
                return Json(new { Success = ex }, JsonRequestBehavior.AllowGet);
            }
        }
        public JsonResult UpdateUpload(string UploadId, string Caption, string Location, string ScriptAs)
        {
            string hi = Uploader.addUpload(UploadId, Caption, Location, ScriptAs);

            return Json(new { hi }, JsonRequestBehavior.AllowGet);
        }
        // GET: Uploader/Edit/5
        public ActionResult Edit(int id)
        {
            return View();
        }

        // POST: Uploader/Edit/5
        [HttpPost]
        public ActionResult Edit(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add update logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }

        // GET: Uploader/Delete/5
        public ActionResult Delete(int id)
        {
            return View();
        }

        // POST: Uploader/Delete/5
        [HttpPost]
        public ActionResult Delete(int id, FormCollection collection)
        {
            try
            {
                // TODO: Add delete logic here

                return RedirectToAction("Index");
            }
            catch
            {
                return View();
            }
        }
    }
}
