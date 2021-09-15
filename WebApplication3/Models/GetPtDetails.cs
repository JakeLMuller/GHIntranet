using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using WebApplication3.SQL;

namespace WebApplication3.Models
{
    public class GetPtDetails
    {
        public GetPtDetails(string path, string Page, string FirstDate, string secondDate, string LN, string FN, string DOB)
        {
            string PTJson = Get.GetInfusionFaxes("Infusion", path, Page, FirstDate, secondDate, LN, FN, DOB);
        }
        public string PTJson { get; set; }
    }
}