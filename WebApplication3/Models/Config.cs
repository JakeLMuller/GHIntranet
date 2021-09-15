using System.Web;
using System.Configuration;

namespace WebApplication3.Models
{
    public class Config
    {

        public string route { get; set; }
        public string path { get; set; }
        public string sourceFilesRootPath { get; set; }
        public HttpRequestBase request { get; set; }
        public HttpSessionStateBase session { get; set; }
        public System.Security.Principal.IPrincipal principal { get; set; }
        public string headerDisplay { get; set; }
        public string rootPath { get; set; }
        public bool loadFiles { get; set; }
        public string MasterView { get; set; }

        public string View
        {
            get;
            set;
        }


        public string rootDirectory
        {
            get
            {
                if (HttpContext.Current.Request.Url.AbsoluteUri.Contains("/Files/b/"))
                    return "/Files/b/";

                return "/Files/";
            }
        }

        public string serverAndRootPathForRendering
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForRendering, sourceFilesRootPath);
            }
        }

        public string serverAndRootPathForWebPage
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForWebPage, sourceFilesRootPath);
            }
        }


        public string accessFileForRendering
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForRendering, sourceFilesRootPath, ".access");
            }
        }

        public string accessFileForWebPage
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForWebPage, sourceFilesRootPath, ".access");
            }
        }

        public string contentFolderForRendering
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForRendering, sourceFilesRootPath, ".page_content");
            }
        }


        public string serverAndRootPathTitle
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "page_title.txt");
            }
        }

        public string serverAndRootPathSubTitle
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "page_subtitle.txt");
            }
        }

        public string serverAndRootPathLogo
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "page_logo.png");
            }
        }

        public string contactsXMLFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "contacts.xml");
            }
        }

        public string pageSectionsXMLFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "page_sections.xml");
            }
        }

        public string customCSSFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "page_stylesheet.css");
            }
        }

        public string expandAllDirFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "expandalldir.txt");
            }
        }

        public string contactsXSLTFile
        {
            get
            {
                //string path = string.Format(@"{0}:////{1}:{2}", requestUri.Scheme, requestUri.Host, requestUri.Port) + "/XSLT/contacts.xslt";
                string path = "~/XSLT/contacts.xslt";
                return System.Web.HttpContext.Current.Server.MapPath(path);
            }
        }

        public string rootFileServerURLForRendering
        {
            get
            {
                return ConfigurationManager.AppSettings["RootFilePathForRendering"];
            }
        }
        public string rootFileServerURLForWebPage
        {
            get
            {
                return ConfigurationManager.AppSettings["RootFilePathForWebPage"];
            }
        }

        public string rootFileServerPathURLForRendering
        {
            get
            {
                return Url.Url.Combine(rootFileServerURLForRendering, this.sourceFilesRootPath, this.path);
                //return rootFileDownloadServerURL + this.sourceFilesRootPath + this.path;
            }
        }

        public string rootFileServerPathURLForWebPage
        {
            get
            {
                //return rootFileServerURLForWebPage;
                return Url.Url.Combine(rootFileServerURLForWebPage, this.sourceFilesRootPath, this.path);
                //return rootFileDownloadServerURL + this.sourceFilesRootPath + this.path;
            }
        }

        public string headerContentFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "header.html");
            }
        }

        public string footerContentFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "footer.html");
            }
        }


        public string viewsContentFile
        {
            get
            {
                return Url.Url.Combine(contentFolderForRendering, "views.xml");
            }
        }

        public Config(HttpRequestBase request, HttpSessionStateBase session, System.Security.Principal.IPrincipal principal, string route)
        {
            ConfigExplorerConfigurationModel(request, session, principal, route, "");
        }

        public Config(HttpRequestBase request, HttpSessionStateBase session, System.Security.Principal.IPrincipal principal, string route, string path)
        {
            ConfigExplorerConfigurationModel(request, session, principal, route, path);
        }

        public string WindowsShareRootFolder { get; set; }

        public bool ExpandAllDirs { get; set; }

        //public string WindowsShareFile
        //{
        //    get
        //    {
        //        return WindowsShareRootFolder + route + @"\" + path;
        //    }
        //}

        private void ConfigExplorerConfigurationModel(HttpRequestBase request, HttpSessionStateBase session, System.Security.Principal.IPrincipal principal, string route, string path)
        {
            this.request = request;
            this.session = session;
            this.principal = principal;
            this.route = route;
            this.path = path;
            this.MasterView = "~/Views/Shared/_LayoutFiles.cshtml";
            this.View = "Index";
            this.headerDisplay = route;
            this.sourceFilesRootPath = "/" + route + "/";
            this.rootPath = this.rootDirectory + route + "/";
            this.loadFiles = true;
            this.WindowsShareRootFolder = @"\\hmc_nt2\IntranetFiles\Files\";


            switch (route)
            {
                case "IT":
                    sourceFilesRootPath = "/IT/TipSheets/IT/";
                    headerDisplay = "I.T. Information";
                    this.View = "IT";
                    this.MasterView = "~/Views/Shared/_LayoutIT.cshtml";
                    //this.WindowsShareRootFolder = @"\\ghinfo\IT\";
                    break;
                case "ITPolicies":
                    this.MasterView = "~/Views/Shared/_LayoutIT.cshtml";
                    break;
                //case "Epic":
                //    sourceFilesRootPath = "/IT/TipSheets/Epic/";
                //    this.View = "IT";
                //    this.WindowsShareRootFolder = @"\\ghinfo\IT";
                //    break;
                case "TipSheets":
                    sourceFilesRootPath = "/IT/TipSheets/";
                    headerDisplay = "Tip Sheets";
                    this.View = "IT";
                    this.MasterView = "~/Views/Shared/_LayoutIT.cshtml";
                    //this.WindowsShareRootFolder = @"\\ghfileserv\epicimplementation$\TIP SHEETS\";
                    break;
                case "HR":
                    //this.View = "HR";
                    headerDisplay = "HUMAN RESOURCES";
                    break;
                case "EmergencyManagement":
                    headerDisplay = "Emergency Management";
                    break;
                case "Strata":
                    //this.WindowsShareRootFolder = @"\\ghfileserv\strata$\GHVHS Strata Home Page\";
                    break;
                case "Search":
                    headerDisplay = "Search " + path;
                    loadFiles = false;
                    this.View = "Search";
                    break;
                case "SubmitSearch":
                    headerDisplay = "Search Submitted for " + path;
                    loadFiles = false;
                    this.View = "Search";
                    break;
                case "MedicalRecords":
                    //this.sourceFilesRootPath = "/MedicalRecords/";
                    this.headerDisplay = "Health Information Management Medical Records";
                    // this.WindowsShareRootFolder = @"\\hmc_nt2\epicimplementation$\HIM\Medical Record Paper Lite Forms\";
                    break;
                case "Foundation":
                    //this.sourceFilesRootPath = this.rootDirectory + "Foundation/";
                    break;
                case "AuditCompliance":
                    //this.sourceFilesRootPath = this.rootDirectory + "AuditCompliance/";
                    this.headerDisplay = "Compliance, Audit & HIPAA Privacy";
                    break;
                case "Pharmacy":
                    //this.WindowsShareRootFolder = @"\\hmc_nt2\PharmacyForms$\Intranet\";
                    break;
                case "Physicians":
                    //this.WindowsShareRootFolder = @"\\hmc_nt2\epicimplementation$\Intranet\Physicians\";
                    break;
                case "PlayVideo":
                    this.loadFiles = false;
                    break;
                default:
                    break;
            }

            if (rootDirectory == "/Files/b/")
                this.MasterView = "~/Views/Shared/_LayoutBlankFiles.cshtml";

            try
            {
                string getalldirs = WebScraping.WebPage.GetURLText(expandAllDirFile);
                if (getalldirs == "Y")
                {
                    this.ExpandAllDirs = true;
                }

            }
            catch
            {

            }
        }
    }
}