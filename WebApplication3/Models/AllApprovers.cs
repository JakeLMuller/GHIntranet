using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class AllApprovers
    {
            public static List<AllApprovers> Items = new List<AllApprovers>();
            public string Name { get; set; }
            public Approvers Data { get; set; }
        
    }
}