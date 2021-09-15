using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class phone
    {
        public string PhoneID { get; set; }

        public string PhoneTypeID { get; set; }
        public string ExternalID { get; set; }
        public string LocationID { get; set; }
        public string PhoneNumber { get; set; }
        public string Extension { get; set; }
        public string SpeedDial { get; set; }
        public string PhoneDescription { get; set; }
        
    }
}