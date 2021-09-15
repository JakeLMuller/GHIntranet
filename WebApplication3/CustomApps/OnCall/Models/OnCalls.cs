using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class OnCalls
    {
        public string ItemID { get; set; }

        public string GroupID { get; set; }
        public string ExternalID { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Comments { get; set; }
        public string CommentsPrivate { get; set; }
        public string HospitalistArea { get; set; }
    }
}