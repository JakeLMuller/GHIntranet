
using System.Web.Mvc;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Graphics;
using Syncfusion;
using System.Drawing;
using System.Diagnostics;
using System;
using System.Web;
using System.Drawing.Imaging;
using WebApplication3.SQL;
using WebApplication3.TiffViewer;
using System.Drawing;

using System.Drawing.Imaging;

namespace MvcMovie.Controllers
{
    public class HelloWorldController : Controller
    {
        // 
        // GET: /HelloWorld/

        public string Index()
        {
            return "This is my default action...";
        }
        public JsonResult GetResults(string Page, string FirstDate, string secondDate, string LN, string FN, string DOB)
        {
            string PTJson = Get.GetInfusionFaxes("Infusion", "PtDetail", Page, FirstDate, secondDate, LN, FN, DOB);
          

            //response.Content = new StringContent(PTJson, Encoding.UTF8, "application/json");
         

            return Json(new { data = PTJson }, JsonRequestBehavior.AllowGet);
        }
        // 
        // GET: /HelloWorld/Welcome/ 

        public ActionResult Welcome(string name, int numTimes = 1)
        {
            ViewData["Message"] = "Hello " + name;
            ViewData["NumTimes"] = numTimes;

            return View();
        }
       
        public ActionResult Game(string id)
        {
            if (id == "Snake" || id == "snake")
            {
                return View("~/Views/HelloWorld/Snake.cshtml");
            }
            return View("~/Views/HelloWorld/Snake.cshtml");
        }
        
        public void GetImage()
        {
            HttpContext context = System.Web.HttpContext.Current;
            string imgName = context.Request.QueryString["n"];
            context.Response.ContentType = "image/tiff";
            string path = @"file:\\\\hmc_nt2\IntranetFAX$\InfusionFax\tiffs\00939FC6.TIF";
            Image image = Image.FromFile(path);
            image.Save(context.Response.OutputStream, ImageFormat.Png);
        }
       
        public ActionResult Tiff(string id, string FaxDepo)
        {
            PdfDocument doc = new PdfDocument();
            //Setting margin size of all the pages to zero
            doc.PageSettings.Margins.All = 0;
            //Get the image stream and draw frame by frame
            string uriPath = "";
            if (FaxDepo == "Infusion")
            {
                uriPath =
               "file:\\\\hmc_nt2\\IntranetFAX$\\InfusionFax\\tiffs\\" + id + ".TIF";
            }
            else if (FaxDepo == "OR")
            {
                if (id.IndexOf("Fax_") > 0)
                {
                    uriPath =
                    "file:\\\\hmc_nt2\\IntranetFAX$\\ORFax\\tiffs\\" + id + ".tiff";
                }
                else
                {
                    uriPath =
                    "file:\\\\hmc_nt2\\IntranetFAX$\\ORFax\\tiffs\\" + id + ".TIF";
                }
                
            }
            else if (FaxDepo == "Cardiac") { 
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\CardiacCathFax\\tiffs\\" + id + ".TIF";
                }
            }
            else if (FaxDepo == "Ent")
            {
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\EntFax\\tiffs\\" + id + ".TIF";
                }
            }
            else if (FaxDepo == "Concierge")
            {
                {
                    uriPath =
                   "file:\\\\hmc_nt2\\IntranetFAX$\\ConciergeFax\\tiffs\\" + id + ".TIF";
                }
            }
        
            char[] charsToTrim = { ' ', ' ', '\'' };
            String NewPath  = uriPath.Trim(charsToTrim);
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
            
            doc.Save(Server.MapPath("/img/")+"TiffImage" + id + ".pdf");

            //Close the document
            doc.Close(true);
            //This will open the PDF file so, the result will be seen in default PDF viewer
            //Process.Start("C:\\Users\\jmuller3\\Documents\\Visual Studio 2015\\Projects\\WebApplication3\\WebApplication3\\img\\TiffImage.pdf");
            ViewBag.url = "/img/TiffImage"+id+".pdf";
            return View();

        }
    }
}