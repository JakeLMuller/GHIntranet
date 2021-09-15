using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class AllSingleOnCall
    {
        public Groups Group { get; set; }

        public OnCalls OnCall { get; set; }

        public Person Person { get; set; }
        public phone Phone { get; set; }
    }
}