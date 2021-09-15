using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.CustomApps.Applications.Models;

namespace WebApplication3.CustomApps.Applications
{
    public class Apps
    {
        public static List<AllApps> getApps(string username)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["MyAppsConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "Select *  " +
 "From  [Applications].[vw_ApplicationUsers]   " +
 "Where [User]='" + username + "' " +
 "order by     [Name],[VersionNumber] ";


            if (DB != "")
            {
                String commandText = DB;
                if (AddtoQuery != "")
                {
                    commandText += " " + AddtoQuery;
                }


                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand(commandText, conn);
                    conn.Open();

                    SqlDataReader dr = cmd.ExecuteReader();
                    if (dr.HasRows)
                    {

                        int counted = dr.FieldCount;
                        while (dr.Read())
                        {

                            AllApps newEntry = new AllApps();
                            Application fields = new Application()
                            {
                                ApplicationID = dr["ApplicationID"].ToString(),
                                Name = dr["Name"].ToString(),
                                CurrentVersionNumber = dr["CurrentVersionNumber"].ToString(),
                                VersionNumber = dr["VersionNumber"].ToString(),
                                User = dr["User"].ToString(),
                                URL = dr["URL"].ToString(),
                                IncludeCurrentVersion = dr["IncludeCurrentVersion"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllApps.Apps.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }



            }
            var temp = AllApps.Apps;
            AllApps.Apps = new List<AllApps>();
            return temp;
        }


    }
}