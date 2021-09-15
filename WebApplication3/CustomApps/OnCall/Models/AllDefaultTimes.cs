using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllDefaultTimes
    {
        public static List<AllDefaultTimes> AllTimes = new List<AllDefaultTimes>();
        public DefaultTime Fields { get; set; }
    }
}