using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class People
    {
        public static List<People> AllPeople = new List<People>();
        public Person Fields { get; set; }
    }
}