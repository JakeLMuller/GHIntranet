using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SQL
{
    public class Pnp
    {
        public static string CheckOrAddUser(string Username, String CheckOrCreate = "N", string Password = "", string Id = "")
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";


            if (CheckOrCreate == "Y")
            {
                DB = "USE [GHVHSUserUploads]"
                + " INSERT INTO[dbo].[PnpUsers] "
                    + " ([Username]"
                    + " ,[Password]"
                    + " ,[Id])"
                + " VALUES"
                    + "('" + Username + "'"
                    + " ,'" + Password + "'"
                    + " ,'" + Id + "')";
            }
            else if (CheckOrCreate == "ID")
            {
                DB = "Select * From [dbo].[PnpUsers] Where Id = '" + Id + "'";
            }
            else if (CheckOrCreate == "Username")
            {
                DB = "Select * From [dbo].[PnpUsers] Where Username = '" + Username + "'";
            }
            else if (CheckOrCreate == "developer")
            {
                DB = "Select * From [dbo].[PnpUsers] Where Username = '" + Username + "'";
            }
            else if (CheckOrCreate == "Update")
            {
                DB = "USE [GHVHSUserUploads] UPDATE[dbo].[PnpUsers] SET[Password] = '" + Password + "' Where Username = '" + Username + "'";
            }
            else if (CheckOrCreate == "UpdateId")
            {
                DB = "USE [GHVHSUserUploads] UPDATE[dbo].[PnpUsers] SET[Id] = '" + Id + "' Where Username = '" + Username + "'";
            }
            else
            {
                DB = "Select * From [dbo].[PnpUsers] Where Username = '" + Username + "' And Password = '" + Password + "'";
            }
            string output = "false";
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
                    if (CheckOrCreate == "Y")
                    {
                        if (dr.HasRows == true)
                        {
                            output = "true";
                        }
                        else
                        {
                            output = "false";
                        }

                    }
                    else if (CheckOrCreate == "ID" || CheckOrCreate == "developer")
                    {
                        while (dr.Read())
                        {
                            output = dr["Username"].ToString() + "|" + dr["Password"].ToString();
                        }
                    }
                    else
                    {
                        while (dr.Read())
                        {
                            output = dr["Username"].ToString();
                        }
                    }

                    dr.Close();

                    //close connection
                    conn.Close();
                    return output;
                }

            }
            else
            {
                return output;
            }


        }
        public static List<string> storeDraftPolcies(string Id, string PolicyRelatedDoc1, string PolicyRelatedDoc2, string PolicyRelatedDoc3, string PolicyRelatedDoc4,
            string Concurrer, string updateOrget, string DocumentContents, string AutoApprove, string Category, string Department, string Location, string Creator)
        {
            if (String.IsNullOrEmpty(PolicyRelatedDoc1) == true)
            {
                PolicyRelatedDoc1 = "Null";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc2) == true)
            {
                PolicyRelatedDoc2 = "Null";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc3) == true)
            {
                PolicyRelatedDoc3 = "Null";
            }
            if (String.IsNullOrEmpty(PolicyRelatedDoc4) == true)
            {
                PolicyRelatedDoc4 = "Null";
            }
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";

            if (String.IsNullOrEmpty(updateOrget) == true)
            {
                DB = "Select * From [GHVHSUserUploads].[dbo].[DraftPolicies]";
                if (String.IsNullOrEmpty(Id) == false)
                {
                    AddtoQuery += "Where Id = '" + Id + "'";
                }
            }
            else if (updateOrget == "Update")
            {
                if (String.IsNullOrEmpty(Id) == false)
                {
                    int count = 0;
                    DB = "UPDATE [dbo].[DraftPolicies] SET ";
                    if (String.IsNullOrEmpty(PolicyRelatedDoc1) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PolicyRelatedDoc1] = '" + PolicyRelatedDoc1 + "'";
                    }
                    if (String.IsNullOrEmpty(PolicyRelatedDoc2) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PolicyRelatedDoc2] = '" + PolicyRelatedDoc2 + "'";
                    }
                    if (String.IsNullOrEmpty(PolicyRelatedDoc3) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PolicyRelatedDoc3] = '" + PolicyRelatedDoc3 + "'";
                    }
                    if (String.IsNullOrEmpty(PolicyRelatedDoc4) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PolicyRelatedDoc4] = '" + PolicyRelatedDoc4 + "'";
                    }
                    if (String.IsNullOrEmpty(Concurrer) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Concurrer] = '" + Concurrer + "'";
                    }
                    if (String.IsNullOrEmpty(DocumentContents) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[DocumentContents] = '" + DocumentContents + "'";
                    }
                    if (String.IsNullOrEmpty(AutoApprove) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[AutoApprove] = '" + AutoApprove + "'";
                    }
                    if (String.IsNullOrEmpty(Category) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Category] = '" + Category + "'";
                    }
                    if (String.IsNullOrEmpty(Location) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Location] = '" + Location + "'";
                    }
                    if (String.IsNullOrEmpty(Department) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Department] = '" + Department + "'";
                    }
                    DB += " Where Id = '" + Id + "'";
                }
                else
                {
                    DB = "";
                }

            }
            else if (updateOrget == "Create")
            {
                DB = "USE [GHVHSUserUploads]"
                  + "INSERT INTO [dbo].[DraftPolicies]"
                  + " ([Id]"
                  + ",[PolicyRelatedDoc1]"
                  + ",[PolicyRelatedDoc2]"
                  + ",[PolicyRelatedDoc3]"
                  + ",[PolicyRelatedDoc4]"
                  + ",[Concurrer]"
                  + ",[DocumentContents]"
                  + ",[AutoApprove]"
                  + ",[Category]"
                  + ",[Location]"
                  + ",[Department]"
                  + ",[Creator])"
                  + "VALUES "
                  + "('" + Id + "'"
                  + " ,'" + PolicyRelatedDoc1 + "'"
                  + " ,'" + PolicyRelatedDoc2 + "'"
                  + " ,'" + PolicyRelatedDoc3 + "'"
                  + " ,'" + PolicyRelatedDoc4 + "'"
                  + " ,'" + Concurrer + "'"
                  + " ,'" + DocumentContents + "'"
                  + " ,'" + AutoApprove + "'"
                  + " ,'" + Category + "'"
                  + " ,'" + Location + "'"
                  + " ,'" + Department + "'"
                  + " ,'" + Creator + "')";
            }
            else if (updateOrget == "Delete")
            {
                if (String.IsNullOrEmpty(Id) == false)
                {
                    DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[DraftPolicies] Where Id = '" + Id + "'";
                }
                else
                {
                    DB = "";
                }
            }


            string JSONString = "Error";
            List<string> list = new List<string>();
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
                    if (String.IsNullOrEmpty(updateOrget) == true)
                    {
                        if (dr.HasRows)
                        {
                            while (dr.Read())
                            {
                                list.Add(dr["PolicyRelatedDoc1"].ToString());
                                list.Add(dr["PolicyRelatedDoc2"].ToString());
                                list.Add(dr["PolicyRelatedDoc3"].ToString());
                                list.Add(dr["PolicyRelatedDoc4"].ToString());
                                list.Add(dr["Concurrer"].ToString());
                                list.Add(dr["DocumentContents"].ToString());
                                list.Add(dr["AutoApprove"].ToString());
                                list.Add(dr["Category"].ToString());
                                list.Add(dr["Location"].ToString());
                                list.Add(dr["Department"].ToString());
                                list.Add(dr["Creator"].ToString());
                            }
                        }
                    }
                    else
                    {
                        list.Add("Success");
                    }
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
            else
            {
                list.Add("Error");
            }


            return list;
        }

        public static List<string> GetUser(string FullName, string firstName, string lastName, string usersName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "SELECT * FROM [dbo].[Users]";
            if (String.IsNullOrEmpty(FullName) == false)
            {
                string[] splitName = FullName.Split(' ');
                AddtoQuery = " Where FirstName = '" + splitName[0] + "'";
                AddtoQuery += " And LastName = '" + splitName[splitName.Length-1] + "'";
            }else if (String.IsNullOrEmpty(firstName) == false)
            {
                AddtoQuery = " Where FirstName = '" + firstName + "'";
            }else if (String.IsNullOrEmpty(usersName) == false)
            {
                AddtoQuery = " Where username = '" + usersName + "'";
            }
            List<string> list = new List<string>();
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

                        while (dr.Read())
                        {

                            list.Add(dr["UserName"].ToString());
                            list.Add(dr["EmployeeNumber"].ToString());
                            list.Add(dr["EmailAddress"].ToString());
                            list.Add(dr["FirstName"].ToString());
                            list.Add(dr["LastName"].ToString());
                            list.Add(dr["ADDomainUserName"].ToString());
                            list.Add(dr["ADExpirationDate"].ToString());
                            list.Add(dr["ADStatus"].ToString());
                        }
                    }


                    dr.Close();

                    //close connection
                    conn.Close();

                }
            }
            return list; 
        }
    }

}
