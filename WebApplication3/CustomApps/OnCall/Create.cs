using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.CustomApps.OnCall
{
    public class Create
    {
        public static string CreateCallTime(string GroupID, string ExternalID, string StrartTime, string EndTime, string Comments, string CommentsPrivate)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            string Result = "false";
            DB = "INSERT INTO [dbo].[tblOnCall] " +
           "([GroupID] " +
           ",[ExternalID] " +
           ",[StartTime] " +
           ",[EndTime] " +
           ",[Comments] " +
           ",[CommentsPrivate] )"  +
     " VALUES ( " + GroupID + "," + ExternalID +
                 ", CONVERT(DATETIME, '"+ StrartTime + "')," +
                 " CONVERT(DATETIME, '" + EndTime + "')," +
                "'" + Comments + "'," +
                "'" + CommentsPrivate + "'"+
                ")";

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
                    if (dr.RecordsAffected > 0)
                    {

                        Result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            return Result;
        }
        public static string UpdateCallTime(string GroupID, string ExternalID, string StrartTime, string EndTime, string Comments, string CommentsPrivate, string id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            string Result = "false";
            DB = "UPDATE [dbo].[tblOnCall] "
            + " SET "+
            " [ExternalID] = " + ExternalID +
            " ,[StartTime] = CONVERT(DATETIME, '" + StrartTime + "') " +
            " ,[EndTime] = CONVERT(DATETIME, '" + EndTime + "') " +
            " ,[Comments] = '" + Comments + "'" +
            " ,[CommentsPrivate] = '" + CommentsPrivate + "'"+
            " Where ItemID = " + id;

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
                    if (dr.RecordsAffected > 0)
                    {

                        Result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            return Result;
        }

        public static string DeleteCall(string id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            string Result = "false";
            DB = " DELETE FROM [dbo].[tblOnCall] ";
                
            DB += " WHERE ItemID = "+id;

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
                    if (dr.RecordsAffected > 0)
                    {

                        Result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            return Result;
        }
        public static string AddMember(string External, string GroupId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            string Result = "false";
            DB = " USE [GHVHS_Intranet_OnCallSchedule] "+

    " INSERT INTO[dbo].[tblOnCallMembers] " +
              " ([GroupID] " +
              " ,[ExternalID]) "+
         " VALUES "+
           "( " + GroupId+
           "," + External + ")";


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
                    if (dr.RecordsAffected > 0)
                    {

                        Result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            return Result;
        }
        public static string DeleteMember(string MemberId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["OnCallConnection"].ConnectionString;
            String DB = "";
            String AddtoQuery = "";
            string Result = "false";
            DB = " USE [GHVHS_Intranet_OnCallSchedule] " +

        "DELETE FROM [dbo].[tblOnCallMembers]" +
              " Where MemberID = " + MemberId;

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
                    if (dr.RecordsAffected > 0)
                    {

                        Result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }

            }
            return Result;
        }

    }
}