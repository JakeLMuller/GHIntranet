using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllPhones
    {
        public static List<AllPhones> Phones = new List<AllPhones>();
        public phone Fields { get; set; }
    }
}