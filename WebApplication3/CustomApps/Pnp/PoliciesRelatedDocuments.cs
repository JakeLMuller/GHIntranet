using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.IO;
using System.Web;
using WebApplication3.Models;

namespace WebApplication3.CustomApps.Pnp
{
    public class PoliciesRelatedDocuments
    {
        public static List<SingleItem> GetPolicies(string Id, string Author, string RelatedDocIds, string Search, string SearchBy, string order, string Page = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "Select * From [dbo].[PoliciesRelatedDocuments]";
            int count = 0;
            if (String.IsNullOrEmpty(Id) == false)
            {
                
                if (Id.IndexOf("|") >= 0)
                {
                    
                    string[] splitId = Id.Split('|');
                    for (var i = 0; i < splitId.Length; i++)
                    {
                        string subString = " Where";
                        if (count > 0)
                        {
                            subString = " Or ";
                        }
                        count++;
                        if (splitId[i] != "") {
                            AddtoQuery += subString + " Id = " + splitId[i];
                        }
                    }
                    count++;
                }
                else
                {
                    string subString = " Where";
                    if (count > 0)
                    {
                        subString = " And";
                    }
                    count++;
                    AddtoQuery += subString + " Id = " + Id;
                }
            }
            if (String.IsNullOrEmpty(Author) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Author = " + Author;
            }
            if (String.IsNullOrEmpty(RelatedDocIds) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " RelatedDocIds = '%" + RelatedDocIds+"%'";
            }
            if (String.IsNullOrEmpty(Search) == false)
            {
                if (String.IsNullOrEmpty(SearchBy) == false)
                {
                    if (String.IsNullOrEmpty(AddtoQuery) == false)
                    {
                        AddtoQuery += " And " + SearchBy + " like '%" + Search + "%' ";
                    }
                    else
                    {
                        AddtoQuery += " Where " + SearchBy + " like '%" + Search + "%' ";
                    }

                }
                else
                {
                    if (String.IsNullOrEmpty(AddtoQuery) == false)
                    {
                        AddtoQuery = AddtoQuery.Replace("Where", "And");
                        string TempAddToQueryString = "";
                        TempAddToQueryString = " Where FileName like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or Author like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or DocumentContents like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or Title like '%" + Search + "%' " + AddtoQuery;
                    }
                    else
                    {
                        AddtoQuery = " Where FileName like '%" + Search + "%'";
                        AddtoQuery += " Or Author like '%" + Search + "%'";
                        AddtoQuery += " Or DocumentContents like '%" + Search + "%'";
                        AddtoQuery += " Or Title like '%" + Search + "%'";
                    }
                }
            }
            if (String.IsNullOrEmpty(order) == false)
            {
                AddtoQuery += "Order by " + order;
            }else
            {
                AddtoQuery += " Order by  LastModified Desc";
            }
            if (String.IsNullOrEmpty(Page) == false)
            {
                int page = Int32.Parse(Page);
                if (page == 1)
                {
                    page = 0;
                }
                int totalOffset = page * 75;
                AddtoQuery += " OFFSET " + totalOffset + " ROWS  FETCH NEXT 75 ROWS ONLY";
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

                            SingleItem newEntry = new SingleItem();
                            Fields fields = new Fields()
                            {
                                Id = dr["Id"].ToString(),
                                SharepointId = dr["Id"].ToString(),
                                PolicyFolder = "PolicyRelatedDocuments",
                                FileName = dr["FileName"].ToString(),
                                FilePath = dr["FilePath"].ToString(),
                                Author = dr["Author"].ToString(),
                                LastModified = dr["LastModified"].ToString(),
                                Title = dr["Title"].ToString(),
                                CheckedOut = dr["CheckedOut"].ToString(),
                                DocumentContents = dr["DocumentContents"].ToString(),
                            };
                            newEntry.Fields = fields;
                            SingleItem.Items.Add(newEntry);



                        }
                    }

                    dr.Close();
                    conn.Close();
                }



            }
            var temp = SingleItem.Items;
            SingleItem.Items = new List<SingleItem>();
            return temp;
        }
        public static List<string> AddRelatedDoc(string FileName, string FilePath, string Author, string LastModified, string Editor, string Title, string CheckedOut, string RelatedDocIds,
             string DocumentContents, string PDFFilePath)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            List<string> listreturn = new List<string>();

            try
            {

                DB = "INSERT INTO [dbo].[PoliciesRelatedDocuments] " +
                "( [FileName] ,[FilePath] ,[Author] ,[LastModified]  ,[Editor] ,[Title] ,[CheckedOut]" +
               " ,[RelatedDocIds] ,[DocumentContents], [PDFFilePath]) " +
                "VALUES "
               + "('" + FileName + "' ,'" + FilePath + "','" + Author + "'"
               + " ," + LastModified + " ,'" + Editor + "' ,'" + Title + "'"
               + " ,'" + CheckedOut + "' ,'','" + Library.MySqlEscape(DocumentContents) + "','" + PDFFilePath + "')";


                string result = "false";
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
                            result = "true";
                        }
                        dr.Close();
                        conn.Close();
                    }
                }

            }
            catch (Exception ex)
            {
                string Error = ex.ToString();
                string body = "Error: " + Error + "<br>" +
                " FileName :" + FileName + "<br>" +
                " FilePath :" + FilePath + "<br>" +
                " Author :" + Author + "<br>" +
                " LastModified :" + LastModified + "<br>" +
                " Editor :" + Editor + "<br>" +
                " Title :" + Title + "<br>" +
                " Approver :" + RelatedDocIds + "<br>";
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp PoliciesRelatedDocuments Upload", body);
                listreturn.Add(body);

            }
            return listreturn;

        }
        public static List<string>  delete (string id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            List<string> listreturn = new List<string>();
            string result = "false";
            List<SingleItem> RelatedDoc = GetPolicies(id, "", "", "", "", "");
            try
            {

                DB = "DELETE FROM [dbo].[PoliciesRelatedDocuments] Where Id = " + id;


                
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
                        if (dr.RecordsAffected == 1)
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
                    string FileName = RelatedDoc[0].Fields.FileName;
                    string Folder = "";
                    if (RelatedDoc[0].Fields.FilePath.IndexOf("RelatedDocs") >= 0)
                    {
                        Folder = "RelatedDocs";
                    }
                    string getEx = Path.GetExtension(FileName);
                    string TempName = FileName.Replace(getEx, "");
                    CustomApps.Pnp.Library.DeleteFile(FileName, Folder);
                    CustomApps.Pnp.Library.DeleteFile(TempName + ".pdf", Folder);
                }

            }catch(Exception Ex)
            {
                string body = Ex.ToString() + id;

                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);
                listreturn.Add(body);
            }
            listreturn.Add(result);
            return listreturn;
        }
        public static List<string> UploadRelatedDocToSever(HttpPostedFileBase file, string PolicyFolder, string FileName, string username, string id)
        {
            string FilePath = "";
            string PDFFilePath = "";
            string list = "";
            string SharepointFilePath = "";
            string DocumentContents = "";
            string SharepointId = "";
            username = username.Replace("GHVHS\\", "");
            List<string> result = new List<string>();
            var timestamp = DateTime.Now.ToFileTime();
            string timeStampNow = timestamp.ToString();
            List<string> getUserData = SQL.Pnp.GetUser("", "", "", username);
            string getEx = Path.GetExtension(FileName);
            string TempName = FileName.Replace(getEx, "");
            TempName = TempName.Replace("'", "");
            FileName = TempName +"_"+ timeStampNow + getEx;

            try
            {

                string mainPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/");
                string Folder = "";
                if (String.IsNullOrEmpty(id) == false)
                {
                    Folder = "RelatedDocs";
                   
                    FilePath = Library.UploadFile(file, FileName, mainPath, Folder);
                    if (FileName.IndexOf(".pdf") < 0 || FileName.IndexOf(".PDF") < 0)
                    {
                        if (FileName.IndexOf(".xslx") >= 0 || FileName.IndexOf(".xls") >= 0)
                        {
                            PDFFilePath = Library.CreateExcelToPDF(FilePath, mainPath, Folder);
                        }else if (FileName.IndexOf(".ppt") >= 0)
                        {
                            PDFFilePath = Library.CreatePowerPointToPDF(FilePath, mainPath, Folder);
                        }
                        else
                        {
                            PDFFilePath = Library.CreatePDF(FilePath, mainPath, Folder);
                        }
                            
                    }
                    else
                    {
                        PDFFilePath = FilePath;
                    }
                    if (String.IsNullOrEmpty(id) == true)
                    {

                        //SharepointId = Library.UploadFileToSharepoint(list, username, "N", FilePath, FileName, "", "");
                    }
                    SharepointFilePath = "http://sharepoint/sites/Policies/" + list + "/" + FileName;
                    DocumentContents = Library.getFileContents(PDFFilePath);
                    if (String.IsNullOrEmpty(Folder) == true)
                    {
                        Folder = "Policies";
                    }
                    string linkPath = "/img/" + Folder + "/" + FileName;
                    string getEx2 = Path.GetExtension(FileName);
                    string TempName2 = FileName.Replace(getEx2, ".pdf");
                    string linkPDFPath = "/img/" + Folder + "/" + TempName2;
                    
                    CustomApps.Pnp.PoliciesRelatedDocuments.AddRelatedDoc(FileName, linkPath, username, "CURRENT_TIMESTAMP", username, FileName, "", "",
                            DocumentContents, linkPDFPath);
                    SharepointId = CustomApps.Pnp.Library.SetNewRelatedDoc(id, FileName, username);
                    
                }else
                {
                    result.Add("Error creating Policy Entry");
                }
                result.Add(SharepointId);
            }
            catch (Exception Ex)
            {
                string Error = Ex.ToString();
                string body = "Error: " + Error + "<br>" +
                " PolicyFolder :" + PolicyFolder + "<br>" +
                " FileName :" + FileName + "<br>" +
                " FilePath :" + FilePath + "<br>" +
                " SharepointFilePath :" + SharepointFilePath + "<br>" +
                " PDFFilePath :" + PDFFilePath + "<br>" +
                " DocumentContents :" + DocumentContents + "<br>";
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);

                result.Add(body);
            }

            return result;
        }




    }
}