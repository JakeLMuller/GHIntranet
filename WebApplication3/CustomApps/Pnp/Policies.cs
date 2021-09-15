using System;
using System.Collections.Generic;
using System.Web;
using System.Configuration;
using System.Data.SqlClient;
using WebApplication3.Models;
using System.IO;
using System.Globalization;
using WebApplication3.SharePointApi;

namespace WebApplication3.CustomApps.Pnp
{
    public class Policies
    {
        public static Boolean VerifiyName(string FileName)
        {
            string getEx = Path.GetExtension(FileName);
            string baseName = FileName.Replace(getEx, "");
            baseName = baseName.Replace("'", "");
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            Boolean result = false;
            string DB = "";

            DB = "Select * From [dbo].[vw_Policies] p ";

            DB += " Where FileName like '%" + baseName + "%'";

            String commandText = DB;

            using (SqlConnection conn = new SqlConnection(connectionString))
            {
                SqlCommand cmd = new SqlCommand(commandText, conn);
                conn.Open();

                SqlDataReader dr = cmd.ExecuteReader();
                if (dr.HasRows)
                {
                    result = true;


                }

                dr.Close();
                conn.Close();
            }
            return result;

        }
        public static List<SingleItem> GetPolicies(string Id, string SharepointId, string list, string Search, string Department, string SearchBy, string order, string location = "", string Category = "", string Author = "", string AddFilter = "", string PageNumber = "")
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "SELECT p.Id,p.PolicyNumber,p.PolicyFolder," +
            " p.SharepointId, p.FileName, p.FilePath, " +
            " p.Author, p.LastModified, p.Editor, " +
            " p.Title, p.Category, Locations.Name As Location, " +
            " Departments.Name As Department, p.DepartmentPolicyNumber, " +
            " p.DocumentContents, p.SharepointFilePath, " +
            " p.PDFFilePath, p.Concurrers, p.Approver, " +
            " p.CheckedOut, p.CreatedOn, p.DueDate, " +
            " p.AutoApprove, p.RelatedDocs " +
            " FROM [dbo].[vw_Policies] p " +
                 " Inner Join [dbo].[Departments] " +
                 " On p.DepartmentID = Departments.ID " +
                 " Inner Join [dbo].[Locations] " +
                 " On p.LocationID = Locations.ID  ";
            int count = 0;
            if (String.IsNullOrEmpty(AddFilter) == false)
            {
                AddtoQuery += AddFilter;
            }
            if (String.IsNullOrEmpty(SharepointId) == false)
            {
                Id = SharepointId;
                SharepointId = "";
            }
            if (String.IsNullOrEmpty(Id) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " p.Id = " + Id;
            }

            if (String.IsNullOrEmpty(Category) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " p.Category = '" + Category + "'";
            }
            if (String.IsNullOrEmpty(location) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " p.LocationID = '" + location + "'";
            }
            if (String.IsNullOrEmpty(SharepointId) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " p.SharepointId = " + SharepointId;
            }
            if (String.IsNullOrEmpty(list) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " p.PolicyFolder = '" + list + "'";

            }
            if (String.IsNullOrEmpty(Department) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;


                if (Department.IndexOf('|') >= 0)
                {

                    /*string[] splitSearch = Department.Split('|');
                    string TempAddToQueryString = "";
                    string newAddToQuery = "";
                    for (int i = 0; i < splitSearch.Length; i++)
                    {
                        if (splitSearch[i] != "")
                        {
                            AddtoQuery = AddtoQuery.Replace("Where", "And");


                            if (TempAddToQueryString != "")
                            {
                                TempAddToQueryString = " or Policies.DepartmentID = " + splitSearch[i] + " " + AddtoQuery;

                            }
                            else
                            {
                                TempAddToQueryString = " Where Policies.DepartmentID = " + splitSearch[i] + " " + AddtoQuery;
                            }
                            newAddToQuery += TempAddToQueryString;
                        }
                    }*/
                    Department = Department.Replace('|', ',');
                    AddtoQuery += subString + " p.DepartmentID In (" + Department + ") ";
                } else
                {
                    AddtoQuery += subString + " p.DepartmentID = " + Department;
                }
            }

            if (String.IsNullOrEmpty(Search) == false)
            {
                if (String.IsNullOrEmpty(SearchBy) == false)
                {
                    if (SearchBy == "DepartmentID")
                    {
                        if (String.IsNullOrEmpty(AddtoQuery) == false)
                        {

                            if (Search.IndexOf(',') >= 0)
                            {

                                string[] splitSearch = Search.Split(',');
                                string TempAddToQueryString = "";
                                string newAddToQuery = "";
                                for (int i = 0; i < splitSearch.Length; i++)
                                {
                                    if (splitSearch[i] != "")
                                    {
                                        AddtoQuery = AddtoQuery.Replace("Where", "And");


                                        if (TempAddToQueryString != "")
                                        {

                                            TempAddToQueryString = " or p." + SearchBy + " = " + splitSearch[i] + " " + AddtoQuery;

                                        } else
                                        {
                                            TempAddToQueryString = " Where p." + SearchBy + " = " + splitSearch[i] + " " + AddtoQuery;
                                        }
                                        newAddToQuery += TempAddToQueryString;
                                    }
                                }
                                AddtoQuery = newAddToQuery;
                            }
                            else
                            {
                                AddtoQuery += " And p." + SearchBy + " = " + Search;
                            }
                        }
                        else
                        {
                            AddtoQuery += " Where p." + SearchBy + " = " + Search;
                        }
                    } else
                    {
                        if (String.IsNullOrEmpty(AddtoQuery) == false)
                        {
                            AddtoQuery += " And p." + SearchBy + " like '%" + Search + "%' ";
                        }
                        else
                        {
                            AddtoQuery += " Where p." + SearchBy + " like '%" + Search + "%' ";
                        }
                    }

                }
                else
                {
                    if (String.IsNullOrEmpty(AddtoQuery) == false)
                    {
                        AddtoQuery = AddtoQuery.Replace("Where", "And");
                        string TempAddToQueryString = "";
                        TempAddToQueryString = " Where p.FileName like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or p.Author like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or p.Title like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or p.DocumentContents like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or p.PolicyNumber like '%" + Search + "%' " + AddtoQuery;
                        AddtoQuery = TempAddToQueryString;
                    }
                    else
                    {
                        AddtoQuery = " Where p.FileName like '%" + Search + "%'";
                        AddtoQuery += " Or p.Author like '%" + Search + "%'";
                        AddtoQuery += " Or p.Title like '%" + Search + "%'";
                        AddtoQuery += " Or p.DocumentContents like '%" + Search + "%'";
                        AddtoQuery += " Or p.PolicyNumber like '%" + Search + "%'";
                    }
                }
            }

            if (String.IsNullOrEmpty(Author) == false)
            {
                string accountFor = "";
                string subString = " Where";
                if (String.IsNullOrEmpty(AddtoQuery) == true)
                {

                    if (count > 0)
                    {
                        subString = " And";
                    }
                } else
                {
                    subString = " Or ";
                    if (String.IsNullOrEmpty(list) == false)
                    {
                        accountFor = " and  p.PolicyFolder = '" + list + "'";

                    }
                }
                count++;

                AddtoQuery += subString + " p.Author = '" + Author + "'" + accountFor;

            }
            if (String.IsNullOrEmpty(order) == false)
            {
                AddtoQuery += " Order by " + order;
            } else
            {
                AddtoQuery += " Order by  LastModified Desc";

            }
            if (String.IsNullOrEmpty(PageNumber) == false)
            {
                int page = Int32.Parse(PageNumber);
                if (page == 1)
                {
                    page = 0;
                }
                int totalOffset = page * 30;
                AddtoQuery += " OFFSET " + totalOffset + " ROWS  FETCH NEXT 30 ROWS ONLY";
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
                                PolicyNumber = dr["PolicyNumber"].ToString(),
                                PolicyFolder = dr["PolicyFolder"].ToString(),
                                SharepointId = dr["Id"].ToString(),
                                FileName = dr["FileName"].ToString(),
                                FilePath = dr["FilePath"].ToString(),
                                Author = dr["Author"].ToString(),
                                LastModified = dr["LastModified"].ToString(),
                                Editor = dr["Editor"].ToString(),
                                Title = dr["Title"].ToString(),
                                CheckedOut = dr["CheckedOut"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString(),
                                DueTime = dr["DueDate"].ToString(),
                                AutoApprove = dr["AutoApprove"].ToString(),
                                Category = dr["Category"].ToString(),
                                Location = dr["Location"].ToString(),
                                Department = dr["Department"].ToString(),
                                DocumentContents = dr["DocumentContents"].ToString(),
                                SharepointFilePath = dr["SharepointFilePath"].ToString(),
                                PDFFilePath = dr["PDFFilePath"].ToString(),
                                Concurrers = dr["Concurrers"].ToString(),
                                Approver = dr["Approver"].ToString(),
                                RelatedDocs = dr["RelatedDocs"].ToString()
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
        public static string returnUserNames(string users)
        {
            string[] splitUsers = users.Split(';');
            string returnValue = "";
            for (int i = 0; i < splitUsers.Length; i++)
            {
                if (splitUsers[i] != "")
                {
                    var user = CustomApps.Pnp.MetaData.getUsers(splitUsers[i], "", "", "", "", "");
                    returnValue += user[0].Fields.DisplayName + ";";
                }
            }
            return returnValue;
        }
        public static List<string> UploadFileToServer(HttpPostedFileBase file, string PolicyFolder, string FileName, string username, string id)
        {
            string FilePath = "";
            string PDFFilePath = "";
            string list = "";
            string SharepointFilePath = "";
            string DocumentContents = "";
            string SharepointId = "";
            username = username.Replace("GHVHS\\", "");
            FileName = FileName.Replace("'", "");
            List<string> result = new List<string>();

            List<string> getUserData = SQL.Pnp.GetUser("", "", "", username);
            if (PolicyFolder == "Approved")
            {
                list = "Approved%20Policies";
            }
            else
            {
                list = PolicyFolder + "Policies";
            }

            try
            {

                string mainPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/");
                string Folder = "";
                if (String.IsNullOrEmpty(id) == false)
                {
                    if (PolicyFolder != "PoliciesRelatedDocuments")
                    {
                        string getEx = Path.GetExtension(FileName);
                        string TempName = FileName.Replace(getEx, "");
                        FileName = TempName + "_" + id + getEx.ToLower();
                    } else
                    {
                        Folder = "RelatedDocs";
                    }
                    FilePath = Library.UploadFile(file, FileName, mainPath, Folder);
                    string UseInHouseConverstion = System.Configuration.ConfigurationSettings.AppSettings.Get("PnpPDFConverstion");
                    if (UseInHouseConverstion == "Y")
                    {
                        if (FileName.IndexOf(".pdf") < 0 || FileName.IndexOf(".PDF") < 0)
                        {
                            PDFFilePath = Library.CreatePDF(FilePath, mainPath, Folder);
                        }
                        else
                        {
                            PDFFilePath = FilePath;
                        }
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

                    if (PolicyFolder == "PoliciesRelatedDocuments") {
                        CustomApps.Pnp.PoliciesRelatedDocuments.AddRelatedDoc(FileName, linkPath, username, "CURRENT_TIMESTAMP", username, FileName, "", "",
                              DocumentContents, linkPDFPath);
                        SharepointId = CustomApps.Pnp.Library.SetNewRelatedDoc(id, FileName, username);
                    } else {

                        List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", FileName, linkPath, "", "CURRENT_TIMESTAMP", username, "",
                        "", "clear", "", "", "", "", "", "", DocumentContents, "", linkPDFPath, "", "", id, "");
                    }
                } else
                {
                    List<string> temp = AddPolicy(PolicyFolder, "", "", "", username, "CURRENT_TIMESTAMP", username, "", "", "", "CURRENT_TIMESTAMP", "",
                           "", "", "", "", "", "", "", "", "", "");
                    if (temp.Count == 2 && temp[0] == "true")
                    {
                        SharepointId = temp[1];
                        string getEx = Path.GetExtension(FileName);
                        string TempName = FileName.Replace(getEx, "");
                        FileName = TempName + "_" + SharepointId + getEx.ToLower();
                        FilePath = Library.UploadFile(file, FileName, mainPath, "");
                        string UseInHouseConverstion = System.Configuration.ConfigurationSettings.AppSettings.Get("PnpPDFConverstion");
                        if (UseInHouseConverstion == "Y")
                        {
                            if (FileName.IndexOf(".pdf") < 0 || FileName.IndexOf(".PDF") < 0)
                            {
                                PDFFilePath = Library.CreatePDF(FilePath, mainPath, "");
                            }
                            else
                            {
                                PDFFilePath = FilePath;
                            }
                        }
                        SharepointFilePath = "http://sharepoint/sites/Policies/" + list + "/" + FileName;
                        DocumentContents = Library.getFileContents(FilePath);
                        string linkPath = "/img/Policies/" + FileName;
                        string getEx2 = Path.GetExtension(FileName);
                        string TempName2 = FileName.Replace(getEx2, ".pdf");
                        string linkPDFPath = "/img/Policies/" + TempName2;

                        List<string> temp2 = UpdatePolicy(SharepointId, PolicyFolder, FileName, linkPath, username, "CURRENT_TIMESTAMP", username, FileName,
                            "", "", "", "", "", "", "", "", DocumentContents, "", linkPDFPath, "", "", SharepointId, "");
                        if (PolicyFolder == "Draft") {
                            SendEmail.SendEmail.NewUpload(FileName, "http://garnetinfo/Pnp/Policy/" + SharepointId, username);
                        }
                    } else
                    {
                        result.Add("Error creating Policy Entry");
                    }

                }
                result.Add(SharepointId);


            }
            catch (Exception Ex)
            {
                string Error = Ex.ToString();
                string body = "Error: " + Error + "<br>" +
                " PolicyFolder :" + PolicyFolder + "<br>" +
                " Username :" + username + "<br>" +
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
        public static List<string> AddPolicy(string PolicyFolder, string SharepointId, string FileName, string FilePath, string Author, string LastModified, string Editor, string Title,
            string Concurrer, string CheckedOut, string CreatedOn, string DueTime, string AutoApprove, string Category, string Location, string Department,
            string DocumentContents, string SharepointFilePath, string PDFFilePath, string Concurrers, string Approver, string RelatedDocs)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string id = "";
            List<string> listreturn = new List<string>();

            try
            {
                if (String.IsNullOrEmpty(Department) == true)
                {
                    Department = "1";
                }
                if (String.IsNullOrEmpty(Category) == true)
                {
                    Category = "Unspecified";
                }
                if (String.IsNullOrEmpty(DueTime) == true)
                {
                    DueTime = "NULL";
                }
                if (String.IsNullOrEmpty(Location) == true)
                {
                    Location = "4";
                }
                DB = " INSERT INTO [dbo].[Policies] " +
                "([PolicyFolder]  ,[FileName] ,[FilePath] ,[Author] ,[LastModified]  ,[Editor] ,[Title] ,[CheckedOut]" +
               " ,[CreatedOn] ,[DueDate] ,[AutoApprove] ,[Category] ,[LocationID] ,[DepartmentID] ,[DocumentContents],[SharepointFilePath]" +
               ",[PDFFilePath],[Concurrers],[Approver])" +
                "VALUES "
               + "('" + PolicyFolder + "'  ,'" + FileName + "' ,'" + FilePath + "','" + Author + "'"
               + " ," + LastModified + " ,'" + Editor + "' ,'" + Title + "'"
               + " ,'" + CheckedOut + "' ," + CreatedOn + "," + DueTime + ",'" + AutoApprove + "'"
               + " ,'" + Category + "' ," + Location + " ," + Department + " ,'" + Library.MySqlEscape(DocumentContents) + "'"
               + ",'' ,'" + PDFFilePath + "' ,'" + Concurrers + "','" + Approver + "'); SELECT CAST(scope_identity() AS int)";


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
                        int tempId = (int)cmd.ExecuteScalar();
                        id = tempId.ToString();
                        if (String.IsNullOrEmpty(id) == false)
                        {

                            result = "true";

                        }
                        conn.Close();
                    }
                }
                string link = "http://garnetinfo/Pnp/Policy/" + SharepointId;


                listreturn.Add(result);
                listreturn.Add(id);

            }
            catch (Exception ex)
            {
                string Error = ex.ToString();
                string body = "Error: " + Error + "<br>" +
                " PolicyFolder :" + PolicyFolder + "<br>" +
                " FileName :" + FileName + "<br>" +
                " FilePath :" + FilePath + "<br>" +
                " Author :" + Author + "<br>" +
                " LastModified :" + LastModified + "<br>" +
                " Editor :" + Editor + "<br>" +
                " Title :" + Title + "<br>" +
                " Concurrer :" + Concurrer + "<br>" +
                " Category :" + Category + "<br>" +
                " Location :" + Location + "<br>" +
                " Department :" + Department + "<br>" +
                " SharepointFilePath :" + SharepointFilePath + "<br>" +
                " PDFFilePath :" + PDFFilePath + "<br>" +
                " Concurrers :" + Concurrers + "<br>" +
                " Approver :" + Approver + "<br>";
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);
                listreturn.Add(body);

            }
            return listreturn;

        }

        public static List<string> UpdatePolicy(string id, string PolicyFolder, string FileName, string FilePath, string Author, string LastModified, string Editor, string Title,
            string Concurrer, string CheckedOut, string CreatedOn, string DueDate, string AutoApprove, string Category, string Location, string Department,
            string DocumentContents, string SharepointFilePath, string PDFFilePath, string Concurrers, string Approver, string SharepointId, string RelatedDocs)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string value = "";
            string list = "";
            List<string> listreturn = new List<string>();
            int count = 1;
            List<SingleItem> getDocData = CustomApps.Pnp.Policies.GetPolicies("", SharepointId, "", "", "", "", "");
            string ConcurrersOld = getDocData[0].Fields.Concurrers;
            if (Concurrers == ConcurrersOld)
            {
                Concurrers = "";
            } else
            {
                //string DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(SharepointId);
                //string DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(SharepointId);
            }
            string[] paramValues = {  PolicyFolder, FileName , FilePath, Author, LastModified, Editor, Title,  CheckedOut, CreatedOn, DueDate, AutoApprove,
            Category, Location, Department, DocumentContents, SharepointFilePath, PDFFilePath, Concurrers, Approver, RelatedDocs};
            string[] paramLabels = {  "PolicyFolder", "FileName" , "FilePath", "Author", "LastModified", "Editor", "Title",  "CheckedOut", "CreatedOn",
                "DueDate", "AutoApprove","Category", "LocationID", "DepartmentID", "DocumentContents", "SharepointFilePath", "PDFFilePath", "Concurrers", "Approver", "RelatedDocs"};
            DB = "UPDATE [dbo].[Policies] SET ";
            if (PolicyFolder == "Approved")
            {
                list = "Approved%20Policies";
            }
            else
            {
                list = PolicyFolder + "Policies";
            }
            if (String.IsNullOrEmpty(SharepointId) == false)
            {

                for (var i = 0; i < paramValues.Length; i++)
                {
                    if (String.IsNullOrEmpty(paramValues[i]) == false)
                    {
                        string toAddComma = " ";
                        if (count > 1)
                        {
                            toAddComma = " ,";
                        }
                        if (paramLabels[i] == "DocumentContents" && paramValues[i] == "Y")
                        {
                            value = "'" + Library.MySqlEscape(Library.getFileContents(FilePath)) + "'";

                        }
                        else if (paramLabels[i] == "Concurrers")
                        {
                            value = "'" + paramValues[i] + "'";
                            if (paramValues[i] == "Null")
                            {
                                string DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(SharepointId);
                                string checkApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(SharepointId);
                                value = "''";
                                Concurrers = "";
                            }
                        }
                        else if (paramLabels[i] == "RelatedDocs")
                        {
                            if (paramValues[i] == "Null")
                            {
                                value = "''";
                            } else
                            {
                                value = "'" + paramValues[i] + "'";
                            }
                        }
                        else if (paramLabels[i] == "CheckedOut" && paramValues[i] == "clear")
                        {
                            value = "''";
                        }
                        else if (paramLabels[i] == "LastModified" || paramLabels[i] == "DueDate")
                        {
                            value = Library.MySqlEscape(paramValues[i]);
                        }
                        else if (paramLabels[i] == "DepartmentID")
                        {
                            //List<MetaDataList> temp = MetaData.getMetaData(, "", "", "", "Departments");
                            string idForName = paramValues[i];
                            value = Library.MySqlEscape(idForName);
                        }
                        else if (paramLabels[i] == "LocationID")
                        {
                            value = paramValues[i];
                        }
                        else if (paramLabels[i] == "Approver")
                        {
                            value = "'" + paramValues[i] + "'";
                            if (paramValues[i] == "Null")
                            {
                                string DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(SharepointId);
                                value = "''";
                            }
                            else
                            {
                                if (String.IsNullOrEmpty(Concurrers) == true)
                                {
                                    bool check = Library.checkOnConcurrence(paramValues[i], SharepointId);
                                    if (check == true) {
                                        string DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(SharepointId);
                                        List<string> Add = Library.AddApproval(paramValues[i], SharepointId);
                                    }
                                }

                            }
                        }
                        else
                        {
                            value = "'" + Library.MySqlEscape(paramValues[i]) + "'";
                        }
                        count++;
                        AddtoQuery += toAddComma + "[" + paramLabels[i] + "] = " + value;
                    }
                }

                AddtoQuery += " Where Id = " + SharepointId;
                string result = "false";
                try
                {
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
                            dr.Read();
                            if (dr.RecordsAffected > 0)
                            {

                                int counted = dr.FieldCount;
                                result = "true";
                            }
                            dr.Close();
                            conn.Close();
                        }
                        if (result == "true" && String.IsNullOrEmpty(Concurrers) == false)
                        {
                            string DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(SharepointId);
                            string checkApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(SharepointId);
                            string OkayOnEmails = Library.CreateAndEmailforConcurence(Concurrers, FileName, Author, SharepointId, list);
                            listreturn.Add(result);
                            listreturn.Add("Emails Sent");

                        }
                        listreturn.Add(result);

                    }
                }
                catch (Exception ex)
                {
                    string Error = ex.ToString();
                    string body = "Error: " + Error + "<br>" +
                    " PolicyFolder :" + PolicyFolder + "<br>" +
                    " FileName :" + FileName + "<br>" +
                    " FilePath :" + FilePath + "<br>" +
                    " Author :" + Author + "<br>" +
                    " LastModified :" + LastModified + "<br>" +
                    " Editor :" + Editor + "<br>" +
                    " Title :" + Title + "<br>" +
                    " Concurrer :" + Concurrer + "<br>" +
                    " Category :" + Category + "<br>" +
                    " Location :" + Location + "<br>" +
                    " Department :" + Department + "<br>" +
                    " SharepointFilePath :" + SharepointFilePath + "<br>" +
                    " PDFFilePath :" + PDFFilePath + "<br>" +
                    " Concurrers :" + Concurrers + "<br>" +
                    " Approver :" + Approver + "<br>" +
                    " <br> <br> <br>" + DB + AddtoQuery;
                    SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);
                    listreturn.Add(body);
                }
            } else
            {
                listreturn.Add("No SharePoint Id");
            }
            return listreturn;
        }

        public static List<string> Delete(string id)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            List<string> listreturn = new List<string>();
            string result = "false";
            List<SingleItem> Doc = GetPolicies(id, "", "", "", "", "", "");
            string FileName = Doc[0].Fields.FileName;
            if (String.IsNullOrEmpty(id) == false)
            {
                try
                {

                    DB = "DELETE FROM [dbo].[Policies] Where Id = " + id;



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
                    string DeleteFileHistory = CustomApps.Pnp.FileHistory.Delete("", id);
                    string DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(id);
                    string DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(id);
                    string getEx = Path.GetExtension(FileName);
                    string TempName = FileName.Replace(getEx, "");
                    CustomApps.Pnp.Library.DeleteFile(FileName, "");
                    CustomApps.Pnp.Library.DeleteFile(TempName + ".pdf", "");
                }
                catch (Exception Ex)
                {
                    string body = Ex.ToString() + id;

                    SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp Policy Upload", body);
                    listreturn.Add(body);
                }
            } else
            {
                result = "Missing Id";
            }

            listreturn.Add(result);
            return listreturn;
        }
        public static List<SingleItem> GetTransferUserPolicies(string olderUser, string newUser, string department, string Role, string PolicyFolder)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            List<SingleItem> ResultArray = new List<SingleItem>();
            List<string> returnList = new List<string>();
            string result = "false";
            int count = 0;
            string ids = "";
            string subString = " Where";
            string queryVars = "DECLARE @NewUser varchar(max) = '" + newUser + "';" +
                  " DECLARE @OldUser varchar(max) = '" + olderUser + "';";
            string DB = queryVars + " SELECT * FROM Policies ";
           
                    if (String.IsNullOrEmpty(Role) == false)
                    {
                        if (Role == "approver")
                        {
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Approver like @OldUser";
                        }
                        else if (Role == "concurrer")
                        {
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Concurrers like @OldUser";

                        }
                        else if (Role == "all")
                        {
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Approver like @OldUser";
                        }
                    }
                    if (String.IsNullOrEmpty(department) == false)
                    {
                        if (count > 0)
                        {
                            subString = " And ";
                        }
                        count++;
                        AddtoQuery += subString + "  DepartmentID = " + department;
                    }
                    if (String.IsNullOrEmpty(PolicyFolder) == false)
                    {
                        if (PolicyFolder != "All")
                        {
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  PolicyFolder = '" + PolicyFolder + "'";
                        }
                    }
                    DB = DB + AddtoQuery;

                    if (DB != "")
                    {
                        String commandText = DB;



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
                                        PolicyNumber = dr["PolicyNumber"].ToString(),
                                        PolicyFolder = dr["PolicyFolder"].ToString(),
                                        SharepointId = dr["Id"].ToString(),
                                        FileName = dr["FileName"].ToString(),
                                        FilePath = dr["FilePath"].ToString(),
                                        Author = dr["Author"].ToString(),
                                        LastModified = dr["LastModified"].ToString(),
                                        Editor = dr["Editor"].ToString(),
                                        Title = dr["Title"].ToString(),
                                        CheckedOut = dr["CheckedOut"].ToString(),
                                        CreatedOn = dr["CreatedOn"].ToString(),
                                        DueTime = dr["DueDate"].ToString(),
                                        AutoApprove = dr["AutoApprove"].ToString(),
                                        Category = dr["Category"].ToString(),
                                        Department = dr["DepartmentID"].ToString(),
                                        DocumentContents = dr["DocumentContents"].ToString(),
                                        SharepointFilePath = dr["SharepointFilePath"].ToString(),
                                        PDFFilePath = dr["PDFFilePath"].ToString(),
                                        Concurrers = dr["Concurrers"].ToString(),
                                        Approver = dr["Approver"].ToString(),
                                        RelatedDocs = dr["RelatedDocs"].ToString()
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





        public static List<string> TransferUser(string olderUser, string newUser, string department, string Role, string PolicyFolder)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            List<string> returnList = new List<string>();
            string result = "false";
            int count = 0;
            string ids = "";
            string queryVars = "DECLARE @NewUser varchar(max) = '" + newUser + "';" +
                        " DECLARE @OldUser varchar(max) = '" + olderUser + "';";
            string subString = " Where";
            string selectStatement = " SELECT Id FROM Policies ";
            string DB = 
                        " UPDATE [dbo].[Policies]" +
                        " SET ";
            List<AllUsers> newU = MetaData.getUsers(newUser, "", "", "", "", "");
            List<AllUsers> OldU = MetaData.getUsers(olderUser, "", "", "", "", "");
            if (OldU.Count > 0 && newU.Count > 0)
            {
                if (String.IsNullOrEmpty(olderUser) == false && String.IsNullOrEmpty(newUser) == false)
                {
                    if (String.IsNullOrEmpty(Role) == false)
                    {
                        if (Role == "approver")
                        {
                            DB += " [Approver] = REPLACE([Approver], @OldUser, @NewUser) ";
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Approver like @OldUser";
                        }
                        else if (Role == "concurrer")
                        {
                            DB += " [Concurrers] = REPLACE([Concurrers], @OldUser, @NewUser) ";
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Concurrers like @OldUser";

                        }
                        else if (Role == "all")
                        {
                            DB += " [Approver] = REPLACE([Approver], @OldUser, @NewUser), ";
                            DB += " [Concurrers] = REPLACE([Concurrers], @OldUser, @NewUser) ";
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  Approver like @OldUser";
                        }
                    }
                    if (String.IsNullOrEmpty(department) == false)
                    {
                        if (count > 0)
                        {
                            subString = " And ";
                        }
                        count++;
                        AddtoQuery += subString + "  DepartmentID = " + department;
                    }
                    if (String.IsNullOrEmpty(PolicyFolder) == false)
                    {
                        if (PolicyFolder != "All")
                        {
                            if (count > 0)
                            {
                                subString = " And ";
                            }
                            count++;
                            AddtoQuery += subString + "  PolicyFolder = '" + PolicyFolder + "'";
                        }
                    }
                    selectStatement += AddtoQuery + "; ";
                    DB = queryVars + selectStatement + DB + AddtoQuery;
                    try
                    {



                        if (DB != "")
                        {
                            String commandText = DB;
                           


                            using (SqlConnection conn = new SqlConnection(connectionString))
                            {
                                SqlCommand cmd = new SqlCommand(commandText, conn);
                                conn.Open();

                                SqlDataReader dr = cmd.ExecuteReader();
                               
                                   
                                    if (dr.HasRows)
                                    {
                                        result = "true";
                                        while (dr.Read())
                                        {
                                            ids += dr["Id"].ToString() + ", ";
                                        };
                                    }
                                
                                dr.Close();
                                conn.Close();
                            }
                        }
                        if (String.IsNullOrEmpty(ids) == false)
                        {
                            if (String.IsNullOrEmpty(Role) == false)
                            {
                                if (Role == "approver")
                                {
                                    CustomApps.Pnp.Approvers.TransferApprovers(olderUser, newUser, ids);
                                }
                                else if (Role == "concurrer")
                                {
                                    CustomApps.Pnp.Concurrence.TransferConcurences(newUser, olderUser, ids);
                                    CustomApps.Pnp.Concurrence.TransferDiscussions(newUser, olderUser, ids);

                                }
                                else if (Role == "all")
                                {
                                    CustomApps.Pnp.Approvers.TransferApprovers(newUser, olderUser, ids);
                                    CustomApps.Pnp.Concurrence.TransferConcurences(newUser, olderUser, ids);
                                    CustomApps.Pnp.Concurrence.TransferDiscussions(newUser, olderUser, ids);
                                }
                            }
                        }else
                        {
                            result = "No Policies where found with " + olderUser + " As a " + Role + " in the Department " + department;
                        }

                    }
                    catch (Exception Ex)
                    {
                        string body = Ex.ToString() + DB;
                        result = "false";
                        SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error From Pnp User Tansfer", body);
                        returnList.Add(body);
                    }
                }
                else
                {
                    result = "Missing New or older user to Transfer";
                }
            }else
            {
                result = "Invalid Users no found.";
            }
            returnList.Add(result);
            return returnList;
        }

    }
}