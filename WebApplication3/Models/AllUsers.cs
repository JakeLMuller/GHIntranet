using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class AllUsers
    {
        public static List<AllUsers> All = new List<AllUsers>();

        public SingleUser Fields { get; set; }
    }
}