using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace WebApplication3.Models
{
    public class UserRoleDepart
    {
        public static List<UserRoleDepart> Items = new List<UserRoleDepart>();
        public string Name { get; set; }
        public RoleFields Fields { get; set; }
    }
}