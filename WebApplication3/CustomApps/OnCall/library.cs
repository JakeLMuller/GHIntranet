using System;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;
using System.Text;
using System.Text.RegularExpressions;
using System.Web;
using WebApplication3.CustomApps.OnCall.Models;

namespace WebApplication3.CustomApps.OnCall
{
    public class library
    {
        public static List<DateTime> GetWeekStartAndEndFromString(string Date)
        {
            var formats = new[] { "MM/dd/yyyy", "MM/d/yyyy"};

            DateTime dt;
            DateTime.TryParseExact(Date, formats, null, DateTimeStyles.None, out dt);
            int today = (int)dt.DayOfWeek;
            int day = today;
            DateTime startDay;
            DateTime endDay;
            int end = 6 - today;
            int start = 6 - end;
            startDay = dt.AddDays(-start);
            endDay = dt.AddDays(+end);
            List <DateTime> result = new List<DateTime>();
            result.Add(startDay);
            result.Add(endDay);
            return result; 
        }

        public static Boolean ValidateUser(string username, string group)
        {
            Boolean Result; 
            List<AllUsers> Access = CustomApps.OnCall.GroupAccess.getUserAccess(username, group);
            if (Access.Count > 0)
            {
                Result = true;
            }
            else
            {
                Result = false;
            }

            return Result;
        }
    }
}