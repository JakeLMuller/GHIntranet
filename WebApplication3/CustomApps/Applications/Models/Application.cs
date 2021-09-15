using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.Applications.Models
{
    public class Application
    {
        public string ApplicationID { get; set; }

        public string Name { get; set; }

        public string CurrentVersionNumber { get; set; }

        public string VersionNumber { get; set; }
        public string User { get; set; }
        public string URL { get; set; }
        public string Groups { get; set; }

        public string IncludeCurrentVersion { get; set; }
    }
}