using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllHistory
    {
        public static List<AllHistory> History = new List<AllHistory>();
        public SingleHistory Fields { get; set; }
    }
}