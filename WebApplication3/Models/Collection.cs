using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class Collection
    {
        public static List<Collection> Policies = new List<Collection>();

        public List<SingleItem> SingleItem = new List<SingleItem>();
        public string Id { get; set; }
    }
}