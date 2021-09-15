using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class DailyOnCall
    {
        public string ItemID { get; set; }
        public string GroupID { get; set; }
        public string ExternalID { get; set; }
        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string Comments { get; set; }
        public string Title { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string DeptDescription { get; set; }
        public List<People> Person { get; set; }
        public List<AllPhones> Phone { get; set; }

    }
}