using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.CustomApps.OnCall.Models;

namespace WebApplication3.CustomApps.OnCall
{
    public class get
    {



        public static List<AllGroups> getGroups(string GroupName, string GroupID)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";



            DB = "Select *  From [GHVHS_Intranet_OnCallSchedule].[dbo].[tblOnCallGroups]";

            DB += " Where Active =  'Y' ";
            if (String.IsNullOrEmpty(GroupName) == false)
            {
                AddtoQuery = " And GroupName like '%" + GroupName + "%'";
            }
            if (String.IsNullOrEmpty(GroupID) == false)
            {
                AddtoQuery = " And GroupID =" + GroupID;
            }
            AddtoQuery += " Order By GroupName Asc";
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

                            AllGroups newEntry = new AllGroups();
                            Groups fields = new Groups()
                            {
                                GroupID = dr["GroupID"].ToString(),
                                GroupName = dr["GroupName"].ToString(),
                                GroupComments = dr["GroupComments"].ToString(),
                                FacilityFilter = dr["FacilityFilter"].ToString(),
                                Active = dr["Active"].ToString(),
                                UpdateBy = dr["UpdateBy"].ToString(),
                                UpdateDate = dr["UpdateDate"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllGroups.Groups.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllGroups.Groups;
            AllGroups.Groups = new List<AllGroups>();
            return temp;
        }
        public static List<AllOnCalls> getOnCalls(string Item, string Group, string Page, string External, string StartTime, string EndTime)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";


            DB = "Begin " +

        " DECLARE @Group int = "+ Group + ";" +
        " DECLARE @Time DATETIME;" +
        " DECLARE @StartDate DATETIME = CONVERT(DATETIME, '"+ StartTime + "');" +
        " DECLARE @EndDate DATETIME = CONVERT(DATETIME, '"+ EndTime + "');" +
        " DECLARE @NewDate DATETIME = DATEADD(day, 1, @EndDate);" +
        " DECLARE @TestDate DATETIME = DATEADD(hour, 23.99, @EndDate);" +


        " Begin" +

        " Select tblOnCall.GroupID,tblOnCall.ItemID, tblOnCall.ExternalID, tblOnCall.Comments, tblOnCall.StartTime, tblOnCall.EndTime," +

        " tblPeople.Title, tblPeople.FirstName, tblPeople.LastName, tblPeople.DeptDescription" +
        " From[dbo].[tblOnCall]" +
        "  Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople]" +
        " On tblOnCall.ExternalID = tblPeople.ExternalID" +
        " Where ItemID<> 0 " +

        " And GroupID = @Group   and  (tblOnCall.EndTime >= @StartDate ) And GroupID = @Group" +

        "  AND(tblOnCall.EndTime <= @EndDate)" +

        "  or" +
        " (tblOnCall.StartTime <= @EndDate) and(tblOnCall.StartTime >= @StartDate )" +

        "  And GroupID = @Group" +

        " Order By StartTime Asc " +
        " End " +
     " End";

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

                            AllOnCalls newEntry = new AllOnCalls();
                            OnCalls fields = new OnCalls()
                            {
                                ItemID = dr["ItemID"].ToString(),
                                GroupID = dr["GroupID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                StartTime = dr["StartTime"].ToString(),
                                EndTime = dr["EndTime"].ToString(),
                                Comments = dr["Comments"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllOnCalls.OnCalls.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllOnCalls.OnCalls;
            AllOnCalls.OnCalls = new List<AllOnCalls>();
            return temp;
        }
        public static List<People> getPeople(string PersonID, string ExternalID, string FirstName, string LastName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";

            DB = "Select *  From [dbo].[tblPeople] ";


            if (String.IsNullOrEmpty(PersonID) == false)
            {
                AddtoQuery = " And PersonID =" + PersonID;
            }
            
            if (String.IsNullOrEmpty(ExternalID) == false)
            {
                if (ExternalID.IndexOf(",") >= 0)
                {
                    string[] all = ExternalID.Split(',');
                    string ToAdd = "";
                    for (var i = 0; i < all.Length; i++)
                    {
                        if (String.IsNullOrEmpty(all[i]) == false)
                        {
                            if (String.IsNullOrEmpty(ToAdd) == true)
                            {
                                ToAdd = " Where ExternalID = " + all[i];
                            }
                            else
                            {
                                ToAdd += " Or ExternalID = " + all[i];
                            }
                        }

                    }
                    AddtoQuery = ToAdd;
                }
                else
                {
                    AddtoQuery = " Where ExternalID = " + ExternalID;
                }

            }
            if (String.IsNullOrEmpty(FirstName) == false)
            {

                AddtoQuery += " Where FirstName like '%" + FirstName + "%'";
                if (String.IsNullOrEmpty(LastName) == false)
                {
                    AddtoQuery += " or LastName like '%" + LastName + "%'";
                }
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

                            People newEntry = new People();
                            Person fields = new Person()
                            {
                                PersonID = dr["PersonID"].ToString(),
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                MiddleName = dr["MiddleName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                DeptCode = dr["DeptCode"].ToString(),
                                DeptDescription = dr["DeptDescription"].ToString(),
                                Entity = dr["Entity"].ToString(),
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
        public static List<AllPhones> getPhones( string ExternalID)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            DB = "Select tblPhones.PhoneID, tblPhones.ExternalID, tblPhones.Extension, tblPhones.SpeedDial, tblPhones.PhoneNumber, tblPhones.PhoneTypeID, tblPhoneTypes.PhoneDescription  From [GHVHS_Intranet_OnCallSchedule].[dbo].[tblPhones]"
             + " Join [GHVHS_Intranet_OnCallSchedule].[dbo].[tblPhoneTypes] On tblPhones.PhoneTypeID = tblPhoneTypes.PhoneTypeID ";



            if (String.IsNullOrEmpty(ExternalID) == false)
            {
                if (ExternalID.IndexOf(",") >= 0)
                {
                    string[] all = ExternalID.Split(',');
                    string ToAdd = "";
                    for (var i = 0; i < all.Length; i++)
                    {
                        if (String.IsNullOrEmpty(all[i]) == false)
                        {
                            if (String.IsNullOrEmpty(ToAdd) == true)
                            {
                                ToAdd = " Where ExternalID = " + all[i];
                            }
                            else
                            {
                                ToAdd += " Or ExternalID = " + all[i];
                            }
                        }

                    }
                    AddtoQuery = ToAdd;
                }
                else
                {
                    AddtoQuery = " Where ExternalID = " + ExternalID;
                }
                
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

                            AllPhones newEntry = new AllPhones();
                            phone fields = new phone()
                            {
                                PhoneID = dr["PhoneID"].ToString(),
                                PhoneTypeID = dr["PhoneTypeID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                PhoneNumber = dr["PhoneNumber"].ToString(),
                                Extension = dr["Extension"].ToString(),
                                SpeedDial = dr["SpeedDial"].ToString(),
                                PhoneDescription = dr["PhoneDescription"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllPhones.Phones.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllPhones.Phones;
            AllPhones.Phones = new List<AllPhones>();
            return temp;
        }



        public static AllSingleOnCall GetAll(string Id, string date, string Entity)
        {
            List<AllGroups> Group = getGroups("", Id);
            string groupId = Group[0].Fields.GroupID;
            List<AllOnCalls> call = getOnCalls("", groupId, "All", "", date, "");
            string getExternalId = call[0].Fields.ExternalID;
            List<People> person = getPeople("", getExternalId, "", "");
            List<AllPhones> Phone = getPhones(getExternalId);
            AllSingleOnCall Data = new AllSingleOnCall()
            {
                Group = Group[0].Fields,
                OnCall = call[0].Fields,
                Person = person[0].Fields,
                Phone = Phone[0].Fields
            };
            return Data;
        }
        public static AllInMonth GetAllInMonth(string Id, string date, string Entity, string endDate)
        {
            List<AllGroups> Group = getGroups("", Id);
            string groupId = Group[0].Fields.GroupID;
            List<AllOnCalls> call = getOnCalls("", groupId, "All", "", date, endDate);
            string getExternalId = "";
            for (var i = 0; i < call.Count; i++)
            {
                if (String.IsNullOrEmpty(call[i].Fields.ExternalID) == false)
                {
                    if (String.IsNullOrEmpty(getExternalId) == true)
                    {
                        getExternalId = call[i].Fields.ExternalID;
                    }else
                    {
                        getExternalId += ","+call[i].Fields.ExternalID;
                    }
                }

            }
            AllInMonth Data = new AllInMonth();
            if (String.IsNullOrEmpty(getExternalId) == false)
            {
                List<People> person = getPeople("", getExternalId, "", "");
                List<AllPhones> Phone = getPhones(getExternalId);
                 Data = new AllInMonth()
                {
                    Group = Group,
                    OnCall = call,
                    Person = person,
                    Phone = Phone
                };
            }else
            {
                 Data = new AllInMonth()
                {
                    Group = Group,
                    OnCall = call
                };

            }
            return Data;
        }




        public static List<AllDailyOnCalls> getDailyCalls(string Date, string group)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";


            DB = "Begin " +

            " DECLARE @Group int = "+ group + ";" +
            " DECLARE @Time DATETIME;" +
            " DECLARE @Date DATETIME = CONVERT(DATETIME, '"+ Date + "');" +
            " DECLARE @NewDate DATETIME = DATEADD(day, 1, @Date);" +
            " DECLARE @TestDate DATETIME = DATEADD(hour, 23.99, @Date);" +

         " Select" +
         " @Time = EndTime" +
         " from[dbo].[tblOnCall]" +
         " Where ItemID <> 0" +
         " And GroupID = @Group AND(StartTime <= @Date) AND(EndTime >= @Date)" +

    " if @Time > @TestDate" +

        " Begin" +

           " Select tblOnCall.GroupID, tblOnCall.ItemID, tblOnCall.ExternalID, tblOnCall.Comments, tblOnCall.StartTime, tblOnCall.EndTime, " +

            " tblPeople.Title, tblPeople.FirstName, tblPeople.LastName, tblPeople.DeptDescription" +
            " From[dbo].[tblOnCall]" +
            " Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople]" +
            " On tblOnCall.ExternalID = tblPeople.ExternalID" +

            " Where ItemID <> 0 " +

            " And GroupID = @Group AND  (StartTime <= @NewDate) AND(EndTime >= @NewDate)" +

             " or GroupID = @Group AND(StartTime <=  @Date) AND(EndTime >=  @Date) Order By EndTime Asc" +


        " end" +
    " Else" +

        " Begin" +

            " Select tblOnCall.GroupID, tblOnCall.ItemID, tblOnCall.ExternalID, tblOnCall.Comments, tblOnCall.StartTime, tblOnCall.EndTime, " +

            " tblPeople.Title, tblPeople.FirstName, tblPeople.LastName, tblPeople.DeptDescription" +
            " From[dbo].[tblOnCall]" +
            " Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople]" +
            " On tblOnCall.ExternalID = tblPeople.ExternalID" +

            " Where ItemID <> 0 " +

            " And GroupID = @Group AND  (StartTime <= @NewDate) AND(EndTime >= @NewDate)" +

             " or GroupID = @Group AND(StartTime <=  @Date) AND(EndTime >=  @Date) Order By EndTime Asc" +


        " end" +
    " end ";


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

                            AllDailyOnCalls newEntry = new AllDailyOnCalls();
                            DailyOnCall fields = new DailyOnCall()
                            {
                                
                                GroupID = dr["GroupID"].ToString(),
                                ItemID = dr["ItemID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                StartTime = dr["StartTime"].ToString(),
                                EndTime = dr["EndTime"].ToString(),
                                Comments = dr["Comments"].ToString(),
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                DeptDescription = dr["DeptDescription"].ToString(),
                                Person = getPeople("", dr["ExternalID"].ToString(), "", ""),
                                Phone = getPhones(dr["ExternalID"].ToString())
                        };
                            newEntry.Fields = fields;
                            AllDailyOnCalls.Calls.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllDailyOnCalls.Calls;
            AllDailyOnCalls.Calls = new List<AllDailyOnCalls>();
            return temp;
        }
    }
}