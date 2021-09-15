using System;
using System.Collections.Generic;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using WebApplication3.Models;
using WebApplication3.SharePointApi;

namespace WebApplication3.CustomApps.Pnp
{
    public class Concurrence
    {
        public static List<AllConcurrers> GetConcurrences(string username, string DocId, string ConcurrersAll, string Status, string Id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            DB = "Select * From [dbo].[Concurrence]";
            if (String.IsNullOrEmpty(username) == false)
            {
                string AddOrWhere = " Where ";
                if (AddtoQuery.IndexOf("Where") >= 0)
                {
                    AddOrWhere = " And ";
                }
                AddtoQuery += AddOrWhere + "username = '" + username + "'";
            }
            if (String.IsNullOrEmpty(Id) == false)
            {
                string AddOrWhere = " Where ";
                if (AddtoQuery.IndexOf("Where") >= 0)
                {
                    AddOrWhere = " And ";
                }
                AddtoQuery += AddOrWhere + "Id = "+ Id;
            }
            if (String.IsNullOrEmpty(DocId) == false)
            {
                string AddOrWhere = " Where ";
                if (AddtoQuery.IndexOf("Where") >= 0)
                {
                    AddOrWhere = " And ";
                }
                AddtoQuery += AddOrWhere + "DocId = '" + DocId + "'";
            }
            if (String.IsNullOrEmpty(ConcurrersAll) == false)
            {
                string AddOrWhere = " Where ";
                if (AddtoQuery.IndexOf("Where") >= 0)
                {
                    AddOrWhere = " And ";
                }
                AddtoQuery += AddOrWhere + "AllConcurrers like '%" + ConcurrersAll + "%'";
            }
            if (String.IsNullOrEmpty(Status) == false)
            {
                string AddOrWhere = " Where ";
                if (AddtoQuery.IndexOf("Where") >= 0)
                {
                    AddOrWhere = " And ";
                }
                if (Status == "Active")
                {
                   
                    string tempSubQuery = AddtoQuery.Replace("Where", "");
                    AddtoQuery = AddtoQuery + AddOrWhere + "Status = 'Rejected' Or " + tempSubQuery + AddOrWhere + "Status like '%Started%'";
                }
                else if (Status == "Completed")
                {
                    //string tempSubQuery = AddtoQuery.Replace("Where", "");
                    //AddtoQuery = AddtoQuery + AddOrWhere + "Status = 'Rejected' Or " + tempSubQuery + AddOrWhere + "Status = 'Completed'";
                    AddtoQuery += AddOrWhere + "Status = 'Completed' ";
                }
                else
                {
                    AddtoQuery += AddOrWhere + "Status = '" + Status + "'";
                }
            }
            
             AddtoQuery += " Order by  CreatedOn Desc";
            
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

                            AllConcurrers newEntry = new AllConcurrers();
                            ConcurItem fields = new ConcurItem()
                            {
                                DocId = dr["DocId"].ToString(),
                                Id = dr["Id"].ToString(),
                                username = dr["username"].ToString(),
                                userId = dr["userId"].ToString(),
                                DueDate = dr["DueDate"].ToString(),
                                StartDate = dr["StartDate"].ToString(),
                                Status = dr["Status"].ToString(),
                                Title = dr["Title"].ToString(),
                                Author = dr["Author"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString(),
                                RejectionReason = dr["RejectionReason"].ToString(),
                                DeadLine = dr["DeadLine"].ToString(),
                                ApproveComments = dr["ApproveComments"].ToString(),
                                AllConcurrers = dr["AllConcurrers"].ToString(),
                                AllConcurrerIds = dr["AllConcurrerIds"].ToString(),
                                PercentComplete = dr["PercentComplete"].ToString(),
                                Email = dr["Email"].ToString(),
                                Initiator = dr["Initiator"].ToString(),
                                Approver = dr["Approver"].ToString(),
                            };
                            newEntry.Data = fields;
                            AllConcurrers.All.Add(newEntry);
                        }
                    }
                    dr.Close();
                    conn.Close();
                }
            }
            var temp = AllConcurrers.All;
            AllConcurrers.All = new List<AllConcurrers>();
            return temp;
        }
        public static List<string> CreateConcurrence(string DocId, string Id, string username, string userId, string DueDate, string StartDate, string Status, string Title,
                     string Author, string CreatedOn, string RejectionReason, string DeadLine, string ApproveComments, string AllConcurrers, string AllConcurrerIds,
                     string PercentComplete, string Email, string Initiator, string Approver, string fileName)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            List<string> listreturn = new List<string>();
            string result = "false";
            string[] labels = {"username","userId","DueDate","StartDate","Status","Title","Author","CreatedOn","RejectionReason","DeadLine","ApproveComments" ,
                "AllConcurrers","AllConcurrerIds","PercentComplete" ,"Email" ,"Initiator" ,"Approver"};
            string[] values = { username ,userId ,DueDate ,StartDate ,Status ,Title ,Author ,CreatedOn,RejectionReason ,DeadLine ,ApproveComments,
                AllConcurrers ,AllConcurrerIds,PercentComplete  ,Email  ,Initiator  ,Approver };
            DB = " INSERT INTO [dbo].[Concurrence] ( [DocId] ";
            for (int i = 0; i < labels.Length; i++)
            {
                DB +=  ", [" + labels[i] + "] ";
            }
            DB += " ) Values ( " + DocId;
            for (int i = 0; i < values.Length; i++)
            {
                if (labels[i] == "DueDate" || labels[i] == "StartDate" || labels[i] == "CreatedOn" || labels[i] == "DeadLine")
                {
                    DB += " ," + values[i] ;
                }
                else
                {
                    DB += " ,'" + values[i] + "'";
                }
            }
            commandText = DB + ")";
            if (AddtoQuery != "")
            {
                commandText += " " + AddtoQuery;
            }
            try
            {
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand(commandText, conn);
                    conn.Open();

                    SqlDataReader dr = cmd.ExecuteReader();
                    if (dr.RecordsAffected == 1)
                    {

                        int counted = dr.FieldCount;
                        result = "true";
                    }

                    dr.Close();
                    conn.Close();
                }
                if (result == "true") {
                    string ConvoUrl = "http://garnetinfo/PnP/PolicesDiscussion/" + DocId + "c";
                    string viewLink = "http://garnetinfo/PnP/Policy/" + DocId;
                    DateTime today = DateTime.Today;
                    string date = today.ToString("d");
                    SendEmail.SendEmail.NewTasks(fileName, viewLink, username, Initiator, ConvoUrl, date, Email);
                }
            }
            catch(Exception Ex)
            {
                string Error = Ex.ToString();
                string body = "Error: " + Error + "<br>" +
                 DB + AddtoQuery;
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error Createing Concurrence", body);
                listreturn.Add(body);
            }
            listreturn.Add(result);
           
            return listreturn;
        }

        public static List<string> UpdateConcurrence(string DocId, string Id, string username, string userId, string DueDate, string StartDate, string Status, string Title,
                    string Author, string CreatedOn, string RejectionReason, string DeadLine, string ApproveComments, string AllConcurrers, string AllConcurrerIds,
                    string PercentComplete, string Email, string Initiator, string Approver)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            List<string> listreturn = new List<string>();
            if (Status == "Completed")
            {
                PercentComplete = "100";
            }
            else if (Status == "Rejected")
            {
                PercentComplete = "0";
            }
            else if (Status == "Started")
            {
                PercentComplete = "25";
            }
            string[] labels = {"username","userId","DueDate","StartDate","Status","Title","Author","CreatedOn","RejectionReason","DeadLine","ApproveComments" ,
                "AllConcurrers","AllConcurrerIds","PercentComplete" ,"Email" ,"Initiator" ,"Approver"};
            string[] values = { username, userId ,DueDate, StartDate, Status ,Title ,Author ,CreatedOn,RejectionReason ,DeadLine ,ApproveComments,
                AllConcurrers, AllConcurrerIds, PercentComplete, Email, Initiator  ,Approver };

            DB = "UPDATE [dbo].[Concurrence] SET ";
            if (String.IsNullOrEmpty(DocId) == false)
            {
                string toUseComma = " ";
                if (count > 0)
                {
                    toUseComma = " ,";
                }
                count++;
                DB += toUseComma + " [DocId] = " + DocId;
            }
            for (var i = 0; i < values.Length; i++)
            {
                if (String.IsNullOrEmpty(values[i]) == false)
                {
                    string toUseComma = " ";
                    if (count > 0)
                    {
                        toUseComma = " ,";
                    }
                    count++;
                    DB += toUseComma + labels[i] + " = '" + values[i] + "'";
                }
            }
            DB += " Where Id = " + Id;

            try { 
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

            }
            catch (Exception Ex)
            {
                string Error = Ex.ToString();
                string body = "Error: " + Error + "<br>" +
                 DB + AddtoQuery;
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error Updating Concurrence", body);
                listreturn.Add(body);
            }
            listreturn.Add(result);
            return listreturn; 
        }
        public static string DeleteConcurences(string DocId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            DB += "DELETE FROM [dbo].[Concurrence] Where DocId = " + DocId;


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
            if (result == "true")
            {
                PolicesDiscussion.PnpMeassges(DocId + "c", "All", "", "", "", "", "Delete", "");
                PolicesDiscussion.Convos("", DocId + "c", "", "", "", "", "Delete", "", "");
            }
            return result;
        }
        public static string ConcurrenceStatusEmails(string Status, string username, string Title, string Id)
        {
            string results = "False";
            try
            {
                if (String.IsNullOrEmpty(Status) == false)
                {
                    List<AllConcurrers> GetSingleConncurrence = GetConcurrences("", "", "", "", Id);
                    string getDocID = GetSingleConncurrence[0].Data.DocId;
                    string AllIds = GetSingleConncurrence[0].Data.AllConcurrers;
                    string Final = "N";
                    string link = "http://garnetinfo/Pnp/ViewItem/DraftPolcies?ItemId=" + getDocID;
                    if (Title.IndexOf("Finial Approval For") >= 0)
                    {
                        Final = "Y";
                        link = "http://garnetinfo/Pnp/ApprovedPolicies";
                    }
                    else if (Status == "Rejected")
                    {
                        Final = "R";
                    }
                    string[] allUsers = AllIds.Split(';');
                    for (var i =0; i < allUsers.Length; i++) {
                        List<string> SingleUsers = SQL.Pnp.GetUser("", "", "", username);
                        SendEmail.SendEmail.ApprovedConcurrer(username, SingleUsers[3] + SingleUsers[4], Title, link, SingleUsers[2], Final);
                    }
                    results = "true";
                }
                else
                {
                    results = "No status update"; 
                }
            }catch (Exception Ex)
            {
                results = Ex.ToString();
            }
            return results;
        }
        public static string TransferConcurences(string NewUser, string oldUser, string ids)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            List<AllUsers> newU = MetaData.getUsers(NewUser, "", "", "", "", "");
            List<AllUsers> OldU = MetaData.getUsers(oldUser, "", "", "", "", "");
            string NewUFName = newU[0].Fields.DisplayName;
            string OldUFName = OldU[0].Fields.DisplayName;
            DB += " UPDATE [dbo].[Concurrence] " +
                  " SET " +
            " [username] = REPLACE([username], '" + oldUser + "', '" + NewUser + "'), " +
            " [AllConcurrers] = REPLACE([AllConcurrers], '" + oldUser + "', '" + NewUser + "'), " +
            " [AllConcurrerIds] = REPLACE([AllConcurrerIds], '" + oldUser + "', '" + NewUser + "') " +
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
        public static string TransferDiscussions(string NewUser, string oldUser, string ids)
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            string AddtoQuery = "";
            string DB = "";
            string commandText = "";
            string result = "false";
            int count = 0;
            List<AllUsers> newU = MetaData.getUsers(NewUser, "", "", "", "", "");
            List<AllUsers> OldU = MetaData.getUsers(oldUser, "", "", "", "", "");
            string NewUFName = newU[0].Fields.DisplayName;
            string OldUFName = OldU[0].Fields.DisplayName;
            DB += " UPDATE  [GHVHSUserUploads].[dbo].[PnpConvos] " +
                  " SET " +
            " [PeopleInConvo] = REPLACE([PeopleInConvo], '" + OldUFName + "', '" + NewUFName + "')" +
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