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
using System.Drawing;
using Syncfusion.Pdf.Graphics;

namespace WebApplication3.Controllers
{
    public class ApiController : Controller
    {
        // GET: Api
        public ActionResult Index()
        {
            return View();
        }
        public JsonResult GetPT(string path, string route,string Page, string FirstDate, string secondDate, string LN, string FN, string DOB)
        {
            string PTJson = Get.GetInfusionFaxes(route, "PtDetail", Page, FirstDate, secondDate, LN, FN, DOB);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetItems(string path, string route, string Page, string FirstDate, string secondDate, string LN, string FN, string DOB)
        {
            string PTJson = Get.GetInfusionFaxes(route, path, Page, FirstDate, secondDate, LN, FN, DOB);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult GetIds()
        {
            string PTJson = Uploader.getCurrentIds();


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DocTypeSerivce(String Status,String route,  String FaxService)
        {

            string UserName = System.Web.HttpContext.Current.User.Identity.Name;
            string PTJson = FaxSave.UpdateServices(Status,route,UserName, FaxService);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteServices( String route, String FaxService)
        {

            
            string PTJson = FaxSave.DeleteServices( route,  FaxService);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult DeleteDocType(String route, String FaxService)
        {


            string PTJson = FaxSave.DeleteDocType(route, FaxService);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdatePtService(string service, String route, String FaxService)
        {

            string UserName = System.Web.HttpContext.Current.User.Identity.Name;
            string PTJson = FaxSave.UpdatePtService(service, route, UserName, FaxService);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdateToService(string status,string location, string dt, String route, String FaxService)
        {

            string UserName = System.Web.HttpContext.Current.User.Identity.Name;
            string PTJson = FaxSave.ToServiceUpdate(status, route, UserName, location, dt, FaxService);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult UpdatePTData(string FN, string LN, string route, string Dr, string DOB, string Id)
        {

       
            string PTJson = FaxSave.UpdatePTData(FN, LN, route, Dr, DOB, Id);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult Lookup(string path,string Page, string FirstDate, string secondDate, string LN, string FN, string DOB, string Id)
        {
            if (String.IsNullOrEmpty(Id) == false)
            {
                FN = Id;
            }
                string PTJson = Get.GetInfusionFaxes("LookUp", path, Page, FirstDate, secondDate, LN, FN, DOB);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult staffUploads(string path, string Username, string Location, string UploadId,  string Id)
        {
            
            string PTJson = Uploader.getUploads(Username, Location, UploadId);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult upDateLikes(string likes, string Id)
        {

            string PTJson = Uploader.UpdateLikes(Id, likes);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        [AllowAnonymous]
        public JsonResult menuItems(string IntranetMenuItem, string URL, string ADGroupAccess, string Id)
        {

            string PTJson = Uploader.AddMenuItem(IntranetMenuItem, URL, ADGroupAccess, Id);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public JsonResult Comments(string Username , string Cid , string ToUpdate , string Comments, string uploaderId )
        {
            string uName = System.Web.HttpContext.Current.User.Identity.Name;
            uName = uName.Replace(@"GHVHS\", "");
            string PTJson = Uploader.getComments(uName, Cid, ToUpdate, Comments, uploaderId);


            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");


            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        public ActionResult CreatePDF(string path, string exportDir, string ExportAs)
        {
            try
            {
                char[] charsToTrim = { ' ', ' ', '\'' };
                String NewPath = path.Trim(charsToTrim);
                string localPath = new Uri(NewPath).LocalPath;

                WordDocument wordDocument = new WordDocument(localPath, FormatType.Docx);

            //Initialize chart to image converter for converting charts during Word to pdf conversion

   
            //Create an instance of DocToPDFConverter

            DocToPDFConverter converter = new DocToPDFConverter();

            //Convert Word document into PDF document

            PdfDocument pdfDocument = converter.ConvertToPDF(wordDocument);

            //Save the PDF file
            String[] spearator = { "\\" };
            Int32 count = path.IndexOf("\\\\");
           

            // split filePath to get name without mime type to use for newly created pdf 
            String[] strlist = path.Split('\\');
            Int32 lengthOf = strlist.Length - 1;
            String fileName = strlist[lengthOf];
                string[] parts = fileName.Split('.');
            fileName = parts[0] + ".pdf";
           

            converter.Dispose();
            wordDocument.Close();
            
            pdfDocument.Save(Server.MapPath("/img/") + fileName);

            //Close the instance of document objects

            pdfDocument.Close(true);
                ViewBag.url = "/img/" + fileName;
                if (String.IsNullOrEmpty(ExportAs) == false)
                {
                    if (ExportAs == "download" || ExportAs == "Download")
                    {
                        return View("~/Views/Api/download.cshtml");
                    }
                    else
                    {
                        return View("~/Views/HelloWorld/Tiff.cshtml");
                    }

                }
                else
                {
                    return View("~/Views/HelloWorld/Tiff.cshtml");
                }
            }
            catch (Exception ex)
            {
                ViewBag.error = ex.ToString();
                FileInfo myFile = new FileInfo(path);
                bool exists = myFile.Exists;
                ViewBag.exists = "  Files Exisits:" + exists;
                return View("~/Views/HelloWorld/Tiff.cshtml");
               
            }






            
            
            
        }
        public ActionResult CreatePDF2(string path, string exportDir, string ExportAs)
        {
            try
            {
                string localPath = "";
                Int32 debugStr = path.IndexOf("intranet.ormc.org");
                if (path.IndexOf("intranet.ormc.org") > 0)
                {
                    localPath =  DownloadFile(path);

                }
                else
                {
                    char[] charsToTrim = { ' ', ' ', '\'' };
                    String NewPath = path.Trim(charsToTrim);
                     localPath = new Uri(NewPath).LocalPath;
                }
                

                WordDocument wordDocument = new WordDocument(localPath, FormatType.Docx);

                //Initialize chart to image converter for converting charts during Word to pdf conversion


                //Create an instance of DocToPDFConverter

                DocToPDFConverter converter = new DocToPDFConverter();

                //Convert Word document into PDF document

                PdfDocument pdfDocument = converter.ConvertToPDF(wordDocument);

                //Save the PDF file
                String[] spearator = { "\\" };
                Int32 count = path.IndexOf("\\\\");


                // split filePath to get name without mime type to use for newly created pdf 
                String[] strlist = path.Split('\\');
                Int32 lengthOf = strlist.Length - 1;
                String fileName = strlist[lengthOf];
                fileName = fileName.Replace(".doc", ".pdf");
                fileName = fileName.Replace(".docx", ".pdf");

                converter.Dispose();
                wordDocument.Close();

                pdfDocument.Save(Server.MapPath("/img/") + fileName);

                //Close the instance of document objects

                pdfDocument.Close(true);
                ViewBag.url = "/img/" + fileName;
                if (String.IsNullOrEmpty(ExportAs) == false)
                {
                    if (ExportAs == "download" || ExportAs == "Download")
                    {
                        return View("~/Views/Api/download.cshtml");
                    }
                    else
                    {
                        return View("~/Views/HelloWorld/Tiff.cshtml");
                    }

                }
                else
                {
                    return View("~/Views/HelloWorld/Tiff.cshtml");
                }
            }
            catch (Exception ex)
            {
                ViewBag.error = ex.ToString();
                FileInfo myFile = new FileInfo(path);
                bool exists = myFile.Exists;
                ViewBag.exists = "  Files Exisits:" + exists;
                return View("~/Views/HelloWorld/Tiff.cshtml");

            }









        }
        public string DownloadFile(string urlAddress)

        {
             WebClient client = null;
            client = new WebClient();

            //DownlaodFile method directely downlaod file on you given specific path ,Here i've saved in E: Drive
            String[] strlist = urlAddress.Split('\\');
            Int32 lengthOf = strlist.Length - 1;
            String fileName = strlist[lengthOf];
            

            client.DownloadFile(urlAddress, "/img/"+fileName);


            return "/img/DocToPDF/" + fileName;

        }
    
        public ActionResult TiffToPdf(string id, string Type)
        {
            PdfDocument doc = new PdfDocument();
            //Setting margin size of all the pages to zero
            doc.PageSettings.Margins.All = 0;
            //Get the image stream and draw frame by frame
            string uriPath = "";
            string fileName = CustomApps.Fax.GetFaxes.getFileName(Type, id);
            if (Type == "Infusion")
            {
                uriPath =
               "file:\\\\hmc_nt2\\IntranetFAX$\\InfusionFax\\tiffs\\" + fileName;
            }
            else if (Type == "OR")
            {
                if (id.IndexOf("Fax_") > 0)
                {
                    uriPath =
                    "file:\\\\hmc_nt2\\IntranetFAX$\\ORFax\\tiffs\\" + fileName;
                }
                else
                {
                    uriPath =
                    "file:\\\\hmc_nt2\\IntranetFAX$\\ORFax\\tiffs\\" + fileName;
                }

            }
            else if (Type == "Cardiac")
            {
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\CardiacCathFax\\tiffs\\" + fileName;
                }
            }
            else if (Type == "Ent")
            {
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\EntFax\\tiffs\\" + fileName;
                }
            }
            else if (Type == "Concierge")
            {
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\ConciergeFax\\tiffs\\" + fileName;
                }
            }

            char[] charsToTrim = { ' ', ' ', '\'' };
            String NewPath = uriPath.Trim(charsToTrim);
            string localPath = new Uri(NewPath).LocalPath;
            using (var tiffImage = new PdfBitmap(localPath))
            {
                int frameCount = tiffImage.FrameCount;
                for (int i = 0; i < frameCount; i++)
                {
                    //Add pages to the document
                    var page = doc.Pages.Add();
                    //Getting page size to fit the image within the page
                    SizeF pageSize = page.GetClientSize();
                    //Selecting frame in TIFF
                    tiffImage.ActiveFrame = i;
                    //Draw TIFF frame
                    page.Graphics.DrawImage(tiffImage, 0, 0, pageSize.Width, pageSize.Height);
                }
            }
            //Saves the document

            doc.Save(Server.MapPath("/img/") + "TiffImage" + id + ".pdf");

            //Close the document
            doc.Close(true);
            //This will open the PDF file so, the result will be seen in default PDF viewer
            //Process.Start("C:\\Users\\jmuller3\\Documents\\Visual Studio 2015\\Projects\\WebApplication3\\WebApplication3\\img\\TiffImage.pdf");
            ViewBag.url = "/img/TiffImage" + id + ".pdf";
            return View("~/Views/HelloWorld/Tiff.cshtml");

        }
    }
}

