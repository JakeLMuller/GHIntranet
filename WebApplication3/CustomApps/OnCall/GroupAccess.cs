using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.CustomApps.OnCall.Models;

namespace WebApplication3.CustomApps.OnCall
{
    public class GroupAccess
    {
        public static List<AllUsers> getUserAccess(string username, string group, string GetPeople = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";



            if (String.IsNullOrEmpty(GetPeople) == true)
            {

                DB = "Select *  From [dbo].[tblOnCallGroupAccess] ";


                if (String.IsNullOrEmpty(username) == false)
                {
                    AddtoQuery += " Where UserLogin = '" + username + "'";
                }
                if (String.IsNullOrEmpty(group) == false)
                {
                    if (AddtoQuery.IndexOf("Where") >= 0)
                    {
                        AddtoQuery += " And GroupID =" + group;
                    }
                    else
                    {
                        AddtoQuery += " Where GroupID =" + group;
                    }
                }
            }else
            {
                DB = " SELECT tblPeople.FirstName,tblPeople.LastName,tblOnCallGroupAccess.ExternalID,tblOnCallGroupAccess.UserLogin,tblOnCallGroupAccess.AccessID, " +
                    " tblOnCallGroupAccess.GroupID  FROM [GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallGroupAccess] " +
                    " Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople]" +
                    " On tblOnCallGroupAccess.ExternalID = tblPeople.ExternalID" +
                    " Where GroupID = "+ group + " Order By tblPeople.FirstName asc";


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

                            AllUsers newEntry = new AllUsers();
                            if (String.IsNullOrEmpty(GetPeople) == false)
                            {
                                Users fields = new Users()
                                {
                                    AccessID = dr["AccessID"].ToString(),
                                    GroupID = dr["GroupID"].ToString(),
                                    UserLogin = dr["UserLogin"].ToString(),
                                    ExternalID = dr["ExternalID"].ToString(),
                                    FirstName = dr["FirstName"].ToString(),
                                    LastName = dr["LastName"].ToString()

                                };
                                newEntry.Fields = fields;
                            }
                            else
                            {
                                Users fields = new Users()
                                {
                                    AccessID = dr["AccessID"].ToString(),
                                    GroupID = dr["GroupID"].ToString(),
                                    UserLogin = dr["UserLogin"].ToString(),
                                    ExternalID = dr["ExternalID"].ToString()

                                };
                                newEntry.Fields = fields;
                            }
                           
                            AllUsers.Users.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllUsers.Users;
            AllUsers.Users = new List<AllUsers>();
            return temp;
        }
        public static List<AllUsers> getUserAccessMembers(string group)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
      
           DB = " SELECT tblPeople.FirstName,tblPeople.LastName,tblOnCallMembers.ExternalID, " +
                " tblOnCallMembers.GroupID,  tblOnCallMembers.MemberID FROM [GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallMembers] " +
                " Join [GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople]" +
                " On tblOnCallMembers.ExternalID = tblPeople.ExternalID" +
                " Where GroupID = " + group + " Order By tblPeople.FirstName asc";
            

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

                            AllUsers newEntry = new AllUsers();

                            Users fields = new Users()
                            {
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                GroupID = dr["GroupID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                MemberID = dr["MemberID"].ToString()

                                };
                                newEntry.Fields = fields;
                            

                            AllUsers.Users.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllUsers.Users;
            AllUsers.Users = new List<AllUsers>();
            return temp;
        }
        public static List<AllDefaultTimes> getDefaultTimes(string GroupID)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";

            DB = "Select *  From [dbo].[tblOnCallDefaultTimes] ";


            if (String.IsNullOrEmpty(GroupID) == false)
            {
                AddtoQuery += " Where GroupID = '" + GroupID + "'";
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

                            AllDefaultTimes newEntry = new AllDefaultTimes();
                            DefaultTime fields = new DefaultTime()
                            {
                                GroupID = dr["GroupID"].ToString(),
                                StartTime = dr["StartTime"].ToString(),
                                EndTime = dr["EndTime"].ToString(),
                                DaysOfWeek = dr["DaysOfWeek"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllDefaultTimes.AllTimes.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllDefaultTimes.AllTimes;
            AllDefaultTimes.AllTimes = new List<AllDefaultTimes>();
            return temp;
        }
        public static List<People> getPeopleForAdmin(string GroupId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";

            DB = "DECLARE @Group int = "+ GroupId + ";" +
                " Select FirstName, tblPeople.LastName, tblPeople.ExternalID, tblPeople.PeopleType,tblPeople.Title " +
                " From[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople] " +
                        " Where tblPeople.ExternalID not in ( " +

                " Select ExternalID" +

                " From[GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallGroupAccess]" +
                             " Where GroupID = @Group" +
                " )" +

                " Order By FirstName Asc";
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

                            People newEntry = new People();
                            Person fields = new Person()
                            {
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                PeopleType = dr["PeopleType"].ToString(),
                                ExternalID = dr["ExternalID"].ToString()
                            };
                            newEntry.Fields = fields;
                            People.AllPeople.Add(newEntry);
                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = People.AllPeople;
            People.AllPeople = new List<People>();
            return temp;
        }
        public static List<People> getPeopleInGroup(string GroupId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";

            DB = "DECLARE @Group int = " + GroupId + ";" +
                " Select FirstName, tblPeople.LastName, tblPeople.ExternalID, tblPeople.PeopleType,tblPeople.Title " +
                " From[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople] " +
                        " Where tblPeople.ExternalID not in ( " +

                " Select ExternalID" +

                " From[GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallGroupAccess]" +
                             " Where GroupID = @Group" +
                " )" +

                " Order By FirstName Asc";
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

                            People newEntry = new People();
                            Person fields = new Person()
                            {
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                PeopleType = dr["PeopleType"].ToString(),
                                ExternalID = dr["ExternalID"].ToString()
                            };
                            newEntry.Fields = fields;
                            People.AllPeople.Add(newEntry);
                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = People.AllPeople;
            People.AllPeople = new List<People>();
            return temp;
        }

    }
}