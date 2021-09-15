using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class FileModel2
    {
        public string route { get; set; }
        public string path { get; set; }

        public String Html { get; set; }

        public static List<SubFile> AllFiles = new List<SubFile>();
        public static List<SubFile> sites = new List<SubFile>();
        public string files { get; set; }
        //public String links { get; set; }
        //public String Content { get; set; }
        public string pageSections { get; set; }
        public string websites { get; set; }
        // public String websiteLinks { get; set; }
        //public String websiteContent { get; set; }
        public String Images { get; set; }
        public String Title { get; set; }
        public String DisplayOrNot { get; set; }
        public String Contacts { get; set; }
        public String SubHeader { get; set; }
    }
}