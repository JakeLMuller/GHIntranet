using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class AllConcurrers
    {
        public static List<AllConcurrers> All = new List<AllConcurrers>();
        public string Name { get; set; }
        public ConcurItem Data { get; set; }
    }
}