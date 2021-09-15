using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class SingleItem
    {
        public static List<SingleItem> Items = new List<SingleItem>();
        public Fields Fields { get; set; }
    }
}