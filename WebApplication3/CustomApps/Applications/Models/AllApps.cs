using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.Applications.Models
{
    public class AllApps
    {
        public static List<AllApps> Apps = new List<AllApps>();
        public Application Fields { get; set; }
    }
}