using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Pnp
{
    public class MetaData
    {
        public static List<MetaDataList> getMetaData(string Name, string Id, string Code, string order, string Tb, string theName = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            int count = 0;
            if (String.IsNullOrEmpty(Tb) == false)
            {
                if (Tb == "Departments")
                {
                    DB = "Select * From [dbo].[Departments]";
                } else if (Tb == "Category")
                {
                    DB = "Select * From [dbo].[Categories]";
                } else if (Tb == "Location") {

                    DB = "Select * From [dbo].[Locations]";
                }
            }
            if (String.IsNullOrEmpty(Id) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Id = " + Id;
            }
            if (String.IsNullOrEmpty(Name) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Name like '%" + Name + "%'";
            }
            if (String.IsNullOrEmpty(theName) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Name like '%" + theName + "%'";
            }
            if (String.IsNullOrEmpty(Code) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Code = " + Code;
            }
            if (Tb == "Departments")
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Name <> '' " ;
            }
            if (String.IsNullOrEmpty(order) == false)
            {
                AddtoQuery += " Order by " + order;
            }else
            {
                AddtoQuery += " Order by Name Asc";
            }
            commandText = DB + AddtoQuery;
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

                        MetaDataList newEntry = new MetaDataList();
                        if (Tb == "Departments")
                        {
                            newEntry.Id = dr["ID"].ToString();
                            newEntry.Name = dr["Name"].ToString();
                            newEntry.Category = dr["Category"].ToString();
                            newEntry.Code = dr["DepartmentNumber"].ToString();
                        }
                        else if (Tb == "Category")
                        {
                            newEntry.Name = dr["Name"].ToString();
                        }
                        else 
                        {
                            newEntry.Name = dr["Name"].ToString();
                            newEntry.Id = dr["ID"].ToString();
                            newEntry.Code = dr["Code"].ToString();
                            newEntry.Abbr = dr["Abbr"].ToString();

                        }

                        MetaDataList.ListMetaData.Add(newEntry);
                    }
                }
                dr.Close();
                conn.Close();
            }
            var temp = MetaDataList.ListMetaData;
            MetaDataList.ListMetaData = new List<MetaDataList>();
            return temp;
        }
        public static List<AllMetaData> GetAllMetaData()
        {
            string[] list = new String[3];
            list[0] = "Category";
            list[1] = "Departments";
            list[2] = "Location";
            for (int i = 0; i < list.Length; i++)
            {
                AllMetaData newEntry = new AllMetaData();
                newEntry.SingleMetaDataList = getMetaData("", "", "", "", list[i]);
                newEntry.Name = list[i];
                AllMetaData.All.Add(newEntry);
            }   
            var temp = AllMetaData.All;
            AllMetaData.All = new List<AllMetaData>();
            return temp;
        }
        public static List<AllUsers> getUsers(string UserName, string EmployeeNumber, string EmailAddress, string FirstName, string LastName, string ADDomainUserName, string getOneHalf = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            int count = 0;
            AllUsers.All = new List<AllUsers>();
            DB = " Select * From [dbo].[vw_Users]";
            string[] param = { UserName, EmployeeNumber, EmailAddress, FirstName, LastName, ADDomainUserName};
            string[] labels = { "UserName", "EmployeeNumber", "EmailAddress", "FirstName", "LastName", "ADDomainUserName" };
            for (var i = 0; i < param.Length; i++)
            {
                if (String.IsNullOrEmpty(param[i]) == false)
                {
                    string AddToFilter = " Where ";
                    if (count > 0)
                    {
                        AddToFilter = " Or ";
                    }
                    if (labels[i] == "FirstName" && String.IsNullOrEmpty(LastName) == false)
                    {
                        if (FirstName != LastName)
                        {
                            if (AddToFilter != " Where ")
                            {
                                AddToFilter = " And ";
                            }
                        }
                    }
                    if (labels[i] == "LastName" && String.IsNullOrEmpty(FirstName) == false)
                    {
                        if (FirstName != LastName)
                        {
                            if (AddToFilter != " Where ")
                            {
                                AddToFilter = " And ";
                            }
                        }
                    }
                    count++;
                    AddtoQuery += AddToFilter + labels[i] + " like '%" + param[i] + "%'";
                }
            }

           

            AddtoQuery += " Order by FirstName Asc";

            if (String.IsNullOrEmpty(getOneHalf) == false)
            {
                if (getOneHalf == "1")
                {
                    AddtoQuery += " OFFSET 0 ROWS  FETCH NEXT 2500 ROWS ONLY";
                }
                else if (getOneHalf == "2")
                {
                    AddtoQuery += " OFFSET 2500 ROWS ";
                }
            }

            commandText = DB + AddtoQuery;
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
                        
                        AllUsers newEntry = new AllUsers();
                        newEntry.Fields = new SingleUser()
                        {
                            UserName = dr["UserName"].ToString(),
                            EmployeeNumber = dr["EmployeeNumber"].ToString(),
                            EmailAddress = dr["EmailAddress"].ToString(),
                            FirstName = dr["FirstName"].ToString(),
                            LastName = dr["LastName"].ToString(),
                            DisplayName = dr["DisplayName"].ToString(),
                            ADDomainUserName = dr["ADDomainUserName"].ToString(),
                            ADExpirationDate = dr["ADExpirationDate"].ToString(),
                            ADStatus = dr["ADStatus"].ToString(),
                        };
                        AllUsers.All.Add(newEntry);
                    }
                }
                dr.Close();
                conn.Close();
            }
            var temp = AllUsers.All;
            AllUsers.All = new List<AllUsers>();
            return temp;
        }
        public static List<MetaDataList> Roles(string exclude )
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            int count = 0;
            DB = "Select * From [dbo].[Roles]";
            if (String.IsNullOrEmpty(exclude) == false)
            {

                DB += " Where Name <> '" + exclude +"'";
            }
            commandText = DB + AddtoQuery;
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

                        MetaDataList newEntry = new MetaDataList();
                        newEntry.Name = dr["Name"].ToString();

                        MetaDataList.ListMetaData.Add(newEntry);
                    }
                }
                dr.Close();
                conn.Close();
            }
            var temp = MetaDataList.ListMetaData;
            MetaDataList.ListMetaData = new List<MetaDataList>();
            return temp;
        }
        public static List<MetaDataList> Navigation(string Role)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            int count = 0;
            DB = "Select * From [dbo].[Navigation] ";
            if (String.IsNullOrEmpty(Role) == false)
            {
                if (Role.IndexOf("|") >= 0)
                {
                    string[] allRoles = Role.Split('|');
                    for (int i = 0; i < allRoles.Length; i++)
                    {
                        string subString = " Where";
                        if (count > 0)
                        {
                            subString = " OR";
                        }

                        if (allRoles[i].IndexOf(",") >= 0)
                        {
                            string[] subRoles = allRoles[i].Split(',');
                            for (int j = 0; j < subRoles.Length; j++)
                            {
                                if (subRoles[j] != "")
                                {
                                    if (count > 0)
                                    {
                                        subString = " OR";
                                    }
                                    DB += subString + " Role like '%" + subRoles[j] + "%'";
                                    count++;
                                }
                            }
                        }
                        else
                        {
                            DB += subString + " Role like '%" + allRoles[i] + "%'";
                        }
                        count++;
                    }

                }
                else
                {
                    if (Role.IndexOf(",") >= 0) {
                        var splitRole = Role.Split(',');
                        for (var i =0; i < splitRole.Length; i++)
                        {
                            if (i == 0)
                            {
                                DB += " Where Role like '%" + splitRole[i] + "%'";
                            }else
                            {
                                DB += " Or Role like '%" + splitRole[i] + "%'";
                            }
                        }

                    }else
                    {
                        DB += " Where Role like '%" + Role + "%'";
                    }
                   
                }
            }
            else
            {
                DB += " Where Role = 'User'";
            }
            commandText = DB + AddtoQuery;
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

                        MetaDataList newEntry = new MetaDataList();
                        newEntry.Name = dr["Content"].ToString();
                        newEntry.Link = dr["Link"].ToString();

                        MetaDataList.ListMetaData.Add(newEntry);
                    }
                }
                dr.Close();
                conn.Close();
            }
            var temp = MetaDataList.ListMetaData;
            MetaDataList.ListMetaData = new List<MetaDataList>();
            return temp;
        }
    }
}