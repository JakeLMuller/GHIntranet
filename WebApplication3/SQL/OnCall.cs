using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;



namespace WebApplication3.SQL
{
    public class OnCall
    {
        public static string GetGroupsByName(string GroupName)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";



            DB = "Select *  From [GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallGroups]";

            DB += " Where Active =  'Y' ";
            if (String.IsNullOrEmpty(GroupName) == false)
            {
                AddtoQuery = " And GroupName like '%" + GroupName+"%'";
            }
            string JSONString = "I did Not get Changed";

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

                    while (dr.Read())
                    {
                        JSONString = dr["GroupID"].ToString();
                    }
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetPhoneTypes(string PhoneTypeID)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";



            DB = "Select *  From [dbo].[tblPhoneTypes]";



            if (String.IsNullOrEmpty(PhoneTypeID) == false)
            {
                AddtoQuery = " And PhoneTypeID =" + PhoneTypeID;
            }

            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetPhones( string ExternalID)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";



            DB = "Select *  From [dbo].[tblPhones]";


            
            if (String.IsNullOrEmpty(ExternalID) == false)
            {
                AddtoQuery = " And ExternalID =" + ExternalID;
            }

            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetPeople(string PersonID, string ExternalID)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";


             
            DB = "Select *  From [dbo].[tblPeople] Where ExternalID <> 0 ";


            if (String.IsNullOrEmpty(PersonID) == false)
            {
                AddtoQuery = " And PersonID =" + PersonID;
            }
            if (String.IsNullOrEmpty(ExternalID) == false)
            {
                AddtoQuery = " And ExternalID =" + ExternalID;
            }
            
            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetMembers(string GroupID, string ExternalID, string MemberId)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";



            DB = "Select *  From [dbo].[tblOnCallMembers]";

            
            if (String.IsNullOrEmpty(GroupID) == false)
            {
                AddtoQuery = " And GroupID =" + GroupID;
            }
            if (String.IsNullOrEmpty(ExternalID) == false)
            {
                AddtoQuery = " And ExternalID =" + ExternalID;
            }
            if (String.IsNullOrEmpty(MemberId) == false)
            {
                AddtoQuery = " And MemberID =" + MemberId;
            }
            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetGroups(string GroupID)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";


            
            DB = "Select *  From [dbo].[tblOnCallGroups]";

            DB += " Where Active =  'Y' ";
            if (String.IsNullOrEmpty(GroupID) == false)
            {
                AddtoQuery = " And GroupID =" + GroupID;
            }
            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
        public static string GetTimes(string Item, string Group,string Page, string External, string StartTime, string EndTime)
        {
            String connectionString = "Data Source=sql.ormc.org;Initial Catalog=GHVHS_Intranet_OnCallSchedule;Persist Security Info=True;User ID=ssis_user;Password=ssis_user";
            String DB = "";
            String AddtoQuery = "";
            
            
            DB = "Select * From (Select ItemID,GroupID,ExternalID,StartTime,EndTime,Comments,Row_Number() Over(Order By StartTime asc) As RowNum From [dbo].[tblOnCall]) t2";
            DB += " Where ItemID <> 0 ";
            if (String.IsNullOrEmpty(Item) == false)
            {
                AddtoQuery += " And ItemID = '"+Item+"'";
            }
            if (String.IsNullOrEmpty(Group) == false)
            {
                AddtoQuery += " And GroupID = '" + Group + "'";
            }
            if (String.IsNullOrEmpty(External) == false)
            {
                AddtoQuery += " And ExternalID = '" + External + "'";
            }
            if (String.IsNullOrEmpty(StartTime) == false && String.IsNullOrEmpty(EndTime) == false)
            {
                AddtoQuery += " AND  (StartTime <= CONVERT(DATETIME,   '" + StartTime + "' ))";
                AddtoQuery += " AND  (EndTime >= CONVERT(DATETIME,   '" + EndTime + "' ))";
            }else if (String.IsNullOrEmpty(StartTime) == false && String.IsNullOrEmpty(EndTime) == true)
            {
                AddtoQuery += " AND  (StartTime <= CONVERT(DATETIME,   '" + StartTime + "' ))";
                AddtoQuery += "   (EndTime >= CONVERT(DATETIME,   '" + StartTime + "' ))";
            }
            else if (String.IsNullOrEmpty(StartTime) == true && String.IsNullOrEmpty(EndTime) == false)
            {
                AddtoQuery += " AND  (StartTime >= CONVERT(DATETIME,   '" + EndTime + "' ))";
                AddtoQuery += " AND  (EndTime <= CONVERT(DATETIME,   '" + EndTime + "' ))";
            }
            if (String.IsNullOrEmpty(Page) == false)
            {
                if (Page == "1")
                {
                    AddtoQuery += "AND RowNum <= 1000";
                }
                else if (Page == "2")
                {
                    AddtoQuery += "AND RowNum <= 2000 AND RowNum >= 1000";
                }
                else if (Page == "All")
                {
                    AddtoQuery += "AND RowNum <= 10000000";
                }
               
            }
            string JSONString = "I did Not get Changed";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }
    }
}