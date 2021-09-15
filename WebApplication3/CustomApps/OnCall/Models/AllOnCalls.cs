using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllOnCalls
    {
        public static List<AllOnCalls> OnCalls = new List<AllOnCalls>();
        public OnCalls Fields { get; set; }
    }
}