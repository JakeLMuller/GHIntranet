using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SQL
{
    public class urls
    {
        public static string TinyURL(string Id, string url, string name, string scriptAs)
        {
            
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";

            if (String.IsNullOrEmpty(scriptAs) == true)
            {
                DB = "Select * From [GHVHSUserUploads].[dbo].[tinyurls]";
                if (String.IsNullOrEmpty(Id) == false)
                {
                    AddtoQuery += "Where Id = '" + Id + "'";

                    if (String.IsNullOrEmpty(name) == false)
                    {
                        AddtoQuery += " Or name = '" + name + "'";
                    }
                    if (String.IsNullOrEmpty(url) == false)
                    {
                        AddtoQuery += " Or url = '" + url + "'";
                    }
                }
                else if (String.IsNullOrEmpty(name) == false)
                {
                    AddtoQuery += " Where name = '" + name + "'";
                    if (String.IsNullOrEmpty(url) == false)
                    {
                        AddtoQuery += " Or url = '" + url + "'";
                    }
                }
                else if (String.IsNullOrEmpty(url) == false)
                {
                    AddtoQuery += " Where url = '" + url + "'";
                }
            }
            else if (scriptAs == "Update")
            {
                string identifier = "";
                 if (String.IsNullOrEmpty(Id) == false)
                {
                    AddtoQuery = " Where Id = '" + Id + "'";
                    identifier = "Y";
                }
                if (identifier == "Y")
                {
                    int count = 0;
                    DB = "UPDATE [dbo].[tinyurls] SET ";
                    if (String.IsNullOrEmpty(name) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[name] = '" + name + "'";
                    }
                    if (String.IsNullOrEmpty(url) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[url] = '" + url + "'";
                    }
                    if (String.IsNullOrEmpty(Id) == false)
                    {
                        if (count > 0)
                        {
                            DB += ",";
                        }
                        count++;
                        DB += "[Id] = '" + Id + "'";
                    }

                }
                else
                {
                    DB = "";
                }

            }
            else if (scriptAs == "Create")
            {
                DB = "USE [GHVHSUserUploads]"
                  + "INSERT INTO [dbo].[tinyurls]"
                  + " ([Id]"
                  + ",[name]"
                  + ",[url])"
                  + "VALUES "
                  + "('" + Id + "'"
                  + " ,'" + name + "'"
                  + " ,'" + url + "')";
            }
            else if (scriptAs == "Delete")
            {
                string identifier = "";
                if (String.IsNullOrEmpty(Id) == false)
                {
                    AddtoQuery = " Where Id = '" + Id + "'";
                    identifier = "Y";
                }
                if (identifier == "Y")
                {
                    DB = "USE [GHVHSUserUploads] DELETE FROM [dbo].[tinyurls]";
                }
                else
                {
                    DB = "";
                }
            }


            string result = "Error";
            List<string> list = new List<string>();
            if (DB != "")
            {
                String commandText = DB;
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
                        if (String.IsNullOrEmpty(scriptAs) == true)
                        {
                            if (dr.HasRows)
                            {
                                while (dr.Read())
                                {
                                    result = dr["url"].ToString();

                                }
                            }else
                            {
                                result = "none";
                            }
                        }
                        else
                        {
                            if (dr.HasRows)
                            {
                                result = "false";
                            }
                            else
                            {
                                result = "Success";
                                
                            }
                                
                        }
                        dr.Close();

                        //close connection
                        conn.Close();
                    }
                }catch(Exception ex)
                {
                    result = ex.ToString() + "|Error";
                }
            }

            else
            {
                result = "Error"; 
            }


            return result;
        }

        
    }
}