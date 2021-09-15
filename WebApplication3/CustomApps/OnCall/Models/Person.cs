using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall.Models
{
    public class Person
    {
        public string PersonID { get; set; }

        public string Title { get; set; }
        public string FirstName { get; set; }
        public string MiddleName { get; set; }
        public string LastName { get; set; }
        public string DeptCode { get; set; }
        public string DeptDescription { get; set; }
        public string Entity { get; set; }
        public string ExternalID { get; set; }
        public string PeopleType { get; set; }
    }
}