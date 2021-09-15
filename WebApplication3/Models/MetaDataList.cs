using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class MetaDataList
    {
        public static List<MetaDataList> ListMetaData = new List<MetaDataList>();
        public MetaDataFields MetaData { get; set; }

        public string Id { get; set; }
        public string Name { get; set; }
        public string Category { get; set; }
        public string DepartmentNumber { get; set; }
        public string Initials { get; set; }
        public string Description { get; set; }
        public string Code { get; set; }
        public string Abbr { get; set; }
        public string Link { get; set; }
    }
}