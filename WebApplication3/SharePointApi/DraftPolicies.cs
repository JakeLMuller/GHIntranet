using System;
using System.Collections.Generic;
using System.Configuration;
using System.Data.SqlClient;
using System.Linq;
using System.Web;

namespace WebApplication3.SharePointApi
{
    public class DraftPolicies
    {
        public static List<SingleItem> GetPolicies(string Id, string list,  string Search, string Department, string SearchBy, string order)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";

            DB = "Select * From [PNP].[dbo].[DraftPolicies]";
            int count = 0;
            if (String.IsNullOrEmpty(Id) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Id = " + Id;
            }
            if (String.IsNullOrEmpty(Department) == false)
            {
                string subString = " Where";
                if (count > 0)
                {
                    subString = " And";
                }
                count++;
                AddtoQuery += subString + " Department = " + Department;
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
                        TempAddToQueryString += " Or Title like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or Category like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or DocumentContents like '%" + Search + "%' " + AddtoQuery;
                        TempAddToQueryString += " Or Location like '%" + Search + "%' " + AddtoQuery;
                    }
                    else
                    {
                        AddtoQuery = " Where FileName like '%" + Search + "%'";
                        AddtoQuery += " Or Author like '%" + Search + "%'";
                        AddtoQuery += " Or Title like '%" + Search + "%'";
                        AddtoQuery += " Or Category like '%" + Search + "%'";
                        AddtoQuery += " Or DocumentContents like '%" + Search + "%'";
                        AddtoQuery += " Or Location like '%" + Search + "%'";
                    }
                }
            }
            if (String.IsNullOrEmpty(order) == false)
            {
                AddtoQuery += "Order by " + order;
            }
            SingleItem newEntry = new SingleItem();
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
                           
                            
                            Fields fields = new Fields()
                            {
                                Id = dr["Id"].ToString(),
                                FileName = dr["FileName"].ToString(),
                                FilePath = dr["FilePath"].ToString(),
                                Author = dr["Author"].ToString(),
                                LastModified = dr["LastModified"].ToString(),
                                Editor = dr["Editor"].ToString(),
                                Title = dr["Title"].ToString(),
                                Concurrer = dr["Concurrer"].ToString(),
                                CheckedOut = dr["CheckedOut"].ToString(),
                                CreatedOn = dr["CreatedOn"].ToString(),
                                DueTime = dr["DueTime"].ToString(),
                                AutoApprove = dr["AutoApprove"].ToString(),
                                Category = dr["Category"].ToString(),
                                Location = dr["Location"].ToString(),
                                Department = dr["Department"].ToString(),
                                DocumentContents = dr["DocumentContents"].ToString(),
                                SharepointFilePath = dr["SharepointFilePath"].ToString(),
                                PDFFilePath = dr["PDFFilePath"].ToString(),
                                Concurrers = dr["Concurrers"].ToString(),
                                Approver = dr["Approver"].ToString()
                            };
                            newEntry.Fields.Add(fields);
                            SingleItem.Items.Add(newEntry);
                           


                        }
                    }

                    dr.Close();
                    conn.Close();
                }

               

            }
            return SingleItem.Items;
        }
        public static List<string> AddPolicy(string Id, string PolicyFolder, string FileName, string FilePath, string Author, string LastModified, string Editor, string Title,
            string Concurrer, string CheckedOut, string CreatedOn, string DueTime, string AutoApprove, string Category, string Location, string Department, 
            string DocumentContents, string SharepointFilePath, string PDFFilePath, string Concurrers, string Approver)
        {
            var connectionString = ConfigurationManager.ConnectionStrings["PNPConnection"].ConnectionString;
            string AddtoQuery = "";
            string DB = "";
            string mainPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/");
            string list = "";
            if (PolicyFolder == "Approved")
            {
                list = "Approved%20Policies";
            }else
            {
                list = PolicyFolder + "Policies";
            }

            string SharepointId = Library.UploadFileToSharepoint(list, Author, "N", FilePath, FileName, "", "");
           

            DB = "INSERT INTO [dbo].[Policies] "+
            "( [PolicyFolder] ,[SharepointId] ,[FileName] ,[FilePath] ,[Author] ,[LastModified]  ,[Editor] ,[Title] ,[Concurrer] ,[CheckedOut]" +
           " ,[CreatedOn] ,[DueTime] ,[AutoApprove] ,[Category] ,[Location] ,[Department] ,[DocumentContents],[SharepointFilePath]"+
           ",[PDFFilePath],[Concurrers],[Approver])" +
            "VALUES " 
           +"('" + PolicyFolder + "' ,'" + SharepointId + "' ,'" + FileName + "' ,'" + FilePath + "','" + Author + "'"
           + " ,'" + LastModified + "' ,'" + Editor + "' ,'" + Title + "' ,'" + Concurrer + "'"
           + " ,'" + CheckedOut + "' ,'" + CreatedOn + "','" + DueTime + "','" + AutoApprove + "'"
           + " ,'" + Category + "' ,'" + Location + "' ,'" + Department + "' ,'" + DocumentContents + "'"
           +",'" + SharepointFilePath + "' ,'" + PDFFilePath + "' ,'" + Concurrers + "','" + Approver + "')";

            List<string> listreturn = new List<string>();
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
                        }
                    }
                    dr.Close();
                    conn.Close();
                }
            }
            return listreturn;
        }

        public class Collection
        {
            public static List<Collection> Policies = new List<Collection>();

            public List<SingleItem> SingleItem = new List<SingleItem>();
            public string Id { get; set; }


        }

        public class SingleItem
        {
            public static List<SingleItem> Items = new List<SingleItem>();
            public List<Fields> Fields { get; set; }



        }
        public class Fields
        {
            public string Id { get; set; }
            public string FileName { get; set; }
            public string FilePath { get; set; }
            public string Author { get; set; }
            public string LastModified { get; set; }
            public string Editor { get; set; }
            public string Title { get; set; }
            public string Concurrer { get; set; }
            public string CheckedOut { get; set; }
            public string CreatedOn { get; set; }
            public string DueTime { get; set; }
            public string AutoApprove { get; set; }
            public string Category { get; set; }
            public string Location { get; set; }
            public string Department { get; set; }
            public string DocumentContents { get; set; }
            public string SharepointFilePath { get; set; }
            public string PDFFilePath { get; set; }
            public string Concurrers { get; set; }
            public string Approver { get; set; }
            
        }
    }
}
