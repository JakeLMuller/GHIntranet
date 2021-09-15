using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class SingleHistory
    {
        public string HistoryID { get; set; }

        public string ItemID { get; set; }
        public string GroupID { get; set; }
        public string ExternalID { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Event { get; set; }
        public string Comments { get; set; }
        public string CommentsPrivate { get; set; }
        public string HospitalistArea { get; set; }
        public string UpdateBy { get; set; }
        public string UpdateDate { get; set; }
        public string Beeper { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DeptDescription { get; set; }

    }
}