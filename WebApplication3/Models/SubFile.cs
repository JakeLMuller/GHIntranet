using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class SubFile
    {
        public string link { get; set; }
        public string Content { get; set; }

        public string ParentLink { get; set; }
        public string ParentContent { get; set; }
    }
}