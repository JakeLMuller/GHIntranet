using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllDailyOnCalls
    {
        public static List<AllDailyOnCalls> Calls = new List<AllDailyOnCalls>();
        public DailyOnCall Fields { get; set; }
    }
}