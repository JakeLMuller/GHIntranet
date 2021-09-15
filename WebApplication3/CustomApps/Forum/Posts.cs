using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;
using WebApplication3.CustomApps.Forum.Models;

namespace WebApplication3.CustomApps.Forum
{
    public class Posts
    {
        public static List<string> CreatePost(string MSG, string Category, string Username, string Title, string Date, string Likes, string img)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["ForumConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string id = "";
            List<string> listreturn = new List<string>();

            try
            {

                DB = " INSERT INTO [dbo].[Policies] " +
                "([MSG]  ,[Category] ,[Username] ,[Title] ,[Date]  ,[Likes],[Img] )" +
                "VALUES "
               + "('" + MSG + "'  ,'" + Category + "' ,'" + Username + "','" + Title + "'"
               + " ," + Date + " ,'" + Likes + "','" + img + "'); SELECT CAST(scope_identity() AS int)";


                string result = "false";
                if (DB != "")
                {
                    String commandText = DB;
                    if (AddtoQuery != "")
                    {
                        commandText += " " + AddtoQuery;
                    }


                    using (System.Data.SqlClient.SqlConnection conn = new SqlConnection(connectionString))
                    {
                        SqlCommand cmd = new SqlCommand(commandText, conn);

                        conn.Open();
                        int tempId = (int)cmd.ExecuteScalar();
                        id = tempId.ToString();
                        if (String.IsNullOrEmpty(id) == false)
                        {

                            result = "true";

                        }
                        conn.Close();
                    }
                }


                listreturn.Add(result);
                listreturn.Add(id);

            }
            catch (Exception ex)
            {
                string Error = ex.ToString();
                string body = "Error: " + Error + "<br>" +
                " MSG :" + MSG + "<br>" +
                " Category :" + Category + "<br>" +
                " Username :" + Username + "<br>" +
                " Title :" + Title + "<br>";
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Forum Post ", body);
                listreturn.Add(body);

            }
            return listreturn;

        }

        public static List<AllPosts> getPosts(string username, string date, string Category, string search, string order)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            int count = 0;
            DB = "SELECT * From [dbo].[ForumPosts] ";
            if (String.IsNullOrEmpty(username) == false)
            {
                string SubString = "where";
                if (AddtoQuery.IndexOf("where") >= 0)
                {
                    count++;
                }
                if (count > 0)
                {
                    SubString = " And ";
                }
                AddtoQuery += SubString + " Username = '" + username + "'";
            }
            if (String.IsNullOrEmpty(Category) == false)
            {
                string SubString = "where";
                if (AddtoQuery.IndexOf("where") >= 0)
                {
                    count++;
                }
                if (count > 0)
                {
                    SubString = " And ";
                }
                AddtoQuery += SubString + " Category = '" + Category + "'";
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
                            AllPosts Post = new AllPosts();
                            SinglePost fields = new SinglePost()
                            {
                                ID = dr["ID"].ToString(),
                                MSG = dr["MSG"].ToString(),
                                Category = dr["Category"].ToString(),
                                Username = dr["Username"].ToString(),
                                Title = dr["Title"].ToString(),
                                Date = dr["Date"].ToString(),
                                IMG = dr["IMG"].ToString()
                            };
                            Post.Fields = fields;
                            AllPosts.All.Add(Post);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }



            }
            var temp = AllPosts.All;
            AllPosts.All = new List<AllPosts>();
            return temp;
        }
    }
}