using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class Groups
    {
        public string GroupID { get; set; }

        public string GroupName { get; set; }
        public string GroupComments { get; set; }
        public string FacilityFilter { get; set; }
        public string Active { get; set; }
        public string UpdateBy { get; set; }
        public string UpdateDate { get; set; }
    }
}