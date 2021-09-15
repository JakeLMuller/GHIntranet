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

namespace WebApplication3.SharePointApi
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

            if (url.IndexOf(".pdf") >= 0)
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
                string path = mainPath + fileName;
                CopyStream(rs, path);
                //Cleanup



                return path;
            }catch ( Exception ex)
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
        public static string MySqlEscape( string usString)
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
            for (var i =0; i < Users.Count; i++)
            {
                var singleUserData = Users[i].Fields[0];
                string [] getFullNames = ConcurenceNames.Split(';');
                for (var j=0; j < getFullNames.Length; j++)
                {
                    if (singleUserData.Title == getFullNames[j])
                    {
                        EmailList += singleUserData.EMail+";";
                        string[] emailParts = singleUserData.EMail.Split('@');
                        userNameList += emailParts[0] +";";
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
                    string link = "http://garnetinfo/Pnp/ViewItem/" + list + "?ItemId=" + result;
                    SendEmail.SendEmail.NewUpload(FileName, link, userName);
                   
                }
               
            }
            catch (Exception ex)
            {
                result = ex.ToString() + "||" + list + "||" + userName + "||" + FileName;
            }
            return result; 
        }
      
        public string getFileContents(string path)
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
    }
}