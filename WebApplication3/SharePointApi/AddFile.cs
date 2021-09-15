using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net;
using System.Web;
using System.Xml;

namespace WebApplication3.SharePointApi
{
    public class AddFile
    {
        public static String FileToSharepoint(string list, string userName, string password, string overwrite, byte[] file, string FileName, string AddToItem, string itemId)
        {
            String CheckOutOrIn = "";
            
                password = "Sp@Adm1n";
            
            
                userName = "SharePointAdmin";
            
            string result = "true";
            if (String.IsNullOrEmpty(list) == true)
            {
                result = "Missing List to add file to";
            }
            if (String.IsNullOrEmpty(userName) == true)
            {
                result = "Missing Username";
            }
            if (String.IsNullOrEmpty(password) == true)
            {
                result = "Missing password";
            }
            if (String.IsNullOrEmpty(FileName) == true)
            {
                result = "Missing FileName";
            }
            if (file == null && file.Length == 0)
            {
                result = "Missing File";
            }
            if (String.IsNullOrEmpty(overwrite) == true)
            {
                overwrite = "false";
            }
            string[] fileNameSplit = FileName.Split('.');
            if (fileNameSplit[1] != "doc" && fileNameSplit[1] != "docx" && fileNameSplit[1] != "txt" && fileNameSplit[1] != "pdf")
            {
                result = "Unsupported File Type";
            }
            string urlEncoded = System.Web.HttpUtility.UrlPathEncode(list);
            string endpointURL = "/_api/web/GetFolderByServerRelativeUrl('" + urlEncoded + "')/Files/add(url='" + FileName + "',overwrite=false)";
            if (String.IsNullOrEmpty(AddToItem) == false)
            {
               endpointURL = "/_api/web/GetFolderByServerRelativeUrl('" + urlEncoded + "')/Files/add(url='" + FileName + "',overwrite=true)";
            }
            if (result == "true")
            {
                try
                {
                    Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies");

                    string request = sharepointUrl.ToString() + endpointURL;
                    NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");
                    HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(request);
                    listRequest.Method = "POST";
                    string formDigest = CheckInAndOut.GetFormDigestValue(sharepointUrl.ToString(), cred);
                    listRequest.Headers.Add("X-RequestDigest", formDigest);
                    listRequest.Credentials = cred;
                   
                    listRequest.Headers.Add("binaryStringRequestBody", "true");
                    listRequest.GetRequestStream().Write(file, 0, file.Length);
                    HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                    StreamReader listReader = new StreamReader(listResponse.GetResponseStream());
                    result = listReader.ReadToEnd();
                    result = getNewItem(list, userName, password, FileName);
                    return result;
                }
                catch (Exception ex)
                {
                    result = ex.ToString();
                    return result;

                }
            }
            else
            {
                return result;
            }


        }

        public static string getNewItem(string list, string userName, string password, string FileName)
        {
            string result = "";
            XmlNamespaceManager xmlnspm = new XmlNamespaceManager(new NameTable());
            Uri sharepointUrl = new Uri("http://sharepoint/sites/Policies/");

            xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
            xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
            xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
            NetworkCredential cred = new System.Net.NetworkCredential(userName, password, "GHVHS");

            HttpWebRequest listRequest = (HttpWebRequest)HttpWebRequest.Create(sharepointUrl.ToString() + "_api/web/lists/getbytitle('" + list + "')/Items?$filter=FileLeafRef%20eq%20%27" + FileName + "%27&$select=Id");
            listRequest.Method = "GET";
            listRequest.Accept = "application/atom+xml";
            listRequest.ContentType = "application/atom+xml;type=entry";
            listRequest.Credentials = cred;
            try
            {
                HttpWebResponse listResponse = (HttpWebResponse)listRequest.GetResponse();
                StreamReader listReader = new StreamReader(listResponse.GetResponseStream());

                xmlnspm.AddNamespace("atom", "http://www.w3.org/2005/Atom");
                xmlnspm.AddNamespace("d", "http://schemas.microsoft.com/ado/2007/08/dataservices");
                xmlnspm.AddNamespace("m", "http://schemas.microsoft.com/ado/2007/08/dataservices/metadata");
                string resposne = listReader.ReadToEnd();
                var listXml = new XmlDocument();
                listXml.LoadXml(resposne);


                //Method 1 Seperate node list  
                var prop = listXml.SelectNodes("//atom:entry/atom:content/m:properties", xmlnspm);
                foreach (XmlNode ndlist in prop)
                {
                    result = ndlist.SelectSingleNode("d:Id", xmlnspm).InnerXml;
                }
                return result;
            }
            catch (Exception ex)
            {
                return ex.ToString();
            }
        }
    }
}