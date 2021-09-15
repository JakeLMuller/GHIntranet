using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SharePointApi
{
    public class PolicesDiscussion
    {
        public static List<string> Convos(string DocId, string ConvoId, string Title, string Body, string IsSecure, string PeopleInConvo, string ScriptAs, string orderBy, string Emails)
        {

            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";

            if (String.IsNullOrEmpty(ScriptAs) == true)
            {
                DB = "Select * From [GHVHSUserUploads].[dbo].[PnpConvos]";
                if (String.IsNullOrEmpty(ConvoId) == false)
                {
                    AddtoQuery += "Where ConvoId = '" + ConvoId + "'";
                    if (String.IsNullOrEmpty(DocId) == false)
                    {
                        AddtoQuery += " And  DocId = '" + DocId + "'";
                    }
                    if (String.IsNullOrEmpty(Body) == false)
                    {
                        AddtoQuery += " And  Body like '" + Body + "'";
                    }
                    if (String.IsNullOrEmpty(Title) == false)
                    {
                        AddtoQuery += " or  Title like '" + Title + "'";
                        AddtoQuery += " and ConvoId = '" + ConvoId + "'";
                    }
                    if (String.IsNullOrEmpty(PeopleInConvo) == false)
                    {
                        AddtoQuery += " or  PeopleInConvo like '%" + PeopleInConvo + "%'";
                        AddtoQuery += " and ConvoId = '" + ConvoId + "'";
                    }

                }
                
                else if (String.IsNullOrEmpty(DocId) == false)
                {
                    AddtoQuery += "Where  DocId = '" + DocId + "'";

                }
                else if (String.IsNullOrEmpty(Body) == false)
                {
                    AddtoQuery += " Where  Body like '%" + Body + "%'";

                    if (String.IsNullOrEmpty(Title) == false)
                    {
                        AddtoQuery += " or  Title like '%" + Title + "%'";

                    }
                    if (String.IsNullOrEmpty(PeopleInConvo) == false)
                    {
                        AddtoQuery += " or  PeopleInConvo like '%" + PeopleInConvo + "%'";

                    }
                }else if (String.IsNullOrEmpty(PeopleInConvo) == false)
                {
                    AddtoQuery += " Where  PeopleInConvo like '%" + PeopleInConvo + "%'";

                }
                if (String.IsNullOrEmpty(orderBy) == false)
                {
                    AddtoQuery += " ORDER BY " + orderBy;
                }
            }
            else if (ScriptAs == "Update")
            {
                if (String.IsNullOrEmpty(ConvoId) == false)
                {
                    int count = 0;
                    DB = "UPDATE [dbo].[PnpConvos] SET ";
                    if (String.IsNullOrEmpty(DocId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[DocId] = '" + DocId + "'";
                    }
                    if (String.IsNullOrEmpty(ConvoId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[ConvoId] = '" + ConvoId + "'";
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
                    if (String.IsNullOrEmpty(Body) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Body] = '" + Body + "'";
                    }
                    if (String.IsNullOrEmpty(IsSecure) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[IsSecure] = '" + IsSecure + "'";
                    }
                    if (String.IsNullOrEmpty(PeopleInConvo) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[PeopleInConvo] = '" + PeopleInConvo + "'";
                    }
                    DB += " Where ConvoId = '" + ConvoId + "'";
                }
                else
                {
                    DB = "";
                }

            }
            else if (ScriptAs == "Create")
            {
                DB = "USE [GHVHSUserUploads]"
                  + "INSERT INTO [dbo].[PnpConvos]"
                  + " ([DocId]"
                  + ",[ConvoId]"
                  + ",[Title]"
                  + ",[Body]"
                  + ",[IsSecure]"
                  + ",[PeopleInConvo]"
                  + ",[Date]"
                  + ",[Emails])"
                  + "VALUES "
                  + "('" + DocId + "'"
                  + " ,'" + ConvoId + "'"
                  + " ,'" + Title + "'"
                  + " ,'" + Body + "'"
                  + " ,'" + IsSecure + "'"
                  + " ,'" + PeopleInConvo + "'"
                   + " , CURRENT_TIMESTAMP "
                  + " ,'" + Emails + "')";
            }
            else if (ScriptAs == "Delete")
            {
                if (String.IsNullOrEmpty(ConvoId) == false)
                {
                    DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[PnpConvos] Where ConvoId = '" + ConvoId + "'";
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
                            if (String.IsNullOrEmpty(ConvoId) == false) {
                                while (dr.Read())
                                {

                                    list.Add(dr["DocId"].ToString());
                                    list.Add(dr["ConvoId"].ToString());
                                    list.Add(dr["Title"].ToString());
                                    list.Add(dr["Body"].ToString());
                                    list.Add(dr["IsSecure"].ToString());
                                    list.Add(dr["PeopleInConvo"].ToString());
                                    list.Add(dr["Date"].ToString());
                                    list.Add(dr["Emails"].ToString());
                                }
                            }else
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
        public static List<string> PnpMeassges(string ConvoId, string MessageId, string Title, string Body, string SingleUser, string SingleUserId, string ScriptAs, string orderBy)
        {

            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";

            if (String.IsNullOrEmpty(ScriptAs) == true)
            {
                DB = "Select * From [GHVHSUserUploads].[dbo].[PnpMeassges]";
                if (String.IsNullOrEmpty(MessageId) == false)
                {
                    AddtoQuery += "Where MessageId = '" + MessageId + "'";
                    if (String.IsNullOrEmpty(ConvoId) == false)
                    {
                        AddtoQuery += "And  ConvoId = '" + ConvoId + "'";
                    }
                    
                }
                else if (String.IsNullOrEmpty(ConvoId) == false)
                {
                    AddtoQuery += "Where  ConvoId = '" + ConvoId + "'";
                    if (String.IsNullOrEmpty(Body) == false)
                    {
                        AddtoQuery += "And  Body like '%" + Body + "%'";
                    }
                }
                if (String.IsNullOrEmpty(orderBy) == false)
                {
                    AddtoQuery += " ORDER BY " + orderBy ;
                }
            }
            else if (ScriptAs == "Update")
            {
                if (String.IsNullOrEmpty(MessageId) == false)
                {
                    int count = 0;
                    DB = "UPDATE [dbo].[PnpMeassges] SET ";
                    if (String.IsNullOrEmpty(ConvoId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[ConvoId] = '" + ConvoId + "'";
                    }
                    if (String.IsNullOrEmpty(MessageId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[MessageId] = '" + MessageId + "'";
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
                    if (String.IsNullOrEmpty(Body) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Body] = '" + Body + "'";
                    }
                    if (String.IsNullOrEmpty(SingleUser) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[SingleUser] = '" + SingleUser + "'";
                    }
                    if (String.IsNullOrEmpty(SingleUserId) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[SingleUserId] = '" + SingleUserId + "'";
                    }
                   
                    DB += " Where MessageId = '" + MessageId +"' And ConvoId = '" + ConvoId + "' And SingleUser = '" + SingleUser + "'";
                }
                else
                {
                    DB = "";
                }

            }
            else if (ScriptAs == "Create")
            {
                DB = "USE [GHVHSUserUploads]"
                  + "INSERT INTO [dbo].[PnpMeassges]"
                  + " ([ConvoId]"
                  + ",[MessageId]"
                  + ",[Title]"
                  + ",[Body]"
                  + ",[SingleUser]"
                  + ",[SingleUserId]"
                  + ",[Date])"
                  + "VALUES "
                  + "('" + ConvoId + "'"
                  + " ,'" + MessageId + "'"
                  + " ,'" + Title + "'"
                  + " ,'" + Body + "'"
                  + " ,'" + SingleUser + "'"
                  + " ,'" + SingleUserId + "'"
                  + " ,CURRENT_TIMESTAMP)";
            }
            else if (ScriptAs == "Delete")
            {
                if (String.IsNullOrEmpty(MessageId) == false)
                {
                    if (MessageId == "All")
                    {
                        DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[PnpMeassges] Where ConvoId = '" + ConvoId + "'";
                    }
                    else
                    {
                        DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[PnpMeassges] Where MessageId = '" + MessageId + "' And ConvoId = '" + ConvoId + "' And SingleUser = '"+ SingleUser + "'";
                    }
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
                            if (String.IsNullOrEmpty(MessageId) == false)
                            {
                                while (dr.Read())
                                {

                                    list.Add(dr["ConvoId"].ToString());
                                    list.Add(dr["MessageId"].ToString());
                                    list.Add(dr["Title"].ToString());
                                    list.Add(dr["Body"].ToString());
                                    list.Add(dr["SingleUser"].ToString());
                                    list.Add(dr["SingleUserId"].ToString());
                                    list.Add(dr["Date"].ToString());

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