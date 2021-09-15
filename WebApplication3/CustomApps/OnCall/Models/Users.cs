using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class Users
    {
        public string AccessID { get; set; }

        public string GroupID { get; set; }
        public string UserLogin { get; set; }
        public string ExternalID { get; set; }
        public string LastName { get; set; }
        public string FirstName { get; set; }
        public string MemberID { get; set; }
        public object Fields { get; internal set; }
    }
}