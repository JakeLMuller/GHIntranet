using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Pnp
{
    public class Approvers
    {
        public static List<AllApprovers> GetApprovers(string Approver, string DocId, string UserName, string Status, string ApproverID, string orderBy)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            DB = "Select * From [dbo].[Approvers]";
            if (String.IsNullOrEmpty(Approver) == false)
            {
                AddtoQuery += "Where Approver = '" + Approver + "'";
            }  
            if (String.IsNullOrEmpty(DocId) == false)
            {
                AddtoQuery += " Where  DocId = '" + DocId + "'";
            }
            if (String.IsNullOrEmpty(UserName) == false)
            {
                AddtoQuery += " Where  UserName like '" + UserName + "'";
            }
            if (String.IsNullOrEmpty(Status) == false)
            {
                string clause = " where";
                if (String.IsNullOrEmpty(Status) == false)
                {
                    clause = " And";
                }
                if (Status == "Check") {


                    AddtoQuery += clause + " Status in ('Not Started', 'Rejected')";
                }
                else
                {
                    AddtoQuery += clause + "  Status like '" + Status + "'";
                }
               
            }
            if (String.IsNullOrEmpty(ApproverID) == false)
            {
                AddtoQuery += " Where  ApproverID = "+ ApproverID;
            }

            
           
            if (String.IsNullOrEmpty(orderBy) == false)
            {
                AddtoQuery += " ORDER BY " + orderBy;
            }

            if (DB != "")
            {
                commandText = DB;
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

                            AllApprovers newEntry = new AllApprovers();
                            newEntry.Data = new Models.Approvers()
                            {
                                DocId = dr["DocId"].ToString(),
                                ApproverName = dr["Approver"].ToString(),
                                UserName = dr["UserName"].ToString(),
                                Status = dr["Status"].ToString(),
                                Title = dr["Title"].ToString(),
                                PercentComplete = dr["PercentComplete"].ToString(),
                                PDFFilePath = dr["PDFFilePath"].ToString(),
                                ApproverID = dr["ApproverID"].ToString()
                            };
                            AllApprovers.Items.Add(newEntry);
                        }
                    }
                    dr.Close();
                    conn.Close();
                }
            }
            var temp = AllApprovers.Items;
            AllApprovers.Items = new List<AllApprovers>();
            return temp;
        }

        public static List<string> CreateApprover(string Approver, string DocId, string UserName, string Status, string Comments, string Title, string PercentComplete, string PDFFilePath)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string results = "False";
            List<string> result = new List<string>();
            string commandText = "";
            DB = "INSERT INTO [dbo].[Approvers] " +
                "([DocId] " +
                 ",[Approver] " +
                 ",[UserName] " +
                 ",[Status] " +
                 ",[Comments] " +
                 ",[Title] " +
                 ",[PercentComplete] " +
                 ",[PDFFilePath]) VALUES (" +
                DocId +
                ", '" + Approver + "'" +
                ", '" + UserName + "'" +
                 ", '" + Status + "'" +
                 ", '" + Comments + "'" +
                 ", '" + Title + "'" +
                  ", '" + PercentComplete + "'" +
                ", '" + PDFFilePath + "' )";

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(DB, conn);
                conn.Open();

                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.RecordsAffected == 1)
                {
                    results = "true";

                }
                dr.Close();
                conn.Close();
            }
            result.Add(results);
            return result;
        }
        public static List<string> UpdateAppoveral(string Approver, string DocId, string UserName, string Status, string ApproverID, string Comments, string PDFFilePath,  string Title, string PercentComplete)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string results = "False";
            List<string> result = new List<string>();
            string commandText = "";
            int count = 0;
            string[] labels = { "Approver",  "UserName", "Status" ,"Comments", "Title", "PercentComplete", "PDFFilePath" };
            string[] values = { Approver,  UserName, Status, Comments, Title, PercentComplete, PDFFilePath };
            DB = " UPDATE [dbo].[Approvers] SET ";
            for (var i = 0; i < labels.Length; i++)
            {
                if (String.IsNullOrEmpty(values[i]) == false)
                {
                    string toAddComma = " ";
                    if (count > 0)
                    {
                        toAddComma = " ,";
                    }
                    if (labels[i] == "Date")
                    {
                        DB += toAddComma + " [" + labels[i] + "] = " + values[i];
                    }
                    else
                    {
                        DB += toAddComma + " [" + labels[i] + "] = '" + values[i] + "'";
                    }
                    count++;
                }
            }
            if (String.IsNullOrEmpty(ApproverID) == false)
            {
                DB += " Where ApproverID = " + ApproverID;
            }
            if (String.IsNullOrEmpty(DocId) == false)
            {
                DB += " Where DocId = " + DocId;
            }
            commandText = DB;
            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(commandText, conn);
                conn.Open();

                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.RecordsAffected == 1)
                {
                    results = "true";

                }
                dr.Close();
                conn.Close();
            }
            result.Add(results);
            return result;
        }
        public static string DeleteApprovals(string DocId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            DB += "DELETE FROM [dbo].[Approvers] Where DocId = " + DocId;


            commandText = DB;
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

                    int counted = dr.FieldCount;
                    result = "true";
                }

                dr.Close();
                conn.Close();
            }
            return result;
        }
        public static string TransferApprovers(string NewUser, string oldUser, string ids)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            DB += " UPDATE [dbo].[Approver] " +
                  " SET " +
            " [username] = REPLACE([username], '" + oldUser + "', '" + NewUser + "')," +
            " Where DocId IN (" + ids + "0)";

            commandText = DB;
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

                    int counted = dr.FieldCount;
                    result = "true";
                }

                dr.Close();
                conn.Close();
            }

            return result;
        }
    }
}