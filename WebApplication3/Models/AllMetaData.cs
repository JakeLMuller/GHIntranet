using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class AllMetaData
    {
        public static List<AllMetaData> All = new List<AllMetaData>();
        public string Name { get; set; }
        public List<MetaDataList> SingleMetaDataList { get; set; }
    }
}