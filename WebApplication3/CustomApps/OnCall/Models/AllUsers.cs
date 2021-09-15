using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllUsers
    {
        public static List<AllUsers> Users = new List<AllUsers>();
        public Users Fields { get; set; }
    }
}