using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Data;
using System.Data.SqlClient;

namespace WebApplication3.SQL
{
    public class Uploader
    {
        public static String addUpload(string Username, string Caption,  string Location, string fileName )
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";
            if (fileName == "Update") {
                DB = "UPDATE [dbo].[UserUploads]" +
                     "SET[Caption] = '" + Caption + "'" +
                      ",[Location] = '" + Location + "'" +
                      "Where UploadId = " + Username;
            }
            else if (fileName == "Delete")
            {
                DB = "DELETE FROM [dbo].[UserUploads] Where UploadId =" + Username;
            }
            else {
                DB = "USE [GHVHSUserUploads]"

                    + " INSERT INTO[dbo].[UserUploads]"
                    + " ([Username],[Caption],[Location],[Filename] ,[Likes] ,[CommentId] ,[Date] ,[Time] ,[UploadDateTime])"
                    + " VALUES"
                    + "('" + Username + "','" + Caption + "','" + Location + "','" + fileName + "' ,'" + 0 + "' ,'','','' ,CURRENT_TIMESTAMP )";
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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;



            return JSONString;

        }
        public static String AddMenuItem(string IntranetMenuItem, string URL, string ADGroupAccess, string Id)
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";
            DB = "USE [GHVHSUserUploads]"

                + " INSERT INTO[dbo].[MenuItems]"
                + " ([IntranetMenuItem],[URL],[ADGroup],[Id])"
                + " VALUES"
                + "('" + IntranetMenuItem + "','" + URL + "','" + ADGroupAccess + "','" + Id + "'"+")";

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;



            return JSONString;

        }
        public static String getCurrentIds(Int32 CID = 0, Int32 UPID = 0, String ToUpdate = "N")
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";
            if (ToUpdate == "N")
            {
                DB = "Select * From [CurrentIds]";
            }
            else
            {
                DB = "USE[GHVHSUserUploads]"

                + " UPDATE[dbo].[CurrentIds]"
                + " SET[CurrentCommentID] = " + CID
                + " ,[CurrentUploadID] = " + UPID;

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }

        public static String getUploads(string Username = "", string Location = "", String UploadId = "", String Cid = "", string MyPosts = "", string search = "")
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";

            DB = "Select * From [UserUploads] ";

            if (String.IsNullOrEmpty(UploadId) == false)
            {
                AddtoQuery = " Where UploadId = " + UploadId;
            }
            if (String.IsNullOrEmpty(MyPosts) == false)
            {
                if (String.IsNullOrEmpty(AddtoQuery) == false)
                {
                    AddtoQuery += " And Username = '" + MyPosts  + "'";
                }
                else
                {
                    AddtoQuery = " Where Username = '" + MyPosts + "'";
                }
            }
            if (String.IsNullOrEmpty(search) == false)
            {
                if (String.IsNullOrEmpty(AddtoQuery) == false)
                {
                    AddtoQuery = AddtoQuery.Replace("Where", "And");
                    string tempAddToQuery =  " Where Username = '" + search + "' " + AddtoQuery;
                    tempAddToQuery += " OR Location like '%" + search + "%' " + AddtoQuery;
                    tempAddToQuery += " OR Caption like '%" + search + "%' " + AddtoQuery;
                    tempAddToQuery += " OR UploadDateTime like '%" + search + "%' " + AddtoQuery;
                    AddtoQuery = tempAddToQuery;
                }
                else
                {
                    AddtoQuery = " Where Username like '%" + search + "%'";
                    AddtoQuery += " OR Location like '%" + search + "%'";
                    AddtoQuery += " OR Caption like '%" + search + "%'";
                    AddtoQuery += " OR UploadDateTime like '%" + search + "%'";


                }
            }
            AddtoQuery += " order by UploadDateTime Desc";
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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }

            return JSONString;
        }

        public static String UpdateLikes(string UploadId, string likes)
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";

            DB = "USE[GHVHSUserUploads]"

                     + " UPDATE[dbo].[UserUploads]"
                     + " SET[Likes] = " + likes
                     + " Where UploadId =" + UploadId;


            

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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;



            return JSONString;
        }
        public static String getComments(string Username = "",  string Cid = "", string ToUpdate = "", string Comments = "" , string uploaderId = "")
        {
            String connectionString = "Data Source=sqldev.ormc.org;Initial Catalog=GHVHSUserUploads;Persist Security Info=True;User ID=ghvintranet;Password=ghvintranet";
            String DB = "";
            String AddtoQuery = "";
            string JSONString = "I did Not get Changed";

            DB = "Select * From [UploadComments] Where UploadId = '" + uploaderId + "' Order By Date desc";
            if (ToUpdate == "Y")
            {
               DB = " INSERT INTO[dbo].[UploadComments]"
               + " ([Comment],[Date],[Username], [UploadId])"
               + " VALUES"
               + "('" + Comments + "',CURRENT_TIMESTAMP,'" + Username + "','" + uploaderId + "' )";

            }else if (ToUpdate == "Delete")
            {
                if (String.IsNullOrEmpty(uploaderId) == true)
                {
                    DB = "DELETE FROM [dbo].[UploadComments] Where CommentID ='" + Cid + "'";
                }else
                {
                    DB = "DELETE FROM [dbo].[UploadComments] Where UploadId ='" + uploaderId + "'";
                }
            }else if (ToUpdate == "Update")
            {
                DB = "UPDATE [dbo].[UploadComments]" +
                      "SET [Comment] = '" + Comments + "'" +
                      ",[Date] = CURRENT_TIMESTAMP " +
                      "WHERE CommentID = '" + Cid + "'";
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


                    var dataTable = new DataTable();
                    dataTable.Load(dr);
                    JSONString = JsonConvert.SerializeObject(dataTable);
                    //close data reader
                    dr.Close();

                    //close connection
                    conn.Close();
                }
            }
            // Specify the year of StartDate  
            //SqlParameter parameterYear = new SqlParameter("@Year", SqlDbType.Int);
            //parameterYear.Value = year;

            // When the direction of parameter is set as Output, you can get the value after   
            // executing the command.  
            //SqlParameter parameterBudget = new SqlParameter("@BudgetSum", SqlDbType.Money);
            //parameterBudget.Direction = ParameterDirection.Output;



            return JSONString;
        }

    }
}