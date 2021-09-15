using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.Forum.Models
{
    public class AllPosts
    {
        public static List<AllPosts> All = new List<AllPosts>();

        public SinglePost Fields { get; set; }
    }
}