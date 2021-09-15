using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class SingleUser
    {
        public string UserName { get; set; }

        public string EmployeeNumber { get; set; }
        public string EmailAddress { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public string ADDomainUserName { get; set; }
        public string ADExpirationDate { get; set; }
        public string ADStatus { get; set; }
        public string DisplayName { get; set; }
    }
}