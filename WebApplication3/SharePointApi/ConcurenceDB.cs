using System;
using System.Collections.Generic;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SharePointApi
{
    public class ConcurenceDB
    {
        public static List<string> Convos(string ScriptAs, string DocId, string username, string userId, string DueDate, string StartDate, string Status, string Title, 
            string Author,string CreatedOn, string RejectionReason, string DeadLine,string ApproveComments, string AllConcurrers, string AllConcurrerIds,
            string PercentComplete, string Id, string Email, string Initiator)
        {

            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";

            if (String.IsNullOrEmpty(ScriptAs) == true)
            {
                DB = "Select * From [GHVHSUserUploads].[dbo].[ConcurerDB]";


                if (String.IsNullOrEmpty(username) == false)
                {
                    string AddOrWhere = " Where ";
                    if (AddtoQuery.IndexOf("Where") >=0 ) {
                        AddOrWhere = " And ";
                    }
                    AddtoQuery += AddOrWhere+ "username = '" + username + "'";
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
                if (String.IsNullOrEmpty(AllConcurrers) == false)
                {
                    string AddOrWhere = " Where ";
                    if (AddtoQuery.IndexOf("Where") >= 0)
                    {
                        AddOrWhere = " And ";
                    }
                    AddtoQuery += AddOrWhere + "AllConcurrers like '%" + AllConcurrers + "%'";
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
                        AddtoQuery += AddOrWhere + "Status like '%Started%' ";
                    }
                    else if (Status == "Completed")
                    {
                       string tempSubQuery = AddtoQuery.Replace("Where", "");
                       AddtoQuery = AddtoQuery+ AddOrWhere + "Status = 'Rejected' Or " + tempSubQuery + AddOrWhere + "Status = 'Completed'";
                    }
                    else
                    {
                        AddtoQuery += AddOrWhere + "Status = '" + Status + "'";
                    }
                }
            }
            else if (ScriptAs == "Update")
            {
                if (String.IsNullOrEmpty(Id) == false)
                {
                    int count = 0;
                    DB = "UPDATE [dbo].[ConcurerDB] SET ";
                    if (String.IsNullOrEmpty(DocId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[DocId] = '" + DocId + "'";
                    }
                    if (String.IsNullOrEmpty(username) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[username] = '" + username + "'";
                    }
                    if (String.IsNullOrEmpty(DueDate) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[DueDate] = '" + DueDate + "'";
                    }
                    if (String.IsNullOrEmpty(StartDate) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[StartDate] = '" + StartDate + "'";
                    }
                    if (String.IsNullOrEmpty(Status) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Status] = '" + Status + "'";
                    }
                    if (String.IsNullOrEmpty(Title) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Title] = '" + Title + "'";
                    }
                    if (String.IsNullOrEmpty(Author) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Author] = '" + Author + "'";
                    }
                    if (String.IsNullOrEmpty(CreatedOn) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[CreatedOn] = '" + CreatedOn + "'";
                    }
                    if (String.IsNullOrEmpty(RejectionReason) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[RejectionReason] = '" + RejectionReason + "'";
                    }
                    if (String.IsNullOrEmpty(DeadLine) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[DeadLine] = '" + DeadLine + "'";
                    }
                    if (String.IsNullOrEmpty(ApproveComments) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[ApproveComments] = '" + ApproveComments + "'";
                    }
                    if (String.IsNullOrEmpty(AllConcurrers) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[AllConcurrers] = '" + AllConcurrers + "'";
                    }
                    if (String.IsNullOrEmpty(AllConcurrerIds) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[AllConcurrerIds] = '" + AllConcurrerIds + "'";
                    }
                    if (String.IsNullOrEmpty(PercentComplete) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PercentComplete] = '" + PercentComplete + "'";
                    }
                    if (String.IsNullOrEmpty(Email) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        
                       count++;
                        DB += "[Email] = '" + Email + "'";
                    }
                    if (String.IsNullOrEmpty(Initiator) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Initiator] = '" + Initiator + "'";
                    }
                    DB += " Where Id = '" + Id + "'";
                }
                else
                {
                    DB = "";
                }

            }
            else if (ScriptAs == "Create")
            {
                DB = "USE [GHVHSUserUploads]"
                  + "INSERT INTO [dbo].[ConcurerDB]"
                  + " ([DocId]"
                  + ",[username]"
                  + ",[userId]"
                  + ",[DueDate]"
                  + ",[StartDate]"
                  + ",[Status]"
                   + ",[Title]"
                  + ",[Author]"
                  + ",[CreatedOn]"
                  + ",[RejectionReason]"
                  + ",[DeadLine]"
                  + ",[ApproveComments]"
                  + ",[AllConcurrers]"
                  + ",[AllConcurrerIds]"
                  + ",[PercentComplete]"
                  + ",[Email]"
                  + ",[Initiator])"
                  + "VALUES "
                  + "('" + DocId + "'"
                  + " ,'" + username + "'"
                  + " ,'" + userId + "'"
                  + " ,'" + DueDate + "'"
                  + " ,'" + StartDate + "'"
                  + " ,'" + Status + "'"
                  + " ,'" + Title + "'"
                  + " ,'" + Author + "'"
                  + " ,'" + CreatedOn + "'"
                  + " ,'" + RejectionReason + "'"
                  + " ,'" + DeadLine + "'"
                  + " ,'" + ApproveComments + "'"
                  + " ,'" + AllConcurrers + "'"
                  + " ,'" + AllConcurrerIds + "'"
                  + " ,'" + PercentComplete + "'"
                  + " ,'" + Email + "'"
                  + " ,'" + Initiator + "'"
                  + ")";
            }
            else if (ScriptAs == "Delete")
            {
                if (String.IsNullOrEmpty(Id) == false)
                {
                    DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[ConcurerDB] Where Id = '" + Id + "'";
                }else if (String.IsNullOrEmpty(DocId) == false)
                {
                    DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[ConcurerDB] Where DocId = '" + DocId + "'";
                }
                else
                {
                    DB = "";
                }
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
                    if (String.IsNullOrEmpty(ScriptAs) == true)
                    {
                        if (dr.HasRows)
                        {
                            if (String.IsNullOrEmpty(Id) == false)
                            {
                                while (dr.Read())
                                {

                                    list.Add(dr["DocId"].ToString());
                                    list.Add(dr["username"].ToString());
                                    list.Add(dr["userId"].ToString());
                                    list.Add(dr["DueDate"].ToString());
                                    list.Add(dr["StartDate"].ToString());
                                    list.Add(dr["Status"].ToString());
                                    list.Add(dr["Title"].ToString());
                                    list.Add(dr["Author"].ToString());
                                    list.Add(dr["CreatedOn"].ToString());
                                    list.Add(dr["RejectionReason"].ToString());
                                    list.Add(dr["DeadLine"].ToString());
                                    list.Add(dr["ApproveComments"].ToString());
                                    list.Add(dr["AllConcurrers"].ToString());
                                    list.Add(dr["AllConcurrerIds"].ToString());
                                    list.Add(dr["PercentComplete"].ToString());
                                    list.Add(dr["Id"].ToString());
                                    list.Add(dr["Email"].ToString());
                                    list.Add(dr["Initiator"].ToString());
                                }
                            }
                            else
                            {
                                var dataTable = new DataTable();
                                dataTable.Load(dr);
                                string json = JsonConvert.SerializeObject(dataTable);
                                list.Add(json);
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
    }
}