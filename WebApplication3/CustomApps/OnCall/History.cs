using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.CustomApps.OnCall.Models;

namespace WebApplication3.CustomApps.OnCall
{
    public class History
    {
        public static List<AllHistory> getHistory(string GroupID, string Date)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";



            DB = " Begin  " +

            " DECLARE @Group int = "+ GroupID + "; " +
            " DECLARE @Time DATETIME; " +
            " DECLARE @Date DATETIME = CONVERT(DATETIME, '"+ Date + "'); " +
            " DECLARE @NewDate DATETIME = DATEADD(day, 1, @Date); " +
            " DECLARE @TestDate DATETIME = DATEADD(hour, 23.99, @Date); " +

            "Select " +

            " @Time = EndTime " +

            " from[dbo].[tblOnCallHistory] " +


            " Where ItemID <> 0 " +

            " And GroupID = @Group AND(StartTime <= @Date) AND(EndTime >= @Date) " +

            " If @Time > @TestDate " +

               " Begin " +

                    " Select  tblOnCallHistory.HistoryID,tblOnCallHistory.ItemID, tblOnCallHistory.GroupID,tblOnCallHistory.ExternalID,tblOnCallHistory.StartTime, " +

                    " tblOnCallHistory.EndTime,tblOnCallHistory.Event,tblOnCallHistory.Comments,tblOnCallHistory.CommentsPrivate, tblOnCallHistory.HospitalistArea, " +

                    " tblOnCallHistory.UpdateBy,tblOnCallHistory.UpdateDate,tblOnCallHistory.Beeper, tblPeople.Title, tblPeople.FirstName, tblPeople.LastName,  " +

                    " tblPeople.DeptDescription From[GHVHS_Intranet_OnCallSchedule].[dbo].tblOnCallHistory Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople] " +
                    " On tblOnCallHistory.ExternalID = tblPeople.ExternalID Where tblOnCallHistory.ItemID<> 0  AND  (tblOnCallHistory.StartTime <= @Date ) " +

                    " AND(tblOnCallHistory.EndTime >= @Date) And GroupID = @Group Order By UpdateDate Asc " +
                " End " +

            " Else " +
               " Begin " +

                " Select  tblOnCallHistory.HistoryID,tblOnCallHistory.ItemID, tblOnCallHistory.GroupID,tblOnCallHistory.ExternalID,tblOnCallHistory.StartTime, " +
                " tblOnCallHistory.EndTime,tblOnCallHistory.Event,tblOnCallHistory.Comments,tblOnCallHistory.CommentsPrivate, tblOnCallHistory.HospitalistArea, " +
                " tblOnCallHistory.UpdateBy,tblOnCallHistory.UpdateDate,tblOnCallHistory.Beeper, tblPeople.Title, tblPeople.FirstName, tblPeople.LastName,  " +
                " tblPeople.DeptDescription From[GHVHS_Intranet_OnCallSchedule].[dbo].tblOnCallHistory Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople] " +
                " On tblOnCallHistory.ExternalID = tblPeople.ExternalID " +
                " Where " +

                  " tblOnCallHistory.ItemID<> 0  AND  (tblOnCallHistory.StartTime <= @Date) " +

                  " AND(tblOnCallHistory.EndTime >= @Date) And GroupID = @Group " +

                   " OR " +
                   " tblOnCallHistory.ItemID<> 0  AND  (tblOnCallHistory.StartTime <= @NewDate) " +

                   " AND(tblOnCallHistory.EndTime >= @NewDate) And GroupID = @Group " +

                " Order By UpdateDate Asc " +
              " End " +
            "End";
           
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

                            AllHistory newEntry = new AllHistory();
                            SingleHistory fields = new SingleHistory()
                            {
                                HistoryID = dr["HistoryID"].ToString(),
                                ItemID = dr["ItemID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                StartTime = dr["StartTime"].ToString(),
                                EndTime = dr["EndTime"].ToString(),
                                Event = dr["Event"].ToString(),
                                Comments = dr["Comments"].ToString(),
                                CommentsPrivate = dr["CommentsPrivate"].ToString(),
                                HospitalistArea = dr["HospitalistArea"].ToString(),
                                UpdateBy = dr["UpdateBy"].ToString(),
                                UpdateDate = dr["UpdateDate"].ToString(),
                                Beeper = dr["Beeper"].ToString(),
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                DeptDescription = dr["DeptDescription"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllHistory.History.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllHistory.History;
            AllHistory.History = new List<AllHistory>();
            return temp;
        }
        public static List<AllHistory> getMonthlyHistory(string GroupID, string StartDate, string EndDate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";



            DB = " Begin  " +
            " DECLARE @Group int = "+ GroupID + "; " +
            " DECLARE @Time DATETIME; " +
            " DECLARE @StartDate DATETIME = CONVERT(DATETIME, '"+ StartDate + "'); " +
            " DECLARE @EndDate DATETIME = CONVERT(DATETIME, '"+ EndDate + "'); " +
            "  DECLARE @NewDate DATETIME = DATEADD(day, 1, @EndDate); " +
            " DECLARE @TestDate DATETIME = DATEADD(hour, 23.99, @EndDate); " +
            "  Begin " +
            " Select  tblOnCallHistory.HistoryID,tblOnCallHistory.ItemID, tblOnCallHistory.GroupID,tblOnCallHistory.ExternalID,tblOnCallHistory.StartTime, " +
            " tblOnCallHistory.EndTime,tblOnCallHistory.Event,tblOnCallHistory.Comments,tblOnCallHistory.CommentsPrivate, tblOnCallHistory.HospitalistArea, " +
            " tblOnCallHistory.UpdateBy,tblOnCallHistory.UpdateDate,tblOnCallHistory.Beeper, tblPeople.Title, tblPeople.FirstName, tblPeople.LastName,  " +
            " tblPeople.DeptDescription From[GHVHS_Intranet_OnCallSchedule].[dbo].tblOnCallHistory Join[GHVHS_Intranet_OnCallSchedule].[dbo].[tblPeople] " +
            " On tblOnCallHistory.ExternalID = tblPeople.ExternalID Where tblOnCallHistory.ItemID<> 0  and  (tblOnCallHistory.EndTime >= @StartDate ) And GroupID = @Group " +
            " AND(tblOnCallHistory.EndTime <= @EndDate) " +
           " or " +
            " (tblOnCallHistory.StartTime <= @EndDate) and(tblOnCallHistory.StartTime >= @StartDate ) " +
           " And GroupID = @Group " +
            " Order By UpdateDate Asc " +
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

                            AllHistory newEntry = new AllHistory();
                            SingleHistory fields = new SingleHistory()
                            {
                                HistoryID = dr["HistoryID"].ToString(),
                                ItemID = dr["ItemID"].ToString(),
                                ExternalID = dr["ExternalID"].ToString(),
                                StartTime = dr["StartTime"].ToString(),
                                EndTime = dr["EndTime"].ToString(),
                                Event = dr["Event"].ToString(),
                                Comments = dr["Comments"].ToString(),
                                CommentsPrivate = dr["CommentsPrivate"].ToString(),
                                HospitalistArea = dr["HospitalistArea"].ToString(),
                                UpdateBy = dr["UpdateBy"].ToString(),
                                UpdateDate = dr["UpdateDate"].ToString(),
                                Beeper = dr["Beeper"].ToString(),
                                Title = dr["Title"].ToString(),
                                FirstName = dr["FirstName"].ToString(),
                                LastName = dr["LastName"].ToString(),
                                DeptDescription = dr["DeptDescription"].ToString()
                            };
                            newEntry.Fields = fields;
                            AllHistory.History.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            var temp = AllHistory.History;
            AllHistory.History = new List<AllHistory>();
            return temp;
        }
    }
}