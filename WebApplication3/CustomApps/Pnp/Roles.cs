using System;
using System.Collections.Generic;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Pnp
{
    public class Roles
    {
        public static string ReturnCount(string Department)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string DB = "";
            string value = "";
            DB = "SELECT COUNT(*) as Count FROM [dbo].[Users]";
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(DB, conn);
                conn.Open();

                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {

                    int counted = dr.FieldCount;
                    while (dr.Read())
                    {
                        value = dr["Count"].ToString();
                    }
                }

                dr.Close();
                conn.Close();
            }
            return value;
        }

    
        public static List<UserRoleDepart> GetUserRolesDepartment(string Id, string UserNameDisplay, string UserName, string DepartmentID, string DepartmentName, string Role, string order, int offset = 0)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "Select * From [dbo].[vw_UserRoleDepartments2]";
            int count = 0;
            if (String.IsNullOrEmpty(Id) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " ID = '" + Id + "'";
            }
            if (String.IsNullOrEmpty(UserNameDisplay) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " UserNameDisplay like '%" + UserNameDisplay + "%'";
            }
            if (String.IsNullOrEmpty(DepartmentID) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                if (DepartmentID.IndexOf(",") >= 0)
                {
                    AddtoQuery += subString + " DepartmentID In ( " + DepartmentID +" )";
                }
                else
                {
                    AddtoQuery += subString + " DepartmentID = " + DepartmentID;
                }
            }
            if (String.IsNullOrEmpty(UserName) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " UserName like '%" + UserName + "%'";
            }
            string sterlieAddToQuery = AddtoQuery;
            if (String.IsNullOrEmpty(Role) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                if (Role.IndexOf(",") >= 0)
                {

                    string [] getRoles = Role.Split(',');
                    
                    AddtoQuery += subString + " Roles  like '%" + getRoles[0]+"%'";
                    string SubQuery = "";
                    for (int i=1; i < getRoles.Length; i++)
                    {
                        if (subString == "And")
                        {
                            SubQuery = sterlieAddToQuery.Replace(" Where", " or");
                            SubQuery += " And Roles like '%" + getRoles[i] + "%'";
                            AddtoQuery += SubQuery;
                        }else
                        {
                            SubQuery = sterlieAddToQuery.Replace(" Where", " or");
                            SubQuery += " And Roles like '%" + getRoles[i] + "%'";
                            AddtoQuery += SubQuery;
                        }
                    }
                }
                else
                {
                    AddtoQuery += subString + " Roles  = '" + Role+"'";
                }
            }
            if (String.IsNullOrEmpty(order) == false)
            {
                AddtoQuery += " Order by " + order;
            }
            else
            {
                AddtoQuery += " Order by  UserName Asc";
            }
            if (offset > 0 )
            {
                int totalOffset = offset * 50;
                AddtoQuery += " OFFSET " + totalOffset + " ROWS  FETCH NEXT 50 ROWS ONLY";
            }
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

                            UserRoleDepart newEntry = new UserRoleDepart();
                            RoleFields fields = new RoleFields()
                            {
                                UserNameDisplay = dr["UserNameDisplay"].ToString(),
                                UserName = dr["UserName"].ToString(),
                                DepartmentID = dr["DepartmentID"].ToString(),
                                DepartmentName = dr["DepartmentName"].ToString(),
                                Role = dr["Roles"].ToString()
                            };
                            newEntry.Fields = fields;
                            UserRoleDepart.Items.Add(newEntry);
                        }
                    }

                    dr.Close();
                    conn.Close();
                }
            }
            var temp = UserRoleDepart.Items;
            UserRoleDepart.Items = new List<UserRoleDepart>();
            return temp;
        }

        public static string Create(string Id, string UserNameDisplay, string UserName, string DepartmentID, string DepartmentName, string Role)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string result = "false";
            DB = "INSERT INTO [dbo].[vw_UserRoleDepartments2] (" +
                "[UserName] ,[DepartmentID] ,[Roles])" +
                " Values ('" + UserName + "' ," + DepartmentID + " ,'" + Role + "')";

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
                    if (dr.RecordsAffected >= 1)
                    {
                        result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }
            }
            return result;
        }
        public static string Update(string Id, string UserNameDisplay, string UserName, string DepartmentID, string DepartmentName, string Role, string justRole)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "UPDATE[dbo].[vw_UserRoleDepartments2] SET ";
            string result = "false";
            int count = 0;
            
            string[] labels = { "UserName", "DepartmentID", "Roles" };
            string[] values = { UserName, DepartmentID,  Role };
            
            for (int i = 0; i < values.Length; i++)
            {
                if (String.IsNullOrEmpty(values[i]) == false)
                {
                    if (labels[i] == "Roles")
                    {
                     
                        DB += "[" + labels[i] + "] = '" + values[i] + "'";
                    }
                    
                }

            }
            if (String.IsNullOrEmpty(justRole) == false)
            {
                DB += " Where UserName = '" + UserName + "' And DepartmentID = "+ DepartmentID;
            }
            else
            {
                DB += " Where ID = '" + Id + "'";
            }
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
                    if (dr.RecordsAffected == 1)
                    {
                        result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }
            }
            return result;
        }
        public static string Delete(string User, string department = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "DELETE FROM [dbo].[UserDepartmentRoles] ";
            string result = "false";
            int count = 0;
            DB += " Where UserName = '" + User + "'";
            if (String.IsNullOrEmpty(department) == false)
            {
                DB += " And DepartmentID = " + department;
            }
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
                    if (dr.RecordsAffected == 1)
                    {
                        result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }
            }
            return result;
        }
    }
}