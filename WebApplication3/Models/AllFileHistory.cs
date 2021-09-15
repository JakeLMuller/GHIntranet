using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class AllFileHistory
    {
      
        public static List<AllFileHistory> Files = new List<AllFileHistory>();

        public SingleFileHistory Fields { get; set; }
    }
    
}