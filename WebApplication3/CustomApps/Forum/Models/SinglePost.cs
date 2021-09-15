using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.Forum.Models
{
    public class SinglePost
    {
        public string ID { get; set; }

        public string MSG { get; set; }
        public string Category { get; set; }
        public string Username { get; set; }
        public string Title { get; set; }

        public string Date { get; set; }

        public string IMG { get; set; }
    }
}