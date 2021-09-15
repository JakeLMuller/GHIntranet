using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Linq;
using System.Web;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Pnp
{
    public class FileHistory
    {
       public static List<AllFileHistory> GetFileHistory(string PolicyId, string Date, string fileName, string id="")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "Select * From [dbo].[PolicyHistory]";
            int count = 0;

            if (String.IsNullOrEmpty(PolicyId) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " PolicyId = " + PolicyId ;
            }
            if (String.IsNullOrEmpty(id) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Id = " + PolicyId;
            }
            if (String.IsNullOrEmpty(Date) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Date = " + Date;
            }
            if (String.IsNullOrEmpty(fileName) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " FileName = '" + fileName + "'";
            }
            AddtoQuery += " Order By Date Asc"; 
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

                            AllFileHistory newEntry = new AllFileHistory();
                            SingleFileHistory fields = new SingleFileHistory()
                            {
                                PolicyId = dr["PolicyId"].ToString(),
                                FileName = dr["FileName"].ToString(),
                                Date = dr["Date"].ToString(),
                                FilePath = dr["FilePath"].ToString(),
                                PDFPath = dr["PDFPath"].ToString(),
                                Id = dr["Id"].ToString()
                               
                            };
                            newEntry.Fields = fields;
                            AllFileHistory.Files.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }



            }
            var temp = AllFileHistory.Files;
            AllFileHistory.Files = new List<AllFileHistory>();
            return temp;
        }
        public static string AddNewFileHistorEntery(string policyId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string Result = "";
            string DB = "";
            List<AllFileHistory> getFiles = GetFileHistory(policyId, "", "");
            List <string> FileNames =  new List<string>(); 
            for (int i = 0; i < getFiles.Count; i++ ){
                FileNames.Add(getFiles[i].Fields.FileName); 
            }
            try
            {
                DB = " INSERT INTO [dbo].[PolicyHistory] " +
               "([PolicyId]  ,[FileName] ,[Date] ,[FilePath], [PDFPath] )" +
               "VALUES "
              + "(" + policyId + "  ,'' ,CURRENT_TIMESTAMP,'',''); SELECT CAST(scope_identity() AS int)";

                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand(DB, conn);
                    conn.Open();
                    
                    int tempId = (int)cmd.ExecuteScalar();
                    string id = tempId.ToString();

                    if (String.IsNullOrEmpty(id) == false)
                    {

                        Result = id;
                    }


                    conn.Close();
                }
            }
            catch (Exception Ex)
            {
                Result = "False";

            }
            if (Result != "False")
            {
                for (int i = 0; i < FileNames.Count; i++)
                {
                    CustomApps.Pnp.Library.DeleteFile(FileNames[i], "Y");
                }
            }
            return Result;
        }


        
        public static string AddFileToFileHistory(string policyId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string Result = "";
            string DB = "";
            string id =  AddNewFileHistorEntery(policyId); 
            List<SingleItem> Doc = Policies.GetPolicies(policyId, "", "", "", "", "", "");
            string FileName = Doc[0].Fields.FileName;
            string getEx = Path.GetExtension(FileName);
            string TempName = FileName.Replace(getEx, "");
            string NewFileName = "";
            List<AllFileHistory> AllFilesInHistory = GetFileHistory(policyId, "", "");
            NewFileName = TempName + "_" + id  +"("+ AllFilesInHistory.Count+")"+ getEx;

            try
            {
                string test = Library.MoveFile(FileName, NewFileName);
                string test2 = Library.MoveFile(TempName+".pdf", TempName + "_" + id + "(" + AllFilesInHistory.Count + ").pdf");
                string pdfNewName = NewFileName.Replace(getEx, "");
                string NewFilePath = "/img/ArchivedPolicies/" + NewFileName;
                string pdfPath = "/img/ArchivedPolicies/" + pdfNewName + ".pdf";

                DB = " UPDATE [dbo].[PolicyHistory]"
                   + " SET [PolicyId] = " + policyId
                   + " ,[FileName] = '" + NewFileName + "'"
                   + " ,[Date] = CURRENT_TIMESTAMP "
                   + " ,[FilePath] = '" + NewFilePath + "'"
                   + " ,[PDFPath] = '" + pdfPath + "'" +
                   " Where Id = " + id; 
                
                using (SqlConnection conn = new SqlConnection(connectionString))
                {
                    SqlCommand cmd = new SqlCommand(DB, conn);
                    conn.Open();


                    SqlDataReader dr = cmd.ExecuteReader();
                    dr.Read();
                    if (dr.RecordsAffected == 1)
                    {

                        int counted = dr.FieldCount;
                        Result = "true";
                    }
                    dr.Close();
                    conn.Close();

                    conn.Close();
                }
            }
            catch (Exception Ex)
            {
                Result = Ex.ToString();
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Check in. Id  = " + policyId, Ex.ToString() + "||"+ policyId);
            }
            return Result; 
        }
        public static string Delete(string id, string PolicyId)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            List<AllFileHistory> getList =  GetFileHistory(PolicyId, "", "", id);

           string result = "false";
           
                try
                {

                    DB = "DELETE FROM [dbo].[PolicyHistory] ";

                    if (String.IsNullOrEmpty(PolicyId) == false)
                    {
                        DB += " Where PolicyId =" + PolicyId;
                    }
                    else if (String.IsNullOrEmpty(id) == false)
                    {
                        DB += " Where Id =" + id;
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
                            if (dr.RecordsAffected > 0)
                            {

                                int counted = dr.FieldCount;
                                result = "true";
                            }
                            dr.Close();
                            conn.Close();
                        }
                    }
                    if (result == "true")
                    {
                        for (var i = 0; i < getList.Count; i++)
                        {
                            string FileName = getList[i].Fields.FileName;
                            string getEx = Path.GetExtension(FileName);
                            string TempName = FileName.Replace(getEx, "");
                            CustomApps.Pnp.Library.DeleteFile(FileName, "");
                            CustomApps.Pnp.Library.DeleteFile(TempName + ".pdf", "");
                        }
                    }
                }
                catch (Exception Ex)
                {
                    string body = Ex.ToString() +"||"+ id;

                    SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);
                    
                }
            
            return result;
        }
    }
}