using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllInMonth
    {
        public List <AllGroups> Group { get; set; }

        public List<AllOnCalls> OnCall { get; set; }

        public List<People> Person { get; set; }
        public List<AllPhones> Phone { get; set; }
    }
}