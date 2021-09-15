using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using Syncfusion.Pdf;
using Syncfusion.Pdf.Parsing;
using System.Text.RegularExpressions;
using Syncfusion.DocIO.DLS;
using WebApplication3.SharePointApi;
using Syncfusion.DocToPDFConverter;
using Syncfusion.DocIO;
using WebApplication3.Models;
using WebApplication3.Encryption;
using System.Collections;
using Syncfusion.XlsIO;
using Syncfusion.ExcelToPdfConverter;
using Syncfusion.PresentationToPdfConverter;
using Syncfusion.Presentation;

namespace WebApplication3.CustomApps.Pnp
{
    public class Library
    {
        public static byte[] ReadToEnd(System.IO.Stream stream)
        {
            long originalPosition = 0;

            if (stream.CanSeek)
            {
                originalPosition = stream.Position;
                stream.Position = 0;
            }

            try
            {
                byte[] readBuffer = new byte[4096];

                int totalBytesRead = 0;
                int bytesRead;

                while ((bytesRead = stream.Read(readBuffer, totalBytesRead, readBuffer.Length - totalBytesRead)) > 0)
                {
                    totalBytesRead += bytesRead;

                    if (totalBytesRead == readBuffer.Length)
                    {
                        int nextByte = stream.ReadByte();
                        if (nextByte != -1)
                        {
                            byte[] temp = new byte[readBuffer.Length * 2];
                            Buffer.BlockCopy(readBuffer, 0, temp, 0, readBuffer.Length);
                            Buffer.SetByte(temp, totalBytesRead, (byte)nextByte);
                            readBuffer = temp;
                            totalBytesRead++;
                        }
                    }
                }

                byte[] buffer = readBuffer;
                if (readBuffer.Length != totalBytesRead)
                {
                    buffer = new byte[totalBytesRead];
                    Buffer.BlockCopy(readBuffer, 0, buffer, 0, totalBytesRead);
                }
                return buffer;
            }
            finally
            {
                if (stream.CanSeek)
                {
                    stream.Position = originalPosition;
                }
            }
        }
        public static byte[] returnFileData(string url)
        {

            if (url.IndexOf("http") < 0)
            {
                byte[] bytes = System.IO.File.ReadAllBytes(url);
                return bytes;
            }
            else
            {
                //Initialize the input stream
                string[] file = url.Split('/');
                string fileName = file[file.Length - 1];
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                //NetworkCredential cred =  new System.Net.NetworkCredential("jmuller3", "Asstastic!1", "GHVHS");
                req.Credentials = CredentialCache.DefaultCredentials;

                HttpWebResponse resp = (HttpWebResponse)req.GetResponse();

                Stream rs = req.GetResponse().GetResponseStream();
                byte[] fileData = ReadToEnd(rs);
                return fileData;
            }
        }
        public string ApproveFile(string list, string userName, string password, string overwrite, byte[] file, string FileName,
          string AddToItem, string itemId)
        {
            string result = "false";
            result = AddFile.FileToSharepoint(list, userName, password, overwrite, file, FileName, AddToItem, itemId);


            return result;
        }

        public static string getDocumentContent(string pathURL)
        {
            WordDocument document = new WordDocument(pathURL);
            //Gets the document text
            string text = document.GetText();
            document.Close();
            text = text.Replace("Created with a trial version of Syncfusion Essential DocIO.", "");
            /* Microsoft.Office.Interop.Word.Application word = new Microsoft.Office.Interop.Word.Application();
             object miss = System.Reflection.Missing.Value;
             object path = @"" + pathURL;
             object readOnly = true;
             Microsoft.Office.Interop.Word.Document docs = word.Documents.Open(ref path, ref miss, ref readOnly, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss, ref miss);
             string totaltext = "";

             totaltext = docs.Content.Text;
             docs.Close();
             word.Quit();*/
            return Library.MySqlEscape(text);
        }
        public static string getPDFContent(string pathURL)
        {
            PdfLoadedDocument loadedDocument = new PdfLoadedDocument(pathURL);

            //Load the first page.

            PdfPageBase page = loadedDocument.Pages[0];

            //Extract text from first page.

            string extractedText = page.ExtractText();

            //Close the document
            extractedText = extractedText.Replace("Created with a trial version of Syncfusion Essential PDF", "");
            loadedDocument.Close(true);
            return Library.MySqlEscape(extractedText);
        }
        public static string getTextContents(string pathURL)
        {
            string Results = "";
            string text = System.IO.File.ReadAllText(pathURL);
            string[] lines = System.IO.File.ReadAllLines(pathURL);
            foreach (string line in lines)
            {
                // Use a tab to indent each line of the file.
                Results += "\t" + line;
            }
            return Library.MySqlEscape(Results);
        }
        public static string saveFile(string url, string mainPath)
        {

            try
            {
                //Initialize the input stream
                string[] file = url.Split('/');
                string fileName = file[file.Length - 1];
                HttpWebRequest req = (HttpWebRequest)WebRequest.Create(url);
                NetworkCredential cred = new System.Net.NetworkCredential("SharePointAdmin", "Sp@Adm1n", "GHVHS");
                req.Credentials = cred;

                HttpWebResponse resp = (HttpWebResponse)req.GetResponse();

                Stream rs = req.GetResponse().GetResponseStream();
                string path = mainPath + "Policies\\" + fileName;
                CopyStream(rs, path);
                //Cleanup



                return path;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }

        public static void CopyStream(Stream stream, string destPath)
        {
            using (var fileStream = new FileStream(destPath, FileMode.Create, FileAccess.Write))
            {
                stream.CopyTo(fileStream);
            }
        }
        public static string MySqlEscape(string usString)
        {
            if (usString == null)
            {
                return null;
            }
            // SQL Encoding for MySQL Recommended here:
            // http://au.php.net/manual/en/function.mysql-real-escape-string.php
            // it escapes \r, \n, \x00, \x1a, baskslash, single quotes, and double quotes
            return Regex.Replace(usString, @"[\r\n\x00\x1a\\'"";]", @" ");
        }
        public static List<string> returnUserNameInfo(List<getItems.Entry> Users, string ConcurenceNames)
        {
            List<string> results = new List<string>();
            string EmailList = "";
            string userNameList = "";
            for (var i = 0; i < Users.Count; i++)
            {
                var singleUserData = Users[i].Fields[0];
                string[] getFullNames = ConcurenceNames.Split(';');
                for (var j = 0; j < getFullNames.Length; j++)
                {
                    if (singleUserData.Title == getFullNames[j])
                    {
                        EmailList += singleUserData.EMail + ";";
                        string[] emailParts = singleUserData.EMail.Split('@');
                        userNameList += emailParts[0] + ";";
                    }
                }

            }
            results.Add(EmailList);
            results.Add(userNameList);
            return results;
        }
        public static string UploadFileToSharepoint(string list, string userName, string overwrite, string fileLink, string FileName,
            string AddToItem, string itemId)
        {
            string result = "false";
            try
            {
                byte[] data = Library.returnFileData(fileLink);

                result = AddFile.FileToSharepoint(list, "", "", overwrite, data, FileName, AddToItem, itemId);
                if (result.IndexOf("Bad Request") < 0)
                {
                    string link = "http://garnetinfo/Pnp/Policy/" + result;
                    SendEmail.SendEmail.NewUpload(FileName, link, userName);

                }

            }
            catch (Exception ex)
            {
                result = ex.ToString() + "||" + list + "||" + userName + "||" + FileName;
            }
            return result;
        }
        public static string UploadFile(HttpPostedFileBase file, string FileName, string mainPath, string Folder)
        {
            string Result = "";
            try
            {
                if (file != null)
                {
                    string pic = System.IO.Path.GetFileName(file.FileName);
                    string path = "";
                    if (String.IsNullOrEmpty(Folder) == false)
                    {
                        path = mainPath + Folder + "\\" + FileName;
                    }
                    else
                    {
                        path = mainPath + "Policies\\" + FileName;
                    }

                    file.SaveAs(path);

                    Result = path;
                }
                else
                {
                    Result = "No File";
                }
            }
            catch (Exception ex)
            {
                Result = ex.ToString();
            }
            return Result;
        }
        public static string CreateExcelToPDF(string path, string mainPath, string Folder)
        {
            char[] charsToTrim = { ' ', ' ', '\'' };
            String NewPath = path.Trim(charsToTrim);
            string localPath = new Uri(NewPath).LocalPath;
            using (ExcelEngine excelEngine = new ExcelEngine())
            {
              IApplication application = excelEngine.Excel;
                application.DefaultVersion = ExcelVersion.Excel2013;
                IWorkbook workbook = application.Workbooks.Open(localPath, ExcelOpenType.Automatic);

               //Open the Excel document to Convert
               
                IWorksheet sheet = workbook.Worksheets[0];

                //convert the sheet to PDF
                ExcelToPdfConverter converter = new ExcelToPdfConverter(sheet);
                //ExcelToPdfConverter converter = new ExcelToPdfConverter(workbook);

                //Initialize PDF document
                PdfDocument pdfDocument = new PdfDocument();

               //Convert Excel document into PDF document
               pdfDocument = converter.Convert();
                String[] spearator = { "\\" };
              Int32 count = path.IndexOf("\\\\");
               String[] strlist = path.Split('\\');
               Int32 lengthOf = strlist.Length - 1;
                String fileName = strlist[lengthOf];
               string getEx = Path.GetExtension(fileName);
                fileName = fileName.Replace(getEx, ".pdf");
                fileName = fileName.Replace("'", "");
                string newPath = "";
                if (String.IsNullOrEmpty(Folder) == false)
                {
                    newPath = mainPath + Folder + "\\" + fileName;
                }
                //Save the PDF file
                pdfDocument.Save(newPath);

                return newPath;
            }
        }
        public static string CreatePowerPointToPDF(string path, string mainPath, string Folder)
        {

            char[] charsToTrim = { ' ', ' ', '\'' };
            String NewPath = path.Trim(charsToTrim);
            string localPath = new Uri(NewPath).LocalPath;
           // Opens a PowerPoint Presentation
           IPresentation pptxDoc = Presentation.Open(localPath);

            //Creates an instance of ChartToImageConverter and assigns it to ChartToImageConverter property of Presentation
           

           // Converts the PowerPoint Presentation into PDF document
            PdfDocument pdfDocument = PresentationToPdfConverter.Convert(pptxDoc);
            String[] spearator = { "\\" };
            Int32 count = path.IndexOf("\\\\");
            String[] strlist = path.Split('\\');
            Int32 lengthOf = strlist.Length - 1;
            String fileName = strlist[lengthOf];
            string getEx = Path.GetExtension(fileName);
            fileName = fileName.Replace(getEx, ".pdf");
            fileName = fileName.Replace("'", "");
            string newPath = "";
            if (String.IsNullOrEmpty(Folder) == false)
            {
                newPath = mainPath + Folder + "\\" + fileName;
            }
            //Saves the PDF document
           pdfDocument.Save(newPath);

            //Closes the PDF document
           pdfDocument.Close(true);

           // Closes the Presentation
           pptxDoc.Close();

            return newPath;
        }
        public static string CreatePDF(string path, string mainPath, string Folder, string PathToSave = "")
        {
            string Result = "";
            try
            {
                char[] charsToTrim = { ' ', ' ', '\'' };
                String NewPath = path.Trim(charsToTrim);
                string localPath = new Uri(NewPath).LocalPath;
                WordDocument wordDocument = new WordDocument(path, Syncfusion.DocIO.FormatType.Docx);
                DocToPDFConverter converter = new DocToPDFConverter();
                PdfDocument pdfDocument = converter.ConvertToPDF(wordDocument);
                String[] spearator = { "\\" };
                Int32 count = path.IndexOf("\\\\");
                String[] strlist = path.Split('\\');
                Int32 lengthOf = strlist.Length - 1;
                String fileName = strlist[lengthOf];
                string getEx = Path.GetExtension(fileName);
                fileName = fileName.Replace(getEx, ".pdf");
                fileName = fileName.Replace("'", "");
                converter.Dispose();
                
                string newPath = "";
                if (String.IsNullOrEmpty(PathToSave) == false)
                {
                    newPath = PathToSave;
                }
                else
                {
                    if (String.IsNullOrEmpty(Folder) == false)
                    {
                        newPath = mainPath + Folder + "\\" + fileName;
                    }
                    else
                    {
                        newPath = mainPath + "Policies\\" + fileName;
                    }
                }
               
                pdfDocument.Save(newPath);
                pdfDocument.Close(true);
                wordDocument.Close();
                
                Result = newPath;
            }
            catch (Exception Ex)
            {
                Result = Ex.ToString();
            }
            return Result;
        }
        public static string CreateAndEmailforConcurence(string Concurrers, string FileName, string intiator, string SharepointId, string List)
        {
            string result = "false";


            DateTime today = DateTime.Today;
            string date = today.ToString("d");
            List<SingleItem> getDocData = CustomApps.Pnp.Policies.GetPolicies("", SharepointId, "Draft", "", "", "", "");
            string approver = getDocData[0].Fields.Approver;
            string Author = getDocData[0].Fields.Author;
            string fileName = getDocData[0].Fields.FileName;
            string Title = " Please Concur on " + getDocData[0].Fields.Title;
            string[] AllConcurers = Concurrers.Split(';');
            string ConcurrersOld = getDocData[0].Fields.Concurrers;
            string approver2 = getDocData[0].Fields.Approver;
            string intiator2 = getDocData[0].Fields.Author;
            string fileName2 = getDocData[0].Fields.FileName;
            string allUsersNames = "" + intiator2 + ",";
            string allEmails = "" + intiator2 + "@garnethealth.org,";
            for (int i = 0; i < AllConcurers.Length; i++)
            {
                if (AllConcurers[i] != "")
                {
                    List<string> getUserValues = SQL.Pnp.GetUser("", "", "", AllConcurers[i]);
                    if (getUserValues.Count > 0)
                    {
                        List<string> results = CustomApps.Pnp.Concurrence.CreateConcurrence(SharepointId, "", AllConcurers[i], getUserValues[1], "NULL", "NULL", "Not Started", Title,
                           Author, "CURRENT_TIMESTAMP", "", "NULL", "", Concurrers, Concurrers, "0", getUserValues[2], Author, approver, fileName);
                        result = results[0];
                        if (allUsersNames.IndexOf(getUserValues[0]) < 0)
                        {
                            allUsersNames += getUserValues[0] + " ,";
                            allEmails += getUserValues[2] + " ,";
                        }
                    }
                }
            }
            if (String.IsNullOrEmpty(approver2) == false) {
                List<string> getUserValues2 = SQL.Pnp.GetUser("", "", "", approver);
                if (getUserValues2.Count > 0)
                {
                    allUsersNames += getUserValues2[0] + " ,";
                    allEmails += getUserValues2[2] + " ,";
                }
            }
            PolicesDiscussion.Convos(SharepointId, SharepointId + "c", fileName2, intiator2 + " has created " + fileName2 + " Please feel free to add your comments in the board", "", allUsersNames, "Create", "", allEmails);
            return result;
        }

        public static string getFileContents(string path)
        {

            string textContent = "";
            if (path.IndexOf(".pdf") >= 0 || path.IndexOf(".PDF") >= 0)
            {
                textContent = Library.getPDFContent(path);
            }
            else if (path.IndexOf(".doc") >= 0 || path.IndexOf(".DOC") >= 0)
            {
                textContent = Library.getDocumentContent(path);
            }
            else if (path.IndexOf(".txt") >= 0 || path.IndexOf(".txt") >= 0)
            {
                textContent = Library.getTextContents(path);
            }
            return textContent;
        }
        public static List<string> AddApproval(string Approve, string DocId)
        {
            List<SingleItem> getDocData2 = CustomApps.Pnp.Policies.GetPolicies("", DocId, "Draft", "", "", "", "");
            var FileName = getDocData2[0].Fields.FileName;
            var PDFFilePath = getDocData2[0].Fields.PDFFilePath;
            var theId = getDocData2[0].Fields.Id;
            var Author = getDocData2[0].Fields.Author;
            var Approver = Approve;
            List<string> results = new List<string>();
            if (Approver.IndexOf(";") >= 0)
            {
                string [] split = Approver.Split(';');
                for (var i=0; i < split.Length; i++)
                {
                    if (split[i] != "")
                    {
                        List<string> getUserValues = SQL.Pnp.GetUser("", "", "", split[i]);
                        results = CustomApps.Pnp.Approvers.CreateApprover(split[i], DocId, getUserValues[0], "Not Started", "", "Please Approve " + FileName, "0", PDFFilePath);
                        SendEmail.SendEmail.NewApproverTasks(FileName, "http://garnetinfo/Pnp/policy/" + theId, getUserValues[0], Author, "http://garnetinfo/Pnp//PolicesDiscussion/" + theId + "c", "", getUserValues[2]);
                    }
                }
            }
            else
            {
                List<string> getUserValues = SQL.Pnp.GetUser("", "", "", Approver);
                results = CustomApps.Pnp.Approvers.CreateApprover(Approver, DocId, getUserValues[0], "Not Started", "", "Please Approve " + FileName, "0", PDFFilePath);
                SendEmail.SendEmail.NewApproverTasks(FileName, "http://garnetinfo/Pnp/policy/" + theId, getUserValues[0], Author, "http://garnetinfo/Pnp//PolicesDiscussion/" + theId + "c", "", getUserValues[2]);
            }
            return results;
        }
        public static List<string> UpdateApprovals(string ApproverID, string status)
        {
            string Final = "R";
            string percentComplete = "100";
            string theTitle = "";
            List<string> Results = new List<string>();
            var Items = CustomApps.Pnp.Approvers.GetApprovers("", "", "", "", ApproverID, "");
            string docID = Items[0].Data.DocId;
            string Username = System.Web.HttpContext.Current.User.Identity.Name;
            Username = Username.Replace("GHVHS\\", "");
            List<SingleItem> Doc = CustomApps.Pnp.Policies.GetPolicies("", docID, "", "", "", "", "");
            if (Doc.Count > 0) {
                string AllConcur = Doc[0].Fields.Concurrers;
                string Approvers = Doc[0].Fields.Approver;
                string FileName = Doc[0].Fields.FileName;
                string link = "http://garnetinfo/Pnp/Policy/" + docID;
                try
                {
                    if (status == "Approve")
                    {
                        Final = "Y";
                        link = "http://garnetinfo/Pnp/ApprovedPolicies";
                        status = "Complete";
                        Results = CustomApps.Pnp.Approvers.UpdateAppoveral("", "", "", status, ApproverID, "", "", "", percentComplete);
                        theTitle = "Approver " + Username + " has Approved " + FileName;
                        var check = CustomApps.Pnp.Approvers.GetApprovers("", docID, "", "Check", "", "");
                        if (check.Count == 0)
                        {
                            ToApproved(docID);

                        }else
                        {
                            if (Results[0] == "true")
                            {
                                Results = new List<string>();
                                string percent = (100 / check.Count).ToString();
                                
                                Results.Add(percent);
                            }
                        }

                    }
                    else
                    {
                        Final = "R";
                        link = "http://garnetinfo/Pnp/ApprovedPolicies";
                        status = "Rejected";
                        theTitle = "Approver " + Username + " has Rejected " + FileName;
                        Results = CustomApps.Pnp.Approvers.UpdateAppoveral("", "", "", status, ApproverID, "", "", "", percentComplete);
                    }

                    if (AllConcur.EndsWith(";"))
                    {
                        AllConcur = AllConcur + Approvers;
                    }else
                    {
                        AllConcur = AllConcur +";"+ Approvers;
                    }
                    string[] AllCurersSplit = AllConcur.Split(';');
                    for (var i = 0; i < AllCurersSplit.Length; i++)
                    {
                        if (AllCurersSplit[i] != "")
                        {
                            List<string> getUserValues = SQL.Pnp.GetUser(AllCurersSplit[i], "", "", "");
                            if (getUserValues.Count > 0) {
                                SendEmail.SendEmail.ApprovedConcurrer(Username, getUserValues[0], theTitle, link, getUserValues[2], Final);
                            }
                        }
                    }

                }
                catch (Exception Ex)
                {
                    string Error = Ex.ToString();
                    string body = "Error: " + Error + "<br>" + ApproverID + status;
                    SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error Createing Concurrence", body);
                    Results.Add(body);
                }
            }
            return Results;
        }
        public static string ToApproved(string docID)
        {
            string DeleteConcurrence = "";
            string result = "";
            string DeleteApprovals = "";
            try
            {
                string Username = System.Web.HttpContext.Current.User.Identity.Name;
                Username = Username.Replace("GHVHS\\", "");
                List<string> Results = CustomApps.Pnp.Policies.UpdatePolicy("", "Approved", "", "", "", "CURRENT_TIMESTAMP", Username, "",
                  "", "", "", "", "", "", "", "", "", "", "", "", "", docID, "");
                DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(docID);
                DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(docID);
                SharePointApi.DeleteItem.Remove("", "", "DraftPolicies", docID);
                result = "true";

            }
            catch (Exception Ex)
            {
                string Error = Ex.ToString();
                string body = "Error: " + Error + "<br>" + DeleteConcurrence + DeleteApprovals;
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error Createing Concurrence", body);
                result = body;
            }
            return result;
        }
        public static List<string> UpdatedConcur(string DocId, string Id, string username, string userId, string DueDate, string StartDate, string Status, string Title,
                      string Author, string CreatedOn, string RejectionReason, string DeadLine, string ApproveComments, string AllConcurrers, string AllConcurrerIds,
                     string PercentComplete, string Email, string Initiator, string Approver)
        {
            string Final = "N";
            List<string> Items = new List<string>();
            try
            {
                Items = CustomApps.Pnp.Concurrence.UpdateConcurrence(DocId, Id, username, userId, DueDate, StartDate, Status, Title,
                          Author, CreatedOn, RejectionReason, DeadLine, ApproveComments, AllConcurrers, AllConcurrerIds,
                         PercentComplete, "", Initiator, Approver);
                if (Items[0] == "true") {
                    List<AllConcurrers> Concurer = CustomApps.Pnp.Concurrence.GetConcurrences("", "", "", "", Id);
                    string DocumentID = Concurer[0].Data.DocId;
                    List<SingleItem> Doc = CustomApps.Pnp.Policies.GetPolicies("", DocumentID, "", "", "", "", "");
                    string allConcurers = Doc[0].Fields.Author +";"+ Doc[0].Fields.Editor;
                    string Approvers = Doc[0].Fields.Approver;
                    string TheTitle = Concurer[0].Data.Title;
                    string link = "http://garnetinfo/Pnp/Policy/" + DocumentID;
                    string[] AllCurersSplit = allConcurers.Split(';');
                    if (Status != "Started")
                    {
                        for (var i = 0; i < AllCurersSplit.Length; i++)
                        {
                            if (AllCurersSplit[i] != "")
                            {
                                List<string> getUserValues = SQL.Pnp.GetUser("", "", "", AllCurersSplit[i]);
                                if (getUserValues.Count > 0)
                                {
                                    if (Status == "Rejected")
                                    {
                                        Final = "R";
                                    }
                                    SendEmail.SendEmail.ApprovedConcurrer(username, getUserValues[0], TheTitle, link, getUserValues[2], Final);
                                }
                            }
                        }
                    }
                    if (Status == "Completed")
                    {
                        List<AllConcurrers> Concurers = CustomApps.Pnp.Concurrence.GetConcurrences("", DocumentID, "", "", "");
                        string createApprovals = "Y";
                        if (Concurers.Count > 0)
                        {
                            for (var i = 0; i < Concurers.Count; i++)
                            {
                                if (Concurers[i].Data.Status != "Completed")
                                {
                                    createApprovals = "N";
                                }
                            }
                            if (createApprovals == "Y")
                            {
                                AddApproval(Approvers, DocumentID);
                            }
                        }
                    }
                }
                else
                {
                    string body = " No Error but Concurrence did not update: <br>" + DocId + Id + username + userId + DueDate + StartDate + Status + Title +
                                              Author + CreatedOn + RejectionReason + DeadLine + ApproveComments + AllConcurrers + AllConcurrerIds +
                                             PercentComplete + "" + Initiator + Approver;
                    SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Issue Updating Concurrence", body);
                }
            }
            catch (Exception ex)
            {
                string Error = ex.ToString();
                string body = "Error: " + Error + "<br>" + DocId + Id + username + userId + DueDate + StartDate + Status + Title +
                          Author + CreatedOn + RejectionReason + DeadLine + ApproveComments + AllConcurrers + AllConcurrerIds +
                         PercentComplete + "" + Initiator + Approver;
                SendEmail.SendEmail.Send("jmuller3@garnethealth.org", "Error Createing Concurrence", body);
                Items.Add(body);
            }
            return Items;
        }
        public static List<string> ValidateLoggedInUser(HttpCookieCollection Cookies)
        {
            List<string> Results = new List<string>();
            string UserName = "";
            string Password = "";
            string Result = "False";
            if (Cookies["Id"] != null)
            {
                if (Cookies["Date"] != null)
                {
                    var date = Cookies["Date"].Value;
                    DateTime firstDate = DateTime.Parse(date);
                    DateTime secondDate = DateTime.Now;
                    firstDate = firstDate.AddHours(12);
                    int result = DateTime.Compare(firstDate, secondDate);
                    if (result > 0)
                    {
                        var theID = Cookies["Id"].Value;
                        string uANDp = SQL.Pnp.CheckOrAddUser("", "ID", "", theID);
                        if (uANDp != "false")
                        {
                            string[] words = uANDp.Split('|');
                            var checkIdHash = EncryptAndDecrypt.sha256_hash(words[0] + words[1]);
                            if (checkIdHash != theID)
                            {
                                Cookies.Remove("Id");
                                Cookies.Remove("Date");
                            }
                            else
                            {
                                UserName = EncryptAndDecrypt.Decrypt(words[0]);
                                Password = EncryptAndDecrypt.Decrypt(words[1]);
                                Result = "True";
                            }
                        }
                        else
                        {
                            Cookies.Remove("Id");
                            Cookies.Remove("Date");
                        }
                    }
                    else
                    {
                        Cookies.Remove("Id");
                        Cookies.Remove("Date");
                    }
                }
                else
                {
                    Cookies.Remove("Id");
                }
            }
            Results.Add(Result);
            Results.Add(UserName);
            Results.Add(Password);
            return Results;
        }
        public static List<HttpCookie> ValidateUser(HttpCookieCollection Cookies, string username, string password)
        {
            HttpCookie cookieDate;
            HttpCookie cookie;
            List<HttpCookie> temp = new List<HttpCookie>();
            Boolean Results = false;
            if (String.IsNullOrEmpty(username) == false && String.IsNullOrEmpty(password) == false)
            {
                string sharePointAuthOk = "N";
                var Items = getItems.GetListItems("DraftPolicies", username, password, "", "", "", "", "", "");
                if (Items.Count == 0)
                {
                    sharePointAuthOk = "Y";
                }
                else if (Items[0].id == "Not Logged In")
                {
                    sharePointAuthOk = "N";
                }
                else
                {
                    sharePointAuthOk = "Y";
                }
                string checkForAccount = SQL.Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "N", EncryptAndDecrypt.Encrypt(password), "");
                if (sharePointAuthOk == "Y")
                {
                    string Id = "";
                    if (checkForAccount == EncryptAndDecrypt.Encrypt(username))
                    {
                        Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                    }
                    else if (String.IsNullOrEmpty(checkForAccount) == false)
                    {
                        string check = SQL.Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Username", "", "");
                        if (check == EncryptAndDecrypt.Encrypt(username))
                        {
                            string Update = SQL.Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Update", EncryptAndDecrypt.Encrypt(password), "");
                            Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                            string UpdateId = SQL.Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "UpdateId", EncryptAndDecrypt.Encrypt(password), Id);
                        }
                        else
                        {
                            Id = EncryptAndDecrypt.sha256_hash(EncryptAndDecrypt.Encrypt(username) + EncryptAndDecrypt.Encrypt(password));
                            SQL.Pnp.CheckOrAddUser(EncryptAndDecrypt.Encrypt(username), "Y", EncryptAndDecrypt.Encrypt(password), Id);
                        }

                    }
                    cookie = new HttpCookie("Id", Id)
                    {
                        HttpOnly = true
                    };
                    DateTime aDay = DateTime.Now;
                    cookieDate = new HttpCookie("Date", aDay.ToString())
                    {
                        HttpOnly = true
                    };

                    Results = true;
                    temp.Add(cookieDate);
                    temp.Add(cookie);
                }
                else
                {

                    Results = false;
                }

            }


            return temp;
        }
        public static string HandleCheckOut(string id, string username)
        {
            List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", "", "", "", "CURRENT_TIMESTAMP", username, "",
              "", username, "", "", "", "", "", "", "", "", "", "", "", id, "");
            List<SingleItem> Doc = CustomApps.Pnp.Policies.GetPolicies("", id, "", "", "", "", "");
            return Doc[0].Fields.FilePath;
        }
        public static string HandleCheckinPost(HttpPostedFileBase file, string FileName, string username, string id)
        {
            string temp = CustomApps.Pnp.FileHistory.AddFileToFileHistory(id);
            List<string> data = CustomApps.Pnp.Policies.UploadFileToServer(file, "", FileName, username, id);
            List<string> Dicussion2 = SharePointApi.PolicesDiscussion.Convos("", id + "c", "", "", "", "", "", "", "");
            if (Dicussion2.Count > 0) {
                List<string> Items = SharePointApi.PolicesDiscussion.PnpMeassges(id + "c", "", "Doc is now updated", username + " has checked policy back in with changes. ", "System Account", "", "Create", "");



                string[] peopleToEmail = Dicussion2[5].Split(',');
                string CheckForMultpleEmails = "";
                for (var i = 0; i < peopleToEmail.Length; i++)
                {
                    string link = "http://garnetinfo/PnP/Policy/" + Dicussion2[0];
                    string convo = "http://garnetinfo/PnP/PolicesDiscussion/" + Dicussion2[1];
                    if (CheckForMultpleEmails.IndexOf(peopleToEmail[i]) < 0)
                    {
                        SendEmail.SendEmail.NewMessage("System Account", peopleToEmail[i], username + " has checked policy back in with changes. ", convo, link, "");
                        CheckForMultpleEmails += peopleToEmail[i];
                    }
                }
            }
            return data[0];
        }
        public static string HandleCheckin(string id, string username)
        {
            List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", "", "", "", "CURRENT_TIMESTAMP", username, "",
             "", "clear", "", "", "", "", "", "", "", "", "", "", "", id, "");
            return data[0];
        }
        public static string Archive(string id, string username)
        {
            List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "Archive", "", "", "", "CURRENT_TIMESTAMP", username, "",
             "", "", "", "", "", "", "", "", "", "", "", "", "", id, "");
            string DeleteConcurrence = CustomApps.Pnp.Concurrence.DeleteConcurences(id);
            string DeleteApprovals = CustomApps.Pnp.Approvers.DeleteApprovals(id);
            return data[0];
        }
        public static string UnArchive(string id, string username)
        {
            List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "Draft", "", "", "", "CURRENT_TIMESTAMP", username, "",
            "Null", "", "", "", "", "", "", "", "", "", "", "", "", id, "");
            return data[0];
        }
        public static string SetNewRelatedDoc(string id, string RelatedDocFileName, string username)
        {
            string Result = "false";
            List<SingleItem> RelatedDoc = CustomApps.Pnp.PoliciesRelatedDocuments.GetPolicies("", "", "", RelatedDocFileName, "FileName", "");
            List<SingleItem> Doc = CustomApps.Pnp.Policies.GetPolicies("", id, "", "", "", "", "");
            string RelatedDocs = Doc[0].Fields.RelatedDocs;
            string RelatedDocId = RelatedDoc[0].Fields.Id;
            if (String.IsNullOrEmpty(RelatedDocs) == true)
            {
                List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", "", "", "", "CURRENT_TIMESTAMP", username, "",
                  "", "", "", "", "", "", "", "", "", "", "", "", "", id, RelatedDocId);
                Result = "true";
            }
            else if (RelatedDocs.IndexOf(RelatedDocId) >= 0)
            {
                Result = "true";
            }
            else
            {
                string NewRelatedDocs = RelatedDocs + "|" + RelatedDocId;
                List<string> data = CustomApps.Pnp.Policies.UpdatePolicy("", "", "", "", "", "CURRENT_TIMESTAMP", username, "",
                 "", "", "", "", "", "", "", "", "", "", "", "", "", id, NewRelatedDocs);
                Result = "true";
            }
            return RelatedDocId;
        }
        public static string getRole(string username)
        {
            List<UserRoleDepart> temp = CustomApps.Pnp.Roles.GetUserRolesDepartment("", "", username, "", "", "", "");
            string getRole = temp[0].Fields.Role;
            return getRole;
        }
        public static List<HttpCookie> ValidatePnpUser(string username)
        {
            HttpCookie cookieDate;
            HttpCookie cookie;
            List<HttpCookie> temp = new List<HttpCookie>();
            List<UserRoleDepart> getUserRole = CustomApps.Pnp.Roles.GetUserRolesDepartment("", "", username, "", "", "", "");
            string getRole = "";
            string DepartmentName = "";
            if (getUserRole.Count >= 1)
            {
                for (int i = 0; i < getUserRole.Count; i++)
                {
                    if (String.IsNullOrEmpty(getRole) == false)
                    {
                        getRole += "|" + getUserRole[i].Fields.Role;
                    }
                    else
                    {
                        getRole += getUserRole[i].Fields.Role;
                    }
                    if (String.IsNullOrEmpty(DepartmentName) == false)
                    {
                        DepartmentName += "|" + getUserRole[i].Fields.DepartmentID;
                    }
                    else
                    {
                        DepartmentName += getUserRole[i].Fields.DepartmentID;
                    }
                }
            }
            else
            {
                getRole += "";
                DepartmentName += "";
            }
            cookie = new HttpCookie("Role", getRole)
            {
                HttpOnly = true
            };
            cookieDate = new HttpCookie("DepartmentID", DepartmentName)
            {
                HttpOnly = true
            };
            temp.Add(cookieDate);
            temp.Add(cookie);
            return temp;
        }

        public static List<string> getCookieInfo(HttpCookieCollection Cookies, string username = "")
        {
            string toRefresh = "";
            List<UserRoleDepart> getUserRole = new List<UserRoleDepart>();
            List<string> returnList = new List<string>();
            if (Cookies["Role"] != null && Cookies["DepartmentID"] != null)
            {
                var depo = Cookies["DepartmentID"].Value;
                var Role = Cookies["Role"].Value;
                returnList.Add(depo);
                returnList.Add(Role);
            }else
            {
                if (String.IsNullOrEmpty(username) == false)
                {
                    getUserRole = CustomApps.Pnp.Roles.GetUserRolesDepartment("", "", username, "", "", "", "");
                }
                string getRole = "";
                string DepartmentName = "";
                if (getUserRole.Count >= 1)
                {
                    for (int i = 0; i < getUserRole.Count; i++)
                    {
                        if (String.IsNullOrEmpty(getRole) == false)
                        {
                            getRole += "|" + getUserRole[i].Fields.Role;
                        }
                        else
                        {
                            getRole += getUserRole[i].Fields.Role;
                        }
                        if (String.IsNullOrEmpty(DepartmentName) == false)
                        {
                            DepartmentName += "|" + getUserRole[i].Fields.DepartmentID;
                        }
                        else
                        {
                            DepartmentName += getUserRole[i].Fields.DepartmentID;
                        }
                    }
                    toRefresh = "refresh";
                }
                else
                {
                    getRole += "User";
                    DepartmentName += "";
                }
                returnList.Add(DepartmentName);
                returnList.Add(getRole);
                if (String.IsNullOrEmpty(toRefresh) == false)
                {
                    returnList.Add("refresh");
                }
            }
            return returnList;
        }
        public static Boolean HasAccess(List<MetaDataList> Navs, string Page)
        {
            Boolean result = false;
            for (int i = 0; i < Navs.Count; i++)
            {
                if (Navs[i].Name == Page)
                {
                    result = true;
                }
            }
            return result;
        }

        public static string getDepartmentNames(string depos)
        {
            string results = "";
            if (depos.IndexOf("|") >= 0)
            {
                string[] splitDepos = depos.Split('|');
                for (int i = 0; i < splitDepos.Length; i++)
                {
                    if (splitDepos[1] != "")
                    {
                        List<MetaDataList> depo = new List<MetaDataList>();
                        depo = CustomApps.Pnp.MetaData.getMetaData(splitDepos[i], "", "", "", "Departments", "");
                        results += depo[0].Name + "|";
                    }

                }
            }
            else
            {
                List<MetaDataList> depo = new List<MetaDataList>();
                depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments", depos);
                results += depo[0].Name;
            }
            return results;
        }
        public static string getDepartmentIds(string depos)
        {
            string results = "";
            if (depos.IndexOf("|") >= 0)
            {
                string[] splitDepos = depos.Split('|');
                for (int i = 0; i < splitDepos.Length; i++)
                {
                    if (splitDepos[1] != "")
                    {
                        List<MetaDataList> depo = new List<MetaDataList>();
                        depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments", splitDepos[i]);
                        if (results != "")
                        {

                            results += "," + depo[0].Id;
                        }
                        else
                        {
                            results += depo[0].Id;
                        }
                    }

                }
            }
            else
            {
                List<MetaDataList> depo = new List<MetaDataList>();
                depo = CustomApps.Pnp.MetaData.getMetaData("", "", "", "", "Departments", depos);
                results += depo[0].Id;
            }
            return results;
        }
        public static string MoveFile(string FileNameToMove, string NewFileName)
        {
            string result = "false";
            string rootFolderPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies/");
            string destinationPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/ArchivedPolicies/");
            try
            {
                string[] fileList = System.IO.Directory.GetFiles(rootFolderPath, FileNameToMove);
                foreach (string file in fileList)
                {
                    if (file.IndexOf(FileNameToMove) >= 0)
                    {
                        string fileToMove = rootFolderPath + FileNameToMove;
                        string moveTo = destinationPath;
                        //moving file
                        FileInfo filed = new FileInfo(Path.Combine(rootFolderPath, FileNameToMove));
                        File.Move(fileToMove, moveTo + NewFileName);
                    }
                }
                result = "true";
            }
            catch (Exception Ex)
            {
                result = "false";
            }
            return result;
        }
        public static Boolean DeleteFile(string SelectedFile, string FromArchive)
        {
            Boolean result = false;
            string rootFolder = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies/");
            if (String.IsNullOrEmpty(FromArchive) == false)
            {
                if (FromArchive == "RelatedDocs")
                {
                    rootFolder = System.Web.Hosting.HostingEnvironment.MapPath("/img/RelatedDocs/");
                }
                else
                {
                    rootFolder = System.Web.Hosting.HostingEnvironment.MapPath("/img/ArchivedPolicies/");
                }
            }
            try
            {
                // Check if file exists with its full path    
                if (File.Exists(Path.Combine(rootFolder, SelectedFile)))
                {
                    // If file found, delete it    
                    File.Delete(Path.Combine(rootFolder, SelectedFile));
                    result = true;
                }
                else result = false;
            }
            catch (IOException ioExp)
            {
                result = false;
            }
            return result;
        }
        public static Boolean RenameFile(string Old, string newName, string FromArchive)
        {
            Boolean Result = false;
            try
            {
                string rootFolder = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies/");
                if (String.IsNullOrEmpty(FromArchive) == false)
                {
                    rootFolder = System.Web.Hosting.HostingEnvironment.MapPath("/img/ArchivedPolicies/");
                }
                FileInfo file = new FileInfo(Path.Combine(rootFolder, Old));
                file.MoveTo(Path.Combine(file.Directory.FullName, newName));
                Result = true;
            }
            catch (Exception ex)
            {
                Result = false;
            }
            return Result;
        }
        public static string removeCookie(HttpResponseBase Response)
        {
            string result = "false";
            try
            {
                HttpCookie depo = new HttpCookie("DepartmentID");
                HttpCookie Role = new HttpCookie("Role");
                depo.Expires = DateTime.Now.AddDays(-1d);
                depo.Path = "/store";
                Response.Cookies.Add(depo);
                Role.Expires = DateTime.Now.AddDays(-1d);
                Role.Path = "/store";
                Response.Cookies.Add(Role);
                result = "true";
            }
            catch (Exception Ex)
            {
                result = Ex.ToString();
            }
            return result;
        }

    
        public static bool checkOnConcurrence(string name, string id)
        {
            bool returnValue = true;
            List<AllConcurrers> check = Concurrence.GetConcurrences("", id, "", "", "");
            if (check.Count > 0)
            {
                for (var i = 0; i < check.Count; i++)
                {
                    if (check[i].Data.Status != "Completed")
                    {
                        returnValue = false;
                    }
                }

            }
            else
            {
                returnValue = false;
            }
            return returnValue; 
        }
        public static void AddPolicyNumberToWordDoc(string Path, string PolicyNumber, string savePath)
        {
            //Loads the template document
            WordDocument document = new WordDocument(Path, Syncfusion.DocIO.FormatType.Docx);
            TextSelection textSelection = document.Find("{POLICY NUMBER}", false, true);
            //Gets the found text as single text range
            WTextRange textRange = textSelection.GetAsOneRange();
            //Modifies the text
            textRange.Text = PolicyNumber;
            //Sets highlight color
           if (String.IsNullOrEmpty(savePath) == true)
            {
                savePath = Path;
            }
            //Saves and closes the document

            document.Save(savePath, Syncfusion.DocIO.FormatType.Docx);
            document.Close();
        }
        public static void UpdatePolicyPDFToCurrentPolicyNumber(string id)
        {
           List<SingleItem> Policy = Policies.GetPolicies(id, "", "", "", "", "", "");
            string FileName = Policy[0].Fields.FileName;
            string CurrentPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies") +@"\\"+ FileName;
           string getEx = Path.GetExtension(FileName);
           string TempName = FileName.Replace(getEx, "") + "_CurrentPN" + getEx;
           string TempFilePath = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies") + @"\\" + TempName;
           string PolicyNumber = Policy[0].Fields.PolicyNumber;
           string pdfPath = System.Web.Hosting.HostingEnvironment.MapPath("/img/Policies") + @"\\" + FileName.Replace(getEx, ".pdf");
           AddPolicyNumberToWordDoc(CurrentPath, PolicyNumber, TempFilePath);
           CreatePDF(TempFilePath, "", "", pdfPath);

           
        }
    private static void IterateTextBody(WTextBody textBody) { 
        //Iterates through each of the child items of WTextBody
            for (int i = 0; i<textBody.ChildEntities.Count; i++)
            {
                //IEntity is the basic unit in DocIO DOM. 
                //Accesses the body items (should be either paragraph, table or block content control) as IEntity
                IEntity bodyItemEntity = textBody.ChildEntities[i];
                //A Text body has 3 types of elements - Paragraph, Table and Block Content Control
                //Decides the element type by using EntityType
                switch (bodyItemEntity.EntityType)
                {
                    case EntityType.Paragraph:
                        WParagraph paragraph = bodyItemEntity as WParagraph;
                        //Checks for particular style name and removes the paragraph from DOM
                        if (paragraph.StyleName == "MyStyle")
                        {
                            int index = textBody.ChildEntities.IndexOf(paragraph);
                            textBody.ChildEntities.RemoveAt(index);
                        }
                        break;
                    case EntityType.Table:
                        //Table is a collection of rows and cells
                        //Iterates through table's DOM
                        IterateTable(bodyItemEntity as WTable);
                        break;
                    case EntityType.BlockContentControl:
                        BlockContentControl blockContentControl = bodyItemEntity as BlockContentControl;
                        //Iterates to the body items of Block Content Control.
                        IterateTextBody(blockContentControl.TextBody);
                        break;
                }
            }
        }
        private static void IterateTable(WTable table)
        {
            //Iterates the row collection in a table
            foreach (WTableRow row in table.Rows)
            {
                //Iterates the cell collection in a table row
                foreach (WTableCell cell in row.Cells)
                {
                    //Table cell is derived from (also a) TextBody
                    //Reusing the code meant for iterating TextBody
                    IterateTextBody(cell);
                }
            }
        }



    }
        
}