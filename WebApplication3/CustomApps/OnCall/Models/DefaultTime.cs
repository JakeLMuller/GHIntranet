using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class DefaultTime
    {
        public string GroupID { get; set; }

        public string StartTime { get; set; }
        public string EndTime { get; set; }
        public string DaysOfWeek { get; set; }
    }
}